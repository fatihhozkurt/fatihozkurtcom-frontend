import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Cloud,
  FileDown,
  Github,
  Languages,
  Linkedin,
  Mail,
  Menu,
  PenSquare,
  ServerCog,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { startTransition, useEffect, useEffectEvent, useMemo, useState } from 'react'
import { AuthPortal } from './components/AuthPortal'
import { BackgroundEffects, InfoCard, Section, SectionHeading, TechPill } from './components/Chrome'
import { ProjectModal } from './components/ProjectModal'
import { uiText } from './locales'
import { getArticles, getContactLinks, getNavigationItems, getProjects, techStack } from './siteContent'

const contactIconMap = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  'pen-square': PenSquare,
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

function PublicSite({ locale, setLocale }) {
  const text = uiText[locale]
  const navigationItems = useMemo(() => getNavigationItems(locale), [locale])
  const projects = useMemo(() => getProjects(locale), [locale])
  const articles = useMemo(() => getArticles(locale), [locale])
  const contactLinks = useMemo(() => getContactLinks(locale), [locale])
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? null)
  const [projectModalOpen, setProjectModalOpen] = useState(false)

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects[0],
    [projects, selectedProjectId],
  )

  const handleObserverEntries = useEffectEvent((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.35) {
        return
      }

      const sectionId = entry.target.getAttribute('data-section')
      setActiveSection(sectionId)
    })
  })

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('[data-section]'))
    const observer = new IntersectionObserver(handleObserverEntries, {
      threshold: [0.35, 0.55, 0.8],
      rootMargin: '-12% 0px -20% 0px',
    })

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setProjectModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll('[data-reveal]'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    revealNodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [locale])

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false)

    const header = document.querySelector('header')
    const target = document.getElementById(sectionId)

    if (!target) {
      return
    }

    const headerOffset = header ? header.getBoundingClientRect().height : 0
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth',
    })
  }

  const openProject = (projectId) => {
    startTransition(() => {
      setSelectedProjectId(projectId)
      setProjectModalOpen(true)
    })
  }

  return (
    <div className="site-shell min-h-screen bg-obsidian text-slate-100">
      <BackgroundEffects />
      <header className="intro-fade sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,10,18,0.7)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <button type="button" onClick={() => scrollToSection('home')} className="flex items-center gap-3 text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/30 bg-white/5 text-sm font-semibold tracking-[0.3em] text-sky-200">FO</span>
            <span>
              <span className="block text-sm font-medium text-white">Fatih Ozkurt</span>
              <span className="block text-xs uppercase tracking-[0.3em] text-slate-400">{text.brandSubtitle}</span>
            </span>
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`rounded-full px-4 py-2 text-sm ${activeSection === item.id ? 'bg-sky-400/15 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.22)]' : 'text-slate-300 hover:bg-white/6 hover:text-white'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <LanguageSwitch locale={locale} setLocale={setLocale} labels={text.lang} />
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 md:hidden"
            aria-label="Open navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-white/10 bg-[rgba(8,10,18,0.92)] px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2">
              <div className="pb-2">
                <LanguageSwitch locale={locale} setLocale={setLocale} labels={text.lang} />
              </div>
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-left text-sm text-slate-200"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main className="relative z-10">
        <Section id="home" className="overflow-hidden pt-24 md:pt-32">
          <div className="relative">
            <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col items-center justify-start pt-8 text-center md:pt-2">
              <div
                data-reveal
                className="reveal inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-orange-100"
                style={{ '--reveal-delay': '120ms' }}
              >
                <Sparkles size={14} />
                {text.hero.currentCandidate}
              </div>
              <div
                data-reveal
                className="reveal mt-8 rounded-[2.5rem] border border-white/8 bg-white/[0.025] px-6 py-10 shadow-[0_30px_100px_rgba(2,6,23,0.32)] backdrop-blur-[2px] md:px-12 md:py-14"
                style={{ '--reveal-delay': '220ms' }}
              >
                <h1 className="mx-auto max-w-5xl font-display text-6xl font-semibold leading-[0.9] tracking-tight text-white md:text-[7.5rem] md:leading-[0.88]">
                  {text.hero.name}
                </h1>
                <p className="mt-2 text-[1.25rem] font-medium uppercase tracking-[0.16em] text-sky-200/72 md:text-[1.7rem]">
                  {text.hero.title}
                </p>
                <p className="mx-auto max-w-3xl pt-6 text-base leading-8 text-slate-300 md:text-lg">{text.hero.description}</p>
              </div>
              <div
                data-reveal
                className="reveal mt-6 flex flex-wrap items-center justify-center gap-3"
                style={{ '--reveal-delay': '320ms' }}
              >
                <button
                  type="button"
                  onClick={() => scrollToSection('about')}
                  className="button-primary inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold"
                >
                  {text.hero.explore}
                  <ArrowUpRight size={16} className="ml-2" />
                </button>
              </div>

              <div data-reveal className="reveal mt-20 w-full max-w-5xl" style={{ '--reveal-delay': '380ms' }}>
                <div className="mb-8 flex items-center gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-sky-100">
                    <Sparkles size={14} />
                    {text.hero.originalBaseline}
                  </span>
                  <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(125,211,252,0.18),transparent)]" />
                </div>

                <div className="text-left">
                  <div className="max-w-4xl space-y-8 md:space-y-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-orange-100">
                      <Sparkles size={14} />
                      {text.hero.welcome}
                    </div>
                    <div className="space-y-0">
                      <h1 className="max-w-4xl font-display text-6xl font-semibold leading-[0.92] tracking-tight text-white md:text-8xl md:leading-[0.9]">
                        {text.hero.name}
                      </h1>
                      <p className="-mt-2 text-[1.38rem] font-medium text-sky-200/72 md:-mt-3 md:text-[2.18rem]">
                        {text.hero.title}
                      </p>
                      <p className="max-w-2xl pt-4 text-base leading-8 text-slate-300 md:pt-5 md:text-lg">{text.hero.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => scrollToSection('about')}
                        className="button-primary inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold"
                      >
                        {text.hero.explore}
                        <ArrowUpRight size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="about" className="pt-20 md:pt-28">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div data-reveal className="reveal">
              <SectionHeading
                eyebrow={text.sections.about.eyebrow}
                title={text.sections.about.title}
                description={text.sections.about.description}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div data-reveal className="reveal" style={{ '--reveal-delay': '40ms' }}>
                <InfoCard
                  icon={ShieldCheck}
                  title={text.sections.about.cards.security.title}
                  description={text.sections.about.cards.security.description}
                />
              </div>
              <div data-reveal className="reveal" style={{ '--reveal-delay': '100ms' }}>
                <InfoCard
                  icon={ChartNoAxesCombined}
                  title={text.sections.about.cards.observability.title}
                  description={text.sections.about.cards.observability.description}
                />
              </div>
              <div data-reveal className="reveal" style={{ '--reveal-delay': '160ms' }}>
                <InfoCard
                  icon={ServerCog}
                  title={text.sections.about.cards.service.title}
                  description={text.sections.about.cards.service.description}
                />
              </div>
              <div data-reveal className="reveal" style={{ '--reveal-delay': '220ms' }}>
                <InfoCard
                  icon={Cloud}
                  title={text.sections.about.cards.delivery.title}
                  description={text.sections.about.cards.delivery.description}
                />
              </div>
            </div>
          </div>
          <div data-reveal className="reveal mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] py-5" style={{ '--reveal-delay': '120ms' }}>
            <div className="marquee-track flex min-w-max gap-4 px-4">
              {[...techStack, ...techStack].map((item, index) => (
                <TechPill key={`${item.name}-${index}`} item={item} />
              ))}
            </div>
          </div>
        </Section>

        <Section id="projects" className="pt-20 md:pt-28">
          <div className="space-y-10">
            <div data-reveal className="reveal">
              <SectionHeading
                eyebrow={text.sections.projects.eyebrow}
                title={text.sections.projects.title}
                description={text.sections.projects.description}
              />
            </div>
            <div className="grid items-stretch gap-6 lg:grid-cols-3">
              {projects.map((project, index) => (
                <div key={project.id} data-reveal className="reveal" style={{ '--reveal-delay': `${60 + index * 90}ms` }}>
                  <article className="surface-card group relative flex min-h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 transition hover:-translate-y-1 hover:border-sky-300/25">
                    <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,_rgba(253,186,116,0.18),transparent_58%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),transparent_58%)]" />
                    <div className="relative flex h-full flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{project.category}</p>
                          <h3 className="mt-3 min-h-[5.5rem] text-2xl font-semibold text-white">{project.title}</h3>
                        </div>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">0{index + 1}</span>
                      </div>
                      <div className="mt-6 rounded-[1.75rem] border border-white/8 bg-slate-950/55 p-5">
                        <div className="mb-5 rounded-[1.5rem] border border-dashed border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.02),rgba(255,255,255,0.08))] px-5 py-10 text-center">
                          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{text.sections.projects.visualPlaceholder}</p>
                          <p className="mt-3 text-lg font-semibold text-slate-100">{project.accent}</p>
                        </div>
                        <p className="min-h-[9.5rem] text-sm leading-7 text-slate-300">{project.summary}</p>
                      </div>
                      <div className="mt-6 flex min-h-[4.5rem] flex-wrap content-start gap-2">
                        {project.stack.map((item) => (
                          <span key={`${project.id}-${item}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center gap-3 pt-7">
                        <a href={project.repository} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
                          <Github size={16} />
                          {text.sections.projects.github}
                        </a>
                        <button type="button" onClick={() => openProject(project.id)} className="button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                          {text.sections.projects.openDetails}
                          <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="writings" className="pt-20 md:pt-28">
          <div className="space-y-10">
            <div data-reveal className="reveal">
              <SectionHeading
                eyebrow={text.sections.writings.eyebrow}
                title={text.sections.writings.title}
                description={text.sections.writings.description}
              />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {articles.map((article, index) => (
                <div key={article.id} data-reveal className="reveal" style={{ '--reveal-delay': `${50 + index * 90}ms` }}>
                  <a href={article.href} target="_blank" rel="noreferrer" className={`surface-card group block rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 transition hover:-translate-y-1 hover:border-orange-300/25 ${index > 0 ? 'surface-card-delayed' : ''}`}>
                    <div className="inline-flex rounded-full border border-orange-300/15 bg-orange-300/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-orange-100">{article.readingTime}</div>
                    <h3 className="mt-6 text-2xl font-semibold text-white">{article.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{article.excerpt}</p>
                    <div className="mt-8 inline-flex items-center gap-2 text-sm text-sky-200">
                      {text.sections.writings.readOnMedium}
                      <ArrowUpRight size={16} />
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="resume" className="pt-20 md:pt-28">
          <div className="space-y-10">
            <div data-reveal className="reveal">
              <SectionHeading
                eyebrow={text.sections.resume.eyebrow}
                title={text.sections.resume.title}
                description={text.sections.resume.description}
              />
            </div>
            <div data-reveal className="reveal glass-card rounded-[2rem] p-5 md:p-8" style={{ '--reveal-delay': '110ms' }}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/45 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{text.sections.resume.currentCv}</p>
                  <p className="mt-2 text-lg font-semibold text-white">fatih-ozkurt-cv.pdf</p>
                </div>
                <button type="button" className="button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold">
                  <FileDown size={16} />
                  {text.sections.resume.downloadCv}
                </button>
              </div>
              <div className="resume-sheet rounded-[1.75rem] border border-white/10 bg-[#f5f5f1] p-6 text-slate-950 md:p-10">
                <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{text.sections.resume.preview}</p>
                    <h3 className="mt-4 text-4xl font-semibold">Fatih Ozkurt</h3>
                    <p className="mt-3 text-lg text-slate-700">{text.hero.title}</p>
                    <p className="mt-8 max-w-xl text-sm leading-7 text-slate-700">{text.sections.resume.previewDescription}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-300 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{text.sections.resume.highlights}</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                      {text.sections.resume.highlightItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="contact" className="min-h-0 pb-24 pt-20 md:pt-28" divider={false}>
          <div className="grid items-start gap-10 xl:grid-cols-[0.78fr_1.02fr] xl:grid-rows-[auto_1fr] xl:gap-x-12 xl:gap-y-8">
            <div data-reveal className="reveal xl:col-span-2 xl:row-start-1">
              <SectionHeading
                className="max-w-5xl"
                eyebrow={text.sections.contact.eyebrow}
                title={text.sections.contact.title}
                description={text.sections.contact.description}
              />
            </div>
            <div className="grid gap-4 xl:col-start-1 xl:row-start-2">
              {contactLinks.map((link, index) => {
                const Icon = contactIconMap[link.icon] ?? Mail

                return (
                  <div key={link.label} data-reveal className="reveal" style={{ '--reveal-delay': `${50 + index * 80}ms` }}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                      className={`surface-card block rounded-[1.6rem] border border-white/10 bg-white/[0.045] px-5 py-4 transition hover:border-sky-300/20 hover:bg-white/[0.07] ${index > 1 ? 'surface-card-delayed' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-sky-400/10 text-sky-200">
                          <Icon size={18} />
                        </span>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{link.label}</p>
                          <p className="mt-2 text-base text-white">{link.value}</p>
                        </div>
                      </div>
                    </a>
                  </div>
                )
              })}
            </div>
            <div data-reveal className="reveal glass-card h-fit place-self-start self-start rounded-[2rem] p-6 md:p-8 xl:col-start-2 xl:row-start-2" style={{ '--reveal-delay': '120ms' }}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">{text.sections.contact.titleLabel}</span>
                  <input type="text" placeholder={text.sections.contact.subjectPlaceholder} className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">{text.sections.contact.emailLabel}</span>
                  <input type="email" placeholder={text.sections.contact.emailPlaceholder} className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" />
                </label>
              </div>
              <label className="mt-5 block space-y-2">
                <span className="text-sm text-slate-300">{text.sections.contact.contentLabel}</span>
                <textarea rows="6" placeholder={text.sections.contact.contentPlaceholder} className="w-full rounded-[1.6rem] border border-white/10 bg-slate-950/45 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-slate-500" />
              </label>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="button" className="button-primary rounded-full px-6 py-3 text-sm font-semibold">
                  {text.sections.contact.sendMessage}
                </button>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-4 py-8 text-center text-sm text-slate-500 md:px-8">
        <p>{text.footer.copyright}</p>
        <p className="mt-2">{text.footer.note}</p>
      </footer>
      {projectModalOpen && selectedProject ? (
        <ProjectModal
          project={selectedProject}
          onClose={() => setProjectModalOpen(false)}
          text={{
            projectVisual: text.sections.projects.visualPlaceholder,
            github: text.sections.projects.github,
            liveSurface: locale === 'tr' ? 'Canli yuzey' : 'Live surface',
            readmeView: locale === 'tr' ? 'README gorunumu' : 'README rendering view',
          }}
        />
      ) : null}
    </div>
  )
}

function App() {
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') {
      return 'en'
    }

    return window.localStorage.getItem('ui-locale') ?? 'en'
  })

  useEffect(() => {
    window.localStorage.setItem('ui-locale', locale)
    document.documentElement.lang = locale
  }, [locale])

  if (window.location.pathname === '/auth') {
    return <AuthPortal locale={locale} setLocale={setLocale} text={uiText[locale].auth} langLabels={uiText[locale].lang} />
  }

  return <PublicSite locale={locale} setLocale={setLocale} />
}

export default App
