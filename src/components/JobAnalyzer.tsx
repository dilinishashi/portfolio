import { useState, ChangeEvent } from 'react';
import { useContent } from '@/context/ContentContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Wand2, Upload } from 'lucide-react';
import { showError } from '@/utils/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from './ui/input';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Configure the PDF.js worker to ensure it works correctly in the browser.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface AnalysisResult {
  matchPercentage: number;
  summary: string;
  matchingSkills: string[];
}

const JobAnalyzer = () => {
  const { content } = useContent();
  const [inputType, setInputType] = useState('text');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing...');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        showError("Please upload a valid image or PDF file.");
        setFile(null);
        e.target.value = ''; // Reset file input
      }
    }
  };

  const invokeSupabase = async (body: object) => {
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('analyze-job', { body });
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

  const handleAnalyze = async () => {
    if (!content.hero.cvText || !content.hero.cvText.trim()) {
      showError("CV text is missing. Please add it in the Admin Dashboard.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    if (inputType === 'text') {
      if (!jobDescription.trim()) {
        showError("Please paste a job description first.");
        setIsLoading(false);
        return;
      }
      setLoadingMessage('Analyzing...');
      await invokeSupabase({
        jobDescriptionText: jobDescription,
        cvText: content.hero.cvText,
      });
    } else if (inputType === 'url') {
        if (!jobUrl.trim()) {
            showError("Please enter a URL.");
            setIsLoading(false);
            return;
        }
        setLoadingMessage('Fetching from URL...');
        await invokeSupabase({ jobDescriptionUrl: jobUrl, cvText: content.hero.cvText });
    } else { // File input
      if (!file) {
        showError("Please select a file to upload.");
        setIsLoading(false);
        return;
      }

      if (file.type === 'application/pdf') {
        setLoadingMessage('Reading PDF...');
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async (e) => {
          try {
            const pdfData = new Uint8Array(e.target?.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map(item => ('str' in item ? item.str : '')).join(' ');
            }
            setLoadingMessage('Analyzing...');
            await invokeSupabase({ jobDescriptionText: text, cvText: content.hero.cvText });
          } catch (pdfError) {
            setError('Failed to read the PDF file.');
            setIsLoading(false);
          }
        };
      } else if (file.type.startsWith('image/')) {
        setLoadingMessage('Reading Image...');
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (e) => {
          const base64Image = e.target?.result as string;
          setLoadingMessage('Analyzing...');
          await invokeSupabase({ jobDescriptionImage: base64Image, cvText: content.hero.cvText });
        };
      }
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
          Paste text, upload a file, or provide a URL to see how well your CV matches a job.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={inputType} onValueChange={setInputType} defaultValue="text">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Paste Text</TabsTrigger>
            <TabsTrigger value="file">Upload File</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="pt-4">
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
          </TabsContent>
          <TabsContent value="file" className="pt-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Job Description File (PDF or Image)</Label>
              <Input
                id="file-upload"
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
            </div>
          </TabsContent>
          <TabsContent value="url" className="pt-4">
            <div className="space-y-2">
              <Label htmlFor="job-url">Job Posting URL</Label>
              <Input
                id="job-url"
                type="url"
                placeholder="https://example.com/job-posting"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingMessage}
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