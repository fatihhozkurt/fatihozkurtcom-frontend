import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Cloud,
  FileText,
  Github,
  Languages,
  Linkedin,
  Mail,
  Menu,
  ServerCog,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { IconArticle, IconFolderQuestion } from '@tabler/icons-react'
import { createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getPublicAbout,
  getPublicArticles,
  getPublicContactProfile,
  getPublicHero,
  getPublicPageSections,
  getPublicProjectDetail,
  getPublicProjects,
  getPublicResume,
  getPublicTechStack,
  postPublicContactMessage,
  postVisit,
} from './apiClient'
import { AuthPortal } from './components/AuthPortal'
import { BrandIcon } from './components/BrandIcon'
import { BackgroundEffects, InfoCard, Section, SectionHeading, TechPill } from './components/Chrome'
import { ProjectModal } from './components/ProjectModal'
import { ResetPasswordPortal } from './components/ResetPasswordPortal'
import { uiText } from './locales'
import { getArticles, getContactLinks, getNavigationItems, getProjects } from './siteContent'

const contactIconMap = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
}

const ADMIN_ROUTE = '/auth'
const ADMIN_RESET_ROUTE = '/auth/reset-password'

function safeList(value) {
  return Array.isArray(value) ? value : []
}

function normalizePathname(pathname) {
  const raw = String(pathname || '/').trim() || '/'
  const collapsed = raw.replace(/\/{2,}/g, '/')
  if (collapsed.length > 1 && collapsed.endsWith('/')) {
    return collapsed.slice(0, -1)
  }
  return collapsed
}

const LOCALIZED_PREFIX = '__I18N__'

function decodeLocalizedText(value) {
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

function localizedText(value, locale) {
  const decoded = decodeLocalizedText(value)
  return locale === 'tr' ? (decoded.tr || decoded.en) : (decoded.en || decoded.tr)
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

function extractRegionFromLanguageTag(value) {
  const candidate = String(value || '').split(';')[0].trim()
  if (!candidate || candidate === '*') {
    return null
  }
  const parts = candidate.split('-')
  const region = parts.find((part) => /^[A-Za-z]{2}$/.test(part))
  return region ? region.toUpperCase() : null
}

const TIMEZONE_REGION_FALLBACK = {
  'Europe/Istanbul': 'TR',
  'Europe/Berlin': 'DE',
  'Europe/Amsterdam': 'NL',
  'Europe/London': 'GB',
  'America/New_York': 'US',
  'America/Los_Angeles': 'US',
  'Asia/Dubai': 'AE',
}

function resolveVisitCountryHint() {
  if (typeof navigator !== 'undefined') {
    const languageCandidates = [navigator.language, ...(Array.isArray(navigator.languages) ? navigator.languages : [])]
    for (const candidate of languageCandidates) {
      const region = extractRegionFromLanguageTag(candidate)
      if (region) {
        return region
      }
    }
  }

  if (typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function') {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone && TIMEZONE_REGION_FALLBACK[timezone]) {
      return TIMEZONE_REGION_FALLBACK[timezone]
    }
  }

  return 'Unknown'
}

function parseHeroBadgeLines(candidate) {
  if (!candidate || typeof candidate !== 'string') {
    return []
  }
  return candidate
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function randomIndex(length, currentIndex = -1) {
  if (!length || length < 1) {
    return 0
  }

  if (length === 1) {
    return 0
  }

  let nextIndex = currentIndex
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * length)
  }
  return nextIndex
}

function resolveLocalizedContent(content, locale) {
  if (!content || typeof content !== 'object') {
    return null
  }

  const fromTranslations = content.translations?.[locale]
  if (fromTranslations && typeof fromTranslations === 'object') {
    return {
      ...content,
      ...fromTranslations,
    }
  }

  const fromLocalized = content.localized?.[locale]
  if (fromLocalized && typeof fromLocalized === 'object') {
    return {
      ...content,
      ...fromLocalized,
    }
  }

  const declaredLocale = String(content.locale || content.language || '').toLowerCase()
  if (declaredLocale && !declaredLocale.startsWith(locale)) {
    return null
  }

  return content
}

function normalizeProjectReadme(readmeMarkdown, locale) {
  const defaultSections =
    locale === 'tr'
      ? [
          {
            title: 'Teknik notlar',
            items: ['README içeriği bu alana backend üzerinden yüklenecek.'],
          },
        ]
      : [
          {
            title: 'Technical notes',
            items: ['README content will be delivered here from backend data.'],
          },
        ]

  if (!readmeMarkdown || !readmeMarkdown.trim()) {
    return {
      intro:
        locale === 'tr'
          ? 'Bu proje için detay içerik backend tarafında hazır olduğunda burada gösterilecek.'
          : 'Detailed project content will be displayed here when backend data is available.',
      sections: defaultSections,
    }
  }

  const lines = readmeMarkdown
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const introLines = []
  const sections = []
  let currentSection = null

  lines.forEach((line) => {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection)
      }
      currentSection = {
        title: line.replace(/^##\s+/, '').trim(),
        items: [],
      }
      return
    }

    if (line.startsWith('# ')) {
      return
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!currentSection) {
        currentSection = {
          title: locale === 'tr' ? 'Detaylar' : 'Details',
          items: [],
        }
      }
      currentSection.items.push(line.slice(2).trim())
      return
    }

    if (currentSection) {
      currentSection.items.push(line)
      return
    }

    introLines.push(line)
  })

  if (currentSection) {
    sections.push(currentSection)
  }

  const normalizedSections = sections.filter((section) => section.items.length > 0)
  return {
    intro:
      introLines.join(' ') ||
      (locale === 'tr'
        ? 'Bu proje için detay içerik backend tarafında hazır olduğunda burada gösterilecek.'
        : 'Detailed project content will be displayed here when backend data is available.'),
    sections: normalizedSections.length > 0 ? normalizedSections : defaultSections,
  }
}

function mapProjectSummary(project, locale) {
  const coverImageUrl = project.coverImageUrl || '/project-surface.svg'
  const galleryImageUrls = safeList(project.galleryImageUrls).filter(Boolean)
  return {
    id: project.id,
    category: project.category,
    title: localizedText(project.title, locale),
    summary: localizedText(project.summary, locale),
    stack: safeList(project.stack),
    repository: project.repositoryUrl || '#',
    liveUrl: project.demoUrl || '#',
    coverImageUrl,
    galleryImageUrls: galleryImageUrls.length > 0 ? galleryImageUrls : [coverImageUrl],
    readme: normalizeProjectReadme(localizedText(project.readmeMarkdown, locale), locale),
  }
}

function mapProjectDetail(project, locale) {
  const coverImageUrl = project.coverImageUrl || '/project-surface.svg'
  const galleryImageUrls = safeList(project.galleryImageUrls).filter(Boolean)
  return {
    id: project.id,
    category: project.category,
    title: localizedText(project.title, locale),
    summary: localizedText(project.summary, locale),
    stack: safeList(project.stack),
    repository: project.repositoryUrl || '#',
    liveUrl: project.demoUrl || '#',
    coverImageUrl,
    galleryImageUrls: galleryImageUrls.length > 0 ? galleryImageUrls : [coverImageUrl],
    readme: normalizeProjectReadme(localizedText(project.readmeMarkdown, locale), locale),
  }
}

function LanguageSwitch({ locale, setLocale, labels }) {
  return (
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
          {labels[lang]}
        </button>
      ))}
    </div>
  )
}

function SectionLink({ href, onNavigate, className, children, ...props }) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault()
        onNavigate()
      }}
      className={className}
      {...props}
    >
      {children}
    </a>
  )
}

function EmptyCardsPlaceholder({ icon: PlaceholderIcon, message }) {
  return (
    <div className="surface-card rounded-[1.6rem] border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10 text-sky-200/80">
        {createElement(PlaceholderIcon, { size: 26, stroke: 1.7 })}
      </div>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300/80 md:text-base">{message}</p>
    </div>
  )
}

function CharacterSticker({ src, className = '' }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="eager"
      decoding="async"
      className={`pointer-events-none select-none object-contain ${className}`}
    />
  )
}

const DESKTOP_LIST_PAGE_SIZE = 6
const MOBILE_LIST_PAGE_SIZE = 3
const MOBILE_MEDIA_QUERY = '(max-width: 767px)'
const HERO_BADGE_ROTATE_MS = 10000

function PublicSite({ locale, setLocale }) {
  const text = uiText[locale]
  const navigationItems = useMemo(() => getNavigationItems(locale), [locale])
  const fallbackProjects = useMemo(() => getProjects(locale), [locale])
  const fallbackArticles = useMemo(() => getArticles(locale), [locale])
  const fallbackContactLinks = useMemo(() => getContactLinks(locale), [locale])
  const [heroContent, setHeroContent] = useState(null)
  const [aboutContent, setAboutContent] = useState(null)
  const [techItems, setTechItems] = useState([])
  const [projects, setProjects] = useState(fallbackProjects)
  const [articles, setArticles] = useState(fallbackArticles)
  const [resumeContent, setResumeContent] = useState(null)
  const [pageSections, setPageSections] = useState({})
  const [contactLinks, setContactLinks] = useState(fallbackContactLinks)
  const [contactForm, setContactForm] = useState({
    title: '',
    email: '',
    content: '',
  })
  const [contactState, setContactState] = useState({
    type: null,
    message: '',
  })
  const [projectDetailById, setProjectDetailById] = useState({})
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState(fallbackProjects[0]?.id ?? null)
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [projectPage, setProjectPage] = useState(1)
  const [writingPage, setWritingPage] = useState(1)
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false
    }
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches
  })
  const [techPaused, setTechPaused] = useState(false)
  const [techDragging, setTechDragging] = useState(false)
  const techScrollerRef = useRef(null)
  const techTrackRef = useRef(null)
  const techResumeTimeoutRef = useRef(null)
  const techIntervalRef = useRef(null)
  const techDragRef = useRef({
    active: false,
    dragging: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
  })

  const effectiveSelectedProjectId =
    selectedProjectId && projects.some((project) => project.id === selectedProjectId)
      ? selectedProjectId
      : projects[0]?.id ?? null

  const selectedProject = useMemo(
    () => {
      const summary = projects.find((project) => project.id === effectiveSelectedProjectId) ?? projects[0]
      if (!summary) {
        return null
      }

      return projectDetailById[summary.id] ? { ...summary, ...projectDetailById[summary.id] } : summary
    },
    [effectiveSelectedProjectId, projectDetailById, projects],
  )
  const listPageSize = isMobileViewport ? MOBILE_LIST_PAGE_SIZE : DESKTOP_LIST_PAGE_SIZE
  const totalProjectPages = Math.max(1, Math.ceil(projects.length / listPageSize))
  const totalWritingPages = Math.max(1, Math.ceil(articles.length / listPageSize))
  const effectiveProjectPage = Math.min(projectPage, totalProjectPages)
  const effectiveWritingPage = Math.min(writingPage, totalWritingPages)
  const visibleProjects = useMemo(() => {
    const start = (effectiveProjectPage - 1) * listPageSize
    return projects.slice(start, start + listPageSize)
  }, [effectiveProjectPage, listPageSize, projects])
  const visibleArticles = useMemo(() => {
    const start = (effectiveWritingPage - 1) * listPageSize
    return articles.slice(start, start + listPageSize)
  }, [articles, effectiveWritingPage, listPageSize])
  const shouldLoopTechRail = techItems.length >= 5
  const techRailCopies = shouldLoopTechRail ? 3 : 1
  const renderedTechItems = useMemo(() => {
    if (!shouldLoopTechRail) {
      return techItems
    }
    return Array.from({ length: techRailCopies }, () => techItems).flat()
  }, [shouldLoopTechRail, techItems, techRailCopies])

  const resolvedHeroContent = useMemo(() => resolveLocalizedContent(heroContent, locale), [heroContent, locale])
  const resolvedAboutContent = useMemo(() => resolveLocalizedContent(aboutContent, locale), [aboutContent, locale])
  const heroBadgeLines = useMemo(() => {
    const backendLocalizedBadge = localizedText(resolvedHeroContent?.welcomeText, locale)
    const backendLines = parseHeroBadgeLines(backendLocalizedBadge)
    if (backendLines.length > 0) {
      return backendLines
    }
    return safeList(text.hero.rotatingLines).filter(Boolean)
  }, [locale, resolvedHeroContent?.welcomeText, text.hero.rotatingLines])
  const [heroBadgeLineIndex, setHeroBadgeLineIndex] = useState(() => randomIndex(safeList(uiText.en.hero.rotatingLines).length))
  const heroBadgeLine = heroBadgeLines[heroBadgeLineIndex] || localizedText(resolvedHeroContent?.welcomeText, locale) || text.hero.currentCandidate
  const resolveSectionHeading = useCallback(
    (sectionKey, fallback) => {
      const dynamic = pageSections[String(sectionKey || '').toLowerCase()]
      if (!dynamic) {
        return fallback
      }
      return {
        ...fallback,
        eyebrow: dynamic.eyebrow || fallback.eyebrow,
        title: dynamic.title || fallback.title,
        description: dynamic.description || fallback.description,
      }
    },
    [pageSections],
  )

  useEffect(() => {
    let cancelled = false

    const loadPublicContent = async () => {
      try {
        const [
          heroResponse,
          aboutResponse,
          pageSectionResponse,
          techResponse,
          projectsResponse,
          articlesResponse,
          resumeResponse,
          contactProfileResponse,
        ] = await Promise.all([
          getPublicHero(locale),
          getPublicAbout(locale),
          getPublicPageSections(locale),
          getPublicTechStack(locale),
          getPublicProjects(locale),
          getPublicArticles(locale),
          getPublicResume(locale),
          getPublicContactProfile(locale),
        ])

        if (cancelled) {
          return
        }

        setHeroContent(heroResponse)
        setAboutContent(aboutResponse)
        const nextPageSections = {}
        safeList(pageSectionResponse).forEach((item) => {
          if (item?.pageKey) {
            nextPageSections[String(item.pageKey).toLowerCase()] = item
          }
        })
        setPageSections(nextPageSections)
        const mappedTech = safeList(techResponse).map((item) => ({
          name: item.name,
          category: item.category || 'backend',
          icon: item.iconName,
        }))
        setTechItems(mappedTech)
        const mappedProjects = safeList(projectsResponse).map((project) => mapProjectSummary(project, locale))
        setProjects(mappedProjects)

        const mappedArticles = safeList(articlesResponse).map((article) => ({
          id: article.id,
          title: localizedText(article.title, locale),
          excerpt: localizedText(article.excerpt, locale),
          readingTime: localizedText(article.readingTime, locale) || (locale === 'tr' ? 'Okuma' : 'Read'),
          href: article.href,
        }))
        setArticles(mappedArticles)
        setResumeContent(resumeResponse)

        const normalizedMail = contactProfileResponse.email?.trim()
        const normalizedLinkedin = contactProfileResponse.linkedinUrl?.trim()
        const normalizedGithub = contactProfileResponse.githubUrl?.trim()
        const normalizedMedium = contactProfileResponse.mediumUrl?.trim()

        const mailSubject = locale === 'tr' ? 'İş teklifimiz hakkında' : 'About our job offer'
        setContactLinks([
          {
            label: locale === 'tr' ? 'E-posta' : 'Mail',
            value: normalizedMail || '-',
            href: normalizedMail ? `mailto:${normalizedMail}?subject=${encodeURIComponent(mailSubject)}` : '#',
            icon: 'mail',
          },
          {
            label: 'LinkedIn',
            value: normalizedLinkedin
              ? normalizedLinkedin.replace(/^https?:\/\//, '')
              : '-',
            href: normalizedLinkedin || '#',
            icon: 'linkedin',
          },
          {
            label: 'GitHub',
            value: normalizedGithub
              ? normalizedGithub.replace(/^https?:\/\//, '')
              : '-',
            href: normalizedGithub || '#',
            icon: 'github',
          },
          {
            label: 'Medium',
            value: normalizedMedium
              ? normalizedMedium.replace(/^https?:\/\//, '')
              : '-',
            href: normalizedMedium || '#',
            icon: 'medium',
          },
        ])
      } catch (error) {
        if (!cancelled) {
          console.warn('Public content load failed.', error)
          setTechItems([])
          setProjects([])
          setArticles([])
          setContactLinks([
            { label: locale === 'tr' ? 'E-posta' : 'Mail', value: '-', href: '#', icon: 'mail' },
            { label: 'LinkedIn', value: '-', href: '#', icon: 'linkedin' },
            { label: 'GitHub', value: '-', href: '#', icon: 'github' },
            { label: 'Medium', value: '-', href: '#', icon: 'medium' },
          ])
        }
      }
    }

    loadPublicContent()
    return () => {
      cancelled = true
    }
  }, [locale])

  useEffect(() => {
    postVisit(
      {
        path: window.location.pathname || '/',
        country: resolveVisitCountryHint(),
      },
      locale,
    ).catch(() => {})
  }, [locale])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY)
    const handleChange = (event) => {
      setIsMobileViewport(event.matches)
    }

    setIsMobileViewport(mediaQuery.matches)
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  useEffect(() => {
    setProjectPage(1)
  }, [locale, projects.length])

  useEffect(() => {
    setWritingPage(1)
  }, [articles.length, locale])

  useEffect(() => {
    setHeroBadgeLineIndex(randomIndex(heroBadgeLines.length))
  }, [heroBadgeLines.length, locale])

  useEffect(() => {
    if (heroBadgeLines.length <= 1) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setHeroBadgeLineIndex((current) => randomIndex(heroBadgeLines.length, current))
    }, HERO_BADGE_ROTATE_MS)

    return () => window.clearInterval(intervalId)
  }, [heroBadgeLines.length])

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('[data-section]'))
    if (sections.length === 0) {
      return undefined
    }

    const resolveActiveSection = () => {
      const header = document.querySelector('header')
      const headerOffset = header ? header.getBoundingClientRect().height : 0
      const probeLine = window.scrollY + headerOffset + 120
      const defaultSection = sections[0]?.getAttribute('data-section') || 'home'
      let nextSection = defaultSection

      sections.forEach((section) => {
        const sectionId = section.getAttribute('data-section')
        if (!sectionId) {
          return
        }

        if (probeLine >= section.offsetTop) {
          nextSection = sectionId
        }
      })

      const lastSectionId = sections[sections.length - 1]?.getAttribute('data-section')
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (nearBottom && lastSectionId) {
        nextSection = lastSectionId
      }

      return nextSection
    }

    const syncActiveSection = () => {
      const nextSection = resolveActiveSection()
      setActiveSection((current) => (current === nextSection ? current : nextSection))
    }

    syncActiveSection()
    window.addEventListener('scroll', syncActiveSection, { passive: true })
    window.addEventListener('resize', syncActiveSection)

    return () => {
      window.removeEventListener('scroll', syncActiveSection)
      window.removeEventListener('resize', syncActiveSection)
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
    if (revealNodes.length === 0) {
      return undefined
    }

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
        threshold: 0,
        rootMargin: '0px 0px 48% 0px',
      },
    )

    revealNodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [locale, projects, articles, contactLinks, techItems, heroContent, aboutContent, resumeContent, projectPage, writingPage])

  const scrollToSection = useCallback((sectionId) => {
    setMobileMenuOpen(false)
    setActiveSection(sectionId)

    const header = document.querySelector('header')
    const target = document.getElementById(sectionId)

    if (!target) {
      return
    }

    const headerOffset = header ? header.getBoundingClientRect().height : 0
    const sectionTopOffset = window.innerWidth >= 1024 ? 18 : window.innerWidth >= 768 ? 16 : 12
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset - sectionTopOffset

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth',
    })
  }, [])

  useEffect(() => {
    const hashTarget = (window.location.hash || '').replace('#', '').trim()
    if (!hashTarget) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      scrollToSection(hashTarget)
    }, 180)

    return () => window.clearTimeout(timeoutId)
  }, [scrollToSection])

  const openProject = async (projectId) => {
    setSelectedProjectId(projectId)
    setProjectModalOpen(true)

    if (!projectDetailById[projectId]) {
      try {
        const detail = await getPublicProjectDetail(projectId, locale)
        setProjectDetailById((current) => ({
          ...current,
          [projectId]: mapProjectDetail(detail, locale),
        }))
      } catch (error) {
        console.warn('Project detail API failed. Modal will use summary fallback.', error)
      }
    }
  }

  const getTechLoopWidth = () => {
    const track = techTrackRef.current
    if (!track) {
      return 0
    }

    return track.scrollWidth / techRailCopies
  }

  const normalizeTechScrollLeft = (value, loopWidth) => {
    if (!shouldLoopTechRail) {
      return value
    }
    if (loopWidth <= 0) {
      return value
    }

    if (value < loopWidth * 0.5) {
      return value + loopWidth
    }

    if (value > loopWidth * 1.5) {
      return value - loopWidth
    }

    return value
  }

  const pauseTechScroll = () => {
    if (techResumeTimeoutRef.current) {
      clearTimeout(techResumeTimeoutRef.current)
      techResumeTimeoutRef.current = null
    }
    setTechPaused(true)
  }

  const resumeTechScroll = (delay = 0) => {
    if (techResumeTimeoutRef.current) {
      clearTimeout(techResumeTimeoutRef.current)
    }
    techResumeTimeoutRef.current = setTimeout(() => {
      setTechPaused(false)
      techResumeTimeoutRef.current = null
    }, delay)
  }

  useEffect(() => {
    return () => {
      if (techResumeTimeoutRef.current) {
        clearTimeout(techResumeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const container = techScrollerRef.current
    if (!container) {
      return undefined
    }

    const syncTechPosition = () => {
      const loopWidth = getTechLoopWidth()
      if (shouldLoopTechRail && loopWidth > 0) {
        container.scrollLeft = loopWidth
        return
      }
      container.scrollLeft = 0
    }

    syncTechPosition()

    const resizeObserver = new ResizeObserver(() => {
      syncTechPosition()
    })

    const track = techTrackRef.current
    if (track) {
      resizeObserver.observe(track)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [shouldLoopTechRail, techRailCopies, techItems.length])

  useEffect(() => {
    if (!shouldLoopTechRail) {
      if (techIntervalRef.current) {
        clearInterval(techIntervalRef.current)
        techIntervalRef.current = null
      }
      return undefined
    }

    if (techPaused) {
      if (techIntervalRef.current) {
        clearInterval(techIntervalRef.current)
        techIntervalRef.current = null
      }
      return undefined
    }

    const container = techScrollerRef.current
    if (!container) {
      return undefined
    }

    techIntervalRef.current = setInterval(() => {
      const loopWidth = getTechLoopWidth()
      if (!loopWidth) {
        return
      }

      container.scrollLeft = normalizeTechScrollLeft(container.scrollLeft + 0.8, loopWidth)
    }, 16)

    return () => {
      if (techIntervalRef.current) {
        clearInterval(techIntervalRef.current)
        techIntervalRef.current = null
      }
    }
  }, [shouldLoopTechRail, techPaused])

  const handleTechWheel = (event) => {
    if (!shouldLoopTechRail) {
      return
    }
    const container = techScrollerRef.current
    const loopWidth = getTechLoopWidth()
    if (!container) {
      return
    }

    const delta = event.deltaX !== 0 ? event.deltaX : event.shiftKey ? event.deltaY : 0
    if (delta === 0) {
      return
    }

    event.preventDefault()
    pauseTechScroll()
    container.scrollLeft = normalizeTechScrollLeft(container.scrollLeft + delta, loopWidth)
    resumeTechScroll(180)
  }

  const handleTechPointerDown = (event) => {
    if (!shouldLoopTechRail) {
      return
    }
    const container = techScrollerRef.current
    if (!container) {
      return
    }

    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    container.setPointerCapture?.(event.pointerId)
    pauseTechScroll()
    setTechDragging(true)
    techDragRef.current = {
      active: true,
      dragging: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: container.scrollLeft,
    }
  }

  const handleTechPointerMove = (event) => {
    const container = techScrollerRef.current
    const loopWidth = getTechLoopWidth()
    const dragState = techDragRef.current
    if (!container || !dragState.active || dragState.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - dragState.startX
    if (!dragState.dragging && Math.abs(deltaX) < 3) {
      return
    }

    dragState.dragging = true
    event.preventDefault()
    container.scrollLeft = normalizeTechScrollLeft(dragState.startScrollLeft - deltaX, loopWidth)
  }

  const handleTechPointerEnd = (event) => {
    const container = techScrollerRef.current
    const dragState = techDragRef.current
    if (!dragState.active || dragState.pointerId !== event.pointerId) {
      return
    }

    container?.releasePointerCapture?.(event.pointerId)
    techDragRef.current = {
      active: false,
      dragging: false,
      pointerId: null,
      startX: 0,
      startScrollLeft: 0,
    }
    setTechDragging(false)
    resumeTechScroll(180)
  }

  const handleContactChange = (event) => {
    const { name, value } = event.target
    setContactForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()
    if (!contactForm.title.trim() || !contactForm.email.trim() || !contactForm.content.trim()) {
      setContactState({
        type: 'error',
        message: locale === 'tr' ? 'Lütfen tüm alanları doldur.' : 'Please fill in all fields.',
      })
      return
    }
    if (!isValidEmail(contactForm.email)) {
      setContactState({
        type: 'error',
        message: locale === 'tr' ? 'Geçerli bir e-posta adresi gir.' : 'Enter a valid email address.',
      })
      return
    }

    try {
      await postPublicContactMessage(
        {
          title: contactForm.title.trim(),
          email: contactForm.email.trim(),
          content: contactForm.content.trim(),
        },
        locale,
      )
      setContactState({
        type: 'success',
        message: locale === 'tr' ? 'Mesajın başarıyla gönderildi.' : 'Your message has been sent successfully.',
      })
      setContactForm({
        title: '',
        email: '',
        content: '',
      })
    } catch (error) {
      setContactState({
        type: 'error',
        message: error.message || (locale === 'tr' ? 'Mesaj gönderilemedi.' : 'Message could not be sent.'),
      })
    }
  }

  return (
    <div className="site-shell min-h-screen bg-obsidian text-slate-100">
      <BackgroundEffects />
      <a
        href="#main-content"
        className="skip-link absolute left-4 top-4 z-[80] rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950"
      >
        {text.accessibility.skipToContent}
      </a>
      <header className="intro-fade sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,10,18,0.7)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <SectionLink href="#home" onNavigate={() => scrollToSection('home')} className="flex items-center gap-3 text-left">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-sky-400/30 bg-white/5 p-[2px]">
              <img src="/brand-fo-icon.png" alt="" aria-hidden="true" className="h-full w-full rounded-xl object-contain" />
            </span>
            <span>
              <span className="block text-sm font-medium text-white">{resolvedHeroContent?.fullName || text.hero.name}</span>
              <span className="block text-xs uppercase tracking-[0.3em] text-slate-400">{text.brandSubtitle}</span>
            </span>
          </SectionLink>

          <nav
            aria-label={text.accessibility.primaryNavigation}
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 md:ml-auto md:mr-12 md:flex lg:mr-16"
          >
            {navigationItems.map((item) => (
              <SectionLink
                key={item.id}
                href={`#${item.id}`}
                onNavigate={() => scrollToSection(item.id)}
                aria-current={activeSection === item.id ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-sm ${activeSection === item.id ? 'bg-sky-400/15 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.22)]' : 'text-slate-300 hover:bg-white/6 hover:text-white'}`}
              >
                {item.label}
              </SectionLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 md:hidden"
            aria-label={mobileMenuOpen ? text.accessibility.closeNavigation : text.accessibility.openNavigation}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-4 hidden items-center md:flex md:right-8">
          <div aria-label={text.accessibility.languageSwitcher} className="pointer-events-auto">
            <LanguageSwitch locale={locale} setLocale={setLocale} labels={text.lang} />
          </div>
        </div>

        {mobileMenuOpen ? (
          <div id="mobile-navigation" className="border-t border-white/10 bg-[rgba(8,10,18,0.92)] px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2">
              <div className="pb-2" aria-label={text.accessibility.languageSwitcher}>
                <LanguageSwitch locale={locale} setLocale={setLocale} labels={text.lang} />
              </div>
              {navigationItems.map((item) => (
                <SectionLink
                  key={item.id}
                  href={`#${item.id}`}
                  onNavigate={() => scrollToSection(item.id)}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm ${
                    activeSection === item.id
                      ? 'border-sky-300/25 bg-sky-400/15 text-white'
                      : 'border-white/8 bg-white/4 text-slate-200'
                  }`}
                >
                  {item.label}
                </SectionLink>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main id="main-content" className="relative z-10">
        <Section id="home" className="overflow-hidden pt-24 md:pt-32">
          <div className="relative">
            <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col items-center justify-start pt-8 text-center md:pt-2">
              <div
                data-reveal
                className="reveal relative z-30 inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-orange-100"
                style={{ '--reveal-delay': '120ms' }}
              >
                <Sparkles size={14} />
                <span key={`${locale}-${heroBadgeLineIndex}-${heroBadgeLine}`} className="hero-badge-line">
                  {heroBadgeLine}
                </span>
              </div>
              <div
                data-reveal
                className="reveal relative mt-8 rounded-[2.5rem] border border-white/8 bg-white/[0.025] px-6 py-10 shadow-[0_30px_100px_rgba(2,6,23,0.32)] backdrop-blur-[2px] md:px-12 md:py-14"
                style={{ '--reveal-delay': '220ms' }}
              >
                <CharacterSticker src="/avatars/home-laptop.png" className="character-ghost character-sticker character-home" />
                <h1 className="mx-auto max-w-5xl font-display text-6xl font-semibold leading-[0.9] tracking-tight text-white md:text-[7.5rem] md:leading-[0.88]">
                  {resolvedHeroContent?.fullName || text.hero.name}
                </h1>
                <p className="mt-2 text-[1.25rem] font-medium uppercase tracking-[0.16em] text-sky-200/72 md:text-[1.7rem]">
                  {resolvedHeroContent?.title || text.hero.title}
                </p>
                <p className="mx-auto max-w-3xl pt-6 text-base leading-8 text-slate-300 md:text-lg">
                  {resolvedHeroContent?.description || text.hero.description}
                </p>
              </div>
              <div
                data-reveal
                className="reveal mt-6 flex flex-wrap items-center justify-center gap-3"
                style={{ '--reveal-delay': '320ms' }}
              >
                <SectionLink
                  href="#about"
                  onNavigate={() => scrollToSection('about')}
                  className="button-primary inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold"
                >
                  {resolvedHeroContent?.ctaLabel || text.hero.explore}
                  <ArrowUpRight size={16} className="ml-2" />
                </SectionLink>
              </div>
            </div>
          </div>
        </Section>

        <Section id="about" className="pt-20 md:pt-28">
          <div className="relative z-10 grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div data-reveal className="reveal">
              <SectionHeading
                eyebrow={resolvedAboutContent?.eyebrow || text.sections.about.eyebrow}
                title={resolvedAboutContent?.title || text.sections.about.title}
                description={resolvedAboutContent?.description || text.sections.about.description}
              />
            </div>
            <div className="relative grid gap-4 md:grid-cols-2 md:[grid-auto-rows:1fr]">
              <div data-reveal className="reveal h-full" style={{ '--reveal-delay': '40ms' }}>
                <InfoCard
                  icon={ShieldCheck}
                  title={text.sections.about.cards.security.title}
                  description={text.sections.about.cards.security.description}
                />
              </div>
              <div data-reveal className="reveal h-full" style={{ '--reveal-delay': '100ms' }}>
                <InfoCard
                  icon={ChartNoAxesCombined}
                  title={text.sections.about.cards.observability.title}
                  description={text.sections.about.cards.observability.description}
                />
              </div>
              <div data-reveal className="reveal h-full" style={{ '--reveal-delay': '160ms' }}>
                <InfoCard
                  icon={ServerCog}
                  title={text.sections.about.cards.service.title}
                  description={text.sections.about.cards.service.description}
                />
              </div>
              <div data-reveal className="reveal h-full" style={{ '--reveal-delay': '220ms' }}>
                <InfoCard
                  icon={Cloud}
                  title={text.sections.about.cards.delivery.title}
                  description={text.sections.about.cards.delivery.description}
                />
              </div>
            </div>
          </div>
          <div data-reveal className="reveal relative mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] py-5" style={{ '--reveal-delay': '120ms' }}>
            <CharacterSticker src="/avatars/about-knight.png" className="character-ghost-faint character-sticker character-about" />
            <div
              ref={techScrollerRef}
              className={`marquee-shell hide-scrollbar overflow-x-auto px-4 select-none touch-pan-y ${techPaused ? 'is-paused' : ''} ${techDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onWheel={handleTechWheel}
              onPointerDown={handleTechPointerDown}
              onPointerMove={handleTechPointerMove}
              onPointerUp={handleTechPointerEnd}
              onPointerCancel={handleTechPointerEnd}
              onLostPointerCapture={handleTechPointerEnd}
            >
              <div ref={techTrackRef} className="marquee-track flex min-w-max gap-4">
                {renderedTechItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
                    {locale === 'tr' ? 'Henüz görünür tech stack verisi yok.' : 'No visible tech stack data yet.'}
                  </div>
                ) : (
                  renderedTechItems.map((item, index) => (
                    <TechPill key={`${item.name}-${index}`} item={item} />
                  ))
                )}
              </div>
            </div>
          </div>
        </Section>

        <Section id="projects" className="pt-20 md:pt-28">
          <div className="relative z-10 space-y-10">
            <div data-reveal className="reveal">
              <SectionHeading
                eyebrow={resolveSectionHeading('projects', text.sections.projects).eyebrow}
                title={resolveSectionHeading('projects', text.sections.projects).title}
                description={resolveSectionHeading('projects', text.sections.projects).description}
              />
            </div>
            {projects.length === 0 ? (
              <div data-reveal className="reveal relative" style={{ '--reveal-delay': '60ms' }}>
                <EmptyCardsPlaceholder icon={IconFolderQuestion} message={text.sections.projects.emptyPlaceholder} />
              </div>
            ) : (
              <>
              <div className="projects-rail hide-scrollbar -mx-1 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto pb-2 md:mx-0 md:grid md:overflow-visible md:pb-0 md:grid-cols-2 xl:grid-cols-3">
                {visibleProjects.map((project, index) => (
                  <div key={project.id} data-reveal className={`projects-rail-item reveal ${index === 0 ? 'relative' : ''}`} style={{ '--reveal-delay': `${60 + index * 90}ms` }}>
                    <article
                      role="button"
                      tabIndex={0}
                      onClick={() => openProject(project.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          openProject(project.id)
                        }
                      }}
                      className="surface-card relative flex min-h-full cursor-pointer overflow-visible rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-4 transition hover:-translate-y-1 hover:border-sky-300/25"
                    >
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 rounded-t-[1.6rem] bg-[radial-gradient(circle_at_top_left,_rgba(253,186,116,0.16),transparent_58%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),transparent_58%)]" />
                      <div className="relative flex h-full flex-1 flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{project.category}</p>
                              <h3 className="mt-2 min-h-[3.2rem] text-[1.18rem] font-semibold leading-tight text-white">{project.title}</h3>
                            </div>
                          </div>
                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">0{index + 1}</span>
                        </div>
                        <div className="mt-4 rounded-[1.25rem] border border-white/8 bg-slate-950/55 p-3.5">
                          <div className="mb-3 aspect-[16/9] overflow-hidden rounded-[1rem] border border-white/10 bg-slate-950/70">
                            <img
                              src={project.coverImageUrl || '/project-surface.svg'}
                              alt=""
                              loading="eager"
                              decoding="async"
                              fetchPriority={index < 4 ? 'high' : 'auto'}
                              className="h-full w-full object-contain object-center"
                            />
                          </div>
                          <p
                            className="text-sm leading-6 text-slate-300"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {project.summary}
                          </p>
                        </div>
                        <div className="mt-4 flex min-h-[3rem] flex-wrap content-start gap-2">
                          {project.stack.slice(0, 4).map((item) => (
                            <span key={`${project.id}-${item}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                                {item}
                            </span>
                          ))}
                          {project.stack.length > 4 ? (
                            <button
                              type="button"
                              onClick={(event) => event.stopPropagation()}
                              className="group/stack relative rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400"
                              aria-label={locale === 'tr' ? 'Kalan teknolojileri göster' : 'Show remaining technologies'}
                            >
                              +{project.stack.length - 4}
                              <span className="pointer-events-none absolute bottom-[calc(100%+0.55rem)] left-1/2 z-50 w-56 -translate-x-1/2 translate-y-1 rounded-xl border border-white/12 bg-slate-950/96 px-3 py-2 text-left text-[11px] leading-5 text-slate-200 opacity-0 shadow-[0_14px_30px_rgba(2,6,23,0.45)] transition duration-200 group-hover/stack:translate-y-0 group-hover/stack:opacity-100 group-focus-visible/stack:translate-y-0 group-focus-visible/stack:opacity-100">
                                <span className="mb-1 block text-[10px] uppercase tracking-[0.24em] text-slate-400">
                                  {locale === 'tr' ? 'Kalan teknolojiler' : 'Remaining technologies'}
                                </span>
                                <span className="flex flex-col">
                                  {project.stack.slice(4).map((stackItem, stackIndex) => (
                                    <span key={`${project.id}-${stackItem}-extra-${stackIndex}`} className="block">
                                      {stackItem}
                                    </span>
                                  ))}
                                </span>
                              </span>
                            </button>
                          ) : null}
                        </div>
                        <div className="mt-auto flex items-center gap-2 pt-5">
                          <a
                            href={project.repository}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3.5 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                          >
                            <Github size={16} />
                            {text.sections.projects.github}
                          </a>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              openProject(project.id)
                            }}
                            className="button-secondary inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm"
                          >
                            <ArrowUpRight size={16} />
                            {text.sections.projects.openDetails}
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
              {totalProjectPages > 1 ? (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProjectPage((page) => Math.max(1, page - 1))}
                    disabled={effectiveProjectPage === 1}
                    className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-slate-200 disabled:opacity-45"
                  >
                    {locale === 'tr' ? 'Önceki' : 'Prev'}
                  </button>
                  {Array.from({ length: totalProjectPages }, (_, idx) => idx + 1).map((page) => (
                    <button
                      key={`project-page-${page}`}
                      type="button"
                      onClick={() => setProjectPage(page)}
                      aria-current={effectiveProjectPage === page ? 'page' : undefined}
                      className={`h-8 min-w-8 rounded-full px-2 text-xs font-semibold ${effectiveProjectPage === page ? 'bg-sky-400/20 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.35)]' : 'border border-white/10 bg-white/6 text-slate-300 hover:text-white'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setProjectPage((page) => Math.min(totalProjectPages, page + 1))}
                    disabled={effectiveProjectPage === totalProjectPages}
                    className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-slate-200 disabled:opacity-45"
                  >
                    {locale === 'tr' ? 'Sonraki' : 'Next'}
                  </button>
                </div>
              ) : null}
              </>
            )}
          </div>
        </Section>

        <Section id="writings" className="pt-20 md:pt-28">
          <div className="relative z-10 space-y-10">
            <div data-reveal className="reveal">
              <SectionHeading
                eyebrow={resolveSectionHeading('writings', text.sections.writings).eyebrow}
                title={resolveSectionHeading('writings', text.sections.writings).title}
                description={resolveSectionHeading('writings', text.sections.writings).description}
              />
            </div>
            {articles.length === 0 ? (
              <div data-reveal className="reveal relative" style={{ '--reveal-delay': '50ms' }}>
                <EmptyCardsPlaceholder icon={IconArticle} message={text.sections.writings.emptyPlaceholder} />
              </div>
            ) : (
              <>
              <div className="writings-rail hide-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:mx-0 md:grid md:overflow-visible md:pb-0 lg:grid-cols-3">
                {visibleArticles.map((article, index) => (
                  <div key={article.id} data-reveal className={`writings-rail-item reveal ${index === 0 ? 'relative' : ''}`} style={{ '--reveal-delay': `${50 + index * 90}ms` }}>
                    <a href={article.href} target="_blank" rel="noreferrer" className={`surface-card group block rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 transition hover:-translate-y-1 hover:border-orange-300/25 ${index > 0 ? 'surface-card-delayed' : ''}`}>
                      <div className="inline-flex rounded-full border border-orange-300/15 bg-orange-300/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-orange-100">{article.readingTime}</div>
                      <h3 className="mt-6 text-2xl font-semibold text-white">{article.title}</h3>
                      <p className="mt-4 break-words text-sm leading-7 text-slate-300 [overflow-wrap:anywhere]">{article.excerpt}</p>
                      <div className="mt-8 inline-flex items-center gap-2 text-sm text-sky-200">
                        {text.sections.writings.readOnMedium}
                        <ArrowUpRight size={16} />
                      </div>
                    </a>
                  </div>
                ))}
              </div>
              {totalWritingPages > 1 ? (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWritingPage((page) => Math.max(1, page - 1))}
                    disabled={effectiveWritingPage === 1}
                    className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-slate-200 disabled:opacity-45"
                  >
                    {locale === 'tr' ? 'Önceki' : 'Prev'}
                  </button>
                  {Array.from({ length: totalWritingPages }, (_, idx) => idx + 1).map((page) => (
                    <button
                      key={`writing-page-${page}`}
                      type="button"
                      onClick={() => setWritingPage(page)}
                      aria-current={effectiveWritingPage === page ? 'page' : undefined}
                      className={`h-8 min-w-8 rounded-full px-2 text-xs font-semibold ${effectiveWritingPage === page ? 'bg-sky-400/20 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.35)]' : 'border border-white/10 bg-white/6 text-slate-300 hover:text-white'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setWritingPage((page) => Math.min(totalWritingPages, page + 1))}
                    disabled={effectiveWritingPage === totalWritingPages}
                    className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-slate-200 disabled:opacity-45"
                  >
                    {locale === 'tr' ? 'Sonraki' : 'Next'}
                  </button>
                </div>
              ) : null}
              </>
            )}
          </div>
        </Section>

        <Section id="resume" className="pt-20 md:pt-28">
          <div className="space-y-10">
            <div data-reveal className="reveal">
              <SectionHeading
                eyebrow={resolveSectionHeading('resume', text.sections.resume).eyebrow}
                title={resolveSectionHeading('resume', text.sections.resume).title}
                description={resolveSectionHeading('resume', text.sections.resume).description}
              />
            </div>
            <div data-reveal className="reveal glass-card rounded-[2rem] p-5 md:p-8" style={{ '--reveal-delay': '110ms' }}>
              <div className="relative mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/45 px-5 py-4">
                <CharacterSticker src="/avatars/resume-coffee.png" className="character-ghost character-sticker character-resume" />
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{text.sections.resume.currentCv}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{resumeContent?.fileName || 'fatih-ozkurt-cv.pdf'}</p>
                </div>
                <a
                  href={resumeContent?.downloadUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                >
                  <FileText size={16} />
                  {text.sections.resume.downloadCv}
                </a>
              </div>
              <div className="resume-sheet relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#f5f5f1] p-6 text-slate-950 md:p-10">
                <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{text.sections.resume.preview}</p>
                    <h3 className="mt-4 text-4xl font-semibold">{text.hero.name}</h3>
                    <p className="mt-3 text-lg text-slate-700">{resolvedHeroContent?.title || text.hero.title}</p>
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
          <div className="relative z-10 grid items-start gap-10 xl:grid-cols-[0.78fr_1.02fr] xl:grid-rows-[auto_1fr] xl:gap-x-12 xl:gap-y-8">
            <div data-reveal className="reveal xl:col-span-2 xl:row-start-1">
              <SectionHeading
                className="max-w-5xl"
                eyebrow={resolveSectionHeading('contact', text.sections.contact).eyebrow}
                title={resolveSectionHeading('contact', text.sections.contact).title}
                description={resolveSectionHeading('contact', text.sections.contact).description}
              />
            </div>
            <div className="grid gap-4 xl:col-start-1 xl:row-start-2">
              {contactLinks.map((link, index) => {
                const Icon = contactIconMap[link.icon] ?? Mail
                const useBrandIcon = link.icon === 'medium'

                return (
                  <div key={`${link.icon}-${index}-${link.href}`} data-reveal className="reveal" style={{ '--reveal-delay': `${50 + index * 80}ms` }}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                      className={`surface-card block rounded-[1.6rem] border border-white/10 bg-white/[0.045] px-5 py-4 transition hover:border-sky-300/20 hover:bg-white/[0.07] ${index > 1 ? 'surface-card-delayed' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-sky-400/10 text-sky-200">
                          {useBrandIcon ? <BrandIcon name="Medium" size={18} color="#dbeafe" /> : <Icon size={18} />}
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
            <div data-reveal className="reveal relative glass-card h-fit place-self-start self-start rounded-[2rem] p-6 md:p-8 xl:col-start-2 xl:row-start-2" style={{ '--reveal-delay': '120ms' }}>
              <CharacterSticker src="/avatars/contact-wave.png" className="character-ghost-faint character-sticker character-contact" />
              <form onSubmit={handleContactSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="relative -top-1 pl-3 text-sm text-slate-300">{text.sections.contact.titleLabel}</span>
                    <input
                      name="title"
                      type="text"
                      value={contactForm.title}
                      onChange={handleContactChange}
                      autoComplete="organization-title"
                      placeholder={text.sections.contact.subjectPlaceholder}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="relative -top-1 pl-3 text-sm text-slate-300">{text.sections.contact.emailLabel}</span>
                    <input
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      autoComplete="email"
                      placeholder={text.sections.contact.emailPlaceholder}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                    />
                  </label>
                </div>
                <label className="mt-5 block space-y-2">
                  <span className="relative -top-1 pl-3 text-sm text-slate-300">{text.sections.contact.contentLabel}</span>
                  <textarea
                    name="content"
                    rows="6"
                    value={contactForm.content}
                    onChange={handleContactChange}
                    autoComplete="off"
                    placeholder={text.sections.contact.contentPlaceholder}
                    className="w-full rounded-[1.6rem] border border-white/10 bg-slate-950/45 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-slate-500"
                  />
                </label>
                {contactState.message ? (
                  <p className={`mt-4 text-sm ${contactState.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{contactState.message}</p>
                ) : null}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button type="submit" className="button-primary rounded-full px-6 py-3 text-sm font-semibold">
                    {text.sections.contact.sendMessage}
                  </button>
                </div>
              </form>
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
            liveAddress: locale === 'tr' ? 'Canlı adres' : 'Live address',
            readmeView: locale === 'tr' ? 'README görünümü' : 'README view',
            previousImage: text.accessibility.previousImage,
            nextImage: text.accessibility.nextImage,
            goToImage: text.accessibility.goToImage,
            closeProjectDetails: text.accessibility.closeProjectDetails,
          }}
        />
      ) : null}
    </div>
  )
}

function App() {
  const pathname = normalizePathname(window.location.pathname)
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

  useEffect(() => {
    const meta = uiText[locale].meta
    const isAuthPage = pathname === ADMIN_ROUTE || pathname === ADMIN_RESET_ROUTE
    const title = isAuthPage ? `${meta.title} | Admin` : meta.title
    const authMetaDescription =
      locale === 'tr'
        ? 'Fatih \u00d6zkurt portf\u00f6y operasyonlar\u0131 i\u00e7in s\u0131n\u0131rl\u0131 admin giri\u015f y\u00fczeyi.'
        : 'Restricted admin login surface for Fatih Ozkurt portfolio operations.'
    const description = isAuthPage
      ? authMetaDescription
      : meta.description
    const canonicalUrl = pathname === ADMIN_RESET_ROUTE
      ? `https://fatihozkurt.com${ADMIN_RESET_ROUTE}`
      : (isAuthPage ? `https://fatihozkurt.com${ADMIN_ROUTE}` : 'https://fatihozkurt.com/')
    const ogImage = 'https://fatihozkurt.com/og-image.svg'
    const keywords = locale === 'tr'
      ? 'Fatih Özkurt, Fatih Ozkurt, fatihozkurt, java backend developer, spring boot, backend engineer, istanbul yazılım'
      : 'Fatih Ozkurt, Fatih Özkurt, fatihozkurt, java backend developer, spring boot, backend engineer, software architect'

    document.title = title

    const upsertMeta = (selector, attrs) => {
      let node = document.head.querySelector(selector)
      if (!node) {
        node = document.createElement('meta')
        Object.entries(attrs.identity).forEach(([key, value]) => node.setAttribute(key, value))
        document.head.appendChild(node)
      }

      node.setAttribute('content', attrs.content)
    }

    upsertMeta('meta[name="description"]', {
      identity: { name: 'description' },
      content: description,
    })
    upsertMeta('meta[name="robots"]', {
      identity: { name: 'robots' },
      content: isAuthPage ? 'noindex,nofollow,noarchive,nosnippet' : 'index,follow',
    })
    upsertMeta('meta[name="keywords"]', {
      identity: { name: 'keywords' },
      content: keywords,
    })
    upsertMeta('meta[property="og:title"]', {
      identity: { property: 'og:title' },
      content: title,
    })
    upsertMeta('meta[property="og:type"]', {
      identity: { property: 'og:type' },
      content: isAuthPage ? 'website' : 'profile',
    })
    upsertMeta('meta[property="og:description"]', {
      identity: { property: 'og:description' },
      content: description,
    })
    upsertMeta('meta[property="og:url"]', {
      identity: { property: 'og:url' },
      content: canonicalUrl,
    })
    upsertMeta('meta[property="og:locale"]', {
      identity: { property: 'og:locale' },
      content: locale === 'tr' ? 'tr_TR' : 'en_US',
    })
    upsertMeta('meta[property="og:image"]', {
      identity: { property: 'og:image' },
      content: ogImage,
    })
    upsertMeta('meta[property="og:image:alt"]', {
      identity: { property: 'og:image:alt' },
      content: 'Fatih Özkurt backend portfolio preview',
    })
    upsertMeta('meta[name="twitter:card"]', {
      identity: { name: 'twitter:card' },
      content: 'summary_large_image',
    })
    upsertMeta('meta[name="twitter:title"]', {
      identity: { name: 'twitter:title' },
      content: title,
    })
    upsertMeta('meta[name="twitter:description"]', {
      identity: { name: 'twitter:description' },
      content: description,
    })
    upsertMeta('meta[name="twitter:image"]', {
      identity: { name: 'twitter:image' },
      content: ogImage,
    })
    let canonicalNode = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalNode) {
      canonicalNode = document.createElement('link')
      canonicalNode.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalNode)
    }
    canonicalNode.setAttribute('href', canonicalUrl)

    ;['tr', 'en'].forEach((lang) => {
      const hrefLang = lang === 'tr' ? 'tr-TR' : 'en-US'
      let altNode = document.head.querySelector(`link[rel="alternate"][hreflang="${hrefLang}"]`)
      if (!altNode) {
        altNode = document.createElement('link')
        altNode.setAttribute('rel', 'alternate')
        altNode.setAttribute('hreflang', hrefLang)
        document.head.appendChild(altNode)
      }
      altNode.setAttribute('href', 'https://fatihozkurt.com/')
    })

    if (!isAuthPage) {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Fatih Özkurt',
        alternateName: 'Fatih Ozkurt',
        jobTitle: 'Java Backend Developer',
        url: 'https://fatihozkurt.com/',
        image: 'https://fatihozkurt.com/og-image.svg',
        sameAs: [
          'https://github.com/fatihhozkurt',
          'https://www.linkedin.com/in/fatih-%C3%B6zkurt-93748321a/',
          'https://medium.com/@fatihozkurt',
        ],
      }
      let schemaNode = document.head.querySelector('script[data-schema="person"]')
      if (!schemaNode) {
        schemaNode = document.createElement('script')
        schemaNode.setAttribute('type', 'application/ld+json')
        schemaNode.setAttribute('data-schema', 'person')
        document.head.appendChild(schemaNode)
      }
      schemaNode.textContent = JSON.stringify(jsonLd)
    } else {
      const schemaNode = document.head.querySelector('script[data-schema="person"]')
      if (schemaNode) {
        schemaNode.remove()
      }
    }
  }, [locale, pathname])

  if (pathname === ADMIN_RESET_ROUTE) {
    return <ResetPasswordPortal locale={locale} setLocale={setLocale} langLabels={uiText[locale].lang} adminPath={ADMIN_ROUTE} />
  }

  if (pathname === ADMIN_ROUTE) {
    return <AuthPortal locale={locale} setLocale={setLocale} text={uiText[locale].auth} langLabels={uiText[locale].lang} adminPath={ADMIN_ROUTE} />
  }

  return <PublicSite locale={locale} setLocale={setLocale} />
}

export default App
