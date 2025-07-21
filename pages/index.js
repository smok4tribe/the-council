import { useEffect, useState } from 'react';
import AgentResponse from "../components/AgentResponse";  
import { agentsMeta } from "../utils/agentsMeta";  // Import metadata for agent display

export default function HomePage() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const callCouncil = async () => {
      try {
        const res = await fetch("/api/orchestrator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: "Qual è il senso della vita?",
            mute: false,
            maxRounds: 6
          })
        });
        const data = await res.json();
        console.log("🤖 Risposta del Consiglio:", data);
        if (data.responses) {
          // Convert the responses object into an array of results
          const extractedResponses = Object.entries(data.responses).map(([agentKey, agentData]) => ({
            agentKey,
            response: agentData.message || "",
            status: agentData.status || "none"
          }));
          setResponses(extractedResponses);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error calling the council orchestrator:", error);
      } finally {
        // Always remove loading state when done
        setLoading(false);
      }
    };

    // Trigger the orchestrator call when the component mounts
    callCouncil();
  }, []);

  return (
    <main className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold flex items-center">
        <span className="mr-2 text-3xl">🧠</span>
        Risposte del Consiglio
      </h1>

      {/* Conditional Rendering: Loading message or Responses list */}
      {loading ? (
        <p>⏳ Caricamento in corso...</p>
      ) : (
        // Display each agent's response using the AgentResponse component
        responses.map(({ agentKey, response, status }) => {
          // Lookup metadata for this agent (name, icon, color)
          const { name: agentName = agentKey, icon = "🤖", color = "#ccc" } = agentsMeta[agentKey] || {};
          return (
            <AgentResponse
              key={agentKey}
              agentName={agentName}
              icon={icon}
              color={color}
              response={response}
              status={status}
            />
          );
        })
      )}
    </main>
  );
}
