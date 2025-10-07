import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure the API key is loaded from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set. Please set it in your environment variables.");
  // In a real application, you might want to throw an error or handle this more gracefully.
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || ''); // Provide a fallback empty string if key is missing

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { cvText, jobDescription } = req.body;

  if (!cvText || !jobDescription) {
    return res.status(400).json({ error: 'Both cvText and jobDescription are required.' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Gemini API key is missing.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert career advisor. Analyze the provided CV text and job description. Your goal is to determine the match percentage, summarize the alignment, identify key skills/experiences from the job description that are present in the CV, and suggest important skills/experiences from the job description that are missing or underrepresented in the CV.

    CV Text:
    """
    ${cvText}
    """

    Job Description:
    """
    ${jobDescription}
    """

    Provide the output in a JSON format with the following keys:
    - \`matchPercentage\`: (number, 0-100) A numerical score indicating the overall match.
    - \`summary\`: (string) A concise summary of the match, highlighting strengths and areas for improvement.
    - \`matchingKeywords\`: (array of strings) Key skills/experiences from the job description that are clearly present in the CV.
    - \`missingKeywords\`: (array of strings) Key skills/experiences from the job description that are missing or underrepresented in the CV.

    Example JSON output:
    {
      "matchPercentage": 75,
      "summary": "Your CV shows a strong match for the role, particularly in X and Y. Consider highlighting Z more.",
      "matchingKeywords": ["skill A", "experience B"],
      "missingKeywords": ["skill C", "tool D"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Attempt to parse the JSON from Gemini's response
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("Gemini did not return a valid JSON structure.");
    }

    const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
    const analysis = JSON.parse(jsonString);

    res.status(200).json(analysis);

  } catch (error: any) {
    console.error('Error calling Gemini API:', error.message);
    res.status(500).json({ error: 'Failed to analyze job description with AI.', details: error.message });
  }
}