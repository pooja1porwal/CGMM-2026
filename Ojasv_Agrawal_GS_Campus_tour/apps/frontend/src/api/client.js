const configuredUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = (configuredUrl || (import.meta.env.DEV ? "http://localhost:4000/api" : "/api")).replace(/\/+$/, "");
const TOKEN = "sgsits_admin_token", USER = "sgsits_admin_user";
export const setSession = ({ token, user }) => { localStorage.setItem(TOKEN, token); localStorage.setItem(USER, JSON.stringify(user)); };
export const clearSession = () => { localStorage.removeItem(TOKEN); localStorage.removeItem(USER); };
export const getSavedUser = () => { try { return JSON.parse(localStorage.getItem(USER)); } catch { return null; } };
async function request(path, options = {}) { const headers = new Headers(options.headers); const token = localStorage.getItem(TOKEN); if (token) headers.set("Authorization", `Bearer ${token}`); if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json"); const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000); try { const response = await fetch(`${API_URL}${path}`, { ...options, headers, signal: controller.signal }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.message ?? `Request failed (${response.status})`); return data; } catch (error) { if (error.name === "AbortError") throw new Error("The campus API took too long to respond. Please retry."); throw new Error(error.message === "Failed to fetch" ? "Cannot reach the campus API. Check the deployment URL and CORS settings." : error.message); } finally { clearTimeout(timeout); } }
export const apiUrl = API_URL;
export const api = {
  getPlaces: () => request("/places"), getRoutes: () => request("/routes"),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  createPlace: body => request("/places", {method:"POST",body}), updatePlace: (id,body)=>request(`/places/${id}`,{method:"PATCH",body}), deletePlace:id=>request(`/places/${id}`,{method:"DELETE"}),
  deleteMedia:id=>request(`/media/${id}`,{method:"DELETE"}), createRoute:body=>request("/routes",{method:"POST",body}),
  updateRoute:(id,body)=>request(`/routes/${id}`,{method:"PATCH",body}), deleteRoute:id=>request(`/routes/${id}`,{method:"DELETE"}), deleteRouteMedia:id=>request(`/route-media/${id}`,{method:"DELETE"}),
};
