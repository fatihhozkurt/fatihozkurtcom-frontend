export const uiText = {
  en: {
    lang: { tr: 'TR', en: 'EN' },
    brandSubtitle: 'backend portfolio',
    hero: {
      currentCandidate: 'Current candidate',
      originalBaseline: 'Original baseline',
      welcome: 'Welcome to my corner of the internet',
      name: 'Fatih Ozkurt',
      title: 'Java Backend Developer',
      description:
        'Secure APIs, disciplined service design, and modern product thinking with a strong focus on reliability, observability, and security.',
      explore: 'Explore',
    },
    sections: {
      about: {
        eyebrow: 'About',
        title: 'Backend-first engineering, presented with product-level taste.',
        description:
          'I care about the structure behind the interface: clean contracts, predictable behavior, operational visibility, and security decisions that survive real usage.',
        cards: {
          security: {
            title: 'Security-minded by default',
            description:
              'Rate limits, DTO boundaries, token rotation, CSRF-aware flows, and a deliberate reduction of exposed surface area.',
          },
          observability: {
            title: 'Observability built in',
            description:
              'Visits, security events, failed logins, and operational logs should be measurable and searchable from day one.',
          },
          service: {
            title: 'Disciplined service design',
            description:
              'Layered Spring structure, readable domain boundaries, and enough abstraction to scale without inventing accidental complexity.',
          },
          delivery: {
            title: 'Delivery-aware implementation',
            description:
              'Profiles, Dockerized runtime, env-driven configuration, and externalized assets keep deployment predictable.',
          },
        },
      },
      projects: {
        eyebrow: 'Projects',
        title: 'Cards for scanning, deeper views for technical texture.',
        description:
          'Each project opens into a larger overlay so README-like content can still breathe without breaking the one-page flow.',
        visualPlaceholder: 'visual placeholder',
        openDetails: 'Open details',
        github: 'GitHub',
      },
      writings: {
        eyebrow: 'Medium',
        title: 'Writing that matches the engineering style.',
        description:
          'Concise, opinionated articles around contracts, authentication, observability, and making backend choices that stay readable later.',
        readOnMedium: 'Read on Medium',
      },
      resume: {
        eyebrow: 'Resume',
        title: 'Prepared for a PDF-backed CV viewer.',
        description:
          'This area is designed to hold a MinIO-served PDF in production. For now, the interface shows the intended viewer frame, metadata strip, and download action.',
        currentCv: 'Current CV',
        downloadCv: 'Download CV',
        preview: 'Preview',
        highlights: 'Highlights',
        previewDescription:
          'This viewer frame is intentionally styled as a production-ready CV container. Once the backend asset pipeline is wired, the embedded PDF can replace this placeholder sheet without changing the surrounding layout.',
        highlightItems: [
          'Spring Boot API design and layered service architecture',
          'Security-first authentication and content management thinking',
          'Dockerized delivery with PostgreSQL, Redis, MinIO, and logs',
        ],
      },
      contact: {
        eyebrow: 'Contact',
        title: 'Easy to reach. Structured enough to scale.',
        description:
          'Public links stay visible, while the contact form area is already framed for backend delivery and secure outbound communication.',
        titleLabel: 'Title',
        emailLabel: 'Email',
        contentLabel: 'Content',
        subjectPlaceholder: 'Subject',
        emailPlaceholder: 'you@example.com',
        contentPlaceholder: 'Tell me about the role, the product, or the problem space.',
        sendMessage: 'Send message',
      },
    },
    footer: {
      copyright: 'Copyright (c) 2026 Fatih Ozkurt. All rights reserved.',
      note: 'Designed as a public surface for a backend engineer who still cares how systems feel.',
    },
    auth: {
      hiddenAccess: 'Hidden admin access',
      description: 'An admin entry surface kept separate from the public interface.',
      adminLogin: 'Admin login',
      passwordReset: 'Password reset',
      email: 'Email',
      username: 'Username',
      password: 'Password',
      login: 'Login',
      forgotPassword: 'Forgot your password?',
      resetHint:
        'Reset link delivery will become active once the backend is connected. This screen currently represents the prepared UI flow.',
      sendResetLink: 'Send reset link',
      backToLogin: 'Back to login',
      hiddenWorkspace: 'Hidden workspace',
      adminOperationsPreview: 'Admin operations preview',
      logout: 'Logout',
      navigation: 'Navigation',
      criticalLogs: 'Critical logs',
      controlPoints: 'Control points',
      navItems: ['Overview', 'Content', 'Projects', 'Writings', 'Resume', 'Security logs'],
      controlItems: [
        'Hero copy and title management',
        'Project and Medium card lifecycle',
        'CV asset replacement and download control',
        'Contact delivery configuration and mailbox checks',
      ],
    },
  },
  tr: {
    lang: { tr: 'TR', en: 'EN' },
    brandSubtitle: 'backend portfolyo',
    hero: {
      currentCandidate: 'Guncel aday',
      originalBaseline: 'Orijinal duzen',
      welcome: 'Internet koseme hos geldin',
      name: 'Fatih Ozkurt',
      title: 'Java Backend Developer',
      description:
        'Guvenli APIler, disiplinli servis tasarimi ve guvenilirlik, gozlemlenebilirlik ve guvenlige odaklanan modern urun dusuncesi.',
      explore: 'Kesfet',
    },
    sections: {
      about: {
        eyebrow: 'Hakkimda',
        title: 'Urun seviyesi estetikle sunulan backend-oncelikli muhendislik.',
        description:
          'Arayuzun arkasindaki yapiya onem veriyorum: temiz kontratlar, ongorulebilir davranis, operasyonel gorunurluk ve gercek kullanimda ayakta kalan guvenlik kararlari.',
        cards: {
          security: {
            title: 'Varsayilan olarak guvenlik odakli',
            description:
              'Rate limit, DTO sinirlari, token rotation, CSRF farkindalikli akislar ve acik yuzeyin bilincli sekilde azaltilmasi.',
          },
          observability: {
            title: 'Basta gozlemlenebilirlik',
            description:
              'Ziyaretler, guvenlik olaylari, basarisiz girisler ve operasyonel loglar ilk gunden olculebilir ve aranabilir olmali.',
          },
          service: {
            title: 'Disiplinli servis tasarimi',
            description:
              'Katmanli Spring yapisi, okunabilir domain sinirlari ve gereksiz karmasiklik uretmeden buyuyebilen soyutlama seviyesi.',
          },
          delivery: {
            title: 'Teslimat farkindalikli uygulama',
            description:
              'Profiller, Dockerli calisma ortami, env tabanli konfigurasyon ve dis kaynakli asset yapisi deploymenti ongorulebilir kilir.',
          },
        },
      },
      projects: {
        eyebrow: 'Projeler',
        title: 'Hizli tarama icin kartlar, teknik derinlik icin detayli gorunumler.',
        description:
          'Her proje daha buyuk bir overlay icinde acilir; boylece README benzeri icerik one-page akis bozulmadan nefes alabilir.',
        visualPlaceholder: 'gorsel alan',
        openDetails: 'Detaylari ac',
        github: 'GitHub',
      },
      writings: {
        eyebrow: 'Medium',
        title: 'Muhendislik tarzina uygun yazilar.',
        description:
          'Kontratlar, authentication, observability ve sonradan da okunabilir kalan backend kararlarina dair kisa ve gorus sahibi yazilar.',
        readOnMedium: 'Mediumda oku',
      },
      resume: {
        eyebrow: 'Ozgecmis',
        title: 'PDF tabanli CV goruntuleyici icin hazirlandi.',
        description:
          'Bu alan productionda MinIO uzerinden sunulan bir PDFi gosterecek sekilde tasarlandi. Simdilik hedeflenen viewer cercevesi, meta bilgi alani ve indirme aksiyonu gosteriliyor.',
        currentCv: 'Guncel CV',
        downloadCv: 'CV indir',
        preview: 'Onizleme',
        highlights: 'One cikanlar',
        previewDescription:
          'Bu viewer alani production-ready bir CV kapsayicisi gibi tasarlandi. Backend asset hatti baglandiginda gomulu PDF mevcut layout bozulmadan bunun yerine gecirilebilir.',
        highlightItems: [
          'Spring Boot API tasarimi ve katmanli servis mimarisi',
          'Guvenlik odakli authentication ve icerik yonetimi dusuncesi',
          'PostgreSQL, Redis, MinIO ve loglarla Dockerli teslimat',
        ],
      },
      contact: {
        eyebrow: 'Iletisim',
        title: 'Ulasmasi kolay. Buyumeye yetecek kadar duzenli.',
        description:
          'Acik baglantilar gorunur kalirken iletisim formu da backend teslimati ve guvenli dis iletisim icin hazir durumda.',
        titleLabel: 'Baslik',
        emailLabel: 'E-posta',
        contentLabel: 'Icerik',
        subjectPlaceholder: 'Konu',
        emailPlaceholder: 'you@example.com',
        contentPlaceholder: 'Rol, urun ya da problem alanindan bahset.',
        sendMessage: 'Mesaj gonder',
      },
    },
    footer: {
      copyright: 'Copyright (c) 2026 Fatih Ozkurt. Tum haklari saklidir.',
      note: 'Hala sistemlerin nasil hissettigini onemseyen bir backend muhendisi icin tasarlanmis public yuzey.',
    },
    auth: {
      hiddenAccess: 'Gizli admin girisi',
      description: 'Public arayuzden linklenmeyen, ayri kalan admin giris yuzeyi.',
      adminLogin: 'Admin girisi',
      passwordReset: 'Sifre sifirlama',
      email: 'E-posta',
      username: 'Kullanici adi',
      password: 'Sifre',
      login: 'Giris yap',
      forgotPassword: 'Sifreni mi unuttun?',
      resetHint:
        'Reset link gonderimi backend ile baglaninca aktif olacak. Bu ekran simdilik hazir arayuz akisidir.',
      sendResetLink: 'Reset linki gonder',
      backToLogin: 'Girise don',
      hiddenWorkspace: 'Gizli calisma alani',
      adminOperationsPreview: 'Admin panel onizlemesi',
      logout: 'Cikis yap',
      navigation: 'Navigasyon',
      criticalLogs: 'Kritik loglar',
      controlPoints: 'Kontrol alanlari',
      navItems: ['Genel bakis', 'Icerik', 'Projeler', 'Yazilar', 'Ozgecmis', 'Guvenlik loglari'],
      controlItems: [
        'Hero metni ve unvan yonetimi',
        'Proje ve Medium kart yasam dongusu',
        'CV asset degisimi ve indirme kontrolu',
        'Iletisim teslimati ve posta kutusu kontrolleri',
      ],
    },
  },
}
