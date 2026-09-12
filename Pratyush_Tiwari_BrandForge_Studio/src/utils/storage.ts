import type { BrandProject } from '../types/logo';
const KEY = 'brandforge.projects.v1';
export function loadProjects(): BrandProject[] {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(value)
      ? value.filter(
          (p) =>
            p &&
            typeof p.id === 'string' &&
            p.brand?.brandName &&
            Array.isArray(p.concept?.svgElements),
        )
      : [];
  } catch {
    return [];
  }
}
export function saveProject(project: BrandProject) {
  const next = loadProjects().filter((p) => p.id !== project.id);
  next.unshift(project);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
export function deleteProject(id: string) {
  const next = loadProjects().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
