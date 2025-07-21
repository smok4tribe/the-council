import { agentsMeta } from '@/utils/agentsMeta';

export default function AgentResponse({ agent, round, message }) {
  const meta = agentsMeta[agent] || { color: '#999', icon: '🤖' };
  const bgColor = meta.color + '20'; // trasparenza per sfondo

  return (
    <div
      className="p-4 rounded-xl shadow border"
      style={{ backgroundColor: bgColor }}
    >
      <div className="text-sm font-semibold mb-2" style={{ color: meta.color }}>
        {meta.icon} {agent} · Round {round}
      </div>
      <div className="whitespace-pre-wrap text-white">
        {message}
      </div>
    </div>
  );
}
