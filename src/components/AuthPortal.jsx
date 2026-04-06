import {
  AlertTriangle,
  ChartColumn,
  Eye,
  EyeOff,
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
  getAdminPageSections,
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
  uploadAdminProjectAsset,
  updateAdminAbout,
  updateAdminArticle,
  updateAdminContactProfile,
  updateAdminPageSection,
  updateAdminHero,
  updateAdminProject,
  updateAdminTechItem,
  updateCredentials,
} from '../apiClient'
import worldMapUrl from 'world-atlas/countries-110m.json?url'
import { BrandIcon } from './BrandIcon'

const PASSWORD_PATTERN = /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[^\p{L}\d]).{8,}$/u
const MAX_RESUME_FILE_BYTES = 15 * 1024 * 1024
const ALLOWED_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml']
const ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg']
const ALLOWED_RESUME_MIME_TYPES = ['application/pdf', 'application/x-pdf']
const ALLOWED_RESUME_EXTENSIONS = ['.pdf']

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
    resetHint: 'Reset link is always sent to the owner inbox configured in the system.',
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
    resetHint: 'Reset link her zaman sistemde tanımlı sahibi e-posta adresine gönderilir.',
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
    projects: ['Projects', 'CRUD-ready project inventory.', 'Add, edit, delete, and reorder the cards shown on the public surface.'],
    writings: ['Writings', 'Medium and article management.', 'Keep article links, excerpts, and ordering fresh without touching layout.'],
    resume: ['Resume', 'CV asset lifecycle and delivery state.', 'Replace the active file and keep asset metadata visible.'],
    contact: ['Contact', 'Public channels and outbound delivery routing.', 'Expose public links while keeping the form delivery target controlled.'],
    security: ['Security', 'Failed logins, resets, and audit visibility.', 'Authentication events and admin actions should stay observable.'],
  },
  tr: {
    overview: ['Genel bakış', 'Public portfolyo için tek yüzeyli operasyon paneli.', 'Trafik, içerik, teslimat ve güvenlik sinyalleri aynı yerde kalır.'],
    analytics: ['Analitik', 'Trafik, ülke dağılımı ve hata sinyalleri.', 'İçeriğe dokunmadan önce haftalık hareketi ve güvenlik kaymasını oku.'],
    content: ['İçerik', 'Hero metni ve görünür tech stack tek yerde.', 'Landing etkisi ve teknik kısa liste kod değişmeden yönetilebilmeli.'],
    projects: ['Projeler', 'CRUD hazır proje envanteri.', 'Public yüzeyde görünen kartları ekle, düzenle, sil ve sırala.'],
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
  tr: [35.24, 38.96],
  germany: [10.45, 51.17],
  almanya: [10.45, 51.17],
  de: [10.45, 51.17],
  netherlands: [5.29, 52.13],
  hollanda: [5.29, 52.13],
  nl: [5.29, 52.13],
  'united kingdom': [-2.8, 54.1],
  'birleşik krallık': [-2.8, 54.1],
  gb: [-2.8, 54.1],
  uk: [-2.8, 54.1],
  'united states': [-98.58, 39.83],
  'united states of america': [-98.58, 39.83],
  'amerika birleşik devletleri': [-98.58, 39.83],
  us: [-98.58, 39.83],
  'united arab emirates': [53.85, 23.42],
  'birleşik arap emirlikleri': [53.85, 23.42],
  ae: [53.85, 23.42],
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

function localizedText(value, locale) {
  const raw = String(value || '')
  const prefix = '__I18N__'
  if (!raw.startsWith(prefix)) {
    return raw
  }
  try {
    const parsed = JSON.parse(raw.slice(prefix.length))
    const tr = String(parsed?.tr || parsed?.en || '')
    const en = String(parsed?.en || parsed?.tr || '')
    return locale === 'tr' ? (tr || en) : (en || tr)
  } catch {
    return raw
  }
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

function isFileLike(value) {
  return value && typeof value === 'object' && typeof value.name === 'string'
}

function fileListToArray(fileList) {
  if (!fileList || typeof fileList.length !== 'number') {
    return []
  }
  return Array.from(fileList)
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

function isValidGithubUrl(value) {
  const candidate = String(value || '').trim()
  if (!candidate) {
    return true
  }
  try {
    const withScheme = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`
    const url = new URL(withScheme)
    return /(^|\.)github\.com$/i.test(url.hostname)
  } catch {
    return false
  }
}

function extractFileExtension(fileName) {
  const candidate = String(fileName || '').trim().toLowerCase()
  if (!candidate || !candidate.includes('.')) {
    return ''
  }
  return candidate.slice(candidate.lastIndexOf('.'))
}

function hasAllowedFileType(file, allowedMimeTypes, allowedExtensions) {
  const mimeType = String(file?.type || '').toLowerCase()
  const extension = extractFileExtension(file?.name)
  const mimeAllowed = !mimeType || mimeType === 'application/octet-stream' || allowedMimeTypes.includes(mimeType)
  const extensionAllowed = allowedExtensions.includes(extension)
  return mimeAllowed && extensionAllowed
}

function Inventory({
  rows,
  labels,
  addLabel,
  hasStack = false,
  showDuplicate = true,
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
                {showDuplicate ? (
                  <button type="button" onClick={() => onDuplicate?.(row)} className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-slate-200">{labels[1]}</button>
                ) : null}
                <button type="button" onClick={() => onArchive?.(row)} className="rounded-full border border-red-400/16 bg-red-400/8 px-3 py-1.5 text-sm text-red-100">{labels[2]}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AdminEditorModal({ modal, values, error, onChange, onClose, onSubmit, busy, locale }) {
  const hasLocalizedFields = Boolean(modal?.fields?.some((field) => field.type === 'localizedText' || field.type === 'localizedTextarea'))
  const editorLanguage = values.__editorLanguage || locale
  const updateEditorLanguage = (nextLocale) => {
    onChange('__editorLanguage', nextLocale)
  }
  const pendingPreviewUrls = useMemo(() => {
    if (!Array.isArray(values.galleryFiles) || values.galleryFiles.length === 0) {
      return []
    }
    return values.galleryFiles.map((file, index) => ({
      id: `${file?.name || 'file'}-${index}`,
      url: URL.createObjectURL(file),
    }))
  }, [values.galleryFiles])

  useEffect(
    () => () => {
      pendingPreviewUrls.forEach((item) => URL.revokeObjectURL(item.url))
    },
    [pendingPreviewUrls],
  )

  if (!modal) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-slate-950/80 p-2 backdrop-blur-md sm:p-4"
      onMouseDown={onClose}
    >
      <div
        className="mt-2 flex max-h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(180deg,rgba(10,16,34,0.98),rgba(7,12,27,0.98))] shadow-[0_30px_100px_rgba(2,6,23,0.75)] sm:mt-4 sm:max-h-[calc(100dvh-2rem)] sm:rounded-[1.6rem]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 border-b border-white/10 bg-[linear-gradient(180deg,rgba(11,18,34,0.98),rgba(11,18,34,0.88))] px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">{locale === 'tr' ? 'Düzenleyici' : 'Editor'}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-white sm:text-2xl">{modal.title}</h3>
                {hasLocalizedFields ? (
                  <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
                    {['tr', 'en'].map((lang) => (
                      <button
                        key={`editor-lang-${lang}`}
                        type="button"
                        onClick={() => updateEditorLanguage(lang)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                          editorLanguage === lang
                            ? 'bg-sky-400/15 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.22)]'
                            : 'text-slate-300 hover:bg-white/6 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"
              aria-label={locale === 'tr' ? 'Kapat' : 'Close'}
            >
              ×
            </button>
          </div>
        </div>
        <form onSubmit={onSubmit} className="flex h-full min-h-0 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
            {error ? <p className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
            <div className="grid gap-3 md:grid-cols-2">
              {modal.fields.map((field) => (
                <div key={field.name} className={`block space-y-1.5 ${field.type === 'textarea' || field.type === 'localizedTextarea' || field.type === 'galleryManager' ? 'md:col-span-2' : ''}`}>
                  <span className="relative -top-1 pl-1 text-sm text-slate-300">{field.label}</span>
                  {field.type === 'localizedText' || field.type === 'localizedTextarea' ? (
                    <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/45 p-2.5">
                      {field.type === 'localizedTextarea' ? (
                        <textarea
                          rows={field.rows || 4}
                          value={values[editorLanguage === 'tr' ? field.trKey : field.enKey] || ''}
                          onChange={(event) => onChange(editorLanguage === 'tr' ? field.trKey : field.enKey, event.target.value)}
                          placeholder={field.placeholder || ''}
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-slate-500"
                        />
                      ) : (
                        <input
                          type="text"
                          value={values[editorLanguage === 'tr' ? field.trKey : field.enKey] || ''}
                          onChange={(event) => onChange(editorLanguage === 'tr' ? field.trKey : field.enKey, event.target.value)}
                          placeholder={field.placeholder || ''}
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                        />
                      )}
                    </div>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={field.rows || 4}
                      value={values[field.name] || ''}
                      onChange={(event) => onChange(field.name, event.target.value)}
                      placeholder={field.placeholder || ''}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-slate-500"
                    />
                  ) : field.type === 'file' ? (
                    <>
                      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/45 px-3 py-2.5">
                        <input
                          id={`editor-file-${field.name}`}
                          type="file"
                          accept={field.accept || '*/*'}
                          onChange={(event) => onChange(field.name, event.target.files?.[0] ?? null)}
                          className="sr-only"
                        />
                        <label htmlFor={`editor-file-${field.name}`} className="inline-flex cursor-pointer rounded-full bg-sky-400/15 px-3 py-1.5 text-xs font-semibold text-sky-100">
                          {locale === 'tr' ? 'Dosya seç' : 'Choose file'}
                        </label>
                        <span className="text-sm text-slate-300">
                          {isFileLike(values[field.name])
                            ? values[field.name].name
                            : (locale === 'tr' ? 'Dosya seçilmedi' : 'No file selected')}
                        </span>
                      </div>
                    </>
                  ) : field.type === 'files' ? (
                    <>
                      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/45 px-3 py-2.5">
                        <input
                          id={`editor-files-${field.name}`}
                          type="file"
                          multiple
                          accept={field.accept || '*/*'}
                          onChange={(event) => {
                            const incoming = fileListToArray(event.target.files)
                            const existing = Array.isArray(values[field.name]) ? values[field.name] : []
                            onChange(field.name, [...existing, ...incoming])
                          }}
                          className="sr-only"
                        />
                        <label htmlFor={`editor-files-${field.name}`} className="inline-flex cursor-pointer rounded-full bg-sky-400/15 px-3 py-1.5 text-xs font-semibold text-sky-100">
                          {locale === 'tr' ? 'Dosyalar seç' : 'Choose files'}
                        </label>
                        <span className="text-sm text-slate-300">
                          {Array.isArray(values[field.name]) && values[field.name].length > 0
                            ? values[field.name].map((file) => file.name).join(', ')
                            : (locale === 'tr' ? 'Dosya seçilmedi' : 'No file selected')}
                        </span>
                      </div>
                    </>
                  ) : field.type === 'galleryManager' ? (
                    <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/45 p-3.5">
                      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2">
                        <input
                          id="editor-gallery-files"
                          type="file"
                          multiple
                          accept={field.accept || 'image/*'}
                          onChange={(event) => {
                            const incoming = fileListToArray(event.target.files)
                            const existing = Array.isArray(values.galleryFiles) ? values.galleryFiles : []
                            onChange('galleryFiles', [...existing, ...incoming])
                          }}
                          className="sr-only"
                        />
                        <label htmlFor="editor-gallery-files" className="inline-flex cursor-pointer rounded-full bg-sky-400/15 px-3 py-1.5 text-xs font-semibold text-sky-100">
                          {locale === 'tr' ? 'Görseller seç' : 'Choose images'}
                        </label>
                        <span className="text-sm text-slate-300">
                          {Array.isArray(values.galleryFiles) && values.galleryFiles.length > 0
                            ? `${values.galleryFiles.length} ${locale === 'tr' ? 'dosya seçildi' : 'files selected'}`
                            : (locale === 'tr' ? 'Dosya seçilmedi' : 'No file selected')}
                        </span>
                      </div>
                      {Array.isArray(values.galleryFiles) && values.galleryFiles.length > 0 ? (
                        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-2.5">
                          <p className="text-xs text-slate-400">{locale === 'tr' ? 'Yüklemeyi bekleyen dosyalar' : 'Pending uploads'}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {values.galleryFiles.map((file, index) => (
                              <button
                                key={`${file.name}-${index}`}
                                type="button"
                                onClick={() => onChange('galleryFiles', values.galleryFiles.filter((_, i) => i !== index))}
                                className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-slate-300"
                              >
                                {file.name} ×
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {Array.isArray(values.galleryFiles) && values.galleryFiles.length > 0 ? (
                        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-2.5">
                          <p className="text-xs text-slate-400">{locale === 'tr' ? 'Yeni görsel önizlemeleri' : 'New image previews'}</p>
                          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {pendingPreviewUrls.map((item) => {
                              return (
                                <div key={item.id} className="relative rounded-xl border border-white/10 bg-slate-950/55 p-2">
                                  <div className="aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-slate-950/60">
                                    <img src={item.url} alt="" className="h-full w-full object-cover" />
                                  </div>
                                  <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-slate-950/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                                    {locale === 'tr' ? 'Yeni' : 'New'}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ) : null}
                      {Array.isArray(values.galleryUrls) && values.galleryUrls.length > 0 ? (
                        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-2.5">
                          <p className="text-xs text-slate-400">
                            {locale === 'tr'
                              ? 'Mevcut görseller (kapak seçmek için görsele tıkla)'
                              : 'Current images (click an image to set cover)'}
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {values.galleryUrls.map((url) => (
                              <div
                                key={url}
                                role="button"
                                tabIndex={0}
                                onClick={() => onChange('coverImageUrl', url)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault()
                                    onChange('coverImageUrl', url)
                                  }
                                }}
                                className={`group relative cursor-pointer rounded-xl border bg-slate-950/55 p-2 transition ${
                                  values.coverImageUrl === url
                                    ? 'border-sky-300/70 shadow-[0_0_0_1px_rgba(125,211,252,0.3)]'
                                    : 'border-white/10 hover:border-sky-300/35'
                                }`}
                              >
                                <div className="aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-slate-950/60">
                                  <img src={url} alt="" className="h-full w-full object-cover" />
                                </div>
                                <span
                                  className={`pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                    values.coverImageUrl === url
                                      ? 'bg-sky-400/25 text-sky-100'
                                      : 'bg-slate-950/75 text-slate-200 opacity-0 transition group-hover:opacity-100'
                                  }`}
                                >
                                  {values.coverImageUrl === url
                                    ? (locale === 'tr' ? 'Kapak görsel' : 'Cover image')
                                    : (locale === 'tr' ? 'Kapak yap' : 'Set as cover')}
                                </span>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    const nextUrls = values.galleryUrls.filter((item) => item !== url)
                                    const nextCover = values.coverImageUrl === url ? (nextUrls[0] || null) : values.coverImageUrl
                                    onChange('galleryUrls', nextUrls)
                                    onChange('coverImageUrl', nextCover)
                                  }}
                                  className="mt-2 rounded-full border border-red-400/20 bg-red-400/12 px-2 py-1 text-[10px] text-red-100"
                                >
                                  {locale === 'tr' ? 'Çıkar' : 'Remove'}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={values[field.name] || ''}
                      onChange={(event) => onChange(field.name, event.target.value)}
                      placeholder={field.placeholder || ''}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-white/10 bg-[linear-gradient(180deg,rgba(11,18,34,0.9),rgba(11,18,34,0.98))] px-4 py-3 sm:px-6">
            <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200">
              {locale === 'tr' ? 'İptal' : 'Cancel'}
            </button>
            <button type="submit" disabled={busy} className="button-primary rounded-full px-5 py-2 text-sm font-semibold disabled:opacity-55">
              {busy ? '...' : modal.submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
function AdminConfirmModal({ modal, onClose, onConfirm, busy, locale }) {
  if (!modal) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        className="w-full max-w-lg rounded-[1.4rem] border border-white/15 bg-[#0b1222] p-5 shadow-[0_28px_90px_rgba(2,6,23,0.75)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-white">{modal.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">{modal.description}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200">
            {locale === 'tr' ? 'İptal' : 'Cancel'}
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className="rounded-full border border-red-400/20 bg-red-400/15 px-4 py-2 text-sm text-red-100 disabled:opacity-55">
            {busy ? '...' : modal.confirmLabel}
          </button>
        </div>
      </div>
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
  const [showPassword, setShowPassword] = useState(false)
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
    fullName: '',
    title: '',
    description: '',
    ctaLabel: '',
  })
  const [heroBadgeDraft, setHeroBadgeDraft] = useState({
    tr: [''],
    en: [''],
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
  const [pageSectionDraft, setPageSectionDraft] = useState({
    projects: { eyebrow: '', title: '', description: '' },
    writings: { eyebrow: '', title: '', description: '' },
    resume: { eyebrow: '', title: '', description: '' },
    contact: { eyebrow: '', title: '', description: '' },
  })
  const [credentialsDraft, setCredentialsDraft] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
  })
  const [showCurrentCredentialPassword, setShowCurrentCredentialPassword] = useState(false)
  const [showNewCredentialPassword, setShowNewCredentialPassword] = useState(false)
  const [rateLimitTriggerCount, setRateLimitTriggerCount] = useState(0)
  const [securityData, setSecurityData] = useState({
    failed: [],
    reset: [],
    audit: [],
  })
  const [editorModal, setEditorModal] = useState(null)
  const [editorValues, setEditorValues] = useState({})
  const [editorError, setEditorError] = useState('')
  const [confirmModal, setConfirmModal] = useState(null)
  const [toast, setToast] = useState(null)

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
      title: localizedText(project.title, locale),
      status: locale === 'tr' ? 'Yayında' : 'Published',
      index: `0${index + 1}`,
      stackText: (project.stack || []).join(', '),
      raw: project,
    }))
  }, [adminProjects, locale])

  const writingRows = useMemo(() => {
    return adminArticles.map((article, index) => ({
      id: article.id,
      title: localizedText(article.title, locale),
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
  const canSendReset = true

  useEffect(() => {
    if (!authInfo) {
      return undefined
    }
    setToast({ type: 'success', message: authInfo })
    const timeoutId = window.setTimeout(() => {
      setToast(null)
    }, 2600)
    return () => window.clearTimeout(timeoutId)
  }, [authInfo])

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
        pageSections,
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
        getAdminPageSections(accessToken, locale),
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
        fullName: hero?.fullName || '',
        title: hero?.title || '',
        description: hero?.description || '',
        ctaLabel: hero?.ctaLabel || '',
      })
      setHeroBadgeDraft(decodeLocalizedLines(hero?.welcomeText || ''))
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
      const defaultSectionDraft = {
        projects: { eyebrow: '', title: '', description: '' },
        writings: { eyebrow: '', title: '', description: '' },
        resume: { eyebrow: '', title: '', description: '' },
        contact: { eyebrow: '', title: '', description: '' },
      }
      ;(Array.isArray(pageSections) ? pageSections : []).forEach((item) => {
        const key = String(item?.pageKey || '').toLowerCase()
        if (!defaultSectionDraft[key]) {
          return
        }
        defaultSectionDraft[key] = {
          eyebrow: item?.eyebrow || '',
          title: item?.title || '',
          description: item?.description || '',
        }
      })
      setPageSectionDraft(defaultSectionDraft)
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

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      await forgotPassword(locale)
      setAuthInfo(
        locale === 'tr'
          ? 'Reset link isteği alındı ve sahip e-posta kutusuna gönderildi.'
          : 'Reset link request accepted and sent to the owner inbox.',
      )
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

  const handleHeroBadgeLineChange = (lang, index, value) => {
    setHeroBadgeDraft((current) => {
      const currentLines = Array.isArray(current[lang]) ? [...current[lang]] : ['']
      currentLines[index] = value
      return { ...current, [lang]: currentLines }
    })
  }

  const addHeroBadgeLine = (lang) => {
    setHeroBadgeDraft((current) => {
      const currentLines = Array.isArray(current[lang]) ? [...current[lang]] : []
      return { ...current, [lang]: [...currentLines, ''] }
    })
  }

  const removeHeroBadgeLine = (lang, index) => {
    setHeroBadgeDraft((current) => {
      const currentLines = Array.isArray(current[lang]) ? [...current[lang]] : []
      const next = currentLines.filter((_, lineIndex) => lineIndex !== index)
      return { ...current, [lang]: next.length > 0 ? next : [''] }
    })
  }

  const handlePageSectionDraftChange = (pageKey, field) => (event) => {
    const value = event.target.value
    setPageSectionDraft((current) => ({
      ...current,
      [pageKey]: {
        ...(current[pageKey] || {}),
        [field]: value,
      },
    }))
  }

  const handleCredentialsDraftChange = (field) => (event) => {
    setCredentialsDraft((current) => ({ ...current, [field]: event.target.value }))
  }

  const normalizeOptional = (value) => {
    const trimmed = (value || '').trim()
    return trimmed.length > 0 ? trimmed : null
  }

  const LOCALIZED_PREFIX = '__I18N__'

  const decodeLocalizedText = (value) => {
    const raw = String(value || '')
    if (!raw.startsWith(LOCALIZED_PREFIX)) {
      return { tr: raw, en: raw }
    }
    try {
      const parsed = JSON.parse(raw.slice(LOCALIZED_PREFIX.length))
      return {
        tr: String(parsed?.tr || parsed?.en || ''),
        en: String(parsed?.en || parsed?.tr || ''),
      }
    } catch {
      return { tr: raw, en: raw }
    }
  }

  const encodeLocalizedText = (trValue, enValue) => {
    const tr = String(trValue || '').trim()
    const en = String(enValue || '').trim()
    if (!tr && !en) {
      return ''
    }
    if (tr && en && tr === en) {
      return tr
    }
    return `${LOCALIZED_PREFIX}${JSON.stringify({ tr: tr || en, en: en || tr })}`
  }

  const decodeLocalizedLines = (value) => {
    const localized = decodeLocalizedText(value)
    const parse = (input) => String(input || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    const trLines = parse(localized.tr)
    const enLines = parse(localized.en)
    return {
      tr: trLines.length > 0 ? trLines : [''],
      en: enLines.length > 0 ? enLines : [''],
    }
  }

  const encodeLocalizedLines = (linesByLocale) => {
    const normalize = (items) =>
      (Array.isArray(items) ? items : [])
        .map((line) => String(line || '').trim())
        .filter(Boolean)
    const trLines = normalize(linesByLocale?.tr)
    const enLines = normalize(linesByLocale?.en)
    return encodeLocalizedText(trLines.join('\n'), enLines.join('\n'))
  }

  const normalizeWebUrl = (value) => {
    const trimmed = normalizeOptional(value)
    if (!trimmed) {
      return null
    }
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed
    }
    return `https://${trimmed}`
  }

  const resolveReadmeMarkdown = async (file, fallbackValue = '') => {
    if (!isFileLike(file)) {
      return String(fallbackValue || '')
    }
    const maxBytes = 512 * 1024
    if (file.size > maxBytes) {
      throw new Error(
        locale === 'tr'
          ? 'README dosyası çok büyük. Maksimum 512 KB olmalı.'
          : 'README file is too large. Maximum allowed is 512 KB.',
      )
    }
    const text = await file.text()
    return String(text || '')
  }

  const uploadAssetFromFile = async (file, folder, options = {}) => {
    if (!isFileLike(file)) {
      return null
    }
    const maxSizeBytes = Number(options.maxSizeBytes || 0) || 5 * 1024 * 1024
    const allowedMimeTypes = options.allowedMimeTypes || ALLOWED_IMAGE_MIME_TYPES
    const allowedExtensions = options.allowedExtensions || ALLOWED_IMAGE_EXTENSIONS
    if (!hasAllowedFileType(file, allowedMimeTypes, allowedExtensions)) {
      throw new Error(
        locale === 'tr'
          ? 'Geçersiz dosya tipi. PNG, JPG, WEBP, AVIF, GIF veya SVG yükleyebilirsin.'
          : 'Invalid file type. Use PNG, JPG, WEBP, AVIF, GIF, or SVG.',
      )
    }
    if (file.size > maxSizeBytes) {
      const maxMb = Math.round((maxSizeBytes / (1024 * 1024)) * 10) / 10
      throw new Error(
        locale === 'tr'
          ? `Dosya çok büyük. Maksimum ${maxMb} MB olmalı.`
          : `File is too large. Maximum allowed is ${maxMb} MB.`,
      )
    }
    const uploaded = await uploadAdminProjectAsset(accessToken, file, locale, folder)
    return uploaded?.publicUrl || null
  }

  const uniqueUrls = (urls) => {
    if (!Array.isArray(urls)) {
      return []
    }
    return Array.from(new Set(urls.map((item) => String(item || '').trim()).filter(Boolean)))
  }

  const saveCoreSections = async (modeLabel) => {
    if (!accessToken) {
      return
    }

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      if (contactDraft.email && !isValidEmail(contactDraft.email)) {
        throw new Error(locale === 'tr' ? 'Public e-posta geçerli değil.' : 'Public email is not valid.')
      }
      if (contactDraft.recipientEmail && !isValidEmail(contactDraft.recipientEmail)) {
        throw new Error(locale === 'tr' ? 'Inbox hedefi geçerli değil.' : 'Inbox target email is not valid.')
      }
      if (!isValidGithubUrl(contactDraft.githubUrl)) {
        throw new Error(locale === 'tr' ? 'GitHub URL github.com alan adına ait olmalı.' : 'GitHub URL must use a github.com host.')
      }
      await updateAdminHero(accessToken, {
        welcomeText: encodeLocalizedLines(heroBadgeDraft),
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
      for (const pageKey of ['projects', 'writings', 'resume', 'contact']) {
        const sectionDraft = pageSectionDraft[pageKey] || {}
        await updateAdminPageSection(accessToken, pageKey, {
          eyebrow: sectionDraft.eyebrow,
          title: sectionDraft.title,
          description: sectionDraft.description,
        }, locale)
      }
      await loadAdminData()
      setAuthInfo(locale === 'tr' ? `${modeLabel} başarılı.` : `${modeLabel} completed.`)
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleUpdateCredentials = async () => {
    if (!credentialsDraft.currentPassword.trim()) {
      setAuthError(locale === 'tr' ? 'Mevcut şifre zorunlu.' : 'Current password is required.')
      return
    }
    if (!credentialsDraft.newUsername.trim() && !credentialsDraft.newPassword.trim()) {
      setAuthError(locale === 'tr' ? 'Yeni kullanıcı adı veya yeni şifre gir.' : 'Provide a new username or a new password.')
      return
    }
    if (credentialsDraft.newPassword && !PASSWORD_PATTERN.test(credentialsDraft.newPassword)) {
      setAuthError(locale === 'tr' ? 'Yeni şifre güvenlik politikasını karşılamıyor.' : 'New password does not satisfy the policy.')
      return
    }

    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      const response = await updateCredentials({
        currentPassword: credentialsDraft.currentPassword,
        newUsername: normalizeOptional(credentialsDraft.newUsername),
        newPassword: normalizeOptional(credentialsDraft.newPassword),
      }, accessToken, locale)
      setCredentialsDraft({
        currentPassword: '',
        newUsername: '',
        newPassword: '',
      })
      setAuthInfo(
        locale === 'tr'
          ? `Hesap bilgileri güncellendi. Yeni kullanıcı adı: ${response?.username || '-'}`
          : `Account credentials updated. New username: ${response?.username || '-'}`
      )
      await handleLogout()
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const openEditor = ({ title, submitLabel, fields, initialValues, onSubmit }) => {
    setEditorValues(initialValues || {})
    setEditorError('')
    setEditorModal({ title, submitLabel, fields, onSubmit })
  }

  const closeEditor = () => {
    if (!isBusy) {
      setEditorModal(null)
      setEditorValues({})
      setEditorError('')
    }
  }

  const submitEditor = async (event) => {
    event.preventDefault()
    if (!editorModal?.onSubmit) {
      return
    }
    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    setEditorError('')
    try {
      const successMessage = await editorModal.onSubmit(editorValues)
      await loadAdminData()
      if (successMessage) {
        setAuthInfo(successMessage)
      }
      setEditorModal(null)
      setEditorValues({})
      setEditorError('')
    } catch (error) {
      setAuthError(error.message)
      setEditorError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const openConfirm = ({ title, description, confirmLabel, onConfirm }) => {
    setConfirmModal({ title, description, confirmLabel, onConfirm })
  }

  const closeConfirm = () => {
    if (!isBusy) {
      setConfirmModal(null)
    }
  }

  const submitConfirm = async () => {
    if (!confirmModal?.onConfirm) {
      return
    }
    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      const successMessage = await confirmModal.onConfirm()
      await loadAdminData()
      if (successMessage) {
        setAuthInfo(successMessage)
      }
      setConfirmModal(null)
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleAddTech = async () => {
    openEditor({
      title: locale === 'tr' ? 'Yeni teknoloji ekle' : 'Add new technology',
      submitLabel: locale === 'tr' ? 'Kaydet' : 'Save',
      fields: [
        { name: 'name', label: locale === 'tr' ? 'Tech adı' : 'Tech name' },
        { name: 'iconFile', label: locale === 'tr' ? 'İkon dosyası (svg/png/jpg/webp)' : 'Icon file (svg/png/jpg/webp)', type: 'file', accept: '.svg,.png,.jpg,.jpeg,.webp,.gif,.avif,image/*' },
        { name: 'category', label: locale === 'tr' ? 'Kategori' : 'Category' },
      ],
      initialValues: { name: '', iconFile: null, category: 'backend' },
      onSubmit: async (values) => {
        const name = (values.name || '').trim()
        if (!name) {
          throw new Error(locale === 'tr' ? 'Tech adı zorunlu.' : 'Tech name is required.')
        }
        const uploadedIconUrl = await uploadAssetFromFile(values.iconFile, 'tech-icons', { maxSizeBytes: 2 * 1024 * 1024 })
        if (!uploadedIconUrl) {
          throw new Error(locale === 'tr' ? 'İkon dosyası seçmelisin.' : 'You must select an icon file.')
        }
        await createAdminTechItem(accessToken, {
          name,
          iconName: uploadedIconUrl.trim(),
          category: (values.category || 'backend').trim(),
          sortOrder: adminTech.length + 1,
          active: true,
        }, locale)
        return locale === 'tr' ? 'Tech eklendi.' : 'Tech item created.'
      },
    })
  }

  const handleEditTech = async (item, index) => {
    openEditor({
      title: locale === 'tr' ? 'Teknoloji düzenle' : 'Edit technology',
      submitLabel: locale === 'tr' ? 'Güncelle' : 'Update',
      fields: [
        { name: 'name', label: locale === 'tr' ? 'Tech adı' : 'Tech name' },
        { name: 'iconFile', label: locale === 'tr' ? 'İkon dosyası (svg/png/jpg/webp)' : 'Icon file (svg/png/jpg/webp)', type: 'file', accept: '.svg,.png,.jpg,.jpeg,.webp,.gif,.avif,image/*' },
        { name: 'category', label: locale === 'tr' ? 'Kategori' : 'Category' },
      ],
      initialValues: {
        name: item.name || '',
        iconFile: null,
        category: item.category || 'backend',
      },
      onSubmit: async (values) => {
        const name = (values.name || '').trim()
        if (!name) {
          throw new Error(locale === 'tr' ? 'Tech adı zorunlu.' : 'Tech name is required.')
        }
        const uploadedIconUrl = await uploadAssetFromFile(values.iconFile, 'tech-icons', { maxSizeBytes: 2 * 1024 * 1024 })
        await updateAdminTechItem(accessToken, item.id, {
          name,
          iconName: (uploadedIconUrl || item.iconName || name).trim(),
          category: (values.category || 'backend').trim(),
          sortOrder: index + 1,
          active: true,
        }, locale)
        return locale === 'tr' ? 'Tech güncellendi.' : 'Tech item updated.'
      },
    })
  }

  const handleArchiveTech = async (item) => {
    openConfirm({
      title: locale === 'tr' ? 'Teknolojiyi sil' : 'Delete technology',
      description: locale === 'tr' ? 'Bu teknoloji öğesi kalıcı olarak silinecek. Devam etmek istiyor musun?' : 'This tech item will be permanently deleted. Continue?',
      confirmLabel: locale === 'tr' ? 'Sil' : 'Delete',
      onConfirm: async () => {
        await deleteAdminTechItem(accessToken, item.id, locale)
        return locale === 'tr' ? 'Tech silindi.' : 'Tech item deleted.'
      },
    })
  }

  const handleAddProject = async () => {
    openEditor({
      title: locale === 'tr' ? 'Yeni proje ekle' : 'Add new project',
      submitLabel: locale === 'tr' ? 'Kaydet' : 'Save',
      fields: [
        { name: 'titleLocalized', trKey: 'titleTr', enKey: 'titleEn', label: locale === 'tr' ? 'Proje başlığı' : 'Project title', type: 'localizedText' },
        { name: 'category', label: locale === 'tr' ? 'Kategori' : 'Category' },
        { name: 'summaryLocalized', trKey: 'summaryTr', enKey: 'summaryEn', label: locale === 'tr' ? 'Özet' : 'Summary', type: 'localizedTextarea', rows: 3 },
        { name: 'repositoryUrl', label: locale === 'tr' ? 'GitHub URL' : 'GitHub URL' },
        { name: 'demoUrl', label: locale === 'tr' ? 'Canlı adres URL' : 'Live address URL' },
        { name: 'galleryManager', label: locale === 'tr' ? 'Görseller' : 'Images', type: 'galleryManager', accept: '.svg,.png,.jpg,.jpeg,.webp,.gif,.avif,image/*' },
        { name: 'stackCsv', label: locale === 'tr' ? 'Stack (csv)' : 'Stack (csv)' },
        { name: 'readmeFile', label: locale === 'tr' ? 'README dosyası (.md)' : 'README file (.md)', type: 'file', accept: '.md,.markdown,text/markdown,text/plain' },
      ],
      initialValues: {
        titleTr: '',
        titleEn: '',
        category: 'backend',
        summaryTr: '',
        summaryEn: '',
        repositoryUrl: '',
        demoUrl: '',
        coverImageUrl: null,
        galleryUrls: [],
        galleryFiles: [],
        stackCsv: 'Java,Spring Boot',
        readmeFile: null,
      },
      onSubmit: async (values) => {
        const titleTr = (values.titleTr || '').trim()
        const titleEn = (values.titleEn || '').trim()
        if (!titleTr && !titleEn) {
          throw new Error(locale === 'tr' ? 'Proje başlığı zorunlu.' : 'Project title is required.')
        }
        const summaryTr = (values.summaryTr || '').trim()
        const summaryEn = (values.summaryEn || '').trim()
        if (!isValidGithubUrl(values.repositoryUrl)) {
          throw new Error(locale === 'tr' ? 'GitHub URL github.com alan adına ait olmalı.' : 'GitHub URL must use a github.com host.')
        }
        const readmeMarkdown = await resolveReadmeMarkdown(values.readmeFile, '')
        if (!readmeMarkdown.trim()) {
          throw new Error(locale === 'tr' ? 'README için .md dosyası seçmelisin.' : 'You must select a .md file for README.')
        }
        const galleryUrls = uniqueUrls(values.galleryUrls)
        if (Array.isArray(values.galleryFiles) && values.galleryFiles.length > 0) {
          for (const file of values.galleryFiles) {
            const uploadedGalleryUrl = await uploadAssetFromFile(file, 'project-gallery', { maxSizeBytes: 8 * 1024 * 1024 })
            if (uploadedGalleryUrl) {
              galleryUrls.push(uploadedGalleryUrl)
            }
          }
        }
        const finalGalleryUrls = uniqueUrls(galleryUrls)
        if (finalGalleryUrls.length === 0) {
          throw new Error(locale === 'tr' ? 'En az bir proje görseli yüklemelisin.' : 'You must upload at least one project image.')
        }
        const coverImageUrl = finalGalleryUrls.includes(values.coverImageUrl)
          ? values.coverImageUrl
          : finalGalleryUrls[0]
        await createAdminProject(accessToken, {
          title: encodeLocalizedText(titleTr, titleEn),
          category: (values.category || 'backend').trim(),
          summary: encodeLocalizedText(summaryTr, summaryEn),
          repositoryUrl: normalizeWebUrl(values.repositoryUrl),
          demoUrl: normalizeWebUrl(values.demoUrl),
          readmeMarkdown: normalizeOptional(readmeMarkdown),
          coverImageUrl,
          galleryImageUrlsCsv: finalGalleryUrls.join(','),
          stackCsv: (values.stackCsv || '').trim(),
          sortOrder: adminProjects.length + 1,
          active: true,
        }, locale)
        return locale === 'tr' ? 'Proje eklendi.' : 'Project created.'
      },
    })
  }

  const handleEditProject = async (row) => {
    const localizedTitle = decodeLocalizedText(row.raw.title || '')
    const localizedSummary = decodeLocalizedText(row.raw.summary || '')
    openEditor({
      title: locale === 'tr' ? 'Projeyi düzenle' : 'Edit project',
      submitLabel: locale === 'tr' ? 'Güncelle' : 'Update',
      fields: [
        { name: 'titleLocalized', trKey: 'titleTr', enKey: 'titleEn', label: locale === 'tr' ? 'Proje başlığı' : 'Project title', type: 'localizedText' },
        { name: 'category', label: locale === 'tr' ? 'Kategori' : 'Category' },
        { name: 'summaryLocalized', trKey: 'summaryTr', enKey: 'summaryEn', label: locale === 'tr' ? 'Özet' : 'Summary', type: 'localizedTextarea', rows: 3 },
        { name: 'repositoryUrl', label: locale === 'tr' ? 'GitHub URL' : 'GitHub URL' },
        { name: 'demoUrl', label: locale === 'tr' ? 'Canlı adres URL' : 'Live address URL' },
        { name: 'galleryManager', label: locale === 'tr' ? 'Görseller' : 'Images', type: 'galleryManager', accept: '.svg,.png,.jpg,.jpeg,.webp,.gif,.avif,image/*' },
        { name: 'stackCsv', label: locale === 'tr' ? 'Stack (csv)' : 'Stack (csv)' },
        { name: 'readmeFile', label: locale === 'tr' ? 'README dosyası (.md)' : 'README file (.md)', type: 'file', accept: '.md,.markdown,text/markdown,text/plain' },
      ],
      initialValues: {
        titleTr: localizedTitle.tr || '',
        titleEn: localizedTitle.en || '',
        category: row.raw.category || 'backend',
        summaryTr: localizedSummary.tr || '',
        summaryEn: localizedSummary.en || '',
        repositoryUrl: row.raw.repositoryUrl || '',
        demoUrl: row.raw.demoUrl || '',
        coverImageUrl: row.raw.coverImageUrl || null,
        galleryUrls: uniqueUrls(Array.isArray(row.raw.galleryImageUrls) && row.raw.galleryImageUrls.length > 0
          ? row.raw.galleryImageUrls
          : (row.raw.coverImageUrl ? [row.raw.coverImageUrl] : [])),
        galleryFiles: [],
        stackCsv: (row.raw.stack || []).join(','),
        readmeFile: null,
        readmeMarkdownExisting: row.raw.readmeMarkdown || '',
      },
      onSubmit: async (values) => {
        const titleTr = (values.titleTr || '').trim()
        const titleEn = (values.titleEn || '').trim()
        if (!titleTr && !titleEn) {
          throw new Error(locale === 'tr' ? 'Proje başlığı zorunlu.' : 'Project title is required.')
        }
        const summaryTr = (values.summaryTr || '').trim()
        const summaryEn = (values.summaryEn || '').trim()
        if (!isValidGithubUrl(values.repositoryUrl)) {
          throw new Error(locale === 'tr' ? 'GitHub URL github.com alan adına ait olmalı.' : 'GitHub URL must use a github.com host.')
        }
        const readmeMarkdown = await resolveReadmeMarkdown(values.readmeFile, values.readmeMarkdownExisting || '')
        const galleryUrls = uniqueUrls(values.galleryUrls)
        if (Array.isArray(values.galleryFiles) && values.galleryFiles.length > 0) {
          for (const file of values.galleryFiles) {
            const uploadedGalleryUrl = await uploadAssetFromFile(file, 'project-gallery', { maxSizeBytes: 8 * 1024 * 1024 })
            if (uploadedGalleryUrl) {
              galleryUrls.push(uploadedGalleryUrl)
            }
          }
        }
        const finalGalleryUrls = uniqueUrls(galleryUrls)
        if (finalGalleryUrls.length === 0) {
          throw new Error(locale === 'tr' ? 'En az bir proje görseli yüklemelisin.' : 'You must upload at least one project image.')
        }
        const coverImageUrl = finalGalleryUrls.includes(values.coverImageUrl)
          ? values.coverImageUrl
          : finalGalleryUrls[0]
        await updateAdminProject(accessToken, row.id, {
          title: encodeLocalizedText(titleTr, titleEn),
          category: (values.category || 'backend').trim(),
          summary: encodeLocalizedText(summaryTr, summaryEn),
          repositoryUrl: normalizeWebUrl(values.repositoryUrl),
          demoUrl: normalizeWebUrl(values.demoUrl),
          readmeMarkdown: normalizeOptional(readmeMarkdown),
          coverImageUrl,
          galleryImageUrlsCsv: finalGalleryUrls.join(','),
          stackCsv: (values.stackCsv || '').trim(),
          sortOrder: Number(row.index) || 1,
          active: true,
        }, locale)
        return locale === 'tr' ? 'Proje güncellendi.' : 'Project updated.'
      },
    })
  }

  const handleDuplicateProject = async (row) => {
    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      const localizedTitle = decodeLocalizedText(row.raw.title || row.title || '')
      await createAdminProject(accessToken, {
        title: encodeLocalizedText(
          `${localizedTitle.tr || localizedTitle.en || row.title} Kopya`,
          `${localizedTitle.en || localizedTitle.tr || row.title} Copy`,
        ),
        category: row.raw.category || 'backend',
        summary: row.raw.summary || '',
        repositoryUrl: normalizeOptional(row.raw.repositoryUrl),
        demoUrl: normalizeOptional(row.raw.demoUrl),
        readmeMarkdown: normalizeOptional(row.raw.readmeMarkdown),
        coverImageUrl: normalizeOptional(row.raw.coverImageUrl),
        galleryImageUrlsCsv: Array.isArray(row.raw.galleryImageUrls) ? row.raw.galleryImageUrls.join(',') : null,
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
    openConfirm({
      title: locale === 'tr' ? 'Projeyi sil' : 'Delete project',
      description: locale === 'tr' ? 'Bu proje kalıcı olarak silinecek. Devam etmek istiyor musun?' : 'This project will be permanently deleted. Continue?',
      confirmLabel: locale === 'tr' ? 'Sil' : 'Delete',
      onConfirm: async () => {
        await deleteAdminProject(accessToken, row.id, locale)
        return locale === 'tr' ? 'Proje silindi.' : 'Project deleted.'
      },
    })
  }

  const handleAddArticle = async () => {
    openEditor({
      title: locale === 'tr' ? 'Yeni yazı ekle' : 'Add new writing',
      submitLabel: locale === 'tr' ? 'Kaydet' : 'Save',
      fields: [
        { name: 'titleLocalized', trKey: 'titleTr', enKey: 'titleEn', label: locale === 'tr' ? 'Yazı başlığı' : 'Article title', type: 'localizedText' },
        { name: 'excerptLocalized', trKey: 'excerptTr', enKey: 'excerptEn', label: locale === 'tr' ? 'Kısa açıklama' : 'Excerpt', type: 'localizedTextarea', rows: 3 },
        { name: 'href', label: 'Medium URL' },
        { name: 'readingTimeLocalized', trKey: 'readingTimeTr', enKey: 'readingTimeEn', label: locale === 'tr' ? 'Okuma süresi' : 'Reading time', type: 'localizedText' },
      ],
      initialValues: {
        titleTr: '',
        titleEn: '',
        excerptTr: '',
        excerptEn: '',
        href: '',
        readingTimeTr: '5 dk okuma',
        readingTimeEn: '5 min read',
      },
      onSubmit: async (values) => {
        const titleTr = (values.titleTr || '').trim()
        const titleEn = (values.titleEn || '').trim()
        if (!titleTr && !titleEn) {
          throw new Error(locale === 'tr' ? 'Yazı başlığı zorunlu.' : 'Article title is required.')
        }
        const excerptTr = (values.excerptTr || '').trim()
        const excerptEn = (values.excerptEn || '').trim()
        const readingTimeTr = (values.readingTimeTr || '').trim()
        const readingTimeEn = (values.readingTimeEn || '').trim()
        await createAdminArticle(accessToken, {
          title: encodeLocalizedText(titleTr, titleEn),
          excerpt: encodeLocalizedText(excerptTr, excerptEn),
          href: normalizeOptional(values.href),
          readingTime: encodeLocalizedText(readingTimeTr, readingTimeEn || '5 min read'),
          publishedAt: new Date().toISOString().slice(0, 10),
          sortOrder: adminArticles.length + 1,
          active: true,
        }, locale)
        return locale === 'tr' ? 'Yazı eklendi.' : 'Article created.'
      },
    })
  }

  const handleEditArticle = async (row) => {
    const localizedTitle = decodeLocalizedText(row.raw.title || '')
    const localizedExcerpt = decodeLocalizedText(row.raw.excerpt || '')
    const localizedReadingTime = decodeLocalizedText(row.raw.readingTime || '')
    openEditor({
      title: locale === 'tr' ? 'Yazıyı düzenle' : 'Edit writing',
      submitLabel: locale === 'tr' ? 'Güncelle' : 'Update',
      fields: [
        { name: 'titleLocalized', trKey: 'titleTr', enKey: 'titleEn', label: locale === 'tr' ? 'Yazı başlığı' : 'Article title', type: 'localizedText' },
        { name: 'excerptLocalized', trKey: 'excerptTr', enKey: 'excerptEn', label: locale === 'tr' ? 'Kısa açıklama' : 'Excerpt', type: 'localizedTextarea', rows: 3 },
        { name: 'href', label: 'Medium URL' },
        { name: 'readingTimeLocalized', trKey: 'readingTimeTr', enKey: 'readingTimeEn', label: locale === 'tr' ? 'Okuma süresi' : 'Reading time', type: 'localizedText' },
      ],
      initialValues: {
        titleTr: localizedTitle.tr || '',
        titleEn: localizedTitle.en || '',
        excerptTr: localizedExcerpt.tr || '',
        excerptEn: localizedExcerpt.en || '',
        href: row.raw.href || '',
        readingTimeTr: localizedReadingTime.tr || '5 dk okuma',
        readingTimeEn: localizedReadingTime.en || '5 min read',
      },
      onSubmit: async (values) => {
        const titleTr = (values.titleTr || '').trim()
        const titleEn = (values.titleEn || '').trim()
        if (!titleTr && !titleEn) {
          throw new Error(locale === 'tr' ? 'Yazı başlığı zorunlu.' : 'Article title is required.')
        }
        const excerptTr = (values.excerptTr || '').trim()
        const excerptEn = (values.excerptEn || '').trim()
        const readingTimeTr = (values.readingTimeTr || '').trim()
        const readingTimeEn = (values.readingTimeEn || '').trim()
        await updateAdminArticle(accessToken, row.id, {
          title: encodeLocalizedText(titleTr, titleEn),
          excerpt: encodeLocalizedText(excerptTr, excerptEn),
          href: normalizeOptional(values.href),
          readingTime: encodeLocalizedText(readingTimeTr, readingTimeEn || '5 min read'),
          publishedAt: row.raw.publishedAt || new Date().toISOString().slice(0, 10),
          sortOrder: Number(row.index) || 1,
          active: true,
        }, locale)
        return locale === 'tr' ? 'Yazı güncellendi.' : 'Article updated.'
      },
    })
  }

  const handleDuplicateArticle = async (row) => {
    setIsBusy(true)
    setAuthError('')
    setAuthInfo('')
    try {
      const localizedTitle = decodeLocalizedText(row.raw.title || row.title || '')
      await createAdminArticle(accessToken, {
        title: encodeLocalizedText(
          `${localizedTitle.tr || localizedTitle.en || row.title} Kopya`,
          `${localizedTitle.en || localizedTitle.tr || row.title} Copy`,
        ),
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
    openConfirm({
      title: locale === 'tr' ? 'Yazıyı sil' : 'Delete writing',
      description: locale === 'tr' ? 'Bu yazı kalıcı olarak silinecek. Devam etmek istiyor musun?' : 'This writing will be permanently deleted. Continue?',
      confirmLabel: locale === 'tr' ? 'Sil' : 'Delete',
      onConfirm: async () => {
        await deleteAdminArticle(accessToken, row.id, locale)
        return locale === 'tr' ? 'Yazı silindi.' : 'Article deleted.'
      },
    })
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

    if (!hasAllowedFileType(selectedFile, ALLOWED_RESUME_MIME_TYPES, ALLOWED_RESUME_EXTENSIONS)) {
      setAuthError(locale === 'tr' ? 'CV dosyası PDF olmalı.' : 'Resume file must be a PDF.')
      return
    }
    if (selectedFile.size <= 0 || selectedFile.size > MAX_RESUME_FILE_BYTES) {
      setAuthError(locale === 'tr' ? 'CV dosyası en fazla 15 MB olabilir.' : 'Resume file must be 15 MB or smaller.')
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
              {toast ? (
                <div className="fixed bottom-5 right-5 z-[130] max-w-sm rounded-2xl border border-emerald-400/30 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-100 shadow-[0_24px_52px_rgba(2,6,23,0.45)]">
                  {toast.message}
                </div>
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
                      <div className="rounded-[1.1rem] border border-white/10 bg-white/[0.02] p-3">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          {locale === 'tr' ? 'İçerik düzenleme dili' : 'Content editing language'}
                        </p>
                        <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
                          {['tr', 'en'].map((lang) => (
                            <button
                              key={`content-lang-${lang}`}
                              type="button"
                              onClick={() => setLocale(lang)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                                locale === lang
                                  ? 'bg-sky-400/15 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.22)]'
                                  : 'text-slate-300 hover:bg-white/6 hover:text-white'
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.02] p-4">
                        <p className="text-sm font-medium text-white">{locale === 'tr' ? 'Hero badge satırları' : 'Hero badge lines'}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {locale === 'tr'
                            ? 'Aktif dil için satırları ekle, düzenle veya sil. Ana sayfada rastgele döner.'
                            : 'Add, edit, or remove lines for the active language. They rotate randomly on home.'}
                        </p>
                        <div className="mt-4 space-y-2">
                          {(heroBadgeDraft[locale] || ['']).map((line, index) => (
                            <div key={`hero-badge-${locale}-${index}`} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={line}
                                onChange={(event) => handleHeroBadgeLineChange(locale, index, event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                                placeholder={locale === 'tr' ? `Satır ${index + 1}` : `Line ${index + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => removeHeroBadgeLine(locale, index)}
                                className="rounded-full border border-red-400/16 bg-red-400/8 px-3 py-2 text-xs text-red-100"
                              >
                                {locale === 'tr' ? 'Sil' : 'Delete'}
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => addHeroBadgeLine(locale)}
                          className="mt-3 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-slate-200"
                        >
                          {locale === 'tr' ? 'Satır ekle' : 'Add line'}
                        </button>
                      </div>
                      <Field label={locale === 'tr' ? 'Ana başlık' : 'Primary title'} value={heroDraft.fullName} readOnly={false} onChange={handleHeroDraftChange('fullName')} />
                      <Field label={locale === 'tr' ? 'Alt başlık' : 'Subtitle'} value={heroDraft.title} readOnly={false} onChange={handleHeroDraftChange('title')} />
                      <Field label={locale === 'tr' ? 'Açıklama' : 'Description'} large value={heroDraft.description} readOnly={false} onChange={handleHeroDraftChange('description')} />
                      <Field label="CTA" value={heroDraft.ctaLabel} readOnly={false} onChange={handleHeroDraftChange('ctaLabel')} />
                      <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.02] p-4">
                        <p className="text-sm font-medium text-white">{locale === 'tr' ? 'Sayfa başlık metinleri' : 'Page heading copy'}</p>
                        <p className="mt-1 text-xs text-slate-400">{locale === 'tr' ? 'Her sayfa için üst etiket, başlık ve açıklama alanlarını düzenle.' : 'Manage eyebrow, title, and description for each public page.'}</p>
                        <div className="mt-4 space-y-3">
                          {[
                            ['projects', locale === 'tr' ? 'Projeler' : 'Projects'],
                            ['writings', locale === 'tr' ? 'Yazılar' : 'Writings'],
                            ['resume', locale === 'tr' ? 'Özgeçmiş' : 'Resume'],
                            ['contact', locale === 'tr' ? 'İletişim' : 'Contact'],
                          ].map(([pageKey, pageLabel]) => (
                            <div key={pageKey} className="rounded-xl border border-white/10 bg-slate-950/45 p-3">
                              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">{pageLabel}</p>
                              <div className="grid gap-3">
                                <Field label={locale === 'tr' ? 'Üst etiket' : 'Eyebrow'} value={pageSectionDraft[pageKey]?.eyebrow || ''} readOnly={false} onChange={handlePageSectionDraftChange(pageKey, 'eyebrow')} />
                                <Field label={locale === 'tr' ? 'Başlık' : 'Title'} value={pageSectionDraft[pageKey]?.title || ''} readOnly={false} onChange={handlePageSectionDraftChange(pageKey, 'title')} />
                                <Field label={locale === 'tr' ? 'Açıklama' : 'Description'} large value={pageSectionDraft[pageKey]?.description || ''} readOnly={false} onChange={handlePageSectionDraftChange(pageKey, 'description')} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
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
                            <button type="button" onClick={() => handleArchiveTech(item)} className="rounded-full border border-red-400/16 bg-red-400/8 px-3 py-1 text-xs text-red-100">{locale === 'tr' ? 'Sil' : 'Delete'}</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AdminSection>

              <AdminSection id="projects" data={sections.projects}><Inventory rows={projectRows} labels={locale === 'tr' ? ['Düzenle', 'Kopyala', 'Sil'] : ['Edit', 'Duplicate', 'Delete']} addLabel={locale === 'tr' ? 'Proje ekle' : 'Add project'} hasStack emptyLabel={locale === 'tr' ? 'Henüz proje verisi yok.' : 'No project data yet.'} onAdd={handleAddProject} onEdit={handleEditProject} onDuplicate={handleDuplicateProject} onArchive={handleArchiveProject} /></AdminSection>
              <AdminSection id="writings" data={sections.writings}><Inventory rows={writingRows} labels={locale === 'tr' ? ['Düzenle', 'Kopyala', 'Sil'] : ['Edit', 'Duplicate', 'Delete']} addLabel={locale === 'tr' ? 'Yazı ekle' : 'Add article'} emptyLabel={locale === 'tr' ? 'Henüz yazı verisi yok.' : 'No writing data yet.'} showDuplicate={false} onAdd={handleAddArticle} onEdit={handleEditArticle} onArchive={handleArchiveArticle} /></AdminSection>

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
                    <h3 className="mt-4 text-3xl font-semibold">{adminHero?.fullName || 'Fatih Özkurt'}</h3>
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
                <div className="mt-4 rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
                  <p className="text-sm font-medium text-white">{locale === 'tr' ? 'Hesap ayarları' : 'Account settings'}</p>
                  <p className="mt-1 text-sm text-slate-400">{locale === 'tr' ? 'Kullanıcı adı ve şifreni güvenli biçimde güncelle.' : 'Update username and password securely.'}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="block space-y-1.5">
                      <span className="relative -top-1 pl-3 text-sm text-slate-300">{locale === 'tr' ? 'Mevcut şifre' : 'Current password'}</span>
                      <div className="relative">
                        <input
                          type={showCurrentCredentialPassword ? 'text' : 'password'}
                          value={credentialsDraft.currentPassword}
                          onChange={handleCredentialsDraftChange('currentPassword')}
                          className="password-field w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-slate-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentCredentialPassword((current) => !current)}
                          className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                          aria-label={showCurrentCredentialPassword ? (locale === 'tr' ? 'Şifreyi gizle' : 'Hide password') : (locale === 'tr' ? 'Şifreyi göster' : 'Show password')}
                        >
                          {showCurrentCredentialPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </label>
                    <Field label={locale === 'tr' ? 'Yeni kullanıcı adı (opsiyonel)' : 'New username (optional)'} value={credentialsDraft.newUsername} readOnly={false} onChange={handleCredentialsDraftChange('newUsername')} />
                    <label className="block space-y-1.5 md:col-span-2">
                      <span className="relative -top-1 pl-3 text-sm text-slate-300">{locale === 'tr' ? 'Yeni şifre (opsiyonel)' : 'New password (optional)'}</span>
                      <div className="relative">
                        <input
                          type={showNewCredentialPassword ? 'text' : 'password'}
                          value={credentialsDraft.newPassword}
                          onChange={handleCredentialsDraftChange('newPassword')}
                          className="password-field w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-slate-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewCredentialPassword((current) => !current)}
                          className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                          aria-label={showNewCredentialPassword ? (locale === 'tr' ? 'Şifreyi gizle' : 'Hide password') : (locale === 'tr' ? 'Şifreyi göster' : 'Show password')}
                        >
                          {showNewCredentialPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </label>
                  </div>
                  <div className="mt-4">
                    <button type="button" onClick={handleUpdateCredentials} className="button-primary rounded-full px-5 py-2.5 text-sm font-semibold">
                      {locale === 'tr' ? 'Hesap bilgilerini güncelle' : 'Update account credentials'}
                    </button>
                  </div>
                </div>
              </AdminSection>
            </div>
          </div>
          <AdminEditorModal
            modal={editorModal}
            values={editorValues}
            error={editorError}
            onChange={(name, value) => setEditorValues((current) => ({ ...current, [name]: value }))}
            onClose={closeEditor}
            onSubmit={submitEditor}
            busy={isBusy}
            locale={locale}
          />
          <AdminConfirmModal
            modal={confirmModal}
            onClose={closeConfirm}
            onConfirm={submitConfirm}
            busy={isBusy}
            locale={locale}
          />
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
            <div className="space-y-4"><h1 className="text-5xl font-semibold tracking-tight text-white md:text-6xl">{copy.adminLogin}</h1><p className="max-w-xl text-base leading-8 text-slate-300 md:text-lg">{copy.description}</p></div>
          </section>
          <section className="glass-card rounded-[2rem] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">{forgotMode ? copy.passwordReset : copy.adminLogin}</p>
            {forgotMode ? (
              <form className="mt-6 space-y-5" onSubmit={handleForgotPassword}>
                <p className="text-sm leading-7 text-slate-400">{copy.resetHint}</p>
                {authError ? <p className="text-sm text-rose-300">{authError}</p> : null}
                {authInfo ? <p className="text-sm text-emerald-300">{authInfo}</p> : null}
                <button type="submit" disabled={!canSendReset || isBusy} className="button-primary w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-55">{isBusy ? (locale === 'tr' ? 'Gönderiliyor...' : 'Sending...') : copy.sendResetLink}</button>
                <button type="button" onClick={() => setForgotMode(false)} className="w-full rounded-full border border-white/10 bg-white/6 px-6 py-3 text-sm text-slate-200">{copy.backToLogin}</button>
              </form>
            ) : (
              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <label className="block space-y-1.5"><span className="relative -top-1 pl-3 text-sm text-slate-300">{copy.username}</span><input name="username" type="text" autoComplete="username" value={form.username} onChange={handleChange} placeholder="antesionn" className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" /></label>
                <label className="block space-y-1.5">
                  <span className="relative -top-1 pl-3 text-sm text-slate-300">{copy.password}</span>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 8 + Aa + 0-9 + symbol"
                      className="password-field w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                      aria-label={showPassword ? (locale === 'tr' ? 'Şifreyi gizle' : 'Hide password') : (locale === 'tr' ? 'Şifreyi göster' : 'Show password')}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </label>
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



