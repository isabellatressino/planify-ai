const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

export async function generateStudyPlan({ goal, level, hoursDay, deadline }) {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("OPENAI_API_KEY is missing");
    error.code = "OPENAI_FAILED";
    throw error;
  }

  const prompt = [
    "Gere um plano de estudos em JSON valido.",
    "Retorne apenas JSON no formato:",
    '{ "title": string, "days": [ { "day": number, "topic": string, "goal": string, "tasks": [ { "description": string } ] } ] }',
    "O campo title deve ser curto (3 a 8 palavras), bonito e sem aspas.",
    `Objetivo: ${goal}`,
    `Nivel: ${level}`,
    `Horas por dia: ${hoursDay}`,
    `Prazo em dias: ${deadline}`,
    "Limites: deadline entre 1 e 30 dias; hoursDay entre 1 e 6; goal entre 3 e 80 caracteres; level deve ser iniciante, intermediario ou avancado.",
    "Nao inclua campos completed ou id nas tasks.",
  ].join("\n");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25_000);

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "Voce gera planos de estudo em JSON valido.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = new Error(`OpenAI error: ${response.status}`);
      error.code = "OPENAI_FAILED";
      throw error;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      const error = new Error("Empty OpenAI response");
      error.code = "OPENAI_FAILED";
      throw error;
    }

    return JSON.parse(content);
  } catch (err) {
    if (err?.name === "AbortError") {
      const error = new Error("OpenAI timeout");
      error.code = "OPENAI_TIMEOUT";
      throw error;
    }
    if (err.code === "OPENAI_FAILED") {
      throw err;
    }
    const error = new Error("OpenAI request failed");
    error.code = "OPENAI_FAILED";
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
