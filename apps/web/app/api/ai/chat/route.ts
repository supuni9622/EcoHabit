import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';

const ECO_SYSTEM_PROMPT = `You are EcoCoach, an expert AI assistant specializing in environmental sustainability, recycling, and eco-friendly living. You provide practical, encouraging advice to help users build green habits.

Your expertise includes:
- Recycling best practices for all materials (plastic, paper, e-waste, organic, glass, metal, textile)
- Environmental impact facts and statistics
- Sri Lanka-specific recycling centers and initiatives
- Composting and organic waste management
- Sustainable living tips and habits
- Carbon footprint reduction strategies
- The gamification of eco-habits and how to stay motivated

Keep responses concise (under 200 words), practical, and encouraging. Use emojis occasionally to make responses friendly. Always relate advice to local Sri Lankan context when relevant.`;

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

interface FirestoreChatMessage {
  userId: string;
  content: string;
  role: 'user' | 'model';
  timestamp: Timestamp;
}

async function loadChatHistory(userId: string): Promise<GeminiContent[]> {
  try {
    const q = query(
      collection(db, 'chatMessages'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc'),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as FirestoreChatMessage;
      return {
        role: data.role,
        parts: [{ text: data.content }],
      };
    });
  } catch {
    return [];
  }
}

async function saveMessage(userId: string, content: string, role: 'user' | 'model'): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'chatMessages'), {
      userId,
      content,
      role,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.error('Failed to save chat message:', err);
    return null;
  }
}

async function getUserStreak(userId: string): Promise<string> {
  if (!userId) return '';
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return '';
    const streak: number = (userDoc.data().currentStreak as number) ?? 0;
    if (streak >= 7) {
      return `\n\nThe user has a ${streak}-day streak! Celebrate this and encourage them to keep going.`;
    } else if (streak === 0) {
      return "\n\nThe user hasn't logged any actions recently. Gently motivate them to take their first step today.";
    } else {
      return `\n\nThe user is on a ${streak}-day streak. Encourage consistency.`;
    }
  } catch {
    return '';
  }
}

async function getRecentHabitLogs(userId: string): Promise<string> {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const q = query(
      collection(db, 'habitLogs'),
      where('userId', '==', userId),
      where('loggedAt', '>=', Timestamp.fromDate(sevenDaysAgo)),
      orderBy('loggedAt', 'desc'),
      limit(10)
    );
    const snap = await getDocs(q);
    if (snap.empty) return '';

    const summary = snap.docs.map((d) => {
      const data = d.data();
      return `${data.wasteType} x${data.quantity} (${data.pointsAwarded} pts)`;
    }).join(', ');

    return `\n\nUser's recent eco-actions (last 7 days): ${summary}`;
  } catch {
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message as string;
    const userId: string = body.userId ?? '';

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

    // Build system prompt with optional recent habit context and streak
    let systemPrompt = ECO_SYSTEM_PROMPT;
    if (userId) {
      const [recentActivity, streakContext] = await Promise.all([
        getRecentHabitLogs(userId),
        getUserStreak(userId),
      ]);
      systemPrompt += recentActivity + streakContext;
    }

    // Load conversation history from Firestore
    const history: GeminiContent[] = userId ? await loadChatHistory(userId) : [];

    // Append current user message
    const contents: GeminiContent[] = [
      ...history,
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
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
    const responseText: string =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I'm having trouble responding right now. Please try again!";

    // Persist both messages to Firestore
    let assistantMessageId: string | null = null;
    if (userId) {
      await saveMessage(userId, message, 'user');
      assistantMessageId = await saveMessage(userId, responseText, 'model');
    }

    return NextResponse.json({ message: responseText, messageId: assistantMessageId });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
