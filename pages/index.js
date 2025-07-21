import { useState } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatBox from '@/components/ChatBox';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);


  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setConversation([]);
    try {
      const res = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      setConversation(data.conversation);
      setFinished(data.finished);
    } catch (e) {
      console.error('Errore durante la richiesta:', e);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>The Council</title>
      </Head>
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">🧠 The Council</h1>

        <div className="flex gap-2 mb-6">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Fai una domanda al consiglio..."
            className="flex-1"
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Elaborazione...' : 'Invia'}
          </Button>
        </div>

        {conversation.length > 0 && (
          <ChatBox conversation={conversation} finished={true} />
        )}
      </main>
    </>
  );
}
