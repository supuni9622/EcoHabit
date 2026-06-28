import { NextRequest, NextResponse } from 'next/server';

const ECO_SYSTEM_PROMPT = `You are EcoCoach, an expert AI assistant specializing in environmental sustainability, recycling, and eco-friendly living. You provide practical, encouraging advice to help users build green habits.

Your expertise includes:
- Recycling best practices for all materials (plastic, paper, e-waste, organic, glass, metal)
- Environmental impact facts and statistics
- Sri Lanka-specific recycling centers and initiatives
- Composting and organic waste management
- Sustainable living tips and habits
- Carbon footprint reduction strategies
- The gamification of eco-habits and how to stay motivated

Keep responses concise (under 200 words), practical, and encouraging. Use emojis occasionally to make responses friendly. Always relate advice to local Sri Lankan context when relevant.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message as string;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long (max 500 chars)' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      );
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${ECO_SYSTEM_PROMPT}\n\nUser: ${message}\n\nEcoCoach:`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error:', errText);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();
    const responseText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I'm having trouble responding right now. Please try again!";

    return NextResponse.json({ message: responseText });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
