import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const desktopUrl = process.env.NEXT_PUBLIC_DESKTOP_URL
  if (!desktopUrl) {
    return new NextResponse('<!doctype html><html><body><p>Desktop URL not configured. Set NEXT_PUBLIC_DESKTOP_URL.</p></body></html>', {
      status: 200,
      headers: { 'content-type': 'text/html' }
    })
  }
  // Proxy simple HTML wrapper that iframes desktop URL full-screen
  const html = `<!doctype html>
  <html><head><meta name="viewport" content="width=device-width,initial-scale=1">
  <style>html,body,iframe{margin:0;height:100%;width:100%;border:0}</style>
  <title>Desktop</title></head>
  <body>
    <iframe src="${desktopUrl}" allow="clipboard-read; clipboard-write;"></iframe>
  </body></html>`
  return new NextResponse(html, { status: 200, headers: { 'content-type': 'text/html' } })
}
