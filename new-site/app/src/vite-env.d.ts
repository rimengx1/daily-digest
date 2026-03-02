/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEEPSEEK_API_KEY?: string
  readonly VITE_GPT_CODEX_API_KEY?: string
  readonly VITE_KIMI_API_KEY?: string
  readonly VITE_AI_PROVIDER?: 'deepseek' | 'gpt-codex'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
