import { ArrowUpRight, ChevronLeft, ChevronRight, CircleDot, Github, Newspaper, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const CAROUSEL_AUTOPLAY_MS = 4200

function normalizeGallery(project) {
  const gallery = Array.isArray(project.galleryImageUrls) ? project.galleryImageUrls.filter(Boolean) : []
  if (gallery.length > 0) {
    return gallery
  }

  if (project.coverImageUrl) {
    return [project.coverImageUrl]
  }

  return ['/project-surface.svg']
}

export function ProjectModal({ project, onClose, text }) {
  const [state, setState] = useState('open')
  const gallery = useMemo(() => normalizeGallery(project), [project])
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    setState('open')
    setActiveSlide(0)
  }, [project.id])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (state !== 'closing') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      onClose()
    }, 220)

    return () => window.clearTimeout(timeoutId)
  }, [onClose, state])

  useEffect(() => {
    if (gallery.length <= 1 || state === 'closing') {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % gallery.length)
    }, CAROUSEL_AUTOPLAY_MS)

    return () => window.clearInterval(intervalId)
  }, [gallery.length, state])

  const closeModal = () => {
    setState('closing')
  }

  const goPrev = () => {
    setActiveSlide((current) => (current - 1 + gallery.length) % gallery.length)
  }

  const goNext = () => {
    setActiveSlide((current) => (current + 1) % gallery.length)
  }

  const hasRepository = Boolean(project.repository && project.repository !== '#')
  const hasLiveAddress = Boolean(project.liveUrl && project.liveUrl !== '#')

  return (
    <div
      className="modal-shell fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/72 p-3 backdrop-blur-md sm:p-4 md:p-8"
      data-state={state}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-modal-title-${project.id}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal()
        }
      }}
    >
      <div className="glass-card modal-panel relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[1.6rem] md:rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5 md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{project.category}</p>
            <h3 id={`project-modal-title-${project.id}`} className="mt-2 text-xl font-semibold text-white sm:text-2xl md:text-3xl">
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-slate-100 md:h-11 md:w-11"
            aria-label={text.closeProjectDetails}
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-5.5rem)] overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-slate-950/70">
                <div
                  className="flex h-52 transition-transform duration-500 ease-out sm:h-64"
                  style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {gallery.map((imageUrl, index) => (
                    <div key={`${project.id}-slide-${index}`} className="h-full w-full shrink-0 bg-slate-950/80">
                      <img
                        src={imageUrl}
                        alt={text.projectVisual}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
                {gallery.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/45 text-slate-100 hover:bg-slate-900/70"
                      aria-label={text.previousImage || 'Previous image'}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/45 text-slate-100 hover:bg-slate-900/70"
                      aria-label={text.nextImage || 'Next image'}
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-slate-950/45 px-2.5 py-1.5">
                      {gallery.map((imageUrl, index) => (
                        <button
                          key={`${project.id}-${imageUrl}-${index}`}
                          type="button"
                          onClick={() => setActiveSlide(index)}
                          aria-label={`${text.goToImage || 'Go to image'} ${index + 1}`}
                          className={`h-1.5 w-1.5 rounded-full ${activeSlide === index ? 'bg-sky-200' : 'bg-slate-500/80'}`}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <p className="text-sm leading-7 text-slate-300">{project.summary}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={`${project.id}-${item}-modal`}
                      className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-xs text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {hasRepository ? (
                    <a
                      href={project.repository}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white"
                    >
                      <Github size={16} />
                      {text.github}
                    </a>
                  ) : null}
                  {hasLiveAddress ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                    >
                      {text.liveAddress}
                      <ArrowUpRight size={16} />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-slate-950/55 p-4 sm:p-5 md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.28em] text-slate-400">
                <Newspaper size={14} />
                {text.readmeView}
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-300">{project.readme.intro}</p>

              <div className="mt-8 space-y-6">
                {project.readme.sections.map((section) => (
                  <div
                    key={`${project.id}-${section.title}`}
                    className="rounded-[1.4rem] border border-white/8 bg-white/[0.035] p-5"
                  >
                    <h4 className="text-lg font-semibold text-white">{section.title}</h4>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <CircleDot size={14} className="mt-1 shrink-0 text-orange-200" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
