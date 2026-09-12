import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, PenTool, Package, Download, Trash2, ArrowRight } from 'lucide-react';
import { loadProjects, deleteProject } from '../utils/storage';
import { useStudio } from '../components/StudioContext';
import LogoPreview from '../components/LogoPreview';
import { exportLogo } from '../utils/exportUtils';
import type { BrandProject } from '../types/logo';
export default function Dashboard() {
  const [projects, setProjects] = useState(loadProjects),
    [deleting, setDeleting] = useState<BrandProject | null>(null),
    { openProject, startNew, notify } = useStudio(),
    navigate = useNavigate(),
    dialog = useRef<HTMLDialogElement>(null);
  const open = (p: BrandProject, path: string) => {
    openProject(p);
    navigate(path);
  };
  return (
    <main className="page-width dashboard-page">
      <div className="page-intro row between">
        <div>
          <span className="eyebrow">YOUR CREATIVE SHELF</span>
          <h1>
            My Brands<span className="count-badge">{projects.length}</span>
          </h1>
          <p>Your saved identities, ready for their next chapter.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            startNew();
            navigate('/create');
          }}
        >
          <Plus size={18} /> Create a new brand
        </button>
      </div>
      <div className="storage-note">
        <FolderOpen size={16} /> Saved in this browser on this device. Download your brand kit to
        keep a portable copy.
      </div>
      {projects.length ? (
        <div className="dashboard-grid">
          {projects.map((p) => (
            <article className="saved-card" key={p.id}>
              <button
                className="saved-preview"
                onClick={() => open(p, '/editor')}
                aria-label={`Edit ${p.brand.brandName}`}
              >
                <LogoPreview concept={p.concept} />
              </button>
              <div className="saved-card-body">
                <div className="row between">
                  <h3>{p.brand.brandName}</h3>
                  <span className="tag">{p.brand.industry}</span>
                </div>
                <p>
                  Created{' '}
                  {new Date(p.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <div className="saved-actions">
                  <button className="btn btn-outline btn-small" onClick={() => open(p, '/editor')}>
                    <PenTool size={14} /> Edit
                  </button>
                  <button className="btn btn-ghost btn-small" onClick={() => open(p, '/brand-kit')}>
                    <Package size={14} /> Brand kit
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Download ${p.brand.brandName}`}
                    title="Download SVG"
                    onClick={() => {
                      void exportLogo(p.concept, 'svg').catch(() =>
                        notify('Download failed. Please try again.'),
                      );
                    }}
                  >
                    <Download size={15} />
                  </button>
                  <button
                    className="icon-button delete-action"
                    aria-label={`Delete ${p.brand.brandName}`}
                    title="Delete project"
                    onClick={() => {
                      setDeleting(p);
                      dialog.current?.showModal();
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state dashboard-empty">
          <div className="empty-brand-icon">
            <FolderOpen size={38} />
          </div>
          <h2>Your next big idea belongs here.</h2>
          <p>
            Generate a logo, make it yours, then choose Save project in the editor. Your brands will
            appear here.
          </p>
          <Link to="/create" className="btn btn-primary">
            Create your first brand <ArrowRight size={17} />
          </Link>
        </div>
      )}
      <dialog className="confirm-dialog" ref={dialog}>
        <h2>Delete {deleting?.brand.brandName}?</h2>
        <p>
          This removes the saved project from this browser. Previously downloaded files stay yours.
        </p>
        <div className="row">
          <button className="btn btn-outline" onClick={() => dialog.current?.close()}>
            Keep brand
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (!deleting) return;
              try {
                setProjects(deleteProject(deleting.id));
                notify('Saved brand deleted.');
                dialog.current?.close();
                setDeleting(null);
              } catch {
                notify('Could not update browser storage. Please try again.');
              }
            }}
          >
            Delete saved brand
          </button>
        </div>
      </dialog>
    </main>
  );
}
