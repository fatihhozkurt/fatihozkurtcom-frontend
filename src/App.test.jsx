import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

let fetchMock

function mockPublicApiWithData() {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    let payload = {}

    if (url.includes('/api/v1/public/hero')) {
      payload = {
        welcomeText: 'Welcome to my corner of the internet',
        fullName: 'Fatih Özkurt',
        title: 'Java Backend Developer',
        description: 'Secure APIs, disciplined service design, and reliable backend delivery.',
        ctaLabel: 'Explore',
      }
    } else if (url.includes('/api/v1/public/about')) {
      payload = {
        eyebrow: 'About',
        title: 'Backend systems with production discipline.',
        description: 'I build secure, observable, and maintainable backend services.',
      }
    } else if (url.includes('/api/v1/public/projects/')) {
      payload = {
        id: '00000000-0000-0000-0000-000000000001',
        title: 'Personal Portfolio Platform',
        category: 'Personal project',
        summary: 'Summary',
        repositoryUrl: 'https://github.com/fatihozkurt',
        demoUrl: null,
        readmeMarkdown: null,
        coverImageUrl: null,
        stack: ['Java', 'Spring Boot'],
      }
    } else if (url.includes('/api/v1/public/projects')) {
      payload = [{
        id: '00000000-0000-0000-0000-000000000001',
        title: 'Personal Portfolio Platform',
        category: 'Personal project',
        summary: 'Summary',
        repositoryUrl: 'https://github.com/fatihozkurt',
        coverImageUrl: null,
        stack: ['Java', 'Spring Boot'],
      }]
    } else if (url.includes('/api/v1/public/articles')) {
      payload = [{
        id: '00000000-0000-0000-0000-000000000011',
        title: 'Article',
        excerpt: 'Excerpt',
        href: 'https://medium.com/@fatihozkurt',
        readingTime: '5 min read',
      }]
    } else if (url.includes('/api/v1/public/tech-stack')) {
      payload = [{ id: '1', name: 'Java', iconName: 'Java', category: 'backend' }]
    } else if (url.includes('/api/v1/public/contact-profile')) {
      payload = {
        email: 'fatih@example.com',
        linkedinUrl: 'https://linkedin.com/in/fatihozkurt',
        githubUrl: 'https://github.com/fatihozkurt',
        mediumUrl: 'https://medium.com/@fatihozkurt',
      }
    } else if (url.includes('/api/v1/public/resume')) {
      payload = {
        fileName: 'fatih-ozkurt-cv.pdf',
        contentType: 'application/pdf',
        sizeBytes: 100,
        downloadUrl: 'https://example.com/cv.pdf',
      }
    } else if (url.includes('/api/v1/public/visits')) {
      payload = { status: 'recorded' }
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })
}

describe('App', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    window.history.pushState({}, '', '/')
    window.localStorage.clear()
    window.localStorage.setItem('ui-locale', 'en')
    fetchMock = mockPublicApiWithData()
  })

  afterEach(() => {
    window.history.pushState({}, '', '/')
    fetchMock?.mockRestore()
    fetchMock = undefined
  })

  it('renders the main one-page sections', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: /fatih özkurt/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/java backend developer/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: /projects i ship\./i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /let's contact\./i })).toBeInTheDocument()
    expect(screen.queryByText(/backend hook point/i)).not.toBeInTheDocument()
  })

  it('scrolls to the selected section using header-aware offset', async () => {
    const user = userEvent.setup()
    const scrollSpy = vi.fn()

    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      configurable: true,
      value: scrollSpy,
    })

    render(<App />)

    const header = document.querySelector('header')
    const contactSection = document.getElementById('contact')

    header.getBoundingClientRect = vi.fn(() => ({
      width: 1200,
      height: 80,
      top: 0,
      left: 0,
      right: 1200,
      bottom: 80,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }))

    contactSection.getBoundingClientRect = vi.fn(() => ({
      width: 1200,
      height: 900,
      top: 640,
      left: 0,
      right: 1200,
      bottom: 1540,
      x: 0,
      y: 640,
      toJSON: () => ({}),
    }))

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 120,
    })

    await user.click(screen.getByRole('link', { name: /^contact$/i }))

    expect(scrollSpy).toHaveBeenCalledOnce()
    expect(scrollSpy).toHaveBeenCalledWith({
      top: 662,
      behavior: 'smooth',
    })
  })

  it('opens and closes the project detail modal', async () => {
    render(<App />)

    const [projectCard] = await screen.findAllByRole('button', { name: /personal portfolio platform/i })
    fireEvent.click(projectCard)

    expect(await screen.findByRole('dialog', undefined, { timeout: 5000 })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: /personal portfolio platform/i })).toHaveLength(2)

    fireEvent.click(screen.getByRole('button', { name: /close project details/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('closes the project modal with escape', async () => {
    render(<App />)

    const [projectCard] = await screen.findAllByRole('button', { name: /personal portfolio platform/i })
    fireEvent.click(projectCard)
    expect(await screen.findByRole('dialog', undefined, { timeout: 5000 })).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('renders the hidden auth surface only on /auth', () => {
    window.history.pushState({}, '', '/auth')

    render(<App />)

    expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^home$/i })).not.toBeInTheDocument()
  })

  it('switches the public interface language to Turkish', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /^TR$/ })[0])

    expect(screen.getByRole('link', { name: /ana sayfa/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /geliştirdiğim projeler\./i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /backend systems with production discipline\./i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /güvenilir backend mühendisliği, gereksiz drama olmadan\./i })).not.toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /(projeleri keşfet|explore projects|explore)/i }).length).toBeGreaterThan(0)
  })

  it('switches the auth interface language to Turkish', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/auth')

    render(<App />)

    await user.click(screen.getByRole('button', { name: /^TR$/ }))

    expect(screen.getByText(/gizli admin girişi/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /giriş yap/i })).toBeInTheDocument()
  })

  it('reflects empty project and writing data when API returns empty lists', async () => {
    fetchMock?.mockRestore()
    fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
      let payload = {}

      if (url.includes('/api/v1/public/projects')) {
        payload = []
      } else if (url.includes('/api/v1/public/articles')) {
        payload = []
      } else if (url.includes('/api/v1/public/tech-stack')) {
        payload = []
      } else if (url.includes('/api/v1/public/contact-profile')) {
        payload = {}
      }

      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /open details/i })).not.toBeInTheDocument()
    })

    expect(screen.queryByText(/read on medium/i)).not.toBeInTheDocument()
    expect(screen.getByText(/no visible tech stack data yet\./i)).toBeInTheDocument()
  })
})
