import {
  siDocker,
  siGithub,
  siJsonwebtokens,
  siMedium,
  siMinio,
  siOpenapiinitiative,
  siOpensearch,
  siPostgresql,
  siReact,
  siRedis,
  siSpringboot,
  siSpringsecurity,
  siTailwindcss,
} from 'simple-icons'
import { Sparkles } from 'lucide-react'

function JavaIcon({ size }) {
  return (
    <svg role="img" viewBox="0 0 24 24" width={size} height={size} aria-label="Java">
      <path
        d="M10.2 5.1c-.8 1-.5 1.9.4 2.7.9.8 1.3 1.4.3 2.4"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M13.2 4.3c-1 1.2-.7 2.2.3 3.1 1 .8 1.5 1.5.4 2.7"
        fill="none"
        stroke="#fdba74"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7.1 12.6h6.8c1.8 0 3.3 1.4 3.3 3.2 0 1.7-1.5 3.1-3.3 3.1H9.2c-1.9 0-3.4-1.4-3.4-3.1v-1.1"
        fill="none"
        stroke="#dbeafe"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 13.4h.8c1.2 0 2.2.9 2.2 2.1s-1 2.1-2.2 2.1H17"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.4 20.7h12" fill="none" stroke="#fdba74" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

const brandIconMap = {
  'spring boot': siSpringboot,
  'spring security': siSpringsecurity,
  postgresql: siPostgresql,
  redis: siRedis,
  opensearch: siOpensearch,
  docker: siDocker,
  github: siGithub,
  medium: siMedium,
  minio: siMinio,
  react: siReact,
  'tailwind css': siTailwindcss,
  'rest apis': siOpenapiinitiative,
  'jwt + csrf': siJsonwebtokens,
}

const customIconMap = {
  java: JavaIcon,
}

function getPath(path) {
  return Array.isArray(path) ? path.join(' ') : path
}

function getBrandIcon(name) {
  if (!name) {
    return null
  }

  return brandIconMap[String(name).toLowerCase()] ?? null
}

function isImageSource(value) {
  if (typeof value !== 'string') {
    return false
  }

  const normalized = value.trim().toLowerCase()
  if (!normalized) {
    return false
  }

  return (
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('data:image/') ||
    normalized.startsWith('/api/') ||
    normalized.startsWith('/assets/') ||
    normalized.startsWith('/uploads/') ||
    normalized.startsWith('/') ||
    /\.(svg|png|jpe?g|gif|webp|avif)(\?.*)?$/.test(normalized)
  )
}

export function BrandIcon({ name, iconKey, size = 16, fallback, color }) {
  const normalizedName = typeof name === 'string' ? name.trim() : ''
  const normalizedIconKey = typeof iconKey === 'string' ? iconKey.trim() : ''
  const lookupKey = normalizedIconKey && !isImageSource(normalizedIconKey) ? normalizedIconKey : normalizedName
  const imageSource = isImageSource(normalizedIconKey) ? normalizedIconKey : null
  const CustomIcon = customIconMap[lookupKey.toLowerCase()] ?? customIconMap[normalizedName.toLowerCase()]
  const icon = getBrandIcon(lookupKey) ?? getBrandIcon(normalizedName)
  const FallbackIcon = fallback ?? Sparkles

  if (imageSource) {
    return (
      <img
        src={imageSource}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    )
  }

  if (CustomIcon) {
    return <CustomIcon size={size} />
  }

  if (!icon) {
    return <FallbackIcon size={size} />
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-label={icon.title}
      style={{ color: color ?? `#${icon.hex}` }}
      fill="currentColor"
    >
      <path d={getPath(icon.path)} />
    </svg>
  )
}
