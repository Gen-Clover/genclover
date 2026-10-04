/**
 * Calls to the admin API. The session cookie is httpOnly, so this file never
 * sees it; the X-GC-Admin header is what the server checks to reject
 * cross-site requests.
 */
export class AdminApiError extends Error {
  constructor(message, status, errors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

const request = async (method, path, body) => {
  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'X-GC-Admin': '1',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new AdminApiError(data.message || 'Something went wrong.', response.status, data.errors)
  }
  return data
}

export const adminApi = {
  session: () => request('GET', '/api/admin/auth'),
  login: (email, password) => request('POST', '/api/admin/auth', { email, password }),
  logout: () => request('DELETE', '/api/admin/auth'),
  listJobs: () => request('GET', '/api/admin/jobs').then((d) => d.jobs),
  createJob: (job) => request('POST', '/api/admin/jobs', { job }).then((d) => d.job),
  updateJob: (id, job) => request('PUT', `/api/admin/jobs?id=${encodeURIComponent(id)}`, { job }).then((d) => d.job),
  visits: (days) => request('GET', `/api/admin/visits?days=${days}`),
  visitor: (id) => request('GET', `/api/admin/visits?visitor=${encodeURIComponent(id)}`),
  deleteJob: (id) => request('DELETE', `/api/admin/jobs?id=${encodeURIComponent(id)}`),
}
