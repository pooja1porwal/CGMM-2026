import { describe, it, expect } from 'vitest';
import { makeElement, reorder, documentSvg } from './editorUtils';
import { commitHistory, undoHistory, redoHistory } from './useEditorState';
import type { History } from './useEditorState';
describe('editor state', () => {
  const a = makeElement({ name: 'A' }),
    b = makeElement({ name: 'B' }),
    first = { elements: [a, b], background: '#ffffff' };
  it('undoes and redoes positions, colors and layer additions', () => {
    const h: History = { past: [], present: first, future: [] },
      second = {
        ...first,
        elements: [{ ...a, x: 90, rotation: 45, fill: '#123456' }, b, makeElement({ name: 'New' })],
      };
    const next = commitHistory(h, second);
    expect(undoHistory(next).present).toEqual(first);
    expect(redoHistory(undoHistory(next)).present).toEqual(second);
  });
  it('invalidates redo after a new edit', () => {
    const h: History = { past: [first], present: { ...first, background: '#123456' }, future: [] };
    const after = commitHistory(undoHistory(h), { ...first, background: '#000000' });
    expect(after.future).toHaveLength(0);
  });
  it('does not record no-op edits and bounds history to 80 changes', () => {
    let h: History = { past: [], present: first, future: [] };
    expect(commitHistory(h, first)).toBe(h);
    for (let i = 0; i < 100; i++) h = commitHistory(h, { ...first, elements: [{ ...a, x: i }] });
    expect(h.past).toHaveLength(80);
  });
  it('reorders without mutating the original and respects the boundaries', () => {
    const elements = [a, b];
    expect(reorder(elements, a.id, 1)).toEqual([b, a]);
    expect(elements).toEqual([a, b]);
    expect(reorder(elements, a.id, -1)).toBe(elements);
  });
  it('persists hidden layers but excludes them from visible rendering', () => {
    const svg = documentSvg({ elements: [{ ...a, visible: false }], background: 'transparent' });
    expect(svg).toContain('display="none"');
    expect(svg).not.toContain('<rect width="600" height="400"');
  });
});
