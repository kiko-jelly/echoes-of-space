const API_BASE = '/api';

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch statistics');
  return res.json();
}

export async function fetchObjects(params = {}) {
  const query = new URLSearchParams();
  if (params.body) query.append('body', params.body);
  if (params.category) query.append('category', params.category);
  if (params.status) query.append('status', params.status);
  if (params.confidence) query.append('confidence', params.confidence);
  if (params.search) query.append('search', params.search);
  if (params.mission_id) query.append('mission_id', params.mission_id);

  const res = await fetch(`${API_BASE}/objects?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch objects');
  return res.json();
}

export async function fetchObjectBySlug(slug) {
  const res = await fetch(`${API_BASE}/objects/${slug}`);
  if (!res.ok) throw new Error(`Failed to fetch object '${slug}'`);
  return res.json();
}

export async function fetchRandomObject() {
  const res = await fetch(`${API_BASE}/objects/random`);
  if (!res.ok) throw new Error('Failed to fetch random object');
  return res.json();
}

export async function fetchMissions(body = null) {
  const query = body ? `?body=${encodeURIComponent(body)}` : '';
  const res = await fetch(`${API_BASE}/missions${query}`);
  if (!res.ok) throw new Error('Failed to fetch missions');
  return res.json();
}

export async function fetchQuiz(difficulty = 'all', limit = 10) {
  const res = await fetch(`${API_BASE}/quiz?difficulty=${difficulty}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch quiz questions');
  return res.json();
}

export async function fetchBadges() {
  const res = await fetch(`${API_BASE}/badges`);
  if (!res.ok) throw new Error('Failed to fetch badges');
  return res.json();
}
