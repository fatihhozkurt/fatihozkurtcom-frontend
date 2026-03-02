import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Cloud,
  FileDown,
  Github,
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
import { articles, contactLinks, navigationItems, projects, techStack } from './siteContent'

const contactIconMap = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  'pen-square': PenSquare,
}

function PublicSite() {
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? null)
  const [projectModalOpen, setProjectModalOpen] = useState(false)

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects[0],
    [selectedProjectId],
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
  }, [])

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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <button type="button" onClick={() => scrollToSection('home')} className="flex items-center gap-3 text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/30 bg-white/5 text-sm font-semibold tracking-[0.3em] text-sky-200">FO</span>
            <span>
              <span className="block text-sm font-medium text-white">Fatih Ozkurt</span>
              <span className="block text-xs uppercase tracking-[0.3em] text-slate-400">backend portfolio</span>
            </span>
          </button>

          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
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
            <div className="max-w-4xl space-y-8 md:space-y-10">
              <div data-reveal className="reveal inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-orange-100" style={{ '--reveal-delay': '120ms' }}>
                <Sparkles size={14} />
                Welcome to my corner of the internet
              </div>
              <div data-reveal className="reveal space-y-0" style={{ '--reveal-delay': '220ms' }}>
                <h1 className="max-w-4xl font-display text-6xl font-semibold leading-[0.92] tracking-tight text-white md:text-8xl md:leading-[0.9]">Fatih Ozkurt</h1>
                <p className="-mt-2 text-[1.38rem] font-medium text-sky-200/72 md:-mt-3 md:text-[2.18rem]">Java Backend Developer</p>
                <p className="max-w-2xl pt-4 text-base leading-8 text-slate-300 md:pt-5 md:text-lg">Secure APIs, disciplined service design, and modern product thinking with a strong focus on reliability, observability, and security.</p>
              </div>
              <div data-reveal className="reveal flex flex-wrap gap-3 pt-2" style={{ '--reveal-delay': '320ms' }}>
                <button type="button" onClick={() => scrollToSection('projects')} className="button-primary inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold">
                  Explore
                  <ArrowUpRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </Section>

        <Section id="about" className="pt-20 md:pt-28">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div data-reveal className="reveal">
              <SectionHeading eyebrow="About" title="Backend-first engineering, presented with product-level taste." description="I care about the structure behind the interface: clean contracts, predictable behavior, operational visibility, and security decisions that survive real usage." />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div data-reveal className="reveal" style={{ '--reveal-delay': '40ms' }}>
                <InfoCard icon={ShieldCheck} title="Security-minded by default" description="Rate limits, DTO boundaries, token rotation, CSRF-aware flows, and a deliberate reduction of exposed surface area." />
              </div>
              <div data-reveal className="reveal" style={{ '--reveal-delay': '100ms' }}>
                <InfoCard icon={ChartNoAxesCombined} title="Observability built in" description="Visits, security events, failed logins, and operational logs should be measurable and searchable from day one." />
              </div>
              <div data-reveal className="reveal" style={{ '--reveal-delay': '160ms' }}>
                <InfoCard icon={ServerCog} title="Disciplined service design" description="Layered Spring structure, readable domain boundaries, and enough abstraction to scale without inventing accidental complexity." />
              </div>
              <div data-reveal className="reveal" style={{ '--reveal-delay': '220ms' }}>
                <InfoCard icon={Cloud} title="Delivery-aware implementation" description="Profiles, Dockerized runtime, env-driven configuration, and externalized assets keep deployment predictable." />
              </div>
            </div>
          </div>
          <div data-reveal className="reveal mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] py-5" style={{ '--reveal-delay': '120ms' }}>
            <div className="marquee-track flex min-w-max gap-4 px-4">
              {[...techStack, ...techStack].map((item, index) => <TechPill key={`${item.name}-${index}`} item={item} />)}
            </div>
          </div>
        </Section>

        <Section id="projects" className="pt-20 md:pt-28">
          <div className="space-y-10">
            <div data-reveal className="reveal">
              <SectionHeading eyebrow="Projects" title="Cards for scanning, deeper views for technical texture." description="Each project opens into a larger overlay so README-like content can still breathe without breaking the one-page flow." />
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
                          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">visual placeholder</p>
                          <p className="mt-3 text-lg font-semibold text-slate-100">{project.accent}</p>
                        </div>
                        <p className="min-h-[9.5rem] text-sm leading-7 text-slate-300">{project.summary}</p>
                      </div>
                      <div className="mt-6 flex min-h-[4.5rem] flex-wrap content-start gap-2">
                        {project.stack.map((item) => <span key={`${project.id}-${item}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{item}</span>)}
                      </div>
                      <div className="mt-auto flex items-center gap-3 pt-7">
                        <a href={project.repository} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
                          <Github size={16} />
                          GitHub
                        </a>
                      <button type="button" onClick={() => openProject(project.id)} className="button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                        Open details
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
              <SectionHeading eyebrow="Medium" title="Writing that matches the engineering style." description="Concise, opinionated articles around contracts, authentication, observability, and making backend choices that stay readable later." />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {articles.map((article, index) => (
                <div key={article.id} data-reveal className="reveal" style={{ '--reveal-delay': `${50 + index * 90}ms` }}>
                  <a href={article.href} target="_blank" rel="noreferrer" className={`surface-card group block rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 transition hover:-translate-y-1 hover:border-orange-300/25 ${index > 0 ? 'surface-card-delayed' : ''}`}>
                    <div className="inline-flex rounded-full border border-orange-300/15 bg-orange-300/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-orange-100">{article.readingTime}</div>
                    <h3 className="mt-6 text-2xl font-semibold text-white">{article.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{article.excerpt}</p>
                    <div className="mt-8 inline-flex items-center gap-2 text-sm text-sky-200">
                      Read on Medium
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
              <SectionHeading eyebrow="Resume" title="Prepared for a PDF-backed CV viewer." description="This area is designed to hold a MinIO-served PDF in production. For now, the interface shows the intended viewer frame, metadata strip, and download action." />
            </div>
            <div data-reveal className="reveal glass-card rounded-[2rem] p-5 md:p-8" style={{ '--reveal-delay': '110ms' }}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/45 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Current CV</p>
                  <p className="mt-2 text-lg font-semibold text-white">fatih-ozkurt-cv.pdf</p>
                </div>
                <button type="button" className="button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold">
                  <FileDown size={16} />
                  Download CV
                </button>
              </div>
              <div className="resume-sheet rounded-[1.75rem] border border-white/10 bg-[#f5f5f1] p-6 text-slate-950 md:p-10">
                <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Preview</p>
                    <h3 className="mt-4 text-4xl font-semibold">Fatih Ozkurt</h3>
                    <p className="mt-3 text-lg text-slate-700">Java Backend Developer</p>
                    <p className="mt-8 max-w-xl text-sm leading-7 text-slate-700">This viewer frame is intentionally styled as a production-ready CV container. Once the backend asset pipeline is wired, the embedded PDF can replace this placeholder sheet without changing the surrounding layout.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-300 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Highlights</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                      <li>Spring Boot API design and layered service architecture</li>
                      <li>Security-first authentication and content management thinking</li>
                      <li>Dockerized delivery with PostgreSQL, Redis, MinIO, and logs</li>
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
              <SectionHeading className="max-w-5xl" eyebrow="Contact" title="Easy to reach. Structured enough to scale." description="Public links stay visible, while the contact form area is already framed for backend delivery and secure outbound communication." />
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
                  <span className="text-sm text-slate-300">Title</span>
                  <input type="text" placeholder="Subject" className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Email</span>
                  <input type="email" placeholder="you@example.com" className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" />
                </label>
              </div>
              <label className="mt-5 block space-y-2">
                <span className="text-sm text-slate-300">Content</span>
                <textarea rows="6" placeholder="Tell me about the role, the product, or the problem space." className="w-full rounded-[1.6rem] border border-white/10 bg-slate-950/45 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-slate-500" />
              </label>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="button" className="button-primary rounded-full px-6 py-3 text-sm font-semibold">
                  Send message
                </button>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-4 py-8 text-center text-sm text-slate-500 md:px-8">Designed as a public surface for a backend engineer who still cares how systems feel.</footer>
      {projectModalOpen && selectedProject ? <ProjectModal project={selectedProject} onClose={() => setProjectModalOpen(false)} /> : null}
    </div>
  )
}

function App() {
  if (window.location.pathname === '/auth') {
    return <AuthPortal />
  }

  return <PublicSite />
}

export default App
