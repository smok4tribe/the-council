🧠 The Council — README / Documentazione Tecnica

📌 Cos’è The Council
The Council è una piattaforma sperimentale in cui più modelli AI (GPT, Claude, Gemini, HuggingFace, Groq, Mistral, Perplexity, ecc.) vengono orchestrati per discutere tra loro una domanda fino a raggiungere consenso. Ogni round rappresenta un ciclo di confronto tra gli agenti, dove possono:

proporre opinioni

concordare/discutere tra loro

dichiarare il proprio consenso

uscire dal dibattito se non hanno nulla da aggiungere

🎯 Obiettivo
Simulare un ambiente di confronto tra AI con dinamiche collaborative, oppositive o esplorative — utile per brainstorming, validazione idee, analisi etica o scenari complessi.

📁 Struttura del progetto

/lib

orchestrator.js → logica centrale che coordina la conversazione tra le AI

openaiClient.js, anthropicClient.js, ecc. → adapter per ogni modello AI

/pages

index.js → frontend React (Next.js) che chiama l’orchestratore

/api/orchestrator.js → endpoint API POST che attiva la discussione

/components

AgentResponse.js → componente che stampa le risposte di ciascun agente

/public

eventuali asset statici

🛠️ Requisiti

Node.js ≥ 18

Next.js

API keys per i modelli (OpenAI, Claude, Gemini, Groq, ecc.)

Tailwind (già incluso, opzionale per styling)

[Opzionale] Copilot Studio o orchestrazione autonoma per prompt dinamici

🚀 Come usarlo

Clona il progetto

Configura le API keys nei rispettivi file client (.env o direttamente nei client JS)

Avvia il progetto con:
npm install
npm run dev

Apri http://localhost:3000 e vedrai “The Council sta discutendo…”

📨 API POST /api/orchestrator

Body JSON:
{
"question": "Qual è il senso della vita?",
"mute": false,
"maxRounds": 5
}

Response JSON:
{
"finished": true,
"rounds": 3,
"conversation": [
{ "agent": "GPT", "message": "..." },
{ "agent": "Claude", "message": "..." }
...
]
}

🧠 Prompt Strategy (orchestrator.js)

ROUND 0: tutti gli agent rispondono alla domanda iniziale

ROUND 1+:

ciascun agente riceve un prompt con lo storico della conversazione filtrato

il prompt chiede: “vuoi aggiungere qualcosa, controbattere, chiarire o sei d’accordo?”

Stop condition:

se tutti concordano (con frasi tipo "sono d'accordo", "concordo", "yes agreed")

oppure se agenti silenziosi (risposte deboli o vuote) superano soglia

Se consenso → viene chiesto a GPT di fare un riassunto delle opinioni condivise

🤖 Agent Response Logic

didAgree(message): rileva se l’agente ha dichiarato consenso

isWeakResponse(message): risposte troppo corte o vaghe → conteggiate come “silenziose”

Se tutti gli agenti = consensus → riassunto finale

Altrimenti, loopa fino a maxRounds

🧩 Futuri miglioramenti

Possibilità di “mod” manuale: mutare o rimuovere agent in tempo reale

Interfaccia per inserire la domanda dinamicamente

Memory long-term per ogni agente (simulazione di personalità persistenti)

Dashboard per logging ed export dei dibattiti

💡 Idee di utilizzo

Brainstorming creativo (es. “Che business innovativo possiamo lanciare?”)

Decision making etico (“Cosa dovrebbe fare una self-driving car in caso di impatto?”)

Generazione narrativa collettiva

Esperimenti didattici o di explainability delle AI

🧪 Test

Attualmente i test si eseguono via console (console.log) ma è possibile esportare i risultati anche in UI (e.g. in homepage o come log JSON).

