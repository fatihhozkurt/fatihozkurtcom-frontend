export function getNavigationItems(locale) {
  if (locale === 'tr') {
    return [
      { id: 'home', label: 'Ana Sayfa' },
      { id: 'about', label: 'Hakkımda' },
      { id: 'projects', label: 'Projeler' },
      { id: 'writings', label: 'Yazılar' },
      { id: 'resume', label: 'Özgeçmiş' },
      { id: 'contact', label: 'İletişim' },
    ]
  }

  return [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'writings', label: 'Writings' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ]
}

export const techStack = [
  { name: 'Java', category: 'backend', icon: 'braces' },
  { name: 'Spring Boot', category: 'backend', icon: 'server' },
  { name: 'Spring Security', category: 'security', icon: 'shield' },
  { name: 'PostgreSQL', category: 'database', icon: 'database' },
  { name: 'Redis', category: 'cache', icon: 'zap' },
  { name: 'OpenSearch', category: 'observability', icon: 'scan-search' },
  { name: 'Apache Kafka', category: 'platform', icon: 'message-square' },
  { name: 'Docker', category: 'platform', icon: 'container' },
  { name: 'MinIO', category: 'storage', icon: 'box' },
  { name: 'Liquibase', category: 'platform', icon: 'git-branch-plus' },
  { name: 'Flyway', category: 'platform', icon: 'plane' },
  { name: 'GraphQL', category: 'backend', icon: 'network' },
  { name: 'SOAP', category: 'backend', icon: 'network' },
  { name: 'React', category: 'frontend', icon: 'monitor' },
  { name: 'Tailwind CSS', category: 'frontend', icon: 'palette' },
]

export function getProjects(locale) {
  if (locale === 'tr') {
    return [
      {
        id: 'fatihozkurtcom-platform',
        category: 'kişisel platform',
        title: 'fatihozkurt.com Platformu',
        accent: 'Portfolio',
        summary:
          'React + Vite frontend ve Spring Boot backend ile geliştirdiğim, güvenli admin akışlarına sahip ve backend-driven içerik yöneten kişisel platform.',
        stack: ['Java', 'Spring Boot', 'Spring Security', 'PostgreSQL', 'Redis', 'OpenSearch', 'MinIO', 'React', 'Vite', 'Tailwind CSS', 'Docker', 'Nginx'],
        repository: 'https://github.com/fatihhozkurt/fatihhozkurt',
        liveUrl: 'https://fatihozkurt.com',
        readme: {
          intro:
            'Portföyümü sadece görsel bir vitrin değil, güvenlik ve operasyon disiplinini gerçek anlamda gösteren bir ürün gibi kurguladım.',
          sections: [
            {
              title: 'Öne çıkanlar',
              items: [
                'Public ve admin API ayrımı',
                'JWT + CSRF temelli güvenli admin yüzeyi',
                'Projeler, yazılar ve CV için backend kontrollü içerik yönetimi',
              ],
            },
            {
              title: 'Teknik yapı',
              items: [
                'Spring Boot katmanlı mimari + validation + audit yaklaşımı',
                'PostgreSQL, Redis ve OpenSearch ile veri + analiz kurgusu',
                'MinIO ile dosya varlık yönetimi ve Docker tabanlı dağıtım',
              ],
            },
          ],
        },
      },
      {
        id: 'backdroply-ecosystem',
        category: 'saas + mobile',
        title: 'Backdroply Ecosystem',
        accent: 'SaaS',
        summary:
          'Web, mobile, Java backend, FastAPI AI engine ve infra repo katmanlarından oluşan çoklu-repo bir medya işleme ekosistemi.',
        stack: ['Java', 'Spring Boot', 'Python', 'FastAPI', 'React', 'Tailwind CSS', 'Expo', 'RabbitMQ', 'JWT', 'OAuth', 'CSRF', 'Docker'],
        repository: 'https://github.com/fatihhozkurt/backdroply-web',
        liveUrl: 'https://github.com/fatihhozkurt/backdroply-infra',
        readme: {
          intro:
            'Backdroply tarafında hedefim, kullanıcı deneyimi güçlü bir ürünü backend güvenliği ve operasyonel dayanıklılıkla birlikte yürütmekti.',
          sections: [
            {
              title: 'Kapsam',
              items: [
                'Google OAuth tabanlı giriş + JWT cookie/bearer oturum akışları',
                'Asenkron medya işleme kuyruğu ve durum takibi',
                'Token-wallet ve kullanım odaklı iş kuralı yönetimi',
              ],
            },
            {
              title: 'Repo dağılımı',
              items: [
                'backdroply-web: React + Tailwind kullanıcı arayüzü',
                'backdroply-mobile: Expo tabanlı mobil uygulama',
                'backdroply-backend / engine / infra: servis, AI ve dağıtım katmanları',
              ],
            },
          ],
        },
      },
      {
        id: 'opensearch-traffic-insights',
        category: 'observability demo',
        title: 'OpenSearch Traffic Insights',
        accent: 'Analytics',
        summary:
          'API trafiği için arama, filtreleme, sıralama ve aggregation senaryolarını Spring Boot + OpenSearch ile üretim benzeri şekilde modellediğim demo.',
        stack: ['Java', 'Spring Boot', 'OpenSearch', 'PostgreSQL', 'Docker', 'REST API'],
        repository: 'https://github.com/fatihhozkurt/opensearch-traffic-insights',
        liveUrl: '#',
        readme: {
          intro:
            'Bu projede, log/traffic analitiğini sadece sorgu yazmak değil sistem tasarımı problemi olarak ele aldım.',
          sections: [
            {
              title: 'Teknik kapsam',
              items: [
                'Full-text arama + çoklu filtreleme endpointleri',
                'Aggregation tabanlı istatistik çıktıları',
                'Soft delete farkındalığı olan indeksleme/sorgulama yaklaşımı',
              ],
            },
            {
              title: 'Neden önemli',
              items: [
                'Observability ve güvenlik analizine uygun veri modeli',
                'Backend tarafında temiz mimariyi koruyan gerçekçi bir demo',
              ],
            },
          ],
        },
      },
      {
        id: 'marketplace-app',
        category: 'backend uygulama',
        title: 'Marketplace App',
        accent: 'Commerce',
        summary:
          'Spring Boot tabanlı marketplace uygulaması; kullanıcı, ürün, sepet, sipariş ve cüzdan modüllerini güvenli ve sürdürülebilir mimariyle birleştiriyor.',
        stack: ['Java', 'Spring Boot', 'JPA', 'PostgreSQL', 'Redis', 'MapStruct', 'Maven'],
        repository: 'https://github.com/fatihhozkurt/marketplace-app',
        liveUrl: '#',
        readme: {
          intro:
            'Temel e-ticaret akışlarını backend tarafında düzenli bir domain modeli ve temiz API kontratları ile kurguladığım çalışma.',
          sections: [
            {
              title: 'Modüller',
              items: [
                'Kullanıcı, ürün, sepet, sipariş ve cüzdan yönetimi',
                'REST API + validation + soft delete yaklaşımı',
                'Redis cache ve fatura çıktısı desteği',
              ],
            },
            {
              title: 'Mühendislik yaklaşımı',
              items: [
                'Katmanlı mimari ve bakım kolaylığı odaklı tasarım',
                'Güvenli konfigürasyon ve net servis sorumlulukları',
              ],
            },
          ],
        },
      },
    ]
  }

  return [
    {
      id: 'fatihozkurtcom-platform',
      category: 'personal platform',
      title: 'fatihozkurt.com Platform',
      accent: 'Portfolio',
      summary:
        'A full-stack portfolio platform I built with React + Vite and Spring Boot, including secure admin flows and backend-driven content.',
      stack: ['Java', 'Spring Boot', 'Spring Security', 'PostgreSQL', 'Redis', 'OpenSearch', 'MinIO', 'React', 'Vite', 'Tailwind CSS', 'Docker', 'Nginx'],
      repository: 'https://github.com/fatihhozkurt/fatihhozkurt',
      liveUrl: 'https://fatihozkurt.com',
      readme: {
        intro:
          'I designed this project as a real product surface, not just a static portfolio page, with security and delivery discipline built in.',
        sections: [
          {
            title: 'Highlights',
            items: [
              'Public and admin API separation',
              'JWT + CSRF secured admin workflow',
              'Backend-controlled content lifecycle for projects, writings, and resume',
            ],
          },
          {
            title: 'Technical layout',
            items: [
              'Layered Spring Boot architecture with validation and audit thinking',
              'PostgreSQL, Redis, and OpenSearch for persistence, speed, and analytics',
              'MinIO-backed file assets and Docker-based deployment flow',
            ],
          },
        ],
      },
    },
    {
      id: 'backdroply-ecosystem',
      category: 'saas + mobile',
      title: 'Backdroply Ecosystem',
      accent: 'SaaS',
      summary:
        'A multi-repo media-processing ecosystem built across web, mobile, Java backend, FastAPI AI engine, and infrastructure layers.',
      stack: ['Java', 'Spring Boot', 'Python', 'FastAPI', 'React', 'Tailwind CSS', 'Expo', 'RabbitMQ', 'JWT', 'OAuth', 'CSRF', 'Docker'],
      repository: 'https://github.com/fatihhozkurt/backdroply-web',
      liveUrl: 'https://github.com/fatihhozkurt/backdroply-infra',
      readme: {
        intro:
          'Backdroply is where I combined product UX goals with secure backend orchestration and operational reliability.',
        sections: [
          {
            title: 'Scope',
            items: [
              'Google OAuth login and JWT session flow (cookie + bearer)',
              'Asynchronous media processing queue and job-status tracking',
              'Token wallet and usage-aware business rules',
            ],
          },
          {
            title: 'Repository map',
            items: [
              'backdroply-web: React + Tailwind product UI',
              'backdroply-mobile: Expo mobile client',
              'backdroply-backend / engine / infra: service, AI, and deployment layers',
            ],
          },
        ],
      },
    },
    {
      id: 'opensearch-traffic-insights',
      category: 'observability demo',
      title: 'OpenSearch Traffic Insights',
      accent: 'Analytics',
      summary:
        'A Spring Boot + OpenSearch demo for API traffic search, filtering, sorting, and aggregation with production-style backend structure.',
      stack: ['Java', 'Spring Boot', 'OpenSearch', 'PostgreSQL', 'Docker', 'REST API'],
      repository: 'https://github.com/fatihhozkurt/opensearch-traffic-insights',
      liveUrl: '#',
      readme: {
        intro:
          'In this project I treat traffic analytics as a system design problem, not only a query-writing exercise.',
        sections: [
          {
            title: 'Technical scope',
            items: [
              'Full-text search and multi-filter endpoints',
              'Aggregation-oriented statistics outputs',
              'Soft-delete-aware indexing and query patterns',
            ],
          },
          {
            title: 'Why it matters',
            items: [
              'Data model that supports observability and security analysis',
              'A realistic demo that keeps clean architecture under load',
            ],
          },
        ],
      },
    },
    {
      id: 'marketplace-app',
      category: 'backend application',
      title: 'Marketplace App',
      accent: 'Commerce',
      summary:
        'A Spring Boot marketplace application with user, product, cart, order, and wallet modules built with maintainable service boundaries.',
      stack: ['Java', 'Spring Boot', 'JPA', 'PostgreSQL', 'Redis', 'MapStruct', 'Maven'],
      repository: 'https://github.com/fatihhozkurt/marketplace-app',
      liveUrl: '#',
      readme: {
        intro:
          'A practical e-commerce backend project where I focused on clean API contracts and a maintainable domain structure.',
        sections: [
          {
            title: 'Modules',
            items: [
              'User, product, cart, order, and wallet management',
              'REST APIs with validation and soft-delete handling',
              'Redis caching and invoice export support',
            ],
          },
          {
            title: 'Engineering focus',
            items: [
              'Layered architecture with maintainability first',
              'Secure configuration and explicit service responsibilities',
            ],
          },
        ],
      },
    },
  ]
}

export function getArticles(locale) {
  if (locale === 'tr') {
    return [
      {
        id: 'opensearch-101',
        title: 'OpenSearch 101: Telefonun Başında Çaresiz Bekliyorum (veriyi)',
        excerpt:
          'OpenSearch tarafında gerçek trafik verisiyle arama, indeksleme ve analitik akışlarını sahadan örneklerle anlattığım yazı.',
        readingTime: '7 dk okuma',
        href: 'https://medium.com/@fatihozkurt/opensearch-101-telefonun-ba%C5%9F%C4%B1nda-%C3%A7aresiz-bekliyorum-veriyi-505b810f9175',
      },
      {
        id: 'let-me-in-auth',
        title: 'Let Me In: JWT, OAuth, Session, Cookie, Refresh Token, CSRF',
        excerpt:
          'Modern kimlik doğrulama ve oturum yönetimini güvenli ama anlaşılır bir backend akışına nasıl dönüştürdüğümü anlattığım rehber.',
        readingTime: '9 dk okuma',
        href: 'https://medium.com/@fatihozkurt/let-me-in-jwt-oauth-session-cookie-refresh-token-csrf-yani-neredeyse-arad%C4%B1%C4%9F%C4%B1m%C4%B1z-her-%C5%9Fey-f488a7f3e3f8',
      },
      {
        id: 'cache-me-if-you-can',
        title: 'Cache Me If You Can: Redis DB ve Caching',
        excerpt:
          'Redis cache desenleri, performans etkisi ve backend tarafında doğru kullanım kararlarını topladığım pratik notlar.',
        readingTime: '6 dk okuma',
        href: 'https://medium.com/@fatihozkurt/redis-ile-e%C4%9Flenceli-bir-yolculuk-nosqlden-cache-lemeye-f4c5ecc0124b',
      },
    ]
  }

  return [
    {
      id: 'opensearch-101',
      title: 'OpenSearch 101: Telefonun Başında Çaresiz Bekliyorum (veriyi)',
      excerpt:
        'A practical walkthrough of search, indexing, and analytics patterns with OpenSearch on real traffic-style data.',
      readingTime: '7 min read',
      href: 'https://medium.com/@fatihozkurt/opensearch-101-telefonun-ba%C5%9F%C4%B1nda-%C3%A7aresiz-bekliyorum-veriyi-505b810f9175',
    },
    {
      id: 'let-me-in-auth',
      title: 'Let Me In: JWT, OAuth, Session, Cookie, Refresh Token, CSRF',
      excerpt:
        'A deep but practical guide to modern authentication and session management for secure backend applications.',
      readingTime: '9 min read',
      href: 'https://medium.com/@fatihozkurt/let-me-in-jwt-oauth-session-cookie-refresh-token-csrf-yani-neredeyse-arad%C4%B1%C4%9F%C4%B1m%C4%B1z-her-%C5%9Fey-f488a7f3e3f8',
    },
    {
      id: 'cache-me-if-you-can',
      title: 'Cache Me If You Can: Redis DB ve Caching',
      excerpt:
        'A concise write-up on Redis caching patterns, performance impact, and practical backend decisions.',
      readingTime: '6 min read',
      href: 'https://medium.com/@fatihozkurt/redis-ile-e%C4%9Flenceli-bir-yolculuk-nosqlden-cache-lemeye-f4c5ecc0124b',
    },
  ]
}

export function getContactLinks(locale) {
  if (locale === 'tr') {
    return [
      { label: 'E-posta', value: 'fatihozkurt.dev@gmail.com', href: 'mailto:fatihozkurt.dev@gmail.com', icon: 'mail' },
      {
        label: 'LinkedIn',
        value: 'linkedin.com/in/fatih-özkurt-93748321a',
        href: 'https://www.linkedin.com/in/fatih-%C3%B6zkurt-93748321a/',
        icon: 'linkedin',
      },
      {
        label: 'GitHub',
        value: 'github.com/fatihhozkurt',
        href: 'https://github.com/fatihhozkurt',
        icon: 'github',
      },
      {
        label: 'Medium',
        value: 'medium.com/@fatihozkurt',
        href: 'https://medium.com/@fatihozkurt',
        icon: 'medium',
      },
    ]
  }

  return [
    { label: 'Mail', value: 'fatihozkurt.dev@gmail.com', href: 'mailto:fatihozkurt.dev@gmail.com', icon: 'mail' },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/fatih-özkurt-93748321a',
      href: 'https://www.linkedin.com/in/fatih-%C3%B6zkurt-93748321a/',
      icon: 'linkedin',
    },
    {
      label: 'GitHub',
      value: 'github.com/fatihhozkurt',
      href: 'https://github.com/fatihhozkurt',
      icon: 'github',
    },
    {
      label: 'Medium',
      value: 'medium.com/@fatihozkurt',
      href: 'https://medium.com/@fatihozkurt',
      icon: 'medium',
    },
  ]
}
