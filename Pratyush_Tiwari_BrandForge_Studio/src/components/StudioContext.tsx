import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { BrandInput } from '../types/brand';
import type { LogoConcept, BrandProject } from '../types/logo';
import { emptyBrand } from '../data/presets';
import { saveProject, loadProjects } from '../utils/storage';
import { uid } from '../editor/editorUtils';
import { generateLogos } from '../generator/logoGenerator';
interface Studio {
  brand: BrandInput;
  setBrand: (b: BrandInput) => void;
  concepts: LogoConcept[];
  setConcepts: (c: LogoConcept[]) => void;
  selected: LogoConcept | null;
  select: (c: LogoConcept) => void;
  update: (c: LogoConcept) => void;
  save: () => boolean;
  openProject: (p: BrandProject) => void;
  notify: (s: string) => void;
  projectId: string | null;
  startNew: () => void;
}
const Context = createContext<Studio | null>(null);
function restore(): {
  brand: BrandInput;
  concepts: LogoConcept[];
  selected: LogoConcept | null;
  projectId: string | null;
} {
  try {
    const value = JSON.parse(sessionStorage.getItem('brandforge.draft') || 'null');
    if (
      value?.brand?.brandName &&
      Array.isArray(value.concepts) &&
      (!value.selected || Array.isArray(value.selected.svgElements))
    )
      return value;
  } catch {
    /* A new draft is safe when session storage is unavailable. */
  }
  return { brand: emptyBrand, concepts: [], selected: null, projectId: null };
}
export function StudioProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(restore),
    [brand, setBrand] = useState(initial.brand),
    [concepts, setConcepts] = useState(initial.concepts),
    [selected, setSelected] = useState(initial.selected),
    [projectId, setProjectId] = useState(initial.projectId),
    [message, setMessage] = useState('');
  const notify = useCallback((s: string) => setMessage(s), []);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 4500);
    return () => clearTimeout(t);
  }, [message]);
  useEffect(() => {
    try {
      sessionStorage.setItem(
        'brandforge.draft',
        JSON.stringify({ brand, concepts, selected, projectId }),
      );
    } catch {
      /* Saving explicitly still reports any localStorage failure. */
    }
  }, [brand, concepts, selected, projectId]);
  const select = (c: LogoConcept) => {
    setSelected(c);
    setProjectId(null);
  };
  const update = (c: LogoConcept) => {
    setSelected(c);
    setConcepts((prev) => prev.map((x) => (x.id === c.id ? c : x)));
  };
  const save = () => {
    if (!selected) return false;
    try {
      const id = projectId || uid(),
        old = loadProjects().find((p) => p.id === id);
      saveProject({
        id,
        createdAt: old?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        brand,
        concept: selected,
      });
      setProjectId(id);
      notify('Brand saved to My Brands on this device.');
      return true;
    } catch {
      notify(
        'Could not save: browser storage is full or disabled. Download your SVG or brand kit to keep your work.',
      );
      return false;
    }
  };
  const openProject = (p: BrandProject) => {
    setBrand(p.brand);
    setSelected(p.concept);
    const restored = generateLogos(p.brand);
    const slot = restored.findIndex((c) => c.layout === p.concept.layout);
    restored[slot < 0 ? 0 : slot] = p.concept;
    setConcepts(restored);
    setProjectId(p.id);
  };
  const startNew = () => {
    setBrand(emptyBrand);
    setSelected(null);
    setConcepts([]);
    setProjectId(null);
  };
  return (
    <Context.Provider
      value={{
        brand,
        setBrand,
        concepts,
        setConcepts,
        selected,
        select,
        update,
        save,
        openProject,
        notify,
        projectId,
        startNew,
      }}
    >
      {children}
      {message && (
        <div role="status" className="toast" onClick={() => setMessage('')}>
          {message}
        </div>
      )}
    </Context.Provider>
  );
}
export function useStudio() {
  const value = useContext(Context);
  if (!value) throw new Error('StudioProvider is required');
  return value;
}
