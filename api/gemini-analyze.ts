import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow GET requests for the test endpoint, or POST for the main function
  if (req.method === 'GET' && req.query.test === 'true') {
    return res.status(200).json({ message: 'Serverless function is alive and responding with JSON!', test: true });
  }

  // For any other request (including POST), return a simple success message
  // This bypasses all Gemini API logic and environment variable checks.
  return res.status(200).json({
    status: 'success',
    message: 'Serverless function reached and returned a basic JSON response.',
    debug: 'This is a minimal test response.'
  });
}