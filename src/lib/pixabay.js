const API = "https://pixabay.com/api/";

function getKey() {
  const key = process.env.REACT_APP_PIXABAY_KEY;
  if (!key) throw new Error("No found REACT_APP_PIXABAY_KEY (checks .env)");
  return key;
}

export async function searchImages({ q, perPage = 24, page = 1 }) {
  const params = new URLSearchParams({
    key: getKey(),
    q,
    image_type: "photo",
    safesearch: "true",
    per_page: String(perPage),
    page: String(page),
  });
  const res = await fetch(`${API}?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); 
}

export async function getImageById(id) {
  const params = new URLSearchParams({
    key: getKey(),
    id: String(id),
  });
  const res = await fetch(`${API}?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.hits?.[0] || null;
}

export async function getAuthorImages({ userId, perPage = 50, page = 1 }) {
  const params = new URLSearchParams({
    key: getKey(),
    user_id: String(userId),
    image_type: "photo",
    safesearch: "true",
    per_page: String(perPage),
    page: String(page),
  });
  const res = await fetch(`${API}?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}