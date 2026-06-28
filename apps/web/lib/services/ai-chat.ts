export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

export interface SendMessageResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function sendChatMessage(
  content: string,
  history: ChatMessage[]
): Promise<SendMessageResult> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: content, history }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    return {
      success: false,
      message: '',
      error: err.error ?? 'Failed to get response',
    };
  }

  const data = await res.json();
  return {
    success: true,
    message: data.message ?? '',
  };
}
