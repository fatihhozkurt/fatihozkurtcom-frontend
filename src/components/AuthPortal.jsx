import {
  AlertTriangle,
  ChartColumn,
  Globe,
  Languages,
  LockKeyhole,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { useMemo, useState } from 'react'

const recentLogsByLocale = {
  en: [
    'AUTH002 | Failed admin login | 20:41 | 185.73.xx.xx',
    'OPS104 | CV asset downloaded | 19:15 | Public surface',
    'CNT201 | Project content updated | 18:08 | admin',
    'MAIL011 | Contact delivery accepted | 17:52 | queued',
  ],
  tr: [
    'AUTH002 | Basarisiz admin girisi | 20:41 | 185.73.xx.xx',
    'OPS104 | CV dosyasi indirildi | 19:15 | Public yuzey',
    'CNT201 | Proje icerigi guncellendi | 18:08 | admin',
    'MAIL011 | Iletisim teslimati kabul edildi | 17:52 | kuyrukta',
  ],
}

function LanguageSwitch({ locale, setLocale, labels }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400">
        <Languages size={15} />
      </span>
      {['tr', 'en'].map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLocale(lang)}
          className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
            locale === lang ? 'bg-sky-400/15 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.22)]' : 'text-slate-300 hover:bg-white/6 hover:text-white'
          }`}
        >
          {labels[lang]}
        </button>
      ))}
    </div>
  )
}

export function AuthPortal({ locale, setLocale, text, langLabels }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })
  const [resetEmail, setResetEmail] = useState('')

  const adminCards = useMemo(() => {
    if (locale === 'tr') {
      return [
        { title: 'Bugunku ziyaretler', value: '1,284', detail: 'Haftalik ortalamanin %14 ustunde', icon: ChartColumn },
        { title: 'Basarisiz girisler', value: '7', detail: '2 IP icin rate limit aktif', icon: AlertTriangle },
        { title: 'Cografi aktivite', value: '12 ulke', detail: 'TR, DE, NL, UK bugun one cikiyor', icon: Globe },
        { title: 'Guvenlik olaylari', value: '23', detail: 'Token, auth ve teslimat loglari', icon: ShieldCheck },
      ]
    }

    return [
      { title: 'Visits today', value: '1,284', detail: '14% above weekly average', icon: ChartColumn },
      { title: 'Failed logins', value: '7', detail: 'Rate limit active for 2 IPs', icon: AlertTriangle },
      { title: 'Geo activity', value: '12 countries', detail: 'TR, DE, NL, UK lead today', icon: Globe },
      { title: 'Security events', value: '23', detail: 'Token, auth and delivery logs', icon: ShieldCheck },
    ]
  }, [locale])

  const recentLogs = recentLogsByLocale[locale] ?? recentLogsByLocale.en

  const canSubmit = useMemo(() => {
    return form.username.trim().length >= 4 && form.password.trim().length >= 8
  }, [form.password, form.username])

  const canSendReset = useMemo(() => {
    return resetEmail.trim().includes('@')
  }, [resetEmail])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSubmit) {
      return
    }

    setAuthenticated(true)
  }

  if (authenticated) {
    return (
      <div className="site-shell min-h-screen bg-obsidian text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 md:px-8">
          <div className="mb-8 flex items-center justify-between rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur-xl">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">{text.hiddenWorkspace}</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{text.adminOperationsPreview}</h1>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitch locale={locale} setLocale={setLocale} labels={langLabels} />
              <button
                type="button"
                onClick={() => setAuthenticated(false)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200"
              >
                <LogOut size={16} />
                {text.logout}
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
            <aside className="surface-card rounded-[2rem] border border-white/10 bg-white/[0.045] p-5">
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">{text.navigation}</p>
              <div className="mt-5 grid gap-3">
                {text.navItems.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </aside>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {adminCards.map((card) => (
                  <article key={card.title} className="surface-card rounded-[1.7rem] border border-white/10 bg-white/[0.045] p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-sky-400/10 text-sky-200">
                      <card.icon size={18} />
                    </div>
                    <p className="mt-5 text-sm text-slate-400">{card.title}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
                    <p className="mt-3 text-sm text-slate-300">{card.detail}</p>
                  </article>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <section className="surface-card rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
                  <p className="text-xs uppercase tracking-[0.34em] text-slate-500">{text.criticalLogs}</p>
                  <div className="mt-5 grid gap-3">
                    {recentLogs.map((log) => (
                      <div key={log} className="rounded-[1.4rem] border border-white/10 bg-slate-950/45 px-4 py-4 text-sm text-slate-200">
                        {log}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="surface-card rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
                  <p className="text-xs uppercase tracking-[0.34em] text-slate-500">{text.controlPoints}</p>
                  <div className="mt-5 grid gap-3">
                    {text.controlItems.map((item) => (
                      <div key={item} className="rounded-[1.4rem] border border-white/10 bg-slate-950/45 px-4 py-4 text-sm text-slate-200">
                        {item}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="site-shell min-h-screen bg-obsidian text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-12 md:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-orange-100">
                <LockKeyhole size={14} />
                {text.hiddenAccess}
              </div>
              <LanguageSwitch locale={locale} setLocale={setLocale} labels={langLabels} />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold tracking-tight text-white md:text-6xl">/auth</h1>
              <p className="max-w-xl text-base leading-8 text-slate-300 md:text-lg">{text.description}</p>
            </div>
          </section>

          <section className="glass-card rounded-[2rem] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">{forgotMode ? text.passwordReset : text.adminLogin}</p>

            {forgotMode ? (
              <div className="mt-6 space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm text-slate-300">{text.email}</span>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </label>

                <p className="text-sm leading-7 text-slate-400">{text.resetHint}</p>

                <button
                  type="button"
                  disabled={!canSendReset}
                  className="button-primary w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-55"
                >
                  {text.sendResetLink}
                </button>

                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  className="w-full rounded-full border border-white/10 bg-white/6 px-6 py-3 text-sm text-slate-200"
                >
                  {text.backToLogin}
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <label className="block space-y-2">
                  <span className="text-sm text-slate-300">{text.username}</span>
                  <input
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="fatih.admin"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm text-slate-300">{text.password}</span>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </label>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="button-primary w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-55"
                >
                  {text.login}
                </button>

                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="w-full text-sm text-slate-400 underline decoration-white/10 underline-offset-4"
                >
                  {text.forgotPassword}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
