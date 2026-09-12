import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  ScanLine,
  PenTool,
  KeyRound,
  Palette,
  Download,
  MoveUpRight,
  Check,
} from 'lucide-react';
import { presets } from '../data/presets';
import { generateLogos } from '../generator/logoGenerator';
import LogoPreview from '../components/LogoPreview';
import DemoModal from '../components/DemoModal';
import PaletteStrip from '../components/PaletteStrip';
const samples = presets.map((b) => generateLogos(b));
export default function Home() {
  const [demo, setDemo] = useState(false),
    [frame, setFrame] = useState(0),
    [params] = useSearchParams();
  useEffect(() => {
    const timer = setInterval(() => setFrame((f) => (f + 1) % 3), 5500);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (params.get('section') === 'how')
      document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
  }, [params]);
  const featured = samples[frame][0];
  return (
    <>
      <main>
        <section className="hero page-width">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="status-dot" /> MEANING IN EVERY MARK
            </div>
            <h1>
              Create name-related logos using{' '}
              <span>
                Computer
                <br className="desktop-break" /> Graphics<span className="title-period">.</span>
              </span>
            </h1>
            <p className="hero-description">
              Generate meaningful SVG logos, color palettes, typography, and brand kits using a
              semantic vector graphics engine.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-large" to="/create">
                Generate My Logo <ArrowUpRight size={20} />
              </Link>
              <button className="btn btn-outline btn-large" onClick={() => setDemo(true)}>
                <Play size={16} /> Try Demo
              </button>
            </div>
            <div className="hero-note">
              <Check size={15} /> No API key. No credits. Just your creativity.
            </div>
          </div>
          <div className="hero-studio">
            <div className="studio-caption">
              <span>
                <span className="status-dot" /> YOUR NEXT IDENTITY STARTS HERE
              </span>
              <span>01 — 03</span>
            </div>
            <div className="floating-card card-back">
              <LogoPreview concept={samples[(frame + 1) % 3][1]} />
              <div className="mini-card-footer">
                <span>{presets[(frame + 1) % 3].brandName}</span>
                <ArrowUpRight size={15} />
              </div>
            </div>
            <div className="hero-featured" key={frame}>
              <div className="preview-card-top">
                <span>BRAND EXPLORATION</span>
                <PenTool size={15} />
              </div>
              <LogoPreview concept={featured} />
              <div className="hero-card-bottom">
                <div>
                  <strong>{presets[frame].brandName}</strong>
                  <span>
                    {presets[frame].industry} · {presets[frame].logoStyle}
                  </span>
                </div>
                <PaletteStrip palette={featured.palette} />
              </div>
            </div>
            <div className="semantic-sticker">
              <span className="purple-icon">
                <ScanLine size={21} />
              </span>
              <div>
                <strong>Looks like your name.</strong>
                <small>Symbols with a story behind them.</small>
              </div>
              <Check size={17} />
            </div>
            <span className="studio-cross cross-one">+</span>
            <span className="studio-cross cross-two">+</span>
            <div className="preview-dots">
              {presets.map((p, i) => (
                <button
                  key={p.brandName}
                  className={i === frame ? 'active' : ''}
                  onClick={() => setFrame(i)}
                  aria-label={`Preview ${p.brandName}`}
                />
              ))}
            </div>
          </div>
        </section>
        <div className="feature-strip">
          {[
            [ScanLine, 'Semantic Logo Generation'],
            [PenTool, 'Editable SVG Graphics'],
            [KeyRound, 'No API Key Required'],
            [Palette, 'Brand Kit Export'],
            [Download, 'PNG & SVG Download'],
          ].map(([Icon, text]) => {
            const I = Icon as typeof ScanLine;
            return (
              <span key={String(text)}>
                <I size={18} />
                {String(text)}
              </span>
            );
          })}
        </div>
        <section className="page-width how-section" id="how">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FROM A NAME TO AN IDENTITY</span>
              <h2>A little input. A lot of meaning.</h2>
            </div>
            <Link className="text-link" to="/about">
              The graphics behind it <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="how-grid">
            {[
              [
                '01',
                'Tell your brand’s story',
                'Share your name, industry, and personality. Every detail gives your logo more meaning.',
                ScanLine,
              ],
              [
                '02',
                'Find your visual direction',
                'Explore a larger gallery of original vector concepts, each with a clear connection to your brand.',
                Palette,
              ],
              [
                '03',
                'Make it unmistakably yours',
                'Edit every layer. Build your brand kit. Export crisp vectors and high-resolution images.',
                PenTool,
              ],
            ].map(([num, title, copy, Icon]) => {
              const I = Icon as typeof ScanLine;
              return (
                <article className="how-card" key={String(num)}>
                  <div className="row between">
                    <span className="step-number">{String(num)}</span>
                    <I size={25} />
                  </div>
                  <h3>{String(title)}</h3>
                  <p>{String(copy)}</p>
                </article>
              );
            })}
          </div>
        </section>
        <section className="page-width home-bottom">
          <div>
            <span className="eyebrow">BUILT WITH COMPUTER GRAPHICS</span>
            <h2>
              Vector by nature.
              <br />
              Yours by design.
            </h2>
          </div>
          <p>
            From a bun’s Bézier curve to a circuit’s connected nodes, every logo is built from
            editable geometry. See exactly how a name becomes a mark.
          </p>
          <Link to="/about" className="round-link" aria-label="Explore computer graphics">
            <MoveUpRight />
          </Link>
        </section>
      </main>
      <footer className="footer page-width">
        <span>
          BrandForge Studio <span className="muted">© {new Date().getFullYear()}</span>
        </span>
        <span>Semantic SVG Logo & Brand Identity Generator</span>
        <Link to="/create">
          Let’s create <ArrowRight size={15} />
        </Link>
      </footer>
      <DemoModal open={demo} onClose={() => setDemo(false)} />
    </>
  );
}
