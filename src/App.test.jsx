import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    window.history.pushState({}, '', '/')
  })

  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('renders the main one-page sections', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: /fatih ozkurt/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/java backend developer/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: /cards for scanning, deeper views for technical texture\./i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /easy to reach\. structured enough to scale\./i })).toBeInTheDocument()
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

    await user.click(screen.getByRole('button', { name: /^contact$/i }))

    expect(scrollSpy).toHaveBeenCalledOnce()
    expect(scrollSpy).toHaveBeenCalledWith({
      top: 664,
      behavior: 'smooth',
    })
  })

  it('opens and closes the project detail modal', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /open details/i })[0])

    expect(screen.getByText(/README rendering view/i)).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: /personal platform core/i })).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: /close project details/i }))

    await waitFor(() => {
      expect(screen.queryByText(/README rendering view/i)).not.toBeInTheDocument()
    })
  })

  it('closes the project modal with escape', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /open details/i })[0])
    expect(screen.getByText(/README rendering view/i)).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText(/README rendering view/i)).not.toBeInTheDocument()
    })
  })

  it('renders the hidden auth surface only on /auth', () => {
    window.history.pushState({}, '', '/auth')

    render(<App />)

    expect(screen.getByRole('heading', { name: /\/auth/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enter workspace/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^home$/i })).not.toBeInTheDocument()
  })
})
