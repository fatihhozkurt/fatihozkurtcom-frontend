import { Eye, EyeOff, KeyRound, Languages } from 'lucide-react'
import { useMemo, useState } from 'react'
import { resetPassword } from '../apiClient'

const PASSWORD_PATTERN = /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[^\p{L}\d]).{8,}$/u

const copyByLocale = {
  en: {
    title: 'Reset password',
    description: 'Set a strong new password for your hidden admin workspace.',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    submit: 'Update password',
    invalidToken: 'Reset token is missing or invalid. Open the latest link from your inbox.',
    mismatch: 'Passwords do not match.',
    policy: 'Minimum 8 chars with uppercase, lowercase, number, and symbol.',
    success: 'Password updated. You can now sign in from /auth.',
    back: 'Go to /auth',
    show: 'Show password',
    hide: 'Hide password',
  },
  tr: {
    title: 'Şifre sıfırla',
    description: 'Gizli admin alanı için güçlü bir yeni şifre belirle.',
    newPassword: 'Yeni şifre',
    confirmPassword: 'Yeni şifre (tekrar)',
    submit: 'Şifreyi güncelle',
    invalidToken: 'Reset token bulunamadı veya geçersiz. Gelen kutusundaki son bağlantıyı aç.',
    mismatch: 'Şifreler eşleşmiyor.',
    policy: 'En az 8 karakter: büyük, küçük, sayı ve sembol içermeli.',
    success: 'Şifre güncellendi. Artık /auth üzerinden giriş yapabilirsin.',
    back: '/auth sayfasına git',
    show: 'Şifreyi göster',
    hide: 'Şifreyi gizle',
  },
}

function resolveResetToken() {
  if (typeof window === 'undefined') {
    return ''
  }
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const hashToken = hash.get('token')
  if (hashToken) {
    return hashToken.trim()
  }
  const query = new URLSearchParams(window.location.search)
  return (query.get('token') || '').trim()
}

export function ResetPasswordPortal({ locale = 'en', setLocale, langLabels }) {
  const copy = copyByLocale[locale] ?? copyByLocale.en
  const token = useMemo(() => resolveResetToken(), [])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [showFirst, setShowFirst] = useState(false)
  const [showSecond, setShowSecond] = useState(false)

  const canSubmit =
    token.length > 0 &&
    PASSWORD_PATTERN.test(newPassword) &&
    confirmPassword.length > 0 &&
    !busy

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setInfo('')
    if (!token) {
      setError(copy.invalidToken)
      return
    }
    if (newPassword !== confirmPassword) {
      setError(copy.mismatch)
      return
    }
    if (!PASSWORD_PATTERN.test(newPassword)) {
      setError(copy.policy)
      return
    }

    setBusy(true)
    try {
      await resetPassword({ token, newPassword }, locale)
      setInfo(copy.success)
      setNewPassword('')
      setConfirmPassword('')
    } catch (submissionError) {
      setError(submissionError?.message || copy.invalidToken)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="site-shell min-h-screen bg-obsidian text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-12 md:px-8">
        <section className="glass-card w-full rounded-[2rem] p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-orange-100">
              <KeyRound size={14} />
              {copy.title}
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-[3px]">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400">
                <Languages size={13} />
              </span>
              {['tr', 'en'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLocale(lang)}
                  aria-pressed={locale === lang}
                  className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                    locale === lang ? 'bg-sky-400/15 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.22)]' : 'text-slate-300 hover:bg-white/6 hover:text-white'
                  }`}
                >
                  {langLabels[lang]}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-300">{copy.description}</p>
          {!token ? <p className="mt-4 text-sm text-rose-300">{copy.invalidToken}</p> : null}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block space-y-1.5">
              <span className="relative -top-1 pl-3 text-sm text-slate-300">{copy.newPassword}</span>
              <div className="relative">
                <input
                  type={showFirst ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  className="password-field w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 pr-12 text-sm text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowFirst((current) => !current)}
                  className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                  aria-label={showFirst ? copy.hide : copy.show}
                >
                  {showFirst ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            <label className="block space-y-1.5">
              <span className="relative -top-1 pl-3 text-sm text-slate-300">{copy.confirmPassword}</span>
              <div className="relative">
                <input
                  type={showSecond ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  className="password-field w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 pr-12 text-sm text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowSecond((current) => !current)}
                  className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                  aria-label={showSecond ? copy.hide : copy.show}
                >
                  {showSecond ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            <p className="text-sm text-slate-400">{copy.policy}</p>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            {info ? <p className="text-sm text-emerald-300">{info}</p> : null}

            <button type="submit" disabled={!canSubmit} className="button-primary w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-55">
              {busy ? '...' : copy.submit}
            </button>
            <a href="/auth" className="block text-center text-sm text-slate-400 underline decoration-white/10 underline-offset-4">
              {copy.back}
            </a>
          </form>
        </section>
      </div>
    </div>
  )
}
