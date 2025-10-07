import { useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } => '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Wand2 } from 'lucide-react';
import { showError } from '@/utils/toast';

interface AnalysisResult {
  matchPercentage: number;
  summary: string;
  matchingKeywords: string[];
  missingKeywords: string[];
}

// A list of common English "stop words" to filter out from the analysis
const stopWords = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
  'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'd', 
  'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 
  'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 
  'weren', 'won', 'wouldn', 'experience', 'work', 'job', 'role', 'responsibilities', 
  'requirements', 'skills', 'company', 'team', 'etc', 'eg', 'years', 'junior', 'senior', 'lead', 'principal'
]);

// A simple map for synonym expansion
const synonymMap: { [key: string]: string[] } = {
  'qa': ['quality assurance', 'quality engineer', 'tester'],
  'testing': ['test', 'qa', 'quality assurance'],
  'engineer': ['developer', 'programmer', 'specialist'],
  'selenium': ['automation', 'automated testing'],
  'jira': ['project management', 'bug tracking'],
  'agile': ['scrum', 'kanban'],
  'sql': ['database', 'data query'],
  'api': ['rest api', 'graphql'],
  'manual testing': ['exploratory testing', 'functional testing'],
  'automation testing': ['automated testing', 'test automation'],
  'test planning': ['test strategy', 'test case design'],
  'defect tracking': ['bug management', 'issue tracking'],
  'collaboration': ['teamwork', 'cross-functional'],
  'software': ['application', 'system'],
  'quality': ['excellence', 'standard'],
  'assurance': ['guarantee', 'verification'],
  'experience': ['background', 'expertise'],
  'requirements': ['specifications', 'criteria'],
  'development': ['dev', 'engineering'],
  'lifecycle': ['sdlc', 'process'],
  'ci/cd': ['continuous integration', 'continuous delivery'],
  'performance': ['speed', 'scalability'],
  'security': ['vulnerability', 'safeguard'],
  'cloud': ['aws', 'azure', 'gcp'],
  'frontend': ['ui', 'user interface', 'react', 'angular', 'vue'],
  'backend': ['server-side', 'api development', 'node.js', 'python', 'java'],
};

const JobAnalyzer = () => {
  const { content } = useContent();
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getTextTokens = (text: string): Set<string> => {
    if (!text) return new Set();
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/gi, ' ') // remove punctuation
      .split(/\s+/) // split by whitespace
      .filter(word => word.length > 2 && !stopWords.has(word)); // filter out stop words and short words

    const tokens = new Set<string>();
    words.forEach(word => tokens.add(word)); // Add unigrams (single words)

    // Add bigrams (two-word phrases)
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      if (!stopWords.has(words[i]) && !stopWords.has(words[i+1]) && bigram.length > 5) {
        tokens.add(bigram);
      }
    }

    // Add trigrams (three-word phrases)
    for (let i = 0; i < words.length - 2; i++) {
      const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (!stopWords.has(words[i]) && !stopWords.has(words[i+1]) && !stopWords.has(words[i+2]) && trigram.length > 8) {
        tokens.add(trigram);
      }
    }
    return tokens;
  };

  const getExpandedTokens = (baseTokens: Set<string>): Set<string> => {
    const expandedTokens = new Set(baseTokens);
    baseTokens.forEach(token => {
      // Check for direct synonyms of the token
      if (synonymMap[token]) {
        synonymMap[token].forEach(syn => expandedTokens.add(syn));
      }
      // Also check for synonyms of individual words within multi-word tokens
      const wordsInToken = token.split(' ');
      wordsInToken.forEach(word => {
        if (synonymMap[word]) {
          synonymMap[word].forEach(syn => expandedTokens.add(syn));
        }
      });
    });
    return expandedTokens;
  };

  const handleAnalyze = () => {
    const { cvText } = content.hero;

    if (!cvText || cvText.trim().length < 50) {
      showError("Your CV text is missing or too short. Please add it in the Admin Dashboard > Hero section.");
      return;
    }
    if (!jobDescription.trim()) {
      showError("Please paste a job description first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    setTimeout(() => {
      try {
        const cvTokens = getTextTokens(cvText);
        const rawJobTokens = getTextTokens(jobDescription);
        const expandedJobTokens = getExpandedTokens(rawJobTokens); // Use expanded tokens for job description

        if (expandedJobTokens.size === 0) {
          throw new Error("Could not extract any meaningful keywords from the job description.");
        }

        const intersection = new Set([...cvTokens].filter(token => expandedJobTokens.has(token)));
        const missing = new Set([...expandedJobTokens].filter(token => !cvTokens.has(token)));
        
        // The union should include all unique tokens from both CV and the expanded job description tokens
        const union = new Set([...cvTokens, ...expandedJobTokens]);

        // Jaccard Index for similarity percentage
        const matchPercentage = Math.round((intersection.size / union.size) * 100);
        const matchingKeywords = Array.from(intersection).sort();
        const missingKeywords = Array.from(missing).sort(); // Still calculate for summary, but won't display

        const summary = `Based on an enhanced keyword and phrase analysis (including synonyms), your CV has a ${matchPercentage}% content match with the job description. We found ${intersection.size} matching terms and ${missingKeywords.length} terms from the job description that are not present in your CV.`;

        setAnalysisResult({
          matchPercentage,
          summary,
          matchingKeywords,
          missingKeywords,
        });

      } catch (e: any) {
        setError(e.message || "An unexpected error occurred during the analysis.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          Job Skill Matcher
        </CardTitle>
        <CardDescription>
          Paste a job description below to see how your CV content matches the requirements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="job-description">Job Description Text</Label>
          <Textarea
            id="job-description"
            placeholder="Paste the full job description here..."
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Match"
          )}
        </Button>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-start gap-4">
            <AlertCircle className="h-5 w-5 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold">Analysis Failed</h4>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {analysisResult && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Content Match Score</Label>
                <div className="flex items-center gap-4 mt-1">
                  <Progress value={analysisResult.matchPercentage} className="w-full" />
                  <span className="font-bold text-lg text-primary">{analysisResult.matchPercentage}%</span>
                </div>
              </div>
              <div>
                <Label>Summary</Label>
                <p className="text-sm text-muted-foreground mt-1">{analysisResult.summary}</p>
              </div>
              <div>
                <Label>Matching Terms</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysisResult.matchingKeywords.length > 0 ? (
                    analysisResult.matchingKeywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary">{keyword}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No significant matching terms found.</p>
                  )}
                </div>
              </div>
              {/* Removed the "Missing Terms" section as requested */}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default JobAnalyzer;