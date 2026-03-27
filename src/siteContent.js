export function getNavigationItems(locale) {
  if (locale === 'tr') {
    return [
      { id: 'home', label: 'Ana Sayfa' },
      { id: 'about', label: 'Hakkımda' },
      { id: 'projects', label: 'Projeler' },
      { id: 'writings', label: 'Medium' },
      { id: 'resume', label: 'Özgeçmiş' },
      { id: 'contact', label: 'İletişim' },
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
        id: 'portfolio-platform',
        category: 'kişisel proje',
        title: 'Personal Portfolio Platform',
        accent: 'Portfolio',
        summary:
          'React ve Spring Boot tabanlı, içerikleri yönetilebilir ve güvenlik odaklı kurgulanmış kişisel portfolyo platformu.',
        stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'React', 'Tailwind'],
        repository: 'https://github.com/fatihozkurt',
        liveUrl: '#',
        readme: {
          intro:
            'Kendi çalışmalarımı, yazılarımı ve özgeçmişimi tek bir sade yüzeyde sunmak için tasarladığım kişisel portfolyo projesi.',
          sections: [
            {
              title: 'Öne çıkanlar',
              items: [
                'One-page public arayüz',
                'Ayrı admin girişi ve yönetim alanı',
                'Projeler, Medium yazıları ve CV için yönetilebilir içerik yapısı',
              ],
            },
            {
              title: 'Teknik notlar',
              items: [
                'Spring Boot REST API yaklaşımı',
                'PostgreSQL, Redis ve MinIO ile uyumlu altyapı planı',
                'Docker ve env tabanlı çalışma mantığı',
              ],
            },
          ],
        },
      },
      {
        id: 'traffic-insights',
        category: 'backend demo',
        title: 'Traffic Insights',
        accent: 'Analytics',
        summary:
          'API trafiği, filtreleme, arama ve toplulaştırma senaryoları için OpenSearch odaklı Spring Boot demo uygulaması.',
        stack: ['Java', 'Spring Boot', 'OpenSearch', 'PostgreSQL'],
        repository: 'https://github.com/fatihozkurt',
        liveUrl: '#',
        readme: {
          intro:
            'OpenSearch ile backend tarafında arama, filtreleme ve istatistik üretimini daha gerçekçi bir senaryoda göstermek için geliştirdiğim çalışma.',
          sections: [
            {
              title: 'Kapsam',
              items: [
                'Trafik kayıtlarının indekslenmesi',
                'Arama ve filtreleme endpointleri',
                'İstatistik ve aggregation odaklı sonuçlar',
              ],
            },
            {
              title: 'Odak noktası',
              items: [
                'Temiz katmanlı mimari',
                'DTO ve validation kullanımı',
                'Gözlemlenebilir veri akışı',
              ],
            },
          ],
        },
      },
      {
        id: 'auth-content-admin',
        category: 'full stack',
        title: 'Auth and Content Admin',
        accent: 'Admin',
        summary:
          'Authentication, yetkilendirme ve içerik yönetimi akışlarını tek panelde toplayan admin odaklı uygulama tasarımı.',
        stack: ['Java', 'Spring Security', 'React', 'MinIO'],
        repository: 'https://github.com/fatihozkurt',
        liveUrl: '#',
        readme: {
          intro:
            'Güvenli giriş, şifre sıfırlama ve içerik yönetimi gibi akışları daha düzenli ve sürdürülebilir kılmak için hazırlanan admin odaklı çalışma.',
          sections: [
            {
              title: 'İçerik yönetimi',
              items: [
                'Hero alanı ve metin güncelleme',
                'Proje ve yazı kartlarını yönetme',
                'CV ve iletişim alanlarını güncelleme',
              ],
            },
            {
              title: 'Güvenlik',
              items: [
                'Authentication ve oturum yönetimi',
                'Rate limit ve audit log yaklaşımı',
                'Yetki sınırları için ayrık admin yüzeyi',
              ],
            },
          ],
        },
      },
    ]
  }

  return [
    {
      id: 'portfolio-platform',
      category: 'personal project',
      title: 'Personal Portfolio Platform',
      accent: 'Portfolio',
      summary:
        'A personal portfolio platform built with React and Spring Boot, designed around manageable content and a security-minded structure.',
      stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'React', 'Tailwind'],
      repository: 'https://github.com/fatihozkurt',
      liveUrl: '#',
      readme: {
        intro:
          'A personal platform designed to present my work, writing, and resume in a clean public surface with room for secure content management.',
        sections: [
          {
            title: 'Highlights',
            items: [
              'One-page public interface',
              'Separate admin access and management surface',
              'Manageable content for projects, writings, and resume assets',
            ],
          },
          {
            title: 'Technical notes',
            items: [
              'Spring Boot REST API approach',
              'PostgreSQL, Redis, and MinIO friendly structure',
              'Docker and environment-based runtime setup',
            ],
          },
        ],
      },
    },
    {
      id: 'traffic-insights',
      category: 'backend demo',
      title: 'Traffic Insights',
      accent: 'Analytics',
      summary:
        'A Spring Boot demo focused on OpenSearch-backed traffic analysis, filtering, search, and aggregation use cases.',
      stack: ['Java', 'Spring Boot', 'OpenSearch', 'PostgreSQL'],
      repository: 'https://github.com/fatihozkurt',
      liveUrl: '#',
      readme: {
        intro:
          'A focused backend demo that shows how search, filtering, and statistics can be structured cleanly around operational traffic data.',
        sections: [
          {
            title: 'Scope',
            items: [
              'Traffic record indexing',
              'Search and filtering endpoints',
              'Statistics and aggregation outputs',
            ],
          },
          {
            title: 'Focus',
            items: [
              'Clean layered architecture',
              'DTO and validation usage',
              'Observable data flow',
            ],
          },
        ],
      },
    },
    {
      id: 'auth-content-admin',
      category: 'full stack',
      title: 'Auth and Content Admin',
      accent: 'Admin',
      summary:
        'An admin-oriented application design that brings authentication, authorization, and content management flows into one surface.',
      stack: ['Java', 'Spring Security', 'React', 'MinIO'],
      repository: 'https://github.com/fatihozkurt',
      liveUrl: '#',
      readme: {
        intro:
          'A practical admin-focused project built around secure login flows, password reset, and manageable content operations.',
        sections: [
          {
            title: 'Content management',
            items: [
              'Hero and profile copy updates',
              'Project and writing card management',
              'Resume and contact area updates',
            ],
          },
          {
            title: 'Security',
            items: [
              'Authentication and session flow design',
              'Rate limit and audit log thinking',
              'Separated admin surface for tighter access boundaries',
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
        id: 'secure-api-contracts',
        title: 'Güvenli API kontratları nasıl sade kalır?',
        excerpt:
          'Validation, DTO sınırları ve hata cevaplarını gereksiz karmaşıklık oluşturmadan nasıl daha okunabilir tuttuğuma dair kısa notlar.',
        readingTime: '6 dk okuma',
        href: 'https://medium.com/@fatihozkurt',
      },
      {
        id: 'hardening-spring-auth',
        title: 'Spring authentication akışlarını sağlamlaştırmak',
        excerpt:
          'Login, şifre sıfırlama ve brute-force koruması gibi başlıklarda daha düzenli bir backend yaklaşımı.',
        readingTime: '8 dk okuma',
        href: 'https://medium.com/@fatihozkurt',
      },
      {
        id: 'observability-matters',
        title: 'Observability neden baştan düşünülmeli?',
        excerpt:
          'Küçük projelerde bile log, metrik ve olay görünürlüğünün neden fark yarattığına dair kısa bir çerçeve.',
        readingTime: '5 dk okuma',
        href: 'https://medium.com/@fatihozkurt',
      },
    ]
  }

  return [
    {
      id: 'secure-api-contracts',
      title: 'How secure API contracts stay readable',
      excerpt:
        'Short notes on validation, DTO boundaries, and error responses without turning a backend into framework noise.',
      readingTime: '6 min read',
      href: 'https://medium.com/@fatihozkurt',
    },
    {
      id: 'hardening-spring-auth',
      title: 'Hardening Spring authentication flows',
      excerpt:
        'A cleaner backend approach to login, password reset, and brute-force protection.',
      readingTime: '8 min read',
      href: 'https://medium.com/@fatihozkurt',
    },
    {
      id: 'observability-matters',
      title: 'Why observability should be part of the first draft',
      excerpt:
        'A compact view on why logs, metrics, and operational signals matter even in smaller systems.',
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
      { label: 'Medium', value: 'medium.com/@fatihozkurt', href: 'https://medium.com/@fatihozkurt', icon: 'medium' },
    ]
  }

  return [
    { label: 'Mail', value: 'fatih@example.com', href: 'mailto:fatih@example.com', icon: 'mail' },
    { label: 'LinkedIn', value: 'linkedin.com/in/fatihozkurt', href: 'https://www.linkedin.com/in/fatihozkurt/', icon: 'linkedin' },
    { label: 'GitHub', value: 'github.com/fatihozkurt', href: 'https://github.com/fatihozkurt', icon: 'github' },
    { label: 'Medium', value: 'medium.com/@fatihozkurt', href: 'https://medium.com/@fatihozkurt', icon: 'medium' },
  ]
}
