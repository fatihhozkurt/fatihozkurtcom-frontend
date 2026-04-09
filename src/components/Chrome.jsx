import {
  ChartNoAxesCombined,
  Cloud,
  Database,
  ScanSearch,
  ServerCog,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { createElement } from 'react'
import { BrandIcon } from './BrandIcon'

const stackIconMap = {
  backend: ServerCog,
  security: ShieldCheck,
  database: Database,
  cache: Database,
  observability: ChartNoAxesCombined,
  platform: Cloud,
  storage: Database,
  frontend: Sparkles,
}

export function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(253,186,116,0.07),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(147,197,253,0.05),transparent_34%)]" />
      <div className="fog-layer absolute inset-0 opacity-90" />
      <div className="dot-layer absolute inset-0 opacity-65" />
      <div className="vignette-layer absolute inset-0" />
    </div>
  )
}

export function Section({ id, className = '', children, divider = true }) {
  return (
    <section
      id={id}
      data-section={id}
      className={`relative mx-auto max-w-7xl scroll-mt-28 px-4 pb-8 md:px-8 md:pb-12 ${className}`}
    >
      {children}
      {divider ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-4 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),rgba(125,211,252,0.22),rgba(255,255,255,0.08),transparent)] md:inset-x-8"
        />
      ) : null}
    </section>
  )
}

export function SectionHeading({ eyebrow, title, description, className = '' }) {
  return (
    <div className={`max-w-3xl space-y-4 ${className}`}>
      <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{eyebrow}</p>
      <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="text-base leading-8 text-slate-300 md:text-lg">{description}</p>
    </div>
  )
}

export function InfoCard({ icon: Icon, title, description }) {
  return (
    <article className="surface-card flex h-full min-h-[18.6rem] flex-col rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-sky-400/10 text-sky-200">
        {createElement(Icon, { size: 20 })}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </article>
  )
}

export function TechPill({ item }) {
  const stackIcon = stackIconMap[item.category] ?? Sparkles

  return (
    <div className="surface-card inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/65 px-4 py-3 text-sm text-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-sky-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <BrandIcon name={item.name} iconKey={item.icon} fallback={stackIcon} size={16} />
      </span>
      <span className="font-medium">{item.name}</span>
    </div>
  )
}
