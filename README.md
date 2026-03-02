# Fatih Ozkurt Portfolio Frontend
### React + Vite One-Page Personal Website

This project is a modern one-page frontend application built for a backend developer portfolio.
It is designed as the public surface of `fatihozkurt.com`, with a dark atmospheric visual language,
responsive layout, polished UI motion, and a hidden `/auth` route reserved for the admin side.

The main goal is to present backend-focused work through a frontend that feels
clean, intentional, and production-aware rather than decorative.

---

## Technologies Used

- React 19
- Vite 7
- Tailwind CSS 4
- Lucide React
- Vitest
- Testing Library
- ESLint

---

## Core Concepts

- One-page architecture: smooth section-based public portfolio flow
- Responsive design: desktop and mobile-friendly layout
- Dark atmospheric UI: black fog, faded dot textures, muted sky-blue accents
- Progressive reveal motion: sections and cards enter with controlled easing
- Hidden admin entry: `/auth` exists but is not linked from the public UI
- Content-first structure: projects, writings, contact links, and CV area are data-driven
- Backend-ready frontend: placeholders and layout are prepared for later API integration

---

## Project Structure

```text
src
 |- components
 |  |- AuthPortal.jsx
 |  |- Chrome.jsx
 |  `- ProjectModal.jsx
 |- test
 |  `- setup.js
 |- App.jsx
 |- App.test.jsx
 |- index.css
 |- main.jsx
 `- siteContent.js

public
 `- ...
```

### Architectural Notes

- `App.jsx` contains the main page composition and hidden `/auth` surface switch
- `siteContent.js` stores portfolio content as structured frontend data
- `Chrome.jsx` contains reusable UI primitives such as section shells, headings, and tech pills
- `ProjectModal.jsx` renders deep project details in an overlay
- `AuthPortal.jsx` provides the hidden admin-facing entry screen and preview shell
- `index.css` defines motion, layered atmosphere, surface styles, and shared button patterns

---

## Current Features

- Animated hero section with staged entrance
- Section-based navigation with header-aware smooth scrolling
- Tech stack marquee
- Project cards with modal detail view
- Medium article cards
- CV preview section with download CTA
- Contact links and contact form layout
- Hidden `/auth` route
- Hover states, motion polish, and visual hierarchy tuned for dark UI

---

## Setup and Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Default local URL:

- http://localhost:5173

---

## Quality Checks

### Run tests

```bash
npm test
```

### Run lint

```bash
npm run lint
```

### Build production bundle

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

Preview URL is typically:

- http://localhost:4173

---

## Routes

### Public Surface

- `/`

### Hidden Admin Entry

- `/auth`

This route is intentionally not exposed through the public navigation.

---

## Testing Scope

The current test suite covers:

- Main one-page render checks
- Navigation and scroll behavior
- Project modal open/close flow
- Escape-based modal close behavior
- Hidden `/auth` route rendering

---

## Backend Integration Notes

This frontend is currently UI-complete enough for visual iteration, but some areas are still
prepared as integration-ready placeholders rather than fully wired production flows.

Examples:

- Project and article data are currently local
- Contact form submit is not yet connected to a backend mail pipeline
- CV viewer area is visually prepared for real asset delivery
- `/auth` is currently a frontend shell, not a live authenticated admin workflow

---

## Conclusion

This project demonstrates how a personal portfolio frontend can be built with
production-style UI discipline, balancing aesthetics, interaction quality,
and future backend integration needs.

It is intentionally designed to support a larger platform vision:
public portfolio surface outside, secured admin capabilities behind `/auth`.
