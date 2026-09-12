import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, FolderOpen, Menu, X } from 'lucide-react';
export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40">
        <path d="M11 10h12l6 7-6 6H11zm0 13h12l6 7H11z" fill="currentColor" />
        <circle cx="15" cy="16" r="2" fill="#703ee8" />
      </svg>
    </span>
  );
}
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <BrandMark />
          <span>
            BrandForge <small>STUDIO</small>
          </span>
        </Link>
        <button
          className="icon-button mobile-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
          {[
            ['/', 'Home'],
            ['/create', 'Create Logo'],
            ['/brand-kit', 'Brand Kit'],
            ['/?section=how', 'How It Works'],
            ['/about', 'About CG'],
          ].map(([to, label]) => (
            <NavLink
              end={to === '/'}
              className={({ isActive }) => (isActive && to !== '/?section=how' ? 'active' : '')}
              to={to}
              key={label}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/dashboard"
          className="btn btn-small btn-outline nav-brands"
          onClick={() => setOpen(false)}
        >
          <FolderOpen size={16} /> My Brands <ArrowUpRight size={15} />
        </Link>
      </div>
    </header>
  );
}
