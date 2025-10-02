import { useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { supabase } from '@/integrations/supabase/client';
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
  matchingSkills: string[];
}

const JobAnalyzer = () => {
  const { content } = useContent();
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      showError("Please paste a job description first.");
      return;
    }
    if (!content.hero.cvText || !content.hero.cvText.trim()) {
      showError("CV text is missing. Please add it in the Admin Dashboard.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('analyze-job', {
        body: {
          jobDescriptionText: jobDescription,
          cvText: content.hero.cvText,
        },
      });

      if (invokeError) throw invokeError;
      if (data.error) throw new Error(data.error);
      
      setAnalysisResult(data);

    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "An unknown error occurred. Check the browser console and make sure your OpenAI API key is set correctly in Supabase secrets.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          AI Job Matcher
        </CardTitle>
        <CardDescription>
          Paste a job description below to see how well your CV matches, powered by AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="job-description">Job Description</Label>
          <Textarea
            id="job-description"
            placeholder="Paste the full job description here..."
            rows={10}
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
                <Label>Match Percentage</Label>
                <div className="flex items-center gap-4 mt-1">
                  <Progress value={analysisResult.matchPercentage} className="w-full" />
                  <span className="font-bold text-lg text-primary">{analysisResult.matchPercentage}%</span>
                </div>
              </div>
              <div>
                <Label>AI Summary</Label>
                <p className="text-sm text-muted-foreground mt-1">{analysisResult.summary}</p>
              </div>
              <div>
                <Label>Matching Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysisResult.matchingSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
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