# OfficeMate

Production-ready deployment on Railway.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yosiwizman/OfficeMate&plugins=postgresql)

## Services
- UI (this repo root, Next.js)
- Desktop (services/desktop based on linuxserver/webtop)

## Environment variables (UI)
Set these in Railway UI service (no secrets committed):
- NEXT_PUBLIC_SUPABASE_URL: your Supabase URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: your Supabase anon key
- SUPABASE_SERVICE_ROLE_KEY: service role key (server)
- PRIMARY_LLM=anthropic
- PRIMARY_LLM_MODEL=claude-3-5-sonnet-20240620
- PRIMARY_LLM_API_KEY: your Anthropic API key
- SEARCH_API (optional)
- SEARCH_API_KEY (optional)
- NEXT_PUBLIC_DESKTOP_URL: public URL of the Desktop service

## Model locking
The UI is locked to Anthropic Claude 3.5 Sonnet (20240620). No model picker is rendered.

## Workspace landing
After auth, the home page (/) embeds the Desktop immediately. If NEXT_PUBLIC_DESKTOP_URL isn’t set, a friendly notice is shown.

## Health
/api/health returns { ok: true } for Railway health checks.

## Local development

```bash
# install deps
npm i
# run dev
npm run dev
```

## Deploy via Railway CLI

```bash
# login (headless: copy the code into the browser once prompted)
railway login --browserless
# link to project
railway link --project fe6153db-0ea2-48da-a0c3-08de4ef33abc

# create UI variables (placeholders)
railway variables set \
  NEXT_PUBLIC_SUPABASE_URL=__paste__ \
  NEXT_PUBLIC_SUPABASE_ANON_KEY=__paste__ \
  SUPABASE_SERVICE_ROLE_KEY=__paste__ \
  PRIMARY_LLM=anthropic \
  PRIMARY_LLM_MODEL=claude-3-5-sonnet-20240620 \
  PRIMARY_LLM_API_KEY=__paste__ \
  NEXT_PUBLIC_DESKTOP_URL=__paste__

# deploy UI
railway up --service "UI" --detach --verbose

# create Desktop service env
cd services/desktop
railway variables set PORT=3000 TZ=UTC PUID=1000 PGID=1000 PASSWORD=change-me

# deploy Desktop
railway up --service "Desktop" --detach --verbose
```

After Desktop deploy, copy its public URL and paste into the UI service variable NEXT_PUBLIC_DESKTOP_URL.
