import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadProjects, saveProject, deleteProject } from './storage';
import { generateLogos } from '../generator/logoGenerator';
import { presets } from '../data/presets';
describe('device-local projects', () => {
  const data = new Map<string, string>();
  beforeEach(() => {
    data.clear();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => data.get(k) || null,
      setItem: (k: string, v: string) => data.set(k, v),
    });
  });
  afterEach(() => vi.unstubAllGlobals());
  const project = {
    id: 'project-1',
    createdAt: '2026-09-05T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
    brand: presets[0],
    concept: generateLogos(presets[0])[0],
  };
  it('round-trips all editable SVG properties', () => {
    saveProject(project);
    expect(loadProjects()).toEqual([project]);
  });
  it('updates by project ID without duplicating the entry', () => {
    saveProject(project);
    saveProject({ ...project, brand: presets[1] });
    expect(loadProjects()).toHaveLength(1);
    expect(loadProjects()[0].brand.brandName).toBe('NovaTech');
  });
  it('deletes only the requested project', () => {
    saveProject(project);
    saveProject({ ...project, id: 'project-2' });
    deleteProject('project-1');
    expect(loadProjects().map((p) => p.id)).toEqual(['project-2']);
  });
  it('recovers from malformed browser storage', () => {
    data.set('brandforge.projects.v1', '{bad');
    expect(loadProjects()).toEqual([]);
    data.set('brandforge.projects.v1', '{}');
    expect(loadProjects()).toEqual([]);
  });
  it('propagates quota failures so the UI can report them', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('Quota exceeded');
      },
    });
    expect(() => saveProject(project)).toThrow('Quota exceeded');
  });
});
