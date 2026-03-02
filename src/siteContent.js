export function getNavigationItems(locale) {
  if (locale === 'tr') {
    return [
      { id: 'home', label: 'Ana Sayfa' },
      { id: 'about', label: 'Hakkimda' },
      { id: 'projects', label: 'Projeler' },
      { id: 'writings', label: 'Medium' },
      { id: 'resume', label: 'Ozgecmis' },
      { id: 'contact', label: 'Iletisim' },
    ]
  }

  return [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'writings', label: 'Medium' },
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
  { name: 'Docker', category: 'platform', icon: 'container' },
  { name: 'MinIO', category: 'storage', icon: 'box' },
  { name: 'React', category: 'frontend', icon: 'monitor' },
  { name: 'Tailwind CSS', category: 'frontend', icon: 'palette' },
  { name: 'REST APIs', category: 'backend', icon: 'network' },
  { name: 'JWT + CSRF', category: 'security', icon: 'key-round' },
]

export function getProjects(locale) {
  if (locale === 'tr') {
    return [
      {
        id: 'portfolio-core',
        category: 'one cikan mimari',
        title: 'Kisisel Platform Cekirdegi',
        accent: 'Portfolyo',
        summary:
          'Public portfolyo sayfalari, CMS benzeri admin kontrolleri ve gozlemlenebilirlik odakli backend kararlarini bir araya getiren guvenli bir kisisel web platformu.',
        stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'React', 'Tailwind'],
        repository: 'https://github.com/fatihozkurt',
        liveUrl: '#',
        readme: {
          intro:
            'Bu proje, tek bir public yuzey ile guvenli bir admin operasyon alanini ayni urun dili icinde birlestiren kisisel platform cekirdegi olarak dusunuldu.',
          sections: [
            {
              title: 'Odak',
              items: [
                'One-page public arayuz ve ayri admin giris yuzeyi',
                'Iceriklerin admin panelden yonetilebilmesi',
                'CV, projeler, Medium linkleri ve iletisim alanlarinin tek merkezden kontrolu',
              ],
            },
            {
              title: 'Mimari kararlar',
              items: [
                'Spring Boot REST API ve React public yuzey ayrimi',
                'Asset depolama icin MinIO, icerik ve kimlik verileri icin PostgreSQL',
                'Redis tabanli rate limiting ve oturum yardimci katmanlari',
              ],
            },
            {
              title: 'Beklenen sonuc',
              items: [
                'Temiz, guvenli ve bakimi kolay bir vitrin uygulamasi',
                'Ileride production veri akislariyla dogrudan genisleyebilen temel',
              ],
            },
          ],
        },
      },
      {
        id: 'event-observer',
        category: 'gozlemlenebilirlik',
        title: 'Trafik ve Guvenlik Gozlemcisi',
        accent: 'Observer',
        summary:
          'Ziyaretleri, supheli hareketleri ve operasyonel sinyalleri public yuzeyi gereksiz karmasiklastirmadan izleyen backend odakli analytics katmani.',
        stack: ['OpenSearch', 'Redis', 'PostgreSQL', 'Spring Security'],
        repository: 'https://github.com/fatihozkurt',
        liveUrl: '#',
        readme: {
          intro:
            'Observer parcasi, portfolyo sitesinin nasil kullanildigini ve guvenlik olaylarinin nerede yogunlastigini operasyonel olarak gormek icin tasarlandi.',
          sections: [
            {
              title: 'Toplanan sinyaller',
              items: [
                'Sayfa ziyaretleri ve temel trafik dagilimlari',
                'Basarisiz giris denemeleri ve rate-limit tetiklenmeleri',
                'Kritik admin hareketleri ve teslimat loglari',
              ],
            },
            {
              title: 'Teknik yon',
              items: [
                'Arama ve toplulastirma icin OpenSearch merkezli loglama',
                'Guvenlik olaylari icin ayri kod ve kategori duzeni',
                'Dashboard tarafinda kolay taranabilen metrik kartlari ve listeler',
              ],
            },
          ],
        },
      },
      {
        id: 'content-admin',
        category: 'admin deneyimi',
        title: 'Icerik Operasyon Alani',
        accent: 'Control',
        summary:
          'Hero metni, proje kartlari, Medium linkleri, CV dosyalari ve iletisim kanallarini tek bir guvenli yuzeyden yonetmeye odaklanan pratik admin deneyimi.',
        stack: ['React', 'Tailwind', 'REST API', 'MinIO'],
        repository: 'https://github.com/fatihozkurt',
        liveUrl: '#',
        readme: {
          intro:
            'Bu alan, kisisel sitenin teknik olarak olgun ama guncellemesi zahmetsiz bir operasyon paneline sahip olmasi icin kurgulandi.',
          sections: [
            {
              title: 'Yonetilen alanlar',
              items: [
                'Hero metni, unvan ve giris icerigi',
                'Proje ve Medium kartlarinin eklenmesi, guncellenmesi ve kaldirilmasi',
                'CV yukleme, degistirme ve indirme kontrolu',
              ],
            },
            {
              title: 'Guvenlik ve akis',
              items: [
                'Ayrik auth girisi ve sifre sifirlama akisi',
                'Form, teslimat ve hata akislarina hazir hook noktalar',
                'Guvenlik loglarinin admin tarafinda kolay goruntulenmesi',
              ],
            },
          ],
        },
      },
    ]
  }

  return [
    {
      id: 'portfolio-core',
      category: 'featured architecture',
      title: 'Personal Platform Core',
      accent: 'Portfolio',
      summary:
        'A secure personal web platform with public portfolio pages, CMS-style admin controls, and observability-focused backend decisions.',
      stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'React', 'Tailwind'],
      repository: 'https://github.com/fatihozkurt',
      liveUrl: '#',
      readme: {
        intro:
          'This project was shaped as a personal platform core that keeps a public-facing portfolio and a secure admin workspace under one product language.',
        sections: [
          {
            title: 'Focus',
            items: [
              'One-page public interface with a separate admin entry surface',
              'Editable content managed from an admin workspace',
              'CV, projects, Medium links, and contact areas controlled from one place',
            ],
          },
          {
            title: 'Architecture choices',
            items: [
              'Spring Boot REST API separated from the React public surface',
              'MinIO for assets and PostgreSQL for content and identity data',
              'Redis-backed rate limiting and session support layers',
            ],
          },
          {
            title: 'Expected result',
            items: [
              'A clean, secure, maintainable showcase application',
              'A baseline that can grow directly into production-backed data flows',
            ],
          },
        ],
      },
    },
    {
      id: 'event-observer',
      category: 'observability',
      title: 'Traffic and Security Observer',
      accent: 'Observer',
      summary:
        'A backend-oriented analytics layer that tracks visits, suspicious activity, and operational signals without overengineering the public surface.',
      stack: ['OpenSearch', 'Redis', 'PostgreSQL', 'Spring Security'],
      repository: 'https://github.com/fatihozkurt',
      liveUrl: '#',
      readme: {
        intro:
          'The observer layer was designed to expose how the site is being used and where security events cluster operationally.',
        sections: [
          {
            title: 'Signals collected',
            items: [
              'Page visits and high-level traffic distribution',
              'Failed login attempts and rate-limit triggers',
              'Critical admin actions and delivery log visibility',
            ],
          },
          {
            title: 'Technical direction',
            items: [
              'OpenSearch-centered logging for search and aggregation',
              'Structured codes and categories for security events',
              'Dashboard-friendly metrics cards and operational lists',
            ],
          },
        ],
      },
    },
    {
      id: 'content-admin',
      category: 'admin ux',
      title: 'Content Operations Workspace',
      accent: 'Control',
      summary:
        'A practical admin experience for managing hero content, project cards, Medium links, resume assets, and contact channels from one secure surface.',
      stack: ['React', 'Tailwind', 'REST API', 'MinIO'],
      repository: 'https://github.com/fatihozkurt',
      liveUrl: '#',
      readme: {
        intro:
          'This workspace was planned to make the personal site technically mature without turning content updates into engineering chores.',
        sections: [
          {
            title: 'Managed areas',
            items: [
              'Hero copy, title, and first-impression content',
              'Project and Medium card creation, editing, and removal',
              'CV upload, replacement, and download control',
            ],
          },
          {
            title: 'Security and flow',
            items: [
              'Separate auth surface and password reset flow',
              'Prepared hook points for forms, delivery, and exception handling',
              'Operational visibility into security logs from the admin side',
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
        id: 'security-contracts',
        title: 'Guvenli API kontratlari nasil sade kalir?',
        excerpt:
          'Validation, DTO sinirlari ve hata cevaplari etrafinda karmasiklasmadan profesyonel kalan bir sozlesme duzeni.',
        readingTime: '6 dk okuma',
        href: 'https://medium.com/@fatihozkurt',
      },
      {
        id: 'spring-auth-hardening',
        title: 'Spring authentication akislarini sertlestirmek',
        excerpt:
          'Login, reset password, token rotation ve brute-force korumalarini urun odakli bir zihinle ele alma notlari.',
        readingTime: '8 dk okuma',
        href: 'https://medium.com/@fatihozkurt',
      },
      {
        id: 'observability-personal-site',
        title: 'Kisisel bir sitede observability neden onemli?',
        excerpt:
          'Portfolyo sitelerinde bile ziyaret, guvenlik ve teslimat sinyallerinin neden olculmeye deger olduguna dair kisa bir cerceve.',
        readingTime: '5 dk okuma',
        href: 'https://medium.com/@fatihozkurt',
      },
    ]
  }

  return [
    {
      id: 'security-contracts',
      title: 'How do secure API contracts stay readable?',
      excerpt:
        'A compact take on validation, DTO boundaries, and error responses that stay professional without turning into framework noise.',
      readingTime: '6 min read',
      href: 'https://medium.com/@fatihozkurt',
    },
    {
      id: 'spring-auth-hardening',
      title: 'Hardening Spring authentication flows',
      excerpt:
        'Notes on login, password reset, token rotation, and brute-force protection approached from a product-aware backend perspective.',
      readingTime: '8 min read',
      href: 'https://medium.com/@fatihozkurt',
    },
    {
      id: 'observability-personal-site',
      title: 'Why observability matters even on a personal site',
      excerpt:
        'A concise framework for measuring visits, security signals, and delivery events even when the product is a portfolio surface.',
      readingTime: '5 min read',
      href: 'https://medium.com/@fatihozkurt',
    },
  ]
}

export function getContactLinks(locale) {
  if (locale === 'tr') {
    return [
      { label: 'E-posta', value: 'fatih@example.com', href: 'mailto:fatih@example.com', icon: 'mail' },
      { label: 'LinkedIn', value: 'linkedin.com/in/fatihozkurt', href: 'https://www.linkedin.com/in/fatihozkurt/', icon: 'linkedin' },
      { label: 'GitHub', value: 'github.com/fatihozkurt', href: 'https://github.com/fatihozkurt', icon: 'github' },
      { label: 'Medium', value: 'medium.com/@fatihozkurt', href: 'https://medium.com/@fatihozkurt', icon: 'pen-square' },
    ]
  }

  return [
    { label: 'Mail', value: 'fatih@example.com', href: 'mailto:fatih@example.com', icon: 'mail' },
    { label: 'LinkedIn', value: 'linkedin.com/in/fatihozkurt', href: 'https://www.linkedin.com/in/fatihozkurt/', icon: 'linkedin' },
    { label: 'GitHub', value: 'github.com/fatihozkurt', href: 'https://github.com/fatihozkurt', icon: 'github' },
    { label: 'Medium', value: 'medium.com/@fatihozkurt', href: 'https://medium.com/@fatihozkurt', icon: 'pen-square' },
  ]
}
