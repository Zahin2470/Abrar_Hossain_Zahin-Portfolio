const PROVIDER_TIMEOUT_MS = 12_000;
const REQUEST_TIMEOUT_MS = 45_000;

const groqApiKeys = [
  process.env.Zahin_API_KEY,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
].map((apiKey) => apiKey?.trim()).filter(Boolean);

const providers = groqApiKeys.map((apiKey, index) => ({
  name: `Groq account ${index + 1}`,
  apiKey,
  url: "https://api.groq.com/openai/v1/chat/completions",
  model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
}));

export class AiProvidersUnavailableError extends Error {
  constructor() {
    super("All configured AI providers failed.");
    this.name = "AiProvidersUnavailableError";
  }
}

export async function generateAiCompletion({ messages, maxTokens, temperature }) {
  if (providers.length === 0) {
    throw new AiProvidersUnavailableError();
  }

  const deadline = Date.now() + REQUEST_TIMEOUT_MS;

  for (const provider of providers) {
    const remainingTime = deadline - Date.now();
    if (remainingTime <= 0) break;

    try {
      const response = await fetch(provider.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: provider.model,
          max_tokens: maxTokens,
          temperature,
          messages,
        }),
        signal: AbortSignal.timeout(Math.min(PROVIDER_TIMEOUT_MS, remainingTime)),
      });

      if (!response.ok) {
        console.error("AI provider request failed", {
          provider: provider.name,
          status: response.status,
        });
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (typeof content !== "string" || !content.trim()) {
        console.error("AI provider returned an empty or invalid completion", {
          provider: provider.name,
        });
        continue;
      }

      return content;
    } catch (error) {
      console.error("AI provider request failed", {
        provider: provider.name,
        error: error instanceof Error ? error.name : "UnknownError",
      });
    }
  }

  throw new AiProvidersUnavailableError();
}
