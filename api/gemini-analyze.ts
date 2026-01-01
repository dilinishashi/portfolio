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

    const prompt = `You are an expert career advisor specializing in talent acquisition. Your task is to perform a comprehensive, semantic, and contextual analysis of the provided CV text against the given job description. Go beyond simple keyword matching; evaluate the depth of experience, transferable skills, and overall alignment with the role's requirements and responsibilities.

    Your goal is to determine:
    1.  A precise match percentage (0-100).
    2.  A concise summary of the alignment, highlighting key strengths and areas where the candidate's profile could be further emphasized or developed for this specific role.
    3.  Key skills, experiences, and qualifications from the job description that are strongly present or clearly implied in the CV.
    4.  Important skills, experiences, or qualifications from the job description that appear to be missing, underrepresented, or could benefit from more explicit mention in the CV.

    CV Text:
    """
    ${cvText}
    """

    Job Description:
    """
    ${jobDescription}
    """

    Provide the output in a JSON format with the following keys:
    - \`matchPercentage\`: (number, 0-100) A numerical score indicating the overall match based on semantic understanding.
    - \`summary\`: (string) A concise summary of the match, highlighting strengths, potential, and areas for improvement.
    - \`matchingKeywords\`: (array of strings) Key skills/experiences from the job description that are clearly present or strongly implied in the CV.
    - \`missingKeywords\`: (array of strings) Key skills/experiences from the job description that are missing or underrepresented in the CV.

    Example JSON output:
    {
      "matchPercentage": 75,
      "summary": "Your CV demonstrates a strong foundation in X and Y, aligning well with the role's technical demands. To further strengthen your application, consider elaborating on your experience with Z, as it's a key requirement.",
      "matchingKeywords": ["Agile Methodologies", "Test Automation", "Jira", "API Testing"],
      "missingKeywords": ["Cloud Deployment", "CI/CD Pipelines"]
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