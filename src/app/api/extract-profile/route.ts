import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CitizenProfile } from '@/types/engine';

export async function POST(req: NextRequest) {
  try {
    const { message, currentProfile } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return 501 Not Implemented so the client knows to fallback to local regex
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing' }, { status: 501 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an intelligent profile extraction assistant for a government schemes app.
The user is speaking to a chatbot.
Current Profile: ${JSON.stringify(currentProfile)}
User Message: "${message}"

Your task is to extract any new or updated profile information from the user's message.
Return ONLY a valid JSON object containing the fields that need to be updated. Do not include markdown tags.
If the user's message contains spelling mistakes, correct them (e.g. "stident" -> "Student", "mombai" -> "Mumbai").

Possible fields and their allowed formats:
- "age": number
- "gender": "Male" | "Female" | "Other"
- "state": string (Properly capitalized Indian state name, e.g. "Maharashtra")
- "district": string (Properly capitalized Indian city/district name, e.g. "Mumbai")
- "occupation": "Student" | "Farmer" | "Employed" | "Unemployed" | "Retired" | "Self-Employed"
- "annualIncome": number (in rupees, convert lakhs to numbers, e.g. "6 lakh" -> 600000)
- "category": "General" | "SC" | "ST" | "OBC" | "EWS"
- "disability": "None" | "Physical"
- "education": "10th" | "12th" | "Diploma" | "B.Tech" | "B.Sc" | "B.A" | "M.Tech" | "M.Sc" | "MBA" | "PhD"
- "lifeEvents": array of strings (e.g. "job_loss", "crop_damage", "new_child", "family_death", "new_student", "retirement")

Rules:
1. ONLY return the fields that the user explicitly mentioned or updated in their message.
2. DO NOT return fields that were not mentioned, even if they exist in the Current Profile.
3. If no fields were mentioned, return an empty object {}.
4. Output raw JSON only.
`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const responseText = result.response.text();
    const extractedData = JSON.parse(responseText);

    return NextResponse.json({ updates: extractedData });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
