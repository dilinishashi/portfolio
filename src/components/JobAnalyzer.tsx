import { useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Wand2 } from 'lucide-react';
import { showError } from '@/utils/toast';

interface AnalysisResult {
  matchPercentage: number;
  summary: string;
  matchingKeywords: string[];
  missingKeywords: string[]; // Still keep this in the interface for the AI's output, even if not displayed
}

const JobAnalyzer = () => {
  const { content } = useContent();
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
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

    try {
      const response = await fetch('/api/gemini-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cvText, jobDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get analysis from AI.');
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);

    } catch (e: any) {
      setError(e.message || "An unexpected error occurred during the AI analysis.");
      console.error("AI Analysis Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          Job Skill Matcher (AI Powered)
        </CardTitle>
        <CardDescription>
          Paste a job description below to see how your CV content matches the requirements, powered by Gemini AI.
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
            "Analyze Match with AI"
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
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default JobAnalyzer;