import { ArrowUpRight, CircleDot, Github, Newspaper, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ProjectModal({ project, onClose, text }) {
  const [state, setState] = useState('open')

  useEffect(() => {
    if (state !== 'closing') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      onClose()
    }, 220)

    return () => window.clearTimeout(timeoutId)
  }, [onClose, state])

  const closeModal = () => {
    setState('closing')
  }

  return (
    <div className="modal-shell fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/72 p-4 backdrop-blur-md md:p-8" data-state={state}>
      <div className="glass-card modal-panel relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{project.category}</p>
            <h3 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{project.title}</h3>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-slate-100"
            aria-label="Close project details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-5.5rem)] overflow-y-auto px-6 py-6 md:px-8 md:py-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <div className="rounded-[1.8rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(253,186,116,0.16),transparent_42%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),transparent_52%),rgba(15,23,42,0.75)] px-6 py-14 text-center">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{text.projectVisual}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{project.accent}</p>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5">
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
                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white"
                  >
                    <Github size={16} />
                    {text.github}
                  </a>
                  <a
                    href={project.liveUrl}
                    className="button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                  >
                    {text.liveSurface}
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-slate-950/55 p-6">
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
