import React from "react";

/**
 * Display a single AI agent's response card, including its name, icon, and status.
 * @param {Object} props
 * @param {string} props.agentName - The display name of the agent.
 * @param {string} props.icon - An emoji or symbol representing the agent.
 * @param {string} props.color - A color code for the agent's accent border.
 * @param {string} props.response - The response text from the agent.
 * @param {"ok"|"weak"|"none"} props.status - The agent's consensus status.
 */
export default function AgentResponse({ agentName, icon, color, response, status }) {
  return (
    <div className="p-4 my-2 rounded-2xl shadow-md border" style={{ borderColor: color }}>
      {/* Header: Agent icon, name, and status indicator */}
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">{icon}</span>
        <h2 className="font-bold text-lg" style={{ color }}>{agentName}</h2>
        {status === "ok" && <span className="ml-2 text-green-500">✔️</span>}
        {status === "weak" && <span className="ml-2 text-yellow-500">🤔</span>}
        {status === "none" && <span className="ml-2 text-red-500">❌</span>}
      </div>
      {/* Body: Agent's response text (preserving line breaks) */}
      <p className="whitespace-pre-line">{response}</p>
    </div>
  );
}
