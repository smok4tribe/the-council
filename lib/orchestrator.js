import { askGPT } from './openaiClient';
import { askClaude } from './anthropicClient';
import { askGemini } from './geminiClient';
import { askGroq } from './groqClient';
import { askMistral } from './mistralClient';
import { askPerplexity } from './perplexityClient';
import { askHuggingFace } from './huggingfaceClient';

import {
  detectQuoteTargets,
  detectQuestion,
  detectConsensus
} from './councilUtils';

const agents = [
  { name: 'GPT', ask: askGPT },
  { name: 'Claude', ask: askClaude },
  { name: 'Gemini', ask: askGemini },
  { name: 'Groq', ask: askGroq },
  { name: 'Mistral', ask: askMistral },
  { name: 'Perplexity', ask: askPerplexity },
  { name: 'HuggingFace', ask: askHuggingFace },
];

function getOtherMessages(conversation, agentName, round) {
  return conversation
    .filter(entry => entry.round === round && entry.agent !== agentName)
    .map(entry => `${entry.agent}: ${entry.message}`)
    .join('\n\n');
}

export async function orchestrateConversation(prompt, maxRounds = 5) {
  const conversation = [];

  // ROUND 0
  console.log('🤖 ROUND 0 - Risposte iniziali');
  for (const agent of agents) {
    try {
      const response = await agent.ask(prompt);
      const message = response.trim();
      conversation.push({ agent: agent.name, message, round: 0 });
    } catch (err) {
      conversation.push({ agent: agent.name, message: '[No response]', round: 0 });
    }
  }

  // ROUND 1+
  let round = 1;
  let continueDiscussion = true;
  let quotePriority = [];

  while (continueDiscussion && round <= maxRounds) {
    console.log(`🌀 ROUND ${round} - Commenti incrociati`);
    const roundMessages = [];

    // Ordina gli agenti: prima quelli citati nel round precedente
    const agentsToTalk = [...quotePriority, ...agents.map(a => a.name).filter(name => !quotePriority.includes(name))];

    quotePriority = []; // reset per round successivo
    let allConsensus = true;
    let anyQuoteOrQuestion = false;

    for (const agentName of agentsToTalk) {
      const agent = agents.find(a => a.name === agentName);
      const context = getOtherMessages(conversation, agent.name, round - 1);
      const promptRound = `Sei ${agent.name}. Questi sono i contributi degli altri:\n\n${context}\n\nSe hai qualcosa da aggiungere, fallo. Puoi anche citare altri agenti o fare domande, se serve. Se sei d’accordo con quanto detto e non hai nulla da aggiungere, puoi dirlo.`;

      try {
        const response = await agent.ask(promptRound);
        const message = response.trim();
        conversation.push({ agent: agent.name, message, round });
        roundMessages.push({ agent: agent.name, message });

        // logica democratica:
        const isConsensus = detectConsensus(message);
        const isQuestion = detectQuestion(message);
        const quoted = detectQuoteTargets(message);

        if (!isConsensus) allConsensus = false;
        if (isQuestion || quoted.length > 0) anyQuoteOrQuestion = true;
        quotePriority.push(...quoted.filter(q => !quotePriority.includes(q)));

      } catch (err) {
        conversation.push({ agent: agent.name, message: '[No response]', round });
      }
    }

    if (allConsensus && !anyQuoteOrQuestion) {
      continueDiscussion = false;
    } else {
      round++;
    }
  }

  return {
    conversation,
    finished: true,
    rounds: round
  };
}
