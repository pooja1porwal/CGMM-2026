import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Check,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  ScanLine,
  Sparkles,
  Search,
  LayoutGrid,
} from 'lucide-react';
import { useStudio } from '../components/StudioContext';
import { generateLogos } from '../generator/logoGenerator';
import { analyzeBrand, iconSearchTags } from '../generator/semanticAnalyzer';
import { iconDescriptions } from '../generator/iconLibrary';
import LogoCard from '../components/LogoCard';
import type { Layout } from '../types/logo';
const stages = [
  'Reading brand name and keywords',
  'Detecting semantic category',
  'Choosing related symbols',
  'Building SVG geometry',
  'Applying colors and typography',
  'Creating brand identity variations',
];
export default function Generate() {
  const { brand, concepts, setConcepts } = useStudio(),
    location = useLocation(),
    navigate = useNavigate(),
    [stage, setStage] = useState(location.state?.generate ? 0 : 6),
    [error, setError] = useState(''),
    [layoutFilter, setLayoutFilter] = useState<Layout | 'All'>('All'),
    [logoSearch, setLogoSearch] = useState(''),
    brandRef = useRef(brand),
    semantic = analyzeBrand(brand);
  const layoutOptions = ['All', ...new Set(concepts.map((concept) => concept.layout))] as (
      Layout | 'All'
    )[],
    searchTerms = logoSearch
      .toLowerCase()
      .split(/\s+/)
      .map((term) => term.trim())
      .filter(Boolean),
    visibleConcepts = concepts.filter((concept) => {
      if (layoutFilter !== 'All' && concept.layout !== layoutFilter) return false;
      if (!searchTerms.length) return true;
      const symbol = concept.svgElements.find((element) => element.role === 'symbol')?.icon || '';
      const haystack = [
        concept.name,
        concept.layout,
        concept.category,
        concept.semanticConnection,
        symbol,
        symbol.replace(/-/g, ' '),
        iconDescriptions[symbol],
        ...(iconSearchTags[symbol] || []),
      ]
        .join(' ')
        .toLowerCase();
      return searchTerms.every((term) => haystack.includes(term));
    });
  useEffect(() => {
    if (!location.state?.generate) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i >= 6) {
        clearInterval(timer);
        try {
          setConcepts(generateLogos(brandRef.current));
          navigate('/generate', { replace: true, state: null });
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Generation failed.');
        }
      }
      setStage(i);
    }, 380);
    return () => clearInterval(timer);
  }, [location.key]);
  if (!brand.brandName || error)
    return (
      <main className="empty-state page-width">
        <ScanLine size={48} />
        <h1>{error || 'Give your brand a starting point.'}</h1>
        <p>Add a name and your creative preferences to generate a gallery of editable logos.</p>
        <Link className="btn btn-primary" to="/create">
          Create your brief <ArrowRight size={17} />
        </Link>
      </main>
    );
  if (stage < 6)
    return (
      <main className="generation-state">
        <div className="generation-orbit">
          <ScanLine size={44} />
          <span />
        </div>
        <span className="eyebrow">SEMANTIC GRAPHICS ENGINE</span>
        <h1>Giving {brand.brandName} a visual voice.</h1>
        <p>Original shapes. Thoughtful connections. Built right here.</p>
        <ol className="generation-steps">
          {stages.map((text, i) => (
            <li key={text} className={i < stage ? 'done' : i === stage ? 'current' : ''}>
              <span>{i < stage ? <Check size={15} /> : i + 1}</span>
              {text}
            </li>
          ))}
        </ol>
        <div className="progress-track">
          <span style={{ width: `${((stage + 1) / 6) * 100}%` }} />
        </div>
      </main>
    );
  if (!concepts.length)
    return (
      <main className="empty-state">
        <h1>Your canvas is ready.</h1>
        <Link to="/create" className="btn btn-primary">
          Build your brief
        </Link>
      </main>
    );
  return (
    <main className="page-width gallery-page">
      <Link className="back-link" to="/create">
        <ArrowLeft size={16} /> Your creative brief
      </Link>
      <div className="page-intro row between">
        <div>
          <span className="eyebrow">INSTANT EDITABLE LOGO GALLERY</span>
          <h1>Choose a direction for {brand.brandName}.</h1>
          <p>Vector concepts matched to your brief, ready to customize and export.</p>
        </div>
        <Link to="/create" className="btn btn-outline">
          <SlidersHorizontal size={16} /> Refine brief
        </Link>
      </div>
      <section className="logo-marketbar" aria-label="Logo search summary">
        <div className="logo-search-shell">
          <Search size={18} />
          <input
            value={logoSearch}
            onChange={(event) => setLogoSearch(event.target.value)}
            placeholder={`Search ${brand.brandName} logos, e.g. school, badge, cap`}
            aria-label="Search generated logos"
          />
          <span>{semantic.theme}</span>
          <span>{brand.logoStyle}</span>
        </div>
        <div className="logo-stats">
          <span>
            <LayoutGrid size={15} /> {visibleConcepts.length} of {concepts.length} results
          </span>
          <span>{semantic.symbols.length} matched symbols</span>
        </div>
      </section>
      <div className="gallery-insight">
        <div className="row">
          <span className="purple-icon">
            <Sparkles size={20} />
          </span>
          <div>
            <strong>{semantic.theme} detected</strong>
            <p>
              {semantic.keywords.length
                ? `Semantic cues: ${semantic.keywords.join(' · ')}`
                : semantic.source}
            </p>
          </div>
        </div>
        <div className="tag-row">
          {brand.personality.map((p) => (
            <span className="tag" key={p}>
              {p}
            </span>
          ))}
          <span className="tag outline">{brand.logoStyle}</span>
        </div>
      </div>
      <div className="gallery-filters" aria-label="Filter logo layouts">
        {layoutOptions.map((option) => (
          <button
            className={layoutFilter === option ? 'active' : ''}
            key={option}
            onClick={() => setLayoutFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="concept-grid">
        {visibleConcepts.map((c, i) => (
          <LogoCard key={c.id} concept={c} index={i} />
        ))}
      </div>
      <div className="gallery-end">
        <span>{visibleConcepts.length} shown. Every logo stays editable in the studio.</span>
        <Link to="/about">
          Explore the process <ArrowUpRightIcon />
        </Link>
      </div>
    </main>
  );
}
function ArrowUpRightIcon() {
  return <ArrowRight size={15} />;
}
