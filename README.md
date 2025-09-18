# OfficeMate

Production-ready deployment on Railway.

[![Deploy UI on Railway](https://railway.app/button.svg)](https://railway.app/template/new?templateUrl=https%3A%2F%2Fgithub.com%2Fyosiwizman%2FOfficeMate)

[![Deploy Desktop on Railway](https://railway.app/button.svg)](https://railway.app/template/new?templateUrl=https%3A%2F%2Fgithub.com%2Fyosiwizman%2FOfficeMate&rootDir=services%2Fdesktop)

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

## How to deploy (buttons or CLI)

- One-click deploys:
  - UI (root): https://railway.app/template/new?templateUrl=https%3A%2F%2Fgithub.com%2Fyosiwizman%2FOfficeMate
  - Desktop (services/desktop): https://railway.app/template/new?templateUrl=https%3A%2F%2Fgithub.com%2Fyosiwizman%2FOfficeMate&rootDir=services%2Fdesktop

## Deploy via Railway CLI

```bash
# login (headless: copy the code into the browser once prompted)
railway login --browserless
# link to project
railway link --project 22dac265-ded4-4ece-9d74-66e847077195

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
railway variables set PORT=3000 TZ=UTC PUID=1000 PGID=1000 PASSWORD=ChangeMe-Strong!

# deploy Desktop
railway up --service "Desktop" --detach --verbose
```

First run: Desktop may prompt for a password in the iframe; use the PASSWORD env you set.

After Desktop deploy, copy its public URL and paste into the UI service variable NEXT_PUBLIC_DESKTOP_URL.
