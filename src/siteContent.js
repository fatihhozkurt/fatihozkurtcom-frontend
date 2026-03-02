export const navigationItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'writings', label: 'Medium' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
]

export const heroStats = [
  { value: 'Java', label: 'Primary backend lane' },
  { value: 'Spring', label: 'Production-ready APIs' },
  { value: 'Secure', label: 'Defensive engineering focus' },
]

export const techStack = [
  { name: 'Java', category: 'backend', accent: 'JV', icon: 'braces' },
  { name: 'Spring Boot', category: 'backend', accent: 'SB', icon: 'server' },
  { name: 'Spring Security', category: 'security', accent: 'SS', icon: 'shield' },
  { name: 'PostgreSQL', category: 'database', accent: 'PG', icon: 'database' },
  { name: 'Redis', category: 'cache', accent: 'RD', icon: 'zap' },
  { name: 'OpenSearch', category: 'observability', accent: 'OS', icon: 'scan-search' },
  { name: 'Docker', category: 'platform', accent: 'DK', icon: 'container' },
  { name: 'MinIO', category: 'storage', accent: 'MN', icon: 'box' },
  { name: 'React', category: 'frontend', accent: 'RE', icon: 'monitor' },
  { name: 'Tailwind CSS', category: 'frontend', accent: 'TW', icon: 'palette' },
  { name: 'REST APIs', category: 'backend', accent: 'RT', icon: 'network' },
  { name: 'JWT + CSRF', category: 'security', accent: 'SC', icon: 'key-round' },
]

export const projects = [
  {
    id: 'portfolio-core',
    title: 'Personal Platform Core',
    summary:
      'A secure personal web platform with public portfolio pages, CMS-style admin controls, and observability-focused backend decisions.',
    category: 'Featured architecture',
    accent: 'Portfolio',
    repository: 'https://github.com/fatihozkurt',
    liveUrl: '#contact',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'React', 'Tailwind'],
    readme: {
      intro:
        'This concept project frames the kind of backend-first engineering I want to present publicly: secure APIs, measured UI, and maintainable admin tooling.',
      sections: [
        {
          title: 'Goals',
          items: [
            'Expose public content without exposing internal management tools.',
            'Keep content editable from admin without code-level deployment changes.',
            'Preserve a clean separation between public traffic and privileged operations.',
          ],
        },
        {
          title: 'Implementation Notes',
          items: [
            'Admin auth uses rotating refresh tokens and auditable security events.',
            'Public assets are versioned and stored externally from the application image.',
            'Operational logs are designed to be searchable and privacy-conscious.',
          ],
        },
      ],
    },
  },
  {
    id: 'event-observer',
    title: 'Traffic and Security Observer',
    summary:
      'A backend-oriented analytics layer that tracks visits, suspicious activity, and operational signals without overengineering the public surface.',
    category: 'Observability',
    accent: 'Observer',
    repository: 'https://github.com/fatihozkurt',
    liveUrl: '#contact',
    stack: ['OpenSearch', 'Redis', 'PostgreSQL', 'Spring Security'],
    readme: {
      intro:
        'The dashboard focus is not vanity metrics. It is operational clarity: who visited, what failed, and which patterns deserve attention.',
      sections: [
        {
          title: 'Signals',
          items: [
            'Visit totals, unique visitors, and timeline views.',
            'Recent suspicious IP patterns and failed authentication trends.',
            'Admin actions and content update audit records.',
          ],
        },
        {
          title: 'Why It Matters',
          items: [
            'A personal website is still an internet-facing surface.',
            'Operational data should support fast investigation, not just charts.',
          ],
        },
      ],
    },
  },
  {
    id: 'content-admin',
    title: 'Content Operations Workspace',
    summary:
      'A practical admin experience for managing hero content, project cards, Medium links, resume assets, and contact channels from one secure surface.',
    category: 'Admin UX',
    accent: 'Control',
    repository: 'https://github.com/fatihozkurt',
    liveUrl: '#contact',
    stack: ['React', 'Tailwind', 'REST API', 'MinIO'],
    readme: {
      intro:
        'The admin panel is designed as an operations cockpit, not a decorative dashboard. Editing should feel predictable, fast, and auditable.',
      sections: [
        {
          title: 'Managed Areas',
          items: [
            'Hero, about, tech stack, projects, writings, CV, and contact profile.',
            'File replacement with metadata visibility.',
            'Localized exceptions and error-code-driven feedback.',
          ],
        },
        {
          title: 'Guardrails',
          items: [
            'Central validation model for required and optional fields.',
            'Sensitive actions visible in audit logs.',
            'Swagger hidden from production exposure.',
          ],
        },
      ],
    },
  },
]

export const articles = [
  {
    id: 'security-contracts',
    title: 'API contracts that age well',
    excerpt:
      'Thoughts on keeping DTOs, validation, and exception mapping boring in the best possible way.',
    readingTime: '6 min read',
    href: 'https://medium.com/',
  },
  {
    id: 'spring-auth-hardening',
    title: 'Hardening Spring auth without theater',
    excerpt:
      'Rate limits, refresh rotation, CSRF decisions, and where teams usually overcomplicate the wrong layer.',
    readingTime: '8 min read',
    href: 'https://medium.com/',
  },
  {
    id: 'observability-personal-site',
    title: 'Observability for a small internet-facing app',
    excerpt:
      'Why a portfolio site still deserves structured logs, event codes, and a retention strategy.',
    readingTime: '5 min read',
    href: 'https://medium.com/',
  },
]

export const contactLinks = [
  { label: 'Mail', value: 'fatih@example.com', href: 'mailto:fatih@example.com', icon: 'mail' },
  { label: 'LinkedIn', value: 'linkedin.com/in/fatihozkurt', href: 'https://www.linkedin.com/in/fatihozkurt/', icon: 'linkedin' },
  { label: 'GitHub', value: 'github.com/fatihozkurt', href: 'https://github.com/fatihozkurt', icon: 'github' },
  { label: 'Medium', value: 'medium.com/@fatihozkurt', href: 'https://medium.com/', icon: 'pen-square' },
]

export const adminHighlights = [
  'Visit analytics with geo-aware summaries',
  'Failed login and security-event visibility',
  'Editable hero, projects, writings, contact, and CV assets',
  'Localized validation and exception responses',
]
