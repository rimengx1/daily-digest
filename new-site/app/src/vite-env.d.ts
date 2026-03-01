/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEEPSEEK_API_KEY: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_CODEX_API_KEY: string
  readonly VITE_DEFAULT_AI_PROVIDER: 'deepseek' | 'kimi' | 'mock'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
