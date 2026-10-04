// OpenAI-compatible endpoint presets. The base URL stays editable.
export const PRESETS = [
  { id: "openai", name: "OpenAI", baseUrl: "https://api.openai.com/v1" },
  { id: "openrouter", name: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1" },
  { id: "groq", name: "Groq", baseUrl: "https://api.groq.com/openai/v1" },
  { id: "gemini", name: "Google Gemini", baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai" },
  { id: "deepseek", name: "DeepSeek", baseUrl: "https://api.deepseek.com/v1" },
  { id: "mistral", name: "Mistral", baseUrl: "https://api.mistral.ai/v1" },
  { id: "together", name: "Together AI", baseUrl: "https://api.together.xyz/v1" },
  { id: "ollama", name: "Ollama (local)", baseUrl: "http://localhost:11434/v1" },
  { id: "lmstudio", name: "LM Studio (local)", baseUrl: "http://localhost:1234/v1" },
  { id: "other", name: "Other", baseUrl: "" }
];
