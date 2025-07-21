import { useEffect, useState, useRef } from 'react';
import AgentResponse from './AgentResponse';
import MuteButton from './MuteButton';

export default function ChatBox({ conversation, finished }) {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [muted, setMuted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!conversation || conversation.length === 0) return;

    setVisibleMessages([]);
    let i = 0;

    intervalRef.current = setInterval(() => {
      if (muted) return;

      if (i < conversation.length) {
        setVisibleMessages((prev) => [...prev, conversation[i]]);
        i++;
      } else {
        clearInterval(intervalRef.current);
      }
    }, 800);

    return () => clearInterval(intervalRef.current);
  }, [conversation, muted]);

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return (
    <div className="space-y-4">
      <MuteButton muted={muted} onToggle={toggleMute} />

      <div className="p-4 space-y-4 overflow-y-auto max-h-[80vh]">
      {visibleMessages.map((msg, idx) => {
  if (!msg || !msg.agent || !msg.message) return null; // 💥 IGNORA MESSAGGI INVALIDI

  return (
    <AgentResponse
      key={idx}
      agent={msg.agent}
      round={msg.round}
      message={msg.message}
    />
  );
})}

      </div>

      {/* ✅ Fine dibattito */}
      {visibleMessages.length === conversation.length && finished && (
        <div className="text-center text-sm text-green-500 mt-6">
          ✅ Il Consiglio ha concluso. Nessun ulteriore commento necessario.
        </div>
      )}
    </div>
  );
}
