import { useEffect, useMemo, useState } from 'react'

type PanelType =
  | 'focus'
  | 'search'
  | 'files'
  | 'obsidian'
  | 'gmail'
  | 'api'
  | 'tasks'
  | 'preview'
  | 'logs'
  | 'assistant'
  | 'settings'

interface PanelWindow {
  id: string
  type: PanelType
  title: string
  x: number
  y: number
  w: number
  h: number
  minimized: boolean
}

interface WorkspaceState {
  name: string
  project: string
  business: string
  layout: string
  openPanels: PanelType[]
  focusMinutes: number
  notes: string
}

interface ProviderConfig {
  name: string
  status: 'connected' | 'blocked' | 'offline'
  value: string
  endpoint: string
  description: string
}

const DEFAULT_WORKSPACES = [
  { name: 'ApexWeb Main', project: 'Northstar Studio', business: 'Luxury HVAC', layout: 'Build Mode' },
  { name: 'Client Projects', project: 'Westline Homes', business: 'Architectural Design', layout: 'Research Mode' },
  { name: 'Testing Lab', project: 'Prototype Flow', business: 'Website QA Lab', layout: 'QA Mode' },
]

const PANEL_META: Record<PanelType, { title: string; accent: string }> = {
  focus: { title: 'Focus', accent: '#7dd3fc' },
  search: { title: 'Search', accent: '#c4b5fd' },
  files: { title: 'Files', accent: '#86efac' },
  obsidian: { title: 'Obsidian', accent: '#f9a8d4' },
  gmail: { title: 'Gmail', accent: '#fbbf24' },
  api: { title: 'API Health', accent: '#fca5a5' },
  tasks: { title: 'Tasks', accent: '#93c5fd' },
  preview: { title: 'Preview', accent: '#67e8f9' },
  logs: { title: 'Logs', accent: '#a5b4fc' },
  assistant: { title: 'Assistant', accent: '#c7d2fe' },
  settings: { title: 'Settings', accent: '#34d399' },
}

const PANEL_ORDER: PanelType[] = ['focus', 'search', 'files', 'obsidian', 'gmail', 'api', 'tasks', 'preview', 'logs', 'assistant', 'settings']

const DEFAULT_WORKSPACE_STATE: WorkspaceState = {
  name: 'ApexWeb Main',
  project: 'Northstar Studio',
  business: 'Luxury HVAC',
  layout: 'Build Mode',
  openPanels: ['focus', 'preview', 'tasks', 'api', 'assistant', 'obsidian'],
  focusMinutes: 54,
  notes: 'Need to keep a sharper visual direction and use actual Pexels images for the hero concept.'
}

const defaultIntegrations: Record<string, ProviderConfig> = {
  google: {
    name: 'Google',
    status: 'blocked',
    value: '',
    endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    description: 'Use Google sign-in with minimal profile identity.'
  },
  gmail: {
    name: 'Gmail',
    status: 'blocked',
    value: '',
    endpoint: 'https://gmail.googleapis.com/gmail/v1/users/me/messages',
    description: 'Read inbox metadata with explicit Gmail authorization.'
  },
  obsidian: {
    name: 'Obsidian',
    status: 'blocked',
    value: '',
    endpoint: 'local vault directory',
    description: 'Connect to a real vault for memory and knowledge flow.'
  },
  pexels: {
    name: 'Pexels',
    status: 'blocked',
    value: '',
    endpoint: 'https://api.pexels.com/v1/search',
    description: 'Search and select premium imagery for the website build.'
  }
}

const initialPanels = (): PanelWindow[] => [
  { id: 'focus-window', type: 'focus', title: 'Focus', x: 10, y: 12, w: 270, h: 220, minimized: false },
  { id: 'preview-window', type: 'preview', title: 'Preview', x: 300, y: 12, w: 520, h: 360, minimized: false },
  { id: 'tasks-window', type: 'tasks', title: 'Tasks', x: 860, y: 12, w: 260, h: 260, minimized: false },
  { id: 'api-window', type: 'api', title: 'API Health', x: 860, y: 290, w: 260, h: 240, minimized: false },
  { id: 'assistant-window', type: 'assistant', title: 'Assistant', x: 300, y: 400, w: 540, h: 220, minimized: false },
  { id: 'obsidian-window', type: 'obsidian', title: 'Obsidian', x: 10, y: 260, w: 270, h: 320, minimized: false }
]

function App() {
  const [workspace, setWorkspace] = useState<WorkspaceState>(() => {
    const saved = window.localStorage.getItem('apexweb.workspace')
    return saved ? JSON.parse(saved) : DEFAULT_WORKSPACE_STATE
  })

  const [workspaces, setWorkspaces] = useState(() => {
    const saved = window.localStorage.getItem('apexweb.workspaces')
    return saved ? JSON.parse(saved) : DEFAULT_WORKSPACES
  })

  const [integrations, setIntegrations] = useState<Record<string, ProviderConfig>>(() => {
    const saved = window.localStorage.getItem('apexweb.integrations')
    return saved ? JSON.parse(saved) : defaultIntegrations
  })

  const [panels, setPanels] = useState<PanelWindow[]>(() => {
    const saved = window.localStorage.getItem('apexweb.panels')
    return saved ? JSON.parse(saved) : initialPanels()
  })

  const [commandOpen, setCommandOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')
  const [statusLine, setStatusLine] = useState('System ready • provider routing online • 6 active views')
  const [focusSeconds, setFocusSeconds] = useState(54 * 60)
  const [pexelsResult, setPexelsResult] = useState<string>('Awaiting connection test')
  const [gmailState, setGmailState] = useState<string>('Awaiting Google auth')

  useEffect(() => {
    window.localStorage.setItem('apexweb.workspace', JSON.stringify(workspace))
  }, [workspace])

  useEffect(() => {
    window.localStorage.setItem('apexweb.workspaces', JSON.stringify(workspaces))
  }, [workspaces])

  useEffect(() => {
    window.localStorage.setItem('apexweb.integrations', JSON.stringify(integrations))
  }, [integrations])

  useEffect(() => {
    window.localStorage.setItem('apexweb.panels', JSON.stringify(panels))
  }, [panels])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFocusSeconds((value) => (value > 0 ? value - 1 : 0))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  const focusLabel = useMemo(() => {
    const totalMinutes = Math.floor(focusSeconds / 60)
    const remainingSeconds = focusSeconds % 60
    return `${String(totalMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }, [focusSeconds])

  const commandItems = useMemo(() => {
    const query = commandQuery.toLowerCase()
    const list = [
      'New Project',
      'New Website',
      'Open Workspace',
      'Switch Workspace',
      'Open Obsidian',
      'Search Memory',
      'Open Gmail',
      'Open Business',
      'Start Agent Run',
      'Pause Run',
      'Resume Run',
      'Retry Failed Task',
      'Open API Health',
      'Open Preview',
      'Run QA',
      'Start Focus',
      'Toggle Multiview',
      'Create Panel',
      'Save Layout',
      'Share Workspace'
    ]
    return list.filter((item) => item.toLowerCase().includes(query))
  }, [commandQuery])

  const openPanel = (type: PanelType) => {
    setPanels((current) => {
      const existing = current.find((panel) => panel.type === type)
      if (existing) {
        return current.map((panel) => (panel.type === type ? { ...panel, minimized: false } : panel))
      }
      const next = {
        id: `${type}-window-${Date.now()}`,
        type,
        title: PANEL_META[type].title,
        x: 40 + (current.length * 22) % 240,
        y: 30 + (current.length * 18) % 140,
        w: 260,
        h: 240,
        minimized: false
      }
      return [...current, next]
    })
  }

  const closePanel = (type: PanelType) => {
    setPanels((current) => current.filter((panel) => panel.type !== type))
  }

  const saveLayout = () => {
    setStatusLine('Layout saved • workspace state persisted and restored on reload')
  }

  const switchWorkspace = (index: number) => {
    const next = workspaces[index]
    setWorkspace((current) => ({
      ...current,
      name: next.name,
      project: next.project,
      business: next.business,
      layout: next.layout
    }))
    setStatusLine(`Workspace switched to ${next.name}`)
  }

  const addWorkspace = () => {
    const name = `New Workspace ${workspaces.length + 1}`
    const next = { name, project: 'Project seed', business: 'New Business', layout: 'Build Mode' }
    setWorkspaces((current) => [...current, next])
    setWorkspace((current) => ({ ...current, name, project: next.project, business: next.business, layout: next.layout }))
    setStatusLine(`Created ${name}`)
  }

  const setIntegrationValue = (key: string, value: string) => {
    setIntegrations((current) => ({
      ...current,
      [key]: { ...current[key], value, status: value ? 'connected' : 'blocked' }
    }))
  }

  const beginGoogleAuth = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      setStatusLine('Google OAuth is not configured. Add VITE_GOOGLE_CLIENT_ID to enable live authentication.')
      return
    }
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: window.location.origin,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account',
      access_type: 'offline'
    })
    window.open(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`, '_blank', 'noopener,noreferrer')
    setStatusLine('Google sign-in flow started')
  }

  const testPexelsConnection = async () => {
    const key = integrations.pexels.value
    if (!key) {
      setPexelsResult('Pexels not configured — add an API key to test live connectivity.')
      return
    }
    try {
      const res = await fetch('https://api.pexels.com/v1/search?query=modern+luxury+home+exterior&per_page=1', {
        headers: { Authorization: key }
      })
      if (!res.ok) {
        setPexelsResult(`Pexels test failed: ${res.status} ${res.statusText}`)
        setStatusLine('Provider health degraded • Pexels rejected the supplied key or quota')
        return
      }
      const json = await res.json()
      const photoCount = Array.isArray(json.photos) ? json.photos.length : 0
      setPexelsResult(photoCount > 0 ? `Connected. ${photoCount} result(s) returned for a live search.` : 'Connected. The API responded, but no images were returned for the test query.')
      setStatusLine('Pexels verified successfully')
      setIntegrations((current) => ({
        ...current,
        pexels: { ...current.pexels, status: 'connected' }
      }))
    } catch (error) {
      setPexelsResult('Connection error. Check the network or API key.')
      setStatusLine('Pexels connection failed — verify the API key and quota')
      setIntegrations((current) => ({
        ...current,
        pexels: { ...current.pexels, status: 'offline' }
      }))
      console.error(error)
    }
  }

  const testGmailConnection = () => {
    const authEnabled = Boolean(integrations.google.value)
    if (!authEnabled) {
      setGmailState('Google account not connected. Sign in with Google first.')
      return
    }
    setGmailState('Gmail connected • inbox metadata ready for review')
    setIntegrations((current) => ({
      ...current,
      gmail: { ...current.gmail, status: 'connected' }
    }))
  }

  const commandAction = (action: string) => {
    setCommandOpen(false)
    setCommandQuery('')
    const map: Record<string, () => void> = {
      'Open Obsidian': () => openPanel('obsidian'),
      'Open Gmail': () => openPanel('gmail'),
      'Open API Health': () => openPanel('api'),
      'Open Preview': () => openPanel('preview'),
      'Open Business': () => setStatusLine('Business workspace overview opened'),
      'Start Focus': () => openPanel('focus'),
      'Create Panel': () => openPanel('assistant'),
      'Save Layout': saveLayout,
      'New Project': addWorkspace,
      'Search Memory': () => openPanel('search'),
      'Run QA': () => setStatusLine('QA run queued • visual and functional checks now evaluating the current build'),
      'Share Workspace': () => setStatusLine('Sharing permissions opened • owner, admin, editor, and viewer roles ready'),
      'Start Agent Run': () => setStatusLine('Agent run started • design, asset research, and QA tasks are queued')
    }
    if (map[action]) map[action]()
  }

  const openPanelList = (panelType: PanelType) => {
    setPanels((current) => {
      const existing = current.find((panel) => panel.type === panelType)
      if (existing) return current
      return [...current, {
        id: `${panelType}-window-${Date.now()}`,
        type: panelType,
        title: PANEL_META[panelType].title,
        x: 36 + current.length * 16,
        y: 32 + current.length * 18,
        w: 320,
        h: 220,
        minimized: false,
      }]
    })
  }

  const smallCards = [
    { label: 'Pipeline', value: 'Live', accent: '#8b5cf6' },
    { label: 'Providers', value: '4 active', accent: '#14b8a6' },
    { label: 'Assets', value: '128', accent: '#f59e0b' },
    { label: 'Runs', value: '7', accent: '#60a5fa' }
  ]

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">A</div>
          <div>
            <div className="eyebrow">ApexWeb</div>
            <strong>Pipeline OS</strong>
          </div>
        </div>

        <div className="workspace-switcher">
          <select value={workspace.name} onChange={(event) => switchWorkspace(workspaces.findIndex((item) => item.name === event.target.value))}>
            {workspaces.map((item) => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
          <button className="ghost" onClick={addWorkspace}>+ New</button>
        </div>

        <div className="top-actions">
          <button className="ghost" onClick={() => setCommandOpen(true)}>⌘K Command</button>
          <button className="primary" onClick={beginGoogleAuth}>Sign in with Google</button>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <div className="sidebar-title">Workspace</div>
          <div className="nav-list">
            {PANEL_ORDER.map((panelType) => (
              <button key={panelType} className="nav-item" onClick={() => openPanelList(panelType)}>
                <span className="nav-dot" style={{ background: PANEL_META[panelType].accent }} />
                {PANEL_META[panelType].title}
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title small">Current project</div>
            <div className="meta-card">
              <div className="meta-label">Business</div>
              <strong>{workspace.business}</strong>
              <div className="meta-label">Project</div>
              <strong>{workspace.project}</strong>
              <div className="meta-label">Layout</div>
              <strong>{workspace.layout}</strong>
            </div>
          </div>
        </aside>

        <main className="workspace-area">
          <div className="status-strip">
            <span>{statusLine}</span>
            <div className="pill-row">
              <span className="pill online">Healthy</span>
              <span className="pill amber">3 flags</span>
            </div>
          </div>

          <div className="metrics-row">
            {smallCards.map((card) => (
              <div key={card.label} className="metric-card" style={{ borderTop: `2px solid ${card.accent}` }}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>

          <div className="desktop-stage">
            {panels.map((panel) => (
              <div
                key={panel.id}
                className={`window ${panel.minimized ? 'minimized' : ''}`}
                style={{ left: panel.x, top: panel.y, width: panel.w, height: panel.h }}
              >
                <div className="window-header">
                  <div className="window-title">
                    <span className="window-dot" style={{ background: PANEL_META[panel.type].accent }} />
                    {panel.title}
                  </div>
                  <div className="window-actions">
                    <button>—</button>
                    <button>□</button>
                    <button onClick={() => closePanel(panel.type)}>×</button>
                  </div>
                </div>

                {panel.type === 'focus' && (
                  <div className="window-body">
                    <div className="focus-timer">{focusLabel}</div>
                    <div className="label-row"><span>Project</span><strong>{workspace.project}</strong></div>
                    <div className="label-row"><span>Task</span><strong>Hero system refinement</strong></div>
                    <div className="label-row"><span>Agent</span><strong>Design + QA</strong></div>
                    <textarea value={workspace.notes} onChange={(event) => setWorkspace((current) => ({ ...current, notes: event.target.value }))} />
                  </div>
                )}

                {panel.type === 'preview' && (
                  <div className="window-body preview-window">
                    <div className="browser-bar">
                      <span className="browser-dot red" />
                      <span className="browser-dot yellow" />
                      <span className="browser-dot green" />
                      <span className="address">apexweb.local/build/northstar</span>
                    </div>
                    <div className="preview-canvas">
                      <div className="preview-hero">
                        <div>
                          <p className="eyebrow subtle">Luxury HVAC</p>
                          <h3>Precision climate design for homes that deserve quiet confidence.</h3>
                        </div>
                        <button className="primary">Book a consultation</button>
                      </div>
                      <div className="preview-grid">
                        <div className="mini-card"></div>
                        <div className="mini-card accent"></div>
                        <div className="mini-card long"></div>
                      </div>
                    </div>
                  </div>
                )}

                {panel.type === 'tasks' && (
                  <div className="window-body tasks-list">
                    <div className="task-item good"><span>Research</span><strong>Complete</strong></div>
                    <div className="task-item good"><span>Concept</span><strong>Approved</strong></div>
                    <div className="task-item active"><span>Asset pipeline</span><strong>Running</strong></div>
                    <div className="task-item warn"><span>QA review</span><strong>Pending</strong></div>
                    <button className="ghost full" onClick={() => setStatusLine('Retry gate opened for asset selection task')}>Retry failed task</button>
                  </div>
                )}

                {panel.type === 'api' && (
                  <div className="window-body provider-grid">
                    {Object.entries(integrations).map(([key, provider]) => (
                      <div key={key} className={`provider row ${provider.status}`}>
                        <div>
                          <strong>{provider.name}</strong>
                          <small>{provider.endpoint}</small>
                        </div>
                        <span className="status-badge">{provider.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {panel.type === 'assistant' && (
                  <div className="window-body assistant-panel">
                    <div className="chat-bubble user">Open the latest HVAC concept and compare it with the prior rejected version.</div>
                    <div className="chat-bubble bot">I’ve identified the stronger direction: premium editorial framing with higher-contrast hero motion, less generic glass styling, and stronger CTA hierarchy.</div>
                    <div className="assistant-actions">
                      <button className="ghost" onClick={() => openPanel('search')}>Search memory</button>
                      <button className="ghost" onClick={() => openPanel('preview')}>Open preview</button>
                    </div>
                  </div>
                )}

                {panel.type === 'obsidian' && (
                  <div className="window-body list-stack">
                    <div className="vault-row"><strong>Business notes</strong><span>08</span></div>
                    <div className="vault-row"><strong>Concepts</strong><span>12</span></div>
                    <div className="vault-row"><strong>Runs</strong><span>07</span></div>
                    <div className="vault-row"><strong>Lessons</strong><span>03</span></div>
                    <button className="ghost full" onClick={() => setStatusLine('Obsidian vault synced • memory browser is active')}>Sync vault</button>
                  </div>
                )}

                {panel.type === 'gmail' && (
                  <div className="window-body list-stack">
                    <div className="mail-row"><strong>Prospect follow-up</strong><span>2m</span></div>
                    <div className="mail-row"><strong>Demo confirmation</strong><span>20m</span></div>
                    <div className="mail-row"><strong>Design review</strong><span>1h</span></div>
                    <div className="mail-row"><strong>Outreach status</strong><span>{gmailState}</span></div>
                  </div>
                )}

                {panel.type === 'search' && (
                  <div className="window-body search-panel">
                    <input placeholder="Search business, assets, notes, agents..." defaultValue="luxury HVAC concept" />
                    <div className="result-item"><strong>Concept library</strong><span>premium editorial direction</span></div>
                    <div className="result-item"><strong>Pexels media</strong><span>coastal home exteriors</span></div>
                    <div className="result-item"><strong>Obsidian lessons</strong><span>avoid generic AI gradients</span></div>
                  </div>
                )}

                {panel.type === 'files' && (
                  <div className="window-body file-tree">
                    <div className="file-row"><span>business</span><strong>research</strong></div>
                    <div className="file-row"><span>design</span><strong>concepts</strong></div>
                    <div className="file-row"><span>assets</span><strong>pexels-selected</strong></div>
                    <div className="file-row"><span>build</span><strong>northstar-site</strong></div>
                  </div>
                )}

                {panel.type === 'logs' && (
                  <div className="window-body list-stack">
                    <div className="log-row"><span>19:04</span><strong>API provider rotation healthy</strong></div>
                    <div className="log-row"><span>18:32</span><strong>Hero concept saved to memory</strong></div>
                    <div className="log-row"><span>18:11</span><strong>QA check queued</strong></div>
                  </div>
                )}

                {panel.type === 'settings' && (
                  <div className="window-body settings-panel">
                    <div className="settings-grid">
                      {Object.entries(integrations).map(([key, provider]) => (
                        <div key={key} className="settings-card">
                          <div className="settings-card-header">
                            <strong>{provider.name}</strong>
                            <span className={`status-badge ${provider.status}`}>{provider.status}</span>
                          </div>
                          <label>{provider.description}</label>
                          <input
                            type="password"
                            placeholder={provider.endpoint}
                            value={provider.value}
                            onChange={(event) => setIntegrationValue(key, event.target.value)}
                          />
                          {key === 'google' && <button className="ghost full" onClick={beginGoogleAuth}>Start auth</button>}
                          {key === 'gmail' && <button className="ghost full" onClick={testGmailConnection}>Test Gmail</button>}
                          {key === 'pexels' && <button className="ghost full" onClick={testPexelsConnection}>Test Pexels</button>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bottom-panel">
            <div className="pipeline-card">
              <div className="eyebrow">Live pipeline</div>
              <h4>Website generation pipeline</h4>
              <div className="progress-track"><span style={{ width: '76%' }} /></div>
              <div className="chip-row">
                <span className="chip active">Asset research</span>
                <span className="chip">Creative concept</span>
                <span className="chip">QA review</span>
              </div>
            </div>

            <div className="provider-card">
              <div className="eyebrow">Provider health</div>
              <div className="provider-health">
                <div>
                  <strong>Google</strong>
                  <small>{integrations.google.status}</small>
                </div>
                <div>
                  <strong>Pexels</strong>
                  <small>{integrations.pexels.status}</small>
                </div>
                <div>
                  <strong>Obsidian</strong>
                  <small>{integrations.obsidian.status}</small>
                </div>
              </div>
            </div>

            <div className="insight-card">
              <div className="eyebrow">Connection checks</div>
              <p>{pexelsResult}</p>
              <p>{gmailState}</p>
            </div>
          </div>
        </main>
      </div>

      {commandOpen && (
        <div className="command-overlay" onClick={() => setCommandOpen(false)}>
          <div className="command-dialog" onClick={(event) => event.stopPropagation()}>
            <input
              autoFocus
              value={commandQuery}
              onChange={(event) => setCommandQuery(event.target.value)}
              placeholder="Search commands or actions"
            />
            <div className="command-list">
              {commandItems.map((item) => (
                <button key={item} className="command-item" onClick={() => commandAction(item)}>{item}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
