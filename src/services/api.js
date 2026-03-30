/**
 * Cliente HTTP para o backend do Agente Thales.
 * Gerencia token JWT automaticamente.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('thales_token');
}

function setToken(token) {
  localStorage.setItem('thales_token', token);
}

function removeToken() {
  localStorage.removeItem('thales_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Sessão expirada');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || 'Erro na requisição');
  }

  return res.json();
}

// Auth
export async function login(username, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(data.access_token);
  return data;
}

export async function setupPassword(password) {
  return request('/api/auth/setup', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export function logout() {
  removeToken();
}

export function isAuthenticated() {
  return !!getToken();
}

// Status
export async function getSystemStatus() {
  return request('/api/status');
}

export async function getHealth() {
  return request('/api/status/health');
}

export async function reindexVault() {
  return request('/api/status/rag/reindex', { method: 'POST' });
}

// Chat
export async function sendMessage(message, agent = null, conversationId = null) {
  return request('/api/chat/', {
    method: 'POST',
    body: JSON.stringify({
      message,
      agent,
      conversation_id: conversationId,
    }),
  });
}

// Conversations
export async function listConversations(params = {}) {
  const query = new URLSearchParams();
  if (params.agent) query.set('agent', params.agent);
  if (params.source) query.set('source', params.source);
  if (params.limit) query.set('limit', params.limit);
  if (params.offset) query.set('offset', params.offset);
  const qs = query.toString();
  return request(`/api/conversations/${qs ? '?' + qs : ''}`);
}

export async function getConversation(id) {
  return request(`/api/conversations/${id}`);
}

export async function getConversationStats() {
  return request('/api/conversations/stats');
}

export async function closeConversation(id) {
  return request(`/api/conversations/${id}/close`, { method: 'POST' });
}

export async function deleteConversation(id) {
  return request(`/api/conversations/${id}`, { method: 'DELETE' });
}

// Skills
export async function listSkills() {
  return request('/api/skills/');
}

export { getToken, setToken, removeToken };
