import { useRef, useState, useCallback } from 'react';
import type { EditorDocument } from './editorTypes';
export interface History {
  past: EditorDocument[];
  present: EditorDocument;
  future: EditorDocument[];
}
export function commitHistory(h: History, doc: EditorDocument): History {
  if (JSON.stringify(h.present) === JSON.stringify(doc)) return h;
  return { past: [...h.past, h.present].slice(-80), present: doc, future: [] };
}
export function undoHistory(h: History): History {
  if (!h.past.length) return h;
  return { past: h.past.slice(0, -1), present: h.past.at(-1)!, future: [h.present, ...h.future] };
}
export function redoHistory(h: History): History {
  if (!h.future.length) return h;
  return {
    past: [...h.past, h.present].slice(-80),
    present: h.future[0],
    future: h.future.slice(1),
  };
}
export function useEditorState(initial: EditorDocument) {
  const [history, setHistory] = useState<History>({ past: [], present: initial, future: [] }),
    gesture = useRef<EditorDocument | null>(null);
  const change = useCallback((doc: EditorDocument) => setHistory((h) => commitHistory(h, doc)), []);
  const begin = () => {
    gesture.current = history.present;
  };
  const preview = (doc: EditorDocument) => setHistory((h) => ({ ...h, present: doc }));
  const end = () => {
    const before = gesture.current;
    gesture.current = null;
    if (before)
      setHistory((h) =>
        JSON.stringify(before) === JSON.stringify(h.present)
          ? h
          : { past: [...h.past, before].slice(-80), present: h.present, future: [] },
      );
  };
  const undo = useCallback(() => setHistory(undoHistory), []),
    redo = useCallback(() => setHistory(redoHistory), []);
  return {
    doc: history.present,
    change,
    begin,
    preview,
    end,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
