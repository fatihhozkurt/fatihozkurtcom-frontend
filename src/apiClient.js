const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

function localeHeaders(locale) {
  if (!locale) {
    return {}
  }

  return {
    'X-Locale': locale,
  }
}

async function readResponse(response) {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return null
  }

  return response.json()
}

async function request(path, options = {}) {
  const baseUrl =
    API_BASE_URL ||
    (typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'http://localhost')
  const response = await fetch(new URL(path, baseUrl).toString(), options)
  const payload = await readResponse(response)

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`
    const message = payload?.message ?? fallbackMessage
    const error = new Error(message)
    error.status = response.status
    error.code = payload?.code ?? null
    throw error
  }

  return payload
}

export async function getPublicHero(locale) {
  return request('/api/v1/public/hero', {
    headers: localeHeaders(locale),
  })
}

export async function getPublicAbout(locale) {
  return request('/api/v1/public/about', {
    headers: localeHeaders(locale),
  })
}

export async function getPublicTechStack(locale) {
  return request('/api/v1/public/tech-stack', {
    headers: localeHeaders(locale),
  })
}

export async function getPublicProjects(locale) {
  return request('/api/v1/public/projects', {
    headers: localeHeaders(locale),
  })
}

export async function getPublicProjectDetail(projectId, locale) {
  return request(`/api/v1/public/projects/${projectId}`, {
    headers: localeHeaders(locale),
  })
}

export async function getPublicArticles(locale) {
  return request('/api/v1/public/articles', {
    headers: localeHeaders(locale),
  })
}

export async function getPublicResume(locale) {
  return request('/api/v1/public/resume', {
    headers: localeHeaders(locale),
  })
}

export async function getPublicContactProfile(locale) {
  return request('/api/v1/public/contact-profile', {
    headers: localeHeaders(locale),
  })
}

export async function postPublicContactMessage(payload, locale) {
  return request('/api/v1/public/contact-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...localeHeaders(locale),
    },
    body: JSON.stringify(payload),
  })
}

export async function postVisit(payload, locale) {
  return request('/api/v1/public/visits', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...localeHeaders(locale),
    },
    body: JSON.stringify(payload),
  })
}

export async function login(payload, locale) {
  return request('/api/v1/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...localeHeaders(locale),
    },
    body: JSON.stringify(payload),
  })
}

export async function refreshAccessToken(locale) {
  return request('/api/v1/auth/refresh', {
    method: 'POST',
    credentials: 'include',
    headers: localeHeaders(locale),
  })
}

export async function forgotPassword(payload, locale) {
  return request('/api/v1/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...localeHeaders(locale),
    },
    body: JSON.stringify(payload),
  })
}

export async function getCsrf(locale) {
  return request('/api/v1/auth/csrf', {
    credentials: 'include',
    headers: localeHeaders(locale),
  })
}

export async function logout(accessToken, csrfTokenPayload, locale) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    ...localeHeaders(locale),
  }

  if (csrfTokenPayload?.headerName && csrfTokenPayload?.token) {
    headers[csrfTokenPayload.headerName] = csrfTokenPayload.token
  }

  return request('/api/v1/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers,
  })
}

function adminAuthHeaders(accessToken, locale) {
  return {
    Authorization: `Bearer ${accessToken}`,
    ...localeHeaders(locale),
  }
}

export async function getAdminDashboardOverview(accessToken, locale) {
  return request('/api/v1/admin/dashboard/overview', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminAnalyticsOverview(accessToken, locale) {
  return request('/api/v1/admin/analytics/overview', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminCountryDistribution(accessToken, locale) {
  return request('/api/v1/admin/analytics/country-distribution', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminVisitTrend(accessToken, locale, days = 7) {
  return request(`/api/v1/admin/analytics/visits-trend?days=${days}`, {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminSecurityEvents(accessToken, locale) {
  return request('/api/v1/admin/security/events', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminFailedLogins(accessToken, locale) {
  return request('/api/v1/admin/security/failed-logins', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminResetEvents(accessToken, locale) {
  return request('/api/v1/admin/security/reset-events', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminAuditEvents(accessToken, locale) {
  return request('/api/v1/admin/security/audit-events', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminHero(accessToken, locale) {
  return request('/api/v1/admin/content/hero', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminAbout(accessToken, locale) {
  return request('/api/v1/admin/content/about', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminTechStack(accessToken, locale) {
  return request('/api/v1/admin/tech-stack', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminProjects(accessToken, locale) {
  return request('/api/v1/admin/projects', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminArticles(accessToken, locale) {
  return request('/api/v1/admin/articles', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminResume(accessToken, locale) {
  return request('/api/v1/admin/resume', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminContactProfile(accessToken, locale) {
  return request('/api/v1/admin/contact-profile', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

export async function getAdminContactMessages(accessToken, locale) {
  return request('/api/v1/admin/contact-messages', {
    headers: adminAuthHeaders(accessToken, locale),
  })
}

async function adminMutation(path, method, accessToken, payload, locale) {
  const csrf = await getCsrf(locale)
  const headers = {
    ...adminAuthHeaders(accessToken, locale),
    'Content-Type': 'application/json',
  }
  if (csrf?.headerName && csrf?.token) {
    headers[csrf.headerName] = csrf.token
  }

  return request(path, {
    method,
    credentials: 'include',
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  })
}

export async function updateAdminHero(accessToken, payload, locale) {
  return adminMutation('/api/v1/admin/content/hero', 'PUT', accessToken, payload, locale)
}

export async function updateAdminAbout(accessToken, payload, locale) {
  return adminMutation('/api/v1/admin/content/about', 'PUT', accessToken, payload, locale)
}

export async function updateAdminContactProfile(accessToken, payload, locale) {
  return adminMutation('/api/v1/admin/contact-profile', 'PUT', accessToken, payload, locale)
}

export async function createAdminTechItem(accessToken, payload, locale) {
  return adminMutation('/api/v1/admin/tech-stack', 'POST', accessToken, payload, locale)
}

export async function updateAdminTechItem(accessToken, id, payload, locale) {
  return adminMutation(`/api/v1/admin/tech-stack/${id}`, 'PUT', accessToken, payload, locale)
}

export async function deleteAdminTechItem(accessToken, id, locale) {
  return adminMutation(`/api/v1/admin/tech-stack/${id}`, 'DELETE', accessToken, null, locale)
}

export async function createAdminProject(accessToken, payload, locale) {
  return adminMutation('/api/v1/admin/projects', 'POST', accessToken, payload, locale)
}

export async function updateAdminProject(accessToken, id, payload, locale) {
  return adminMutation(`/api/v1/admin/projects/${id}`, 'PUT', accessToken, payload, locale)
}

export async function deleteAdminProject(accessToken, id, locale) {
  return adminMutation(`/api/v1/admin/projects/${id}`, 'DELETE', accessToken, null, locale)
}

export async function createAdminArticle(accessToken, payload, locale) {
  return adminMutation('/api/v1/admin/articles', 'POST', accessToken, payload, locale)
}

export async function updateAdminArticle(accessToken, id, payload, locale) {
  return adminMutation(`/api/v1/admin/articles/${id}`, 'PUT', accessToken, payload, locale)
}

export async function deleteAdminArticle(accessToken, id, locale) {
  return adminMutation(`/api/v1/admin/articles/${id}`, 'DELETE', accessToken, null, locale)
}

export async function replaceAdminResume(accessToken, payload, locale) {
  return adminMutation('/api/v1/admin/resume/replace', 'POST', accessToken, payload, locale)
}

export async function uploadAdminResume(accessToken, file, locale) {
  const csrf = await getCsrf(locale)
  const headers = {
    ...adminAuthHeaders(accessToken, locale),
  }
  if (csrf?.headerName && csrf?.token) {
    headers[csrf.headerName] = csrf.token
  }

  const formData = new FormData()
  formData.append('file', file)

  return request('/api/v1/admin/resume/upload', {
    method: 'POST',
    credentials: 'include',
    headers,
    body: formData,
  })
}
