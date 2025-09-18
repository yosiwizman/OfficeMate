import Link from 'next/link'
import { config } from '@/lib/config'

export default function Page() {
  const hasDesktop = !!config.NEXT_PUBLIC_DESKTOP_URL
  return (
    <div className="container">
      <div className="brand">OfficeMate</div>

      <section className="card">
        <h2>
          Workspace
          <span className="small" style={{ float: 'right' }}>
            Model: {config.PRIMARY_LLM}/{config.PRIMARY_LLM_MODEL}
          </span>
        </h2>
        <div className="body">
          {hasDesktop ? (
            <iframe
              className="desktopFrame"
              src={config.NEXT_PUBLIC_DESKTOP_URL!}
              title="Desktop"
              allow="clipboard-read; clipboard-write;"
            />
          ) : (
            <div className="notice">
              Desktop URL not configured. Set NEXT_PUBLIC_DESKTOP_URL to your Desktop service public URL.
            </div>
          )}
        </div>
      </section>

      <section className="card">
        <h2>Quick Actions</h2>
        <div className="body">
          <ul style={{ listStyle: 'none', padding: 16, margin: 0 }}>
            <li><Link href="/api/health">Health check</Link></li>
            <li><a href="/desktop" target="_blank">Open Desktop full page</a></li>
          </ul>
        </div>
      </section>
    </div>
  )
}
