// lib/orchestrator.js
import { askGPT } from './openaiClient';
import { askClaude } from './anthropicClient';
import { askGemini } from './geminiClient';
import { askGroq } from './groqClient';
import { askMistral } from './mistralClient';
import { askPerplexity } from './perplexityClient';
import { askHuggingFace } from './huggingfaceClient';

const agents = [
  { name: 'GPT', ask: askGPT },
  { name: 'Claude', ask: askClaude },
  { name: 'Gemini', ask: askGemini },
  { name: 'Groq', ask: askGroq },
  { name: 'Mistral', ask: askMistral },
  { name: 'Perplexity', ask: askPerplexity },
  { name: 'HuggingFace', ask: askHuggingFace }
];

function didAgree(message) {
  const lower = message.toLowerCase();
  return /\b(i agree|i concur|same here|i think so too|yes, agreed|sono d'accordo|concordo|nulla da aggiungere|mi trovi d'accordo|sì, esatto)\b/.test(lower);
}

function isWeakResponse(message) {
  const lower = message.toLowerCase();
  return message.trim().length < 20 || /non ho nulla da aggiungere|non saprei|no comment|nothing else/.test(lower);
}

function getFilteredHistory(history, currentAgent) {
  return history
    .filter(entry => entry.name !== currentAgent)
    .map(h => `${h.name}: ${h.content}`)
    .join("\n");
}

export async function orchestrateConversation(question, maxRounds = 10, mute = false) {
  const history = [{ role: 'user', content: question }];
  const conversation = [];
  const agreementStatus = Object.fromEntries(agents.map(agent => [agent.name, false]));
  const silentCounter = Object.fromEntries(agents.map(agent => [agent.name, 0]));

  console.log('🤖 ROUND 0 - Initial thoughts');
  const initialResponses = await Promise.all(
    agents.map(agent => agent.ask(question).catch(() => '[No response]'))
  );

  initialResponses.forEach((message, i) => {
    history.push({ role: 'assistant', name: agents[i].name, content: message });
    conversation.push({ agent: agents[i].name, message });
  });

  if (mute) return { finished: false, rounds: 0, conversation };

  for (let round = 1; round <= maxRounds; round++) {
    console.log(`\n=== ROUND ${round} ===`);

    for (const agent of agents) {
      if (agreementStatus[agent.name] || silentCounter[agent.name] >= 2) continue;

      const discussion = getFilteredHistory(history.slice(-12), agent.name);
      const prompt = `Questa è la discussione attuale tra i membri del consiglio:\n\n${discussion}\n\n${agent.name}, vuoi aggiungere qualcosa, controbattere o chiarire? Se sei d'accordo esplicitalo.`;

      try {
        const response = await agent.ask(prompt);
        const message = response.trim();
        history.push({ role: 'assistant', name: agent.name, content: message });
        conversation.push({ agent: agent.name, message });

        if (didAgree(message)) {
          agreementStatus[agent.name] = true;
          console.log(`✅ ${agent.name} ha dato il consenso.`);
        } else if (isWeakResponse(message)) {
          silentCounter[agent.name]++;
          console.log(`🤐 ${agent.name} risposta debole (${silentCounter[agent.name]}x)`);
        } else {
          silentCounter[agent.name] = 0;
        }

        const allAgree = Object.values(agreementStatus).every(val => val);
        if (allAgree) {
          console.log('🤝 Consenso raggiunto tra tutti i membri del consiglio.');
          const summaryPrompt = `I membri del consiglio hanno raggiunto un consenso su questa discussione:\n\n${history.map(h => `${h.name || h.role}: ${h.content}`).join('\n')}\n\nFornisci un breve riassunto delle opinioni comuni.`;
          const summary = await askGPT(summaryPrompt);
          conversation.push({ agent: 'Consiglio', message: summary });
          return { finished: true, rounds: round, conversation };
        }

      } catch (err) {
        console.error(`${agent.name} failed:`, err.message);
        history.push({ role: 'assistant', name: agent.name, content: '[Error or no response]' });
        conversation.push({ agent: agent.name, message: '[Error or no response]' });
      }
    }
  }

    const responses = {};

  for (const entry of conversation) {
    if (!responses[entry.agent]) {
      responses[entry.agent] = {
        message: entry.message,
        status: didAgree(entry.message)
          ? 'ok'
          : isWeakResponse(entry.message)
          ? 'weak'
          : 'none',
      };
    }
  }

  return { responses, finished: false, rounds: maxRounds };

}

export async function orchestrateConversationWithConsensus(question, maxRounds = 5) {
  const history = [{ role: 'user', content: question }];
  const conversation = [];
  const mentions = new Set();

  let round = 0;
  let consensusReached = false;

  while (round < maxRounds && !consensusReached) {
    console.log(`\n=== ROUND ${round + 1} ===`);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      const context = history
        .map(h => `(${h.role}) ${h.name || 'user'}: ${h.content}`)
        .join('\n');

      const prompt = `The council is discussing a user question. Here's what has been said so far:\n\n${context}\n\nYou are ${agent.name}.\nYou may:\n- Share your opinion,\n- Explicitly agree or disagree with someone,\n- Ask a question to another AI by name (e.g., "Claude, what do you think?").`;

      try {
        const response = await agent.ask(prompt);
        const message = response.trim();
        history.push({ role: 'assistant', name: agent.name, content: message });
        conversation.push({ agent: agent.name, message });

        if (/\b(i agree|i concur|i also believe|same|sounds right|yes, agreed)\b/i.test(message)) {
          mentions.add(agent.name);
        }

        for (const other of agents) {
          if (other.name !== agent.name && message.toLowerCase().includes(other.name.toLowerCase())) {
            mentions.add(other.name);
          }
        }

        if (mentions.size === agents.length) {
          consensusReached = true;
          break;
        }
      } catch (err) {
        console.error(`${agent.name} failed:`, err.message);
        history.push({ role: 'assistant', name: agent.name, content: '[Error or no response]' });
        conversation.push({ agent: agent.name, message: '[Error or no response]' });
      }
    }

    round++;
  }

  return {
    finished: consensusReached,
    rounds: round,
    conversation
  };
}
