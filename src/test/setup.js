import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }

  observe() {}

  unobserve() {}

  disconnect() {}
}

class MockResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
})

Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  writable: true,
  configurable: true,
  value: () => {},
})

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  configurable: true,
  value: () => {},
})

Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  configurable: true,
  value: () => Promise.resolve(),
})

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  configurable: true,
  value: () => {},
})

Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  configurable: true,
  value: () => ({
    clearRect: () => {},
    drawImage: () => {},
    getImageData: (_, __, width = 2, height = 2) => ({
      data: new Uint8ClampedArray(width * height * 4).fill(180),
      width,
      height,
    }),
    putImageData: () => {},
  }),
})

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  configurable: true,
  value: (callback) => setTimeout(callback, 0),
})

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  configurable: true,
  value: (id) => clearTimeout(id),
})

afterEach(() => {
  cleanup()
})
