import { useState } from 'react';
import { Download, LoaderCircle } from 'lucide-react';
import type { LogoConcept } from '../types/logo';
import { exportLogo } from '../utils/exportUtils';
import { useStudio } from './StudioContext';
export default function ExportButtons({
  concept,
  full = false,
}: {
  concept: LogoConcept;
  full?: boolean;
}) {
  const [busy, setBusy] = useState('');
  const { notify } = useStudio();
  async function run(format: 'svg' | 'png' | 'jpeg', transparent = false) {
    setBusy(format);
    try {
      await exportLogo(concept, format, transparent);
      notify(`${format.toUpperCase()} download ready.`);
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Export failed.');
    } finally {
      setBusy('');
    }
  }
  return (
    <div className="export-buttons">
      {(['svg', 'png', ...(full ? ['jpeg'] : [])] as ('svg' | 'png' | 'jpeg')[]).map((f) => (
        <button
          className="btn btn-small btn-ghost"
          key={f}
          disabled={!!busy}
          onClick={() => run(f)}
          aria-label={`Download ${f.toUpperCase()}`}
        >
          {busy === f ? <LoaderCircle size={15} className="spin" /> : <Download size={15} />}{' '}
          {f.toUpperCase()}
        </button>
      ))}
      {full && (
        <button
          className="btn btn-small btn-ghost"
          disabled={!!busy}
          onClick={() => run('png', true)}
        >
          Transparent PNG
        </button>
      )}
    </div>
  );
}
