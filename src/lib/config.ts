export const config = {
  PRIMARY_LLM: process.env.PRIMARY_LLM || 'anthropic',
  PRIMARY_LLM_MODEL: process.env.PRIMARY_LLM_MODEL || 'claude-3-5-sonnet-20240620',
  NEXT_PUBLIC_DESKTOP_URL: process.env.NEXT_PUBLIC_DESKTOP_URL,
}
