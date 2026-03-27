import {
  AlertTriangle,
  ChartColumn,
  FileDown,
  Github,
  Globe,
  Languages,
  Linkedin,
  LockKeyhole,
  LogOut,
  Mail,
  PenSquare,
  ShieldCheck,
} from 'lucide-react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createAdminArticle,
  createAdminProject,
  createAdminTechItem,
  deleteAdminArticle,
  deleteAdminProject,
  deleteAdminTechItem,
  forgotPassword,
  getAdminAbout,
  getAdminArticles,
  getAdminAuditEvents,
  getAdminContactMessages,
  getAdminContactProfile,
  getAdminCountryDistribution,
  getAdminDashboardOverview,
  getAdminFailedLogins,
  getAdminHero,
  getAdminProjects,
  getAdminResetEvents,
  getAdminResume,
  getAdminSecurityEvents,
  getAdminTechStack,
  getAdminVisitTrend,
  getCsrf,
  login,
  logout,
  refreshAccessToken,
  uploadAdminResume,
  updateAdminAbout,
  updateAdminArticle,
  updateAdminContactProfile,
  updateAdminHero,
  updateAdminProject,
  updateAdminTechItem,
} from '../apiClient'
import worldMapUrl from 'world-atlas/countries-110m.json?url'
import { BrandIcon } from './BrandIcon'

const PASSWORD_PATTERN = /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[^\p{L}\d]).{8,}$/u

const copyByLocale = {
  en: {
    hiddenAccess: 'Hidden admin access',
    description: 'A private admin entry surface kept separate from the public portfolio.',
    adminLogin: 'Admin login',
    passwordReset: 'Password reset',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    forgotPassword: 'Forgot your password?',
    resetHint: 'Reset link delivery will become active once the backend is connected.',
    sendResetLink: 'Send reset link',
    backToLogin: 'Back to login',
    passwordRule: 'Minimum 8 characters, uppercase, lowercase, number, and symbol.',
    hiddenWorkspace: 'Hidden workspace',
    adminSurface: 'Admin control surface',
    logout: 'Logout',
    saveDraft: 'Save draft',
    publish: 'Publish changes',
    nav: [
      ['overview', 'Overview'],
      ['analytics', 'Analytics'],
      ['content', 'Hero & tech'],
      ['projects', 'Projects'],
      ['writings', 'Writings'],
      ['resume', 'Resume'],
      ['contact', 'Contact'],
      ['security', 'Security'],
    ],
  },
  tr: {
    hiddenAccess: 'Gizli admin girişi',
    description: 'Public portfolyodan ayrı tutulan özel admin giriş yüzeyi.',
    adminLogin: 'Admin girişi',
    passwordReset: 'Şifre sıfırlama',
    email: 'E-posta',
    username: 'Kullanıcı adı',
    password: 'Şifre',
    login: 'Giriş yap',
    forgotPassword: 'Şifreni mi unuttun?',
    resetHint: 'Reset link gönderimi backend bağlandığında aktif olacak.',
    sendResetLink: 'Reset linki gönder',
    backToLogin: 'Girişe dön',
    passwordRule: 'Minimum 8 karakter, büyük harf, küçük harf, sayı ve sembol zorunlu.',
    hiddenWorkspace: 'Gizli çalışma alanı',
    adminSurface: 'Admin kontrol yüzeyi',
    logout: 'Çıkış yap',
    saveDraft: 'Taslağı kaydet',
    publish: 'Değişiklikleri yayınla',
    nav: [
      ['overview', 'Genel bakış'],
      ['analytics', 'Analitik'],
      ['content', 'Hero ve tech'],
      ['projects', 'Projeler'],
      ['writings', 'Yazılar'],
      ['resume', 'Özgeçmiş'],
      ['contact', 'İletişim'],
      ['security', 'Güvenlik'],
    ],
  },
}

const sectionCopy = {
  en: {
    overview: ['Overview', 'A one-page operations surface for the public portfolio.', 'Traffic, content, delivery, and security signals stay in one space.'],
    analytics: ['Analytics', 'Traffic, country spread, and failure signals.', 'Read weekly movement, geo spread, and security drift before touching content.'],
    content: ['Content', 'Edit hero copy and visible stack.', 'The public landing impression and technical shortlist should be adjustable without code edits.'],
    projects: ['Projects', 'CRUD-ready project inventory.', 'Add, edit, archive, and reorder the cards shown on the public surface.'],
    writings: ['Writings', 'Medium and article management.', 'Keep article links, excerpts, and ordering fresh without touching layout.'],
    resume: ['Resume', 'CV asset lifecycle and delivery state.', 'Replace the active file and keep asset metadata visible.'],
    contact: ['Contact', 'Public channels and outbound delivery routing.', 'Expose public links while keeping the form delivery target controlled.'],
    security: ['Security', 'Failed logins, resets, and audit visibility.', 'Authentication events and admin actions should stay observable.'],
  },
  tr: {
    overview: ['Genel bakış', 'Public portfolyo için tek yüzeyli operasyon paneli.', 'Trafik, içerik, teslimat ve güvenlik sinyalleri aynı yerde kalır.'],
    analytics: ['Analitik', 'Trafik, ülke dağılımı ve hata sinyalleri.', 'İçeriğe dokunmadan önce haftalık hareketi ve güvenlik kaymasını oku.'],
    content: ['İçerik', 'Hero metni ve görünür tech stack tek yerde.', 'Landing etkisi ve teknik kısa liste kod değişmeden yönetilebilmeli.'],
    projects: ['Projeler', 'CRUD hazır proje envanteri.', 'Public yüzeyde görünen kartları ekle, düzenle, arşivle ve sırala.'],
    writings: ['Yazılar', 'Medium ve makale yönetimi.', 'Makale linkleri ve özetleri düzeni bozmadan güncel kalmalı.'],
    resume: ['Özgeçmiş', 'CV asset yaşam döngüsü ve teslim durumu.', 'Aktif dosyayı değiştir ve meta bilgiyi görünür tut.'],
    contact: ['İletişim', 'Public kanallar ve dış teslimat yönlendirmesi.', 'Form teslim hedefi ve şablon ayarları burada yönetilir.'],
    security: ['Güvenlik', 'Başarısız girişler, resetler ve audit görünürlüğü.', 'Authentication olayları ve admin hareketleri görünür kalmalı.'],
  },
}

const COUNTRY_COORDINATES = {
  turkey: [35.24, 38.96],
  turkiye: [35.24, 38.96],
  türkiye: [35.24, 38.96],
  germany: [10.45, 51.17],
  almanya: [10.45, 51.17],
  netherlands: [5.29, 52.13],
  hollanda: [5.29, 52.13],
  'united kingdom': [-2.8, 54.1],
  'birleşik krallık': [-2.8, 54.1],
  'united states': [-98.58, 39.83],
  'united states of america': [-98.58, 39.83],
  'amerika birleşik devletleri': [-98.58, 39.83],
  'united arab emirates': [53.85, 23.42],
  'birleşik arap emirlikleri': [53.85, 23.42],
}

function toCountryPoint(item) {
  const key = (item.country || '').trim().toLowerCase()
  const coordinates = COUNTRY_COORDINATES[key]
  if (!coordinates) {
    return null
  }

  return [item.country, Number(item.count) || 0, coordinates[0], coordinates[1]]
}

function formatDateTime(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleString()
}

function LanguageSwitch({ locale, setLocale, labels }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-[3px]">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400">
        <Languages size={13} />
      </span>
      {['tr', 'en'].map((lang) => (
        <button key={lang} type="button" onClick={() => setLocale(lang)} aria-pressed={locale === lang} className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] ${locale === lang ? 'bg-sky-400/15 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.22)]' : 'text-slate-300 hover:bg-white/6 hover:text-white'}`}>
          {labels[lang]}
        </button>
      ))}
    </div>
  )
}

function AdminSection({ id, data, children }) {
  return (
    <section id={id} data-admin-section className="scroll-mt-28 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-7">
      <p className="text-xs uppercase tracking-[0.34em] text-slate-500">{data[0]}</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">{data[1]}</h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">{data[2]}</p>
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Field({ label, value, large = false, readOnly = true, onChange }) {
  const Element = large ? 'textarea' : 'input'
  return (
    <label className="block space-y-1.5">
      <span className="relative -top-1 pl-3 text-sm text-slate-300">{label}</span>
      <Element
        readOnly={readOnly}
        rows={large ? 5 : undefined}
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none ${large ? 'resize-none leading-7' : ''}`}
      />
    </label>
  )
}

function Inventory({
  rows,
  labels,
  addLabel,
  hasStack = false,
  emptyLabel,
  onAdd,
  onEdit,
  onDuplicate,
  onArchive,
}) {
  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-sm text-slate-400">{rows.length} items</div>
        <button type="button" onClick={onAdd} className="button-secondary rounded-full px-4 py-2 text-sm">{addLabel}</button>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-[1.35rem] border border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-sm text-slate-400">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className={`grid gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4 ${hasStack ? 'md:grid-cols-[1.55fr_0.7fr_0.45fr_1fr]' : 'md:grid-cols-[1.6fr_0.7fr_0.45fr_1fr]'} md:items-center`}>
              <div><p className="text-sm font-medium text-white">{row.title}</p>{hasStack ? <p className="mt-1 text-sm text-slate-400">{row.stackText}</p> : null}</div>
              <p className="text-sm text-slate-200">{row.status}</p>
              <p className="text-sm text-slate-200">{row.index}</p>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <button type="button" onClick={() => onEdit?.(row)} className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-slate-200">{labels[0]}</button>
                <button type="button" onClick={() => onDuplicate?.(row)} className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-slate-200">{labels[1]}</button>
                <button type="button" onClick={() => onArchive?.(row)} className="rounded-full border border-red-400/16 bg-red-400/8 px-3 py-1.5 text-sm text-red-100">{labels[2]}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function GeoMap({ locale, points = [] }) {
  const visiblePoints = points
  const [hoveredCountry, setHoveredCountry] = useState('')
  const labels = locale === 'tr' ? ['Ülke dağılımı', 'Bir ülkenin hacmini görmek için işaretçinin üstüne gel.', 'ziyaret'] : ['Country distribution', 'Hover a marker to inspect volume by country.', 'visits']
  const hovered = visiblePoints.find((point) => point[0] === hoveredCountry) ?? visiblePoints[0] ?? null

  if (visiblePoints.length === 0) {
    return (
      <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
        <div className="mb-5">
          <p className="text-sm font-medium text-white">{labels[0]}</p>
          <p className="mt-2 text-sm text-slate-400">{labels[1]}</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_45%),linear-gradient(180deg,rgba(2,6,23,0.95),rgba(2,6,23,0.72))] p-8 text-center text-sm text-slate-400">
          {locale === 'tr'
            ? 'Henüz haritalanabilir ülke verisi yok. İlk gerçek ziyaretlerden sonra burada görünecek.'
            : 'No mappable country data yet. It will appear here after real visits are recorded.'}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><p className="text-sm font-medium text-white">{labels[0]}</p><p className="mt-2 text-sm text-slate-400">{labels[1]}</p></div>
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100"><div className="font-medium">{hovered[0]}</div><div className="mt-1 text-red-200/90">{hovered[1]} {labels[2]}</div></div>
      </div>
      <div className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_45%),linear-gradient(180deg,rgba(2,6,23,0.95),rgba(2,6,23,0.72))] p-4">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 150, center: [0, 10] }}
          width={960}
          height={420}
          className="h-[20rem] w-full"
        >
          <defs>
            <linearGradient id="adminMapFill" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#17324A" />
              <stop offset="100%" stopColor="#0D1E33" />
            </linearGradient>
          </defs>
          <rect width="960" height="420" rx="24" fill="rgba(4,10,24,0.72)" />
          <Geographies geography={worldMapUrl}>
            {({ geographies }) =>
              geographies.map((geography) => (
                <Geography
                  key={geography.rsmKey}
                  geography={geography}
                  fill="url(#adminMapFill)"
                  stroke="rgba(59,130,246,0.14)"
                  strokeWidth={0.55}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: '#1B3B56' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          {visiblePoints.map((point) => (
            <Marker key={point[0]} coordinates={[point[2], point[3]]}>
              <g
                onMouseEnter={() => setHoveredCountry(point[0])}
                onFocus={() => setHoveredCountry(point[0])}
                style={{ cursor: 'pointer' }}
                tabIndex={0}
              >
                <text
                  y={-16}
                  textAnchor="middle"
                  style={{
                    fill: '#fee2e2',
                    fontSize: '11px',
                    fontWeight: 700,
                    paintOrder: 'stroke',
                    stroke: 'rgba(2,6,23,0.88)',
                    strokeWidth: 4,
                  }}
                >
                  {point[1]}
                </text>
                <circle r={13} fill="rgba(248,113,113,0.18)" />
                <circle r={5.5} fill="#f87171" stroke="rgba(254,202,202,0.35)" strokeWidth={1.2} />
              </g>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  )
}

export function AuthPortal({ locale, setLocale, langLabels }) {
  const copy = copyByLocale[locale] ?? copyByLocale.en
  const sections = sectionCopy[locale] ?? sectionCopy.en
  const [accessToken, setAccessToken] = useState('')
  const [forgotMode, setForgotMode] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })
  const [resetEmail, setResetEmail] = useState('')
  const [activeSection, setActiveSection] = useState(copy.nav[0][0])
  const [authError, setAuthError] = useState('')
  const [authInfo, setAuthInfo] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [dashboardOverview, setDashboardOverview] = useState(null)
  const [countryPoints, setCountryPoints] = useState([])
  const [visitTrend, setVisitTrend] = useState([])
  const [adminHero, setAdminHero] = useState(null)
  const [adminTech, setAdminTech] = useState([])
  const [adminProjects, setAdminProjects] = useState([])
  const [adminArticles, setAdminArticles] = useState([])
  const [adminResume, setAdminResume] = useState(null)
  const [adminContactProfile, setAdminContactProfile] = useState(null)
  const [adminContactMessages, setAdminContactMessages] = useState([])
  const [heroDraft, setHeroDraft] = useState({
    welcomeText: '',
    fullName: '',
    title: '',
    description: '',
    ctaLabel: '',
  })
  const [aboutDraft, setAboutDraft] = useState({
    eyebrow: '',
    title: '',
    description: '',
  })
  const [contactDraft, setContactDraft] = useState({
    email: '',
    linkedinUrl: '',
    githubUrl: '',
    mediumUrl: '',
    recipientEmail: '',
  })
  const [rateLimitTriggerCount, setRateLimitTriggerCount] = useState(0)
  const [securityData, setSecurityData] = useState({
    failed: [],
    reset: [],
    audit: [],
  })

  const authenticated = Boolean(accessToken)
  const metrics = useMemo(() => {
    const visitsToday = Number(dashboardOverview?.visitsToday) || 0
    const failedLogins = Number(dashboardOverview?.failedLoginsToday) || 0
    const geoCount = countryPoints.length
    const securityEvents = Number(dashboardOverview?.securityEventsToday) || 0

    return [
      [
        locale === 'tr' ? 'Bugünkü ziyaretler' : 'Visits today',
        String(visitsToday),
        locale === 'tr' ? 'Canlı backend metriği' : 'Live backend metric',
        ChartColumn,
      ],
      [
        locale === 'tr' ? 'Başarısız girişler' : 'Failed logins',
        String(failedLogins),
        locale === 'tr' ? 'Auth olaylarından hesaplandı' : 'Derived from auth events',
        AlertTriangle,
      ],
      [
        locale === 'tr' ? 'Coğrafi aktivite' : 'Geo activity',
        `${geoCount} ${locale === 'tr' ? 'ülke' : 'countries'}`,
        locale === 'tr'
          ? (geoCount > 0 ? 'Ülke dağılımı verisi' : 'Henüz haritalanabilir ülke verisi yok')
          : (geoCount > 0 ? 'Country distribution feed' : 'No mappable country data yet'),
        Globe,
      ],
      [
        locale === 'tr' ? 'Güvenlik olayları' : 'Security events',
        String(securityEvents),
        locale === 'tr' ? 'Dashboard özeti' : 'Dashboard overview',
        ShieldCheck,
      ],
    ]
  }, [countryPoints.length, dashboardOverview, locale])

  const projectRows = useMemo(() => {
    return adminProjects.map((project, index) => ({
      id: project.id,
      title: project.title,
      status: locale === 'tr' ? 'Yayında' : 'Published',
      index: `0${index + 1}`,
      stackText: (project.stack || []).join(', '),
      raw: project,
    }))
  }, [adminProjects, locale])

  const writingRows = useMemo(() => {
    return adminArticles.map((article, index) => ({
      id: article.id,
      title: article.title,
      status: locale === 'tr' ? 'Yayında' : 'Live',
      index: `0${index + 1}`,
      raw: article,
    }))
  }, [adminArticles, locale])

  const visitDeltaPercent = useMemo(() => {
    if (visitTrend.length < 2) {
      return 0
    }

    const first = Number(visitTrend[0].count) || 0
    const last = Number(visitTrend[visitTrend.length - 1].count) || 0
    if (first <= 0) {
      return last > 0 ? 100 : 0
    }

    return ((last - first) / first) * 100
  }, [visitTrend])

  const canSubmit = useMemo(() => form.username.trim().length >= 4 && PASSWORD_PATTERN.test(form.password), [form.password, form.username])
  const canSendReset = useMemo(() => resetEmail.trim().includes('@'), [resetEmail])

  useEffect(() => {
    if (accessToken) {
      return
    }

    let cancelled = false
    const restoreSession = async () => {
      try {
        const response = await refreshAccessToken(locale)
        if (!cancelled && response?.accessToken) {
          setAccessToken(response.accessToken)
        }
      } catch {
        // Refresh cookie may be missing or expired; keep login view.
      }
    }

    restoreSession()
    return () => {
      cancelled = true
    }
  }, [accessToken, locale])

  useEffect(() => {
    if (!authenticated) return
    const nodes = Array.from(document.querySelectorAll('[data-admin-section]'))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) setActiveSection(entry.target.id)
      })
    }, { threshold: [0.35, 0.55], rootMargin: '-12% 0px -25% 0px' })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [authenticated])

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId)
    const header = document.querySelector('[data-admin-header]')
    if (!target) return
    const headerOffset = header ? header.getBoundingClientRect().height : 0
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 18
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!canSubmit) {
      return
    }

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      const response = await login(
        {
          username: form.username.trim(),
          password: form.password,
        },
        locale,
      )
      setAccessToken(response.accessToken)
      setForgotMode(false)
      setActiveSection(copy.nav[0][0])
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const loadAdminData = useCallback(async () => {
    if (!authenticated) {
      return
    }

    setIsBusy(true)
    setAuthError('')
    try {
      const [
        overview,
        countries,
        trend,
        hero,
        about,
        tech,
        projectsResponse,
        articlesResponse,
        resume,
        contactProfile,
        contactMessages,
        securityEvents,
        failedLogins,
        resetEvents,
        auditEvents,
      ] = await Promise.all([
        getAdminDashboardOverview(accessToken, locale),
        getAdminCountryDistribution(accessToken, locale),
        getAdminVisitTrend(accessToken, locale, 7),
        getAdminHero(accessToken, locale),
        getAdminAbout(accessToken, locale),
        getAdminTechStack(accessToken, locale),
        getAdminProjects(accessToken, locale),
        getAdminArticles(accessToken, locale),
        getAdminResume(accessToken, locale),
        getAdminContactProfile(accessToken, locale),
        getAdminContactMessages(accessToken, locale),
        getAdminSecurityEvents(accessToken, locale),
        getAdminFailedLogins(accessToken, locale),
        getAdminResetEvents(accessToken, locale),
        getAdminAuditEvents(accessToken, locale),
      ])

      setDashboardOverview(overview)
      setCountryPoints((countries || []).map(toCountryPoint).filter(Boolean))
      setVisitTrend(trend || [])
      setAdminHero(hero)
      setAdminTech(tech || [])
      setAdminProjects(projectsResponse || [])
      setAdminArticles(articlesResponse || [])
      setAdminResume(resume)
      setAdminContactProfile(contactProfile)
      setAdminContactMessages(contactMessages || [])
      setHeroDraft({
        welcomeText: hero?.welcomeText || '',
        fullName: hero?.fullName || '',
        title: hero?.title || '',
        description: hero?.description || '',
        ctaLabel: hero?.ctaLabel || '',
      })
      setAboutDraft({
        eyebrow: about?.eyebrow || '',
        title: about?.title || '',
        description: about?.description || '',
      })
      setContactDraft({
        email: contactProfile?.email || '',
        linkedinUrl: contactProfile?.linkedinUrl || '',
        githubUrl: contactProfile?.githubUrl || '',
        mediumUrl: contactProfile?.mediumUrl || '',
        recipientEmail: contactProfile?.email || '',
      })
      setRateLimitTriggerCount((securityEvents || []).filter((item) => item.eventType === 'RATE_LIMIT_TRIGGERED').length)
      const failedRows = (failedLogins || []).slice(0, 6).map((item) => [formatDateTime(item.occurredAt), item.username || '-', item.ipAddress || '-'])
      const resetRows = (resetEvents || []).slice(0, 6).map((item) => [formatDateTime(item.occurredAt), item.username || '-', item.details || '-'])
      const auditRows = (auditEvents || []).slice(0, 6).map((item) => [item.actor || '-', item.action || '-', item.resource || '-'])

      setSecurityData({
        failed: failedRows,
        reset: resetRows,
        audit: auditRows,
      })
      if ((securityEvents || []).length === 0 && failedRows.length === 0) {
        setAuthInfo(locale === 'tr' ? 'Henüz güvenlik olayı oluşmadı.' : 'No security events yet.')
      } else {
        setAuthInfo('')
      }
    } catch (error) {
      if (error?.status === 401) {
        try {
          const refreshed = await refreshAccessToken(locale)
          if (refreshed?.accessToken) {
            setAccessToken(refreshed.accessToken)
            return
          }
        } catch {
          // Fall through and surface the original auth failure.
        }
      }
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }, [accessToken, authenticated, locale])

  useEffect(() => {
    loadAdminData()
  }, [loadAdminData])

  const handleLogout = async () => {
    if (!accessToken) {
      return
    }

    try {
      const csrf = await getCsrf(locale)
      await logout(accessToken, csrf, locale)
    } catch {
      // Ignore logout errors in UI; local auth state is still cleared.
    } finally {
      setAccessToken('')
      setForm({ username: '', password: '' })
      setActiveSection(copy.nav[0][0])
      setAuthError('')
      setAuthInfo('')
      setRateLimitTriggerCount(0)
    }
  }

  const handleForgotPassword = async (event) => {
    event.preventDefault()
    if (!canSendReset) {
      return
    }

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await forgotPassword({ email: resetEmail.trim() }, locale)
      setAuthInfo(locale === 'tr' ? 'Reset link isteği alındı.' : 'Reset link request accepted.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleHeroDraftChange = (field) => (event) => {
    setHeroDraft((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleAboutDraftChange = (field) => (event) => {
    setAboutDraft((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleContactDraftChange = (field) => (event) => {
    setContactDraft((current) => ({ ...current, [field]: event.target.value }))
  }

  const normalizeOptional = (value) => {
    const trimmed = (value || '').trim()
    return trimmed.length > 0 ? trimmed : null
  }

  const saveCoreSections = async (modeLabel) => {
    if (!accessToken) {
      return
    }

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await updateAdminHero(accessToken, {
        welcomeText: heroDraft.welcomeText,
        fullName: heroDraft.fullName,
        title: heroDraft.title,
        description: heroDraft.description,
        ctaLabel: heroDraft.ctaLabel,
      }, locale)
      await updateAdminAbout(accessToken, {
        eyebrow: aboutDraft.eyebrow,
        title: aboutDraft.title,
        description: aboutDraft.description,
      }, locale)
      await updateAdminContactProfile(accessToken, {
        email: contactDraft.email,
        linkedinUrl: normalizeOptional(contactDraft.linkedinUrl),
        githubUrl: normalizeOptional(contactDraft.githubUrl),
        mediumUrl: normalizeOptional(contactDraft.mediumUrl),
        recipientEmail: contactDraft.recipientEmail || contactDraft.email,
      }, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? `${modeLabel} başarılı.` : `${modeLabel} completed.`)
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleAddTech = async () => {
    const name = window.prompt(locale === 'tr' ? 'Tech adı' : 'Tech name')
    if (!name) return
    const iconName = window.prompt(locale === 'tr' ? 'Icon adı (opsiyonel)' : 'Icon name (optional)', name) || name
    const category = window.prompt(locale === 'tr' ? 'Kategori (opsiyonel)' : 'Category (optional)', 'backend') || 'backend'

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await createAdminTechItem(accessToken, {
        name: name.trim(),
        iconName: iconName.trim(),
        category: category.trim(),
        sortOrder: adminTech.length + 1,
        active: true,
      }, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? 'Tech eklendi.' : 'Tech item created.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleEditTech = async (item, index) => {
    const name = window.prompt(locale === 'tr' ? 'Tech adı' : 'Tech name', item.name || '')
    if (!name) return
    const iconName = window.prompt(locale === 'tr' ? 'Icon adı (opsiyonel)' : 'Icon name (optional)', item.iconName || item.name || '') || name
    const category = window.prompt(locale === 'tr' ? 'Kategori' : 'Category', item.category || 'backend') || 'backend'

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await updateAdminTechItem(accessToken, item.id, {
        name: name.trim(),
        iconName: iconName.trim(),
        category: category.trim(),
        sortOrder: index + 1,
        active: true,
      }, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? 'Tech güncellendi.' : 'Tech item updated.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleArchiveTech = async (item) => {
    if (!window.confirm(locale === 'tr' ? 'Bu tech öğesi arşivlensin mi?' : 'Archive this tech item?')) {
      return
    }
    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await deleteAdminTechItem(accessToken, item.id, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? 'Tech arşivlendi.' : 'Tech item archived.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleAddProject = async () => {
    const title = window.prompt(locale === 'tr' ? 'Proje başlığı' : 'Project title')
    if (!title) return
    const category = window.prompt(locale === 'tr' ? 'Kategori' : 'Category', 'backend') || 'backend'
    const summary = window.prompt(locale === 'tr' ? 'Özet' : 'Summary', '') || ''
    const repositoryUrl = window.prompt(locale === 'tr' ? 'GitHub URL (opsiyonel)' : 'GitHub URL (optional)', '') || ''
    const stackCsv = window.prompt(locale === 'tr' ? 'Stack (csv)' : 'Stack (csv)', 'Java,Spring Boot') || ''

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await createAdminProject(accessToken, {
        title: title.trim(),
        category: category.trim(),
        summary: summary.trim(),
        repositoryUrl: normalizeOptional(repositoryUrl),
        demoUrl: null,
        readmeMarkdown: null,
        coverImageUrl: null,
        stackCsv: stackCsv.trim(),
        sortOrder: adminProjects.length + 1,
        active: true,
      }, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? 'Proje eklendi.' : 'Project created.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleEditProject = async (row) => {
    const title = window.prompt(locale === 'tr' ? 'Proje başlığı' : 'Project title', row.title || '')
    if (!title) return
    const category = window.prompt(locale === 'tr' ? 'Kategori' : 'Category', row.raw.category || 'backend') || 'backend'
    const summary = window.prompt(locale === 'tr' ? 'Özet' : 'Summary', row.raw.summary || '') || ''
    const repositoryUrl = window.prompt(locale === 'tr' ? 'GitHub URL (opsiyonel)' : 'GitHub URL (optional)', row.raw.repositoryUrl || '') || ''
    const stackCsv = window.prompt(locale === 'tr' ? 'Stack (csv)' : 'Stack (csv)', (row.raw.stack || []).join(',')) || ''

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await updateAdminProject(accessToken, row.id, {
        title: title.trim(),
        category: category.trim(),
        summary: summary.trim(),
        repositoryUrl: normalizeOptional(repositoryUrl),
        demoUrl: null,
        readmeMarkdown: null,
        coverImageUrl: normalizeOptional(row.raw.coverImageUrl),
        stackCsv: stackCsv.trim(),
        sortOrder: Number(row.index) || 1,
        active: true,
      }, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? 'Proje güncellendi.' : 'Project updated.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleDuplicateProject = async (row) => {
    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await createAdminProject(accessToken, {
        title: `${row.title} Copy`,
        category: row.raw.category || 'backend',
        summary: row.raw.summary || '',
        repositoryUrl: normalizeOptional(row.raw.repositoryUrl),
        demoUrl: null,
        readmeMarkdown: null,
        coverImageUrl: normalizeOptional(row.raw.coverImageUrl),
        stackCsv: (row.raw.stack || []).join(','),
        sortOrder: adminProjects.length + 1,
        active: true,
      }, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? 'Proje kopyalandı.' : 'Project duplicated.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleArchiveProject = async (row) => {
    if (!window.confirm(locale === 'tr' ? 'Bu proje arşivlensin mi?' : 'Archive this project?')) {
      return
    }
    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await deleteAdminProject(accessToken, row.id, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? 'Proje arşivlendi.' : 'Project archived.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleAddArticle = async () => {
    const title = window.prompt(locale === 'tr' ? 'Yazı başlığı' : 'Article title')
    if (!title) return
    const excerpt = window.prompt(locale === 'tr' ? 'Kısa açıklama' : 'Excerpt', '') || ''
    const href = window.prompt(locale === 'tr' ? 'Medium URL' : 'Medium URL', '') || ''
    const readingTime = window.prompt(locale === 'tr' ? 'Okuma süresi' : 'Reading time', '5 min read') || '5 min read'

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await createAdminArticle(accessToken, {
        title: title.trim(),
        excerpt: excerpt.trim(),
        href: normalizeOptional(href),
        readingTime: readingTime.trim(),
        publishedAt: new Date().toISOString().slice(0, 10),
        sortOrder: adminArticles.length + 1,
        active: true,
      }, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? 'Yazı eklendi.' : 'Article created.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleEditArticle = async (row) => {
    const title = window.prompt(locale === 'tr' ? 'Yazı başlığı' : 'Article title', row.title || '')
    if (!title) return
    const excerpt = window.prompt(locale === 'tr' ? 'Kısa açıklama' : 'Excerpt', row.raw.excerpt || '') || ''
    const href = window.prompt(locale === 'tr' ? 'Medium URL' : 'Medium URL', row.raw.href || '') || ''
    const readingTime = window.prompt(locale === 'tr' ? 'Okuma süresi' : 'Reading time', row.raw.readingTime || '5 min read') || '5 min read'

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await updateAdminArticle(accessToken, row.id, {
        title: title.trim(),
        excerpt: excerpt.trim(),
        href: normalizeOptional(href),
        readingTime: readingTime.trim(),
        publishedAt: row.raw.publishedAt || new Date().toISOString().slice(0, 10),
        sortOrder: Number(row.index) || 1,
        active: true,
      }, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? 'Yazı güncellendi.' : 'Article updated.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleDuplicateArticle = async (row) => {
    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await createAdminArticle(accessToken, {
        title: `${row.title} Copy`,
        excerpt: row.raw.excerpt || '',
        href: normalizeOptional(row.raw.href),
        readingTime: row.raw.readingTime || '5 min read',
        publishedAt: row.raw.publishedAt || new Date().toISOString().slice(0, 10),
        sortOrder: adminArticles.length + 1,
        active: true,
      }, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? 'Yazı kopyalandı.' : 'Article duplicated.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleArchiveArticle = async (row) => {
    if (!window.confirm(locale === 'tr' ? 'Bu yazı arşivlensin mi?' : 'Archive this article?')) {
      return
    }
    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await deleteAdminArticle(accessToken, row.id, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? 'Yazı arşivlendi.' : 'Article archived.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleReplaceResume = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,application/pdf'
    input.style.display = 'none'
    document.body.appendChild(input)

    const selectedFile = await new Promise((resolve) => {
      input.onchange = () => resolve(input.files?.[0] || null)
      input.click()
    })
    document.body.removeChild(input)

    if (!selectedFile) {
      return
    }

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await uploadAdminResume(accessToken, selectedFile, locale)
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? 'CV dosyası güncellendi.' : 'Resume file replaced.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  if (authenticated) {
    return (
      <div className="site-shell min-h-screen bg-obsidian text-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <header data-admin-header className="glass-card sticky top-4 z-40 rounded-[2rem] px-5 py-4 md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><p className="text-xs uppercase tracking-[0.34em] text-slate-500">{copy.hiddenWorkspace}</p><h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{copy.adminSurface}</h1></div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="hidden gap-2 md:flex">
                  <button type="button" onClick={() => saveCoreSections(locale === 'tr' ? 'Taslak kaydı' : 'Draft save')} className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200">{copy.saveDraft}</button>
                  <button type="button" onClick={() => saveCoreSections(locale === 'tr' ? 'Yayınlama' : 'Publish')} className="button-primary rounded-full px-4 py-2 text-sm font-semibold">{copy.publish}</button>
                </div>
                <LanguageSwitch locale={locale} setLocale={setLocale} labels={langLabels} />
                <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200"><LogOut size={16} />{copy.logout}</button>
              </div>
            </div>
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-[15.5rem_1fr]">
            <aside className="hidden lg:block">
              <div className="glass-card sticky top-28 rounded-[2rem] p-3">
                <nav className="space-y-2">{copy.nav.map((item) => <button key={item[0]} type="button" onClick={() => scrollToSection(item[0])} className={`w-full rounded-2xl px-4 py-3 text-left text-sm ${activeSection === item[0] ? 'bg-sky-400/15 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.22)]' : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white'}`}>{item[1]}</button>)}</nav>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="sticky top-[5.9rem] z-30 -mx-1 overflow-x-auto pb-1 lg:hidden"><div className="inline-flex gap-2 rounded-full border border-white/10 bg-[rgba(8,10,18,0.72)] p-1 backdrop-blur-xl">{copy.nav.map((item) => <button key={item[0]} type="button" onClick={() => scrollToSection(item[0])} className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${activeSection === item[0] ? 'bg-sky-400/15 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.22)]' : 'text-slate-300'}`}>{item[1]}</button>)}</div></div>
              {authError ? (
                <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{authError}</p>
              ) : null}
              {authInfo ? (
                <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{authInfo}</p>
              ) : null}
              {isBusy ? <p className="text-sm text-slate-400">{locale === 'tr' ? 'Veriler yükleniyor...' : 'Loading admin data...'}</p> : null}

              <AdminSection id="overview" data={sections.overview}><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{metrics.map((item) => { const MetricIcon = item[3]; return <article key={item[0]} className="surface-card rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5"><div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-sky-400/10 text-sky-200"><MetricIcon size={18} /></div><p className="mt-5 text-sm text-slate-400">{item[0]}</p><p className="mt-2 text-3xl font-semibold text-white">{item[1]}</p><p className="mt-3 text-sm text-slate-300">{item[2]}</p></article>})}</div></AdminSection>

              <AdminSection id="analytics" data={sections.analytics}>
                <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
                    <div className="mb-6 flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{locale === 'tr' ? '7 günlük ziyaret' : '7-day visits'}</p>
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                        {`${visitDeltaPercent > 0 ? '+' : ''}${visitDeltaPercent.toFixed(1)}%`}
                      </span>
                    </div>
                    {visitTrend.length === 0 ? (
                      <div className="rounded-[1.35rem] border border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-sm text-slate-400">
                        {locale === 'tr' ? 'Henüz ziyaret trend verisi yok.' : 'No visit trend data yet.'}
                      </div>
                    ) : (
                      <div className="flex h-48 items-end gap-3">
                        {visitTrend.map((point, index, rows) => {
                          const value = Number(point.count) || 0
                          const maxValue = Math.max(...rows.map((row) => Number(row.count) || 0), 0)
                          return (
                            <div key={`${index}-${value}`} className="flex h-full flex-1 flex-col justify-end gap-3">
                              <div className="flex min-h-0 flex-1 items-end">
                                <div
                                  className="w-full rounded-t-2xl border border-sky-300/15 bg-[linear-gradient(180deg,rgba(186,230,253,0.98),rgba(56,189,248,0.72)_38%,rgba(14,165,233,0.22))] shadow-[0_10px_24px_rgba(14,165,233,0.18)]"
                                  style={{ height: `${Math.max(maxValue > 0 ? (value / maxValue) * 100 : 0, value > 0 ? 6 : 0)}%` }}
                                />
                              </div>
                              <span className="text-center text-xs uppercase tracking-[0.18em] text-slate-500">
                                {(locale === 'tr' ? ['Pzt', 'Sal', 'Çrş', 'Per', 'Cum', 'Cmt', 'Paz'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])[index]}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
                    <p className="text-sm font-medium text-white">{locale === 'tr' ? 'Hata sinyalleri' : 'Failure signals'}</p>
                    <div className="mt-6 space-y-4">
                      {[
                        [locale === 'tr' ? 'Başarısız giriş' : 'Login failures', dashboardOverview?.failedLoginsToday ?? 0],
                        [locale === 'tr' ? 'Reset olayları' : 'Reset events', securityData.reset.length],
                        [locale === 'tr' ? 'Rate-limit tetiklenmesi' : 'Rate-limit triggers', rateLimitTriggerCount],
                        [locale === 'tr' ? 'İletişim mesajları (24s)' : 'Contact messages (24h)', dashboardOverview?.contactMessagesToday ?? 0],
                      ].map((row) => (
                        <div key={row[0]} className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-slate-300">
                            <span>{row[0]}</span>
                            <span>{row[1]}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/5">
                            <div className="h-full rounded-full bg-[linear-gradient(90deg,rgba(248,113,113,0.95),rgba(239,68,68,0.35))]" style={{ width: `${Math.min((Number(row[1]) / 10) * 100, 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <GeoMap locale={locale} points={countryPoints} />
                </div>
              </AdminSection>

              <AdminSection id="content" data={sections.content}>
                <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
                    <div className="grid gap-4">
                      <Field label="Hero badge" value={heroDraft.welcomeText} readOnly={false} onChange={handleHeroDraftChange('welcomeText')} />
                      <Field label={locale === 'tr' ? 'Ana başlık' : 'Primary title'} value={heroDraft.fullName} readOnly={false} onChange={handleHeroDraftChange('fullName')} />
                      <Field label={locale === 'tr' ? 'Alt başlık' : 'Subtitle'} value={heroDraft.title} readOnly={false} onChange={handleHeroDraftChange('title')} />
                      <Field label={locale === 'tr' ? 'Açıklama' : 'Description'} large value={heroDraft.description} readOnly={false} onChange={handleHeroDraftChange('description')} />
                      <Field label="CTA" value={heroDraft.ctaLabel} readOnly={false} onChange={handleHeroDraftChange('ctaLabel')} />
                      <Field label={locale === 'tr' ? 'About başlığı' : 'About eyebrow'} value={aboutDraft.eyebrow} readOnly={false} onChange={handleAboutDraftChange('eyebrow')} />
                      <Field label={locale === 'tr' ? 'About ana başlık' : 'About title'} value={aboutDraft.title} readOnly={false} onChange={handleAboutDraftChange('title')} />
                      <Field label={locale === 'tr' ? 'About açıklama' : 'About description'} large value={aboutDraft.description} readOnly={false} onChange={handleAboutDraftChange('description')} />
                    </div>
                  </div>
                  <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{locale === 'tr' ? 'Görünür tech stack' : 'Visible tech stack'}</p>
                      <button type="button" onClick={handleAddTech} className="button-secondary rounded-full px-4 py-2 text-sm">{locale === 'tr' ? 'Tech ekle' : 'Add tech'}</button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {adminTech.length === 0 ? (
                        <div className="col-span-full rounded-[1.25rem] border border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-sm text-slate-400">
                          {locale === 'tr' ? 'Henüz tech stack verisi yok.' : 'No tech stack data yet.'}
                        </div>
                      ) : adminTech.map((item, index) => (
                        <div key={item.id || item.name} className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                          <div className="flex items-start gap-3">
                            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"><BrandIcon name={item.name} size={18} /></span>
                            <div className="min-h-[3.5rem] text-sm font-medium leading-6 text-slate-200">{item.name}</div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button type="button" onClick={() => handleEditTech(item, index)} className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-200">{locale === 'tr' ? 'Düzenle' : 'Edit'}</button>
                            <button type="button" onClick={() => handleArchiveTech(item)} className="rounded-full border border-red-400/16 bg-red-400/8 px-3 py-1 text-xs text-red-100">{locale === 'tr' ? 'Arşivle' : 'Archive'}</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AdminSection>

              <AdminSection id="projects" data={sections.projects}><Inventory rows={projectRows} labels={locale === 'tr' ? ['Düzenle', 'Kopyala', 'Arşivle'] : ['Edit', 'Duplicate', 'Archive']} addLabel={locale === 'tr' ? 'Proje ekle' : 'Add project'} hasStack emptyLabel={locale === 'tr' ? 'Henüz proje verisi yok.' : 'No project data yet.'} onAdd={handleAddProject} onEdit={handleEditProject} onDuplicate={handleDuplicateProject} onArchive={handleArchiveProject} /></AdminSection>
              <AdminSection id="writings" data={sections.writings}><Inventory rows={writingRows} labels={locale === 'tr' ? ['Düzenle', 'Kopyala', 'Arşivle'] : ['Edit', 'Duplicate', 'Archive']} addLabel={locale === 'tr' ? 'Yazı ekle' : 'Add article'} emptyLabel={locale === 'tr' ? 'Henüz yazı verisi yok.' : 'No writing data yet.'} onAdd={handleAddArticle} onEdit={handleEditArticle} onDuplicate={handleDuplicateArticle} onArchive={handleArchiveArticle} /></AdminSection>

              <AdminSection id="resume" data={sections.resume}>
                <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-sky-400/10 text-sky-200"><FileDown size={18} /></div>
                      <div>
                        <p className="text-sm font-medium text-white">{locale === 'tr' ? 'Aktif dosya' : 'Active file'}</p>
                        <p className="mt-1 text-sm text-slate-400">{adminResume?.fileName || 'fatih-ozkurt-cv.pdf'}</p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Storage path</p>
                        <p className="mt-2 text-sm text-slate-200">{adminResume?.downloadUrl || 'minio://public-assets/cv/fatih-ozkurt-cv.pdf'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{locale === 'tr' ? 'Dosya boyutu' : 'File size'}</p>
                        <p className="mt-2 text-sm text-slate-200">{adminResume?.sizeBytes ? `${adminResume.sizeBytes} bytes` : '-'}</p>
                      </div>
                      <button type="button" onClick={handleReplaceResume} className="button-primary rounded-full px-5 py-3 text-sm font-semibold">{locale === 'tr' ? 'Asset değiştir' : 'Replace asset'}</button>
                    </div>
                  </div>
                  <div className="rounded-[1.7rem] border border-white/10 bg-[#f5f5f1] p-6 text-slate-950">
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Public viewer</p>
                    <h3 className="mt-4 text-3xl font-semibold">{adminHero?.fullName || 'Fatih Ozkurt'}</h3>
                    <p className="mt-2 text-lg text-slate-700">{adminHero?.title || 'Java Backend Developer'}</p>
                    <div className="mt-8 rounded-[1.4rem] border border-slate-300 bg-white px-5 py-4 text-sm leading-7 text-slate-700">
                      {locale === 'tr' ? 'Viewer alanı productionda gerçek PDF ile değiştirilecek şekilde hazır durumda.' : 'Viewer area is already prepared to be replaced by the production PDF asset.'}
                    </div>
                  </div>
                </div>
              </AdminSection>

              <AdminSection id="contact" data={sections.contact}>
                <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                  <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
                    <p className="text-sm font-medium text-white">{locale === 'tr' ? 'Public kanallar' : 'Public channels'}</p>
                    <div className="mt-5 grid gap-3">
                      {[
                        [Mail, locale === 'tr' ? 'E-posta' : 'Mail', adminContactProfile?.email || '-'],
                        [Linkedin, 'LinkedIn', (adminContactProfile?.linkedinUrl || '-').replace(/^https?:\/\//, '')],
                        [Github, 'GitHub', (adminContactProfile?.githubUrl || '-').replace(/^https?:\/\//, '')],
                        [PenSquare, 'Medium', (adminContactProfile?.mediumUrl || '-').replace(/^https?:\/\//, '')],
                      ].map((item) => {
                        const ChannelIcon = item[0]
                        return (
                          <div key={item[1]} className="flex items-center gap-4 rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-sky-400/10 text-sky-200"><ChannelIcon size={16} /></span>
                            <div>
                              <p className="text-sm text-white">{item[1]}</p>
                              <p className="mt-1 text-sm text-slate-400">{item[2]}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-6">
                      <p className="text-sm font-medium text-white">{locale === 'tr' ? 'Son iletişim mesajları' : 'Recent contact messages'}</p>
                      <div className="mt-3 space-y-2">
                        {adminContactMessages.length === 0 ? (
                          <div className="rounded-[1.1rem] border border-dashed border-white/15 bg-white/[0.02] px-3 py-4 text-sm text-slate-400">
                            {locale === 'tr' ? 'Henüz iletişim mesajı yok.' : 'No contact messages yet.'}
                          </div>
                        ) : adminContactMessages.slice(0, 4).map((item) => (
                          <div key={item.id} className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-slate-200">
                            <p className="font-medium">{item.title}</p>
                            <p className="mt-1 text-slate-400">{item.email}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
                    <div className="grid gap-4">
                      <Field label={locale === 'tr' ? 'Public e-posta' : 'Public email'} value={contactDraft.email} readOnly={false} onChange={handleContactDraftChange('email')} />
                      <Field label="LinkedIn URL" value={contactDraft.linkedinUrl} readOnly={false} onChange={handleContactDraftChange('linkedinUrl')} />
                      <Field label="GitHub URL" value={contactDraft.githubUrl} readOnly={false} onChange={handleContactDraftChange('githubUrl')} />
                      <Field label="Medium URL" value={contactDraft.mediumUrl} readOnly={false} onChange={handleContactDraftChange('mediumUrl')} />
                      <Field label={locale === 'tr' ? 'Inbox hedefi' : 'Inbox target'} value={contactDraft.recipientEmail} readOnly={false} onChange={handleContactDraftChange('recipientEmail')} />
                      <button type="button" onClick={() => saveCoreSections(locale === 'tr' ? 'İletişim kaydı' : 'Contact profile save')} className="button-primary w-fit rounded-full px-5 py-3 text-sm font-semibold">{locale === 'tr' ? 'İletişim profilini kaydet' : 'Save contact profile'}</button>
                    </div>
                  </div>
                </div>
              </AdminSection>

              <AdminSection id="security" data={sections.security}>
                <div className="grid gap-4 xl:grid-cols-3">
                  {[
                    [locale === 'tr' ? 'Başarısız denemeler' : 'Failed attempts', securityData.failed],
                    [locale === 'tr' ? 'Son resetler' : 'Recent resets', securityData.reset],
                    [locale === 'tr' ? 'Audit log' : 'Audit log', securityData.audit],
                  ].map((block) => (
                    <div key={block[0]} className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
                      <p className="text-sm font-medium text-white">{block[0]}</p>
                      <div className="mt-5 space-y-3">
                        {block[1].length === 0 ? (
                          <div className="rounded-[1.25rem] border border-dashed border-white/15 bg-white/[0.02] px-4 py-6 text-sm text-slate-400">
                            {locale === 'tr' ? 'Henüz kayıt yok.' : 'No records yet.'}
                          </div>
                        ) : block[1].map((row) => (
                          <div key={row.join('-')} className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
                            <div>{row[0]}</div>
                            <div className="mt-1 text-slate-400">
                              {row[1]} · {row[2]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AdminSection>
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
            <div className="flex items-center justify-between gap-4"><div className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-orange-100"><LockKeyhole size={14} />{copy.hiddenAccess}</div><LanguageSwitch locale={locale} setLocale={setLocale} labels={langLabels} /></div>
            <div className="space-y-4"><h1 className="text-5xl font-semibold tracking-tight text-white md:text-6xl">/auth</h1><p className="max-w-xl text-base leading-8 text-slate-300 md:text-lg">{copy.description}</p></div>
          </section>
          <section className="glass-card rounded-[2rem] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">{forgotMode ? copy.passwordReset : copy.adminLogin}</p>
            {forgotMode ? (
              <form className="mt-6 space-y-5" onSubmit={handleForgotPassword}>
                <label className="block space-y-1.5"><span className="relative -top-1 pl-3 text-sm text-slate-300">{copy.email}</span><input type="email" autoComplete="email" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" /></label>
                <p className="text-sm leading-7 text-slate-400">{copy.resetHint}</p>
                {authError ? <p className="text-sm text-rose-300">{authError}</p> : null}
                {authInfo ? <p className="text-sm text-emerald-300">{authInfo}</p> : null}
                <button type="submit" disabled={!canSendReset || isBusy} className="button-primary w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-55">{isBusy ? (locale === 'tr' ? 'Gönderiliyor...' : 'Sending...') : copy.sendResetLink}</button>
                <button type="button" onClick={() => setForgotMode(false)} className="w-full rounded-full border border-white/10 bg-white/6 px-6 py-3 text-sm text-slate-200">{copy.backToLogin}</button>
              </form>
            ) : (
              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <label className="block space-y-1.5"><span className="relative -top-1 pl-3 text-sm text-slate-300">{copy.username}</span><input name="username" type="text" autoComplete="username" value={form.username} onChange={handleChange} placeholder="antesionn" className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" /></label>
                <label className="block space-y-1.5"><span className="relative -top-1 pl-3 text-sm text-slate-300">{copy.password}</span><input name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} placeholder="Min 8 + Aa + 0-9 + symbol" className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" /></label>
                <p className="text-sm leading-6 text-slate-400">{copy.passwordRule}</p>
                {authError ? <p className="text-sm text-rose-300">{authError}</p> : null}
                {authInfo ? <p className="text-sm text-emerald-300">{authInfo}</p> : null}
                <button type="submit" disabled={!canSubmit || isBusy} className="button-primary w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-55">{isBusy ? (locale === 'tr' ? 'Giriş yapılıyor...' : 'Logging in...') : copy.login}</button>
                <button type="button" onClick={() => setForgotMode(true)} className="w-full text-sm text-slate-400 underline decoration-white/10 underline-offset-4">{copy.forgotPassword}</button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
