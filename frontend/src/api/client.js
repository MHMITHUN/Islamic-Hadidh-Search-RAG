const BASE = "/api";

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function searchHadiths(q, limit = 20) {
  return request(`/search?q=${encodeURIComponent(q)}&limit=${limit}`);
}

export function verifyText(text, limit = 5) {
  return request(`/search/verify?text=${encodeURIComponent(text)}&limit=${limit}`);
}

export function getCollections() {
  return request("/collections");
}

export function getByGrade(grade) {
  return request(`/collections/${encodeURIComponent(grade)}`);
}
