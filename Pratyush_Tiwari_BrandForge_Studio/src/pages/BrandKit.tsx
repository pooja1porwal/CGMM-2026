import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Download,
  Copy,
  Check,
  Palette,
  PenTool,
  Save,
  Package,
  LoaderCircle,
} from 'lucide-react';
import { useStudio } from '../components/StudioContext';
import LogoPreview from '../components/LogoPreview';
import BrandMockups from '../components/BrandMockups';
import { brandVariants } from '../generator/brandKitGenerator';
import { hexToRgb, contrast, validHex } from '../utils/colorUtils';
import { downloadSVG, downloadKit, rasterBlob } from '../utils/exportUtils';
import { documentSvg } from '../editor/editorUtils';
export default function BrandKit() {
  const { selected, brand, save, notify } = useStudio(),
    [tab, setTab] = useState('Identity'),
    [copied, setCopied] = useState(''),
    [busy, setBusy] = useState(false);
  if (!selected)
    return (
      <main className="empty-state">
        <Package size={45} />
        <h1>Your brand, all together.</h1>
        <p>
          Choose a logo concept to build your color palette, typography, logo variations, and
          mockups.
        </p>
        <Link to="/generate" className="btn btn-primary">
          Choose a concept <ArrowRight size={17} />
        </Link>
        <Link className="text-link" to="/dashboard">
          Open a saved brand
        </Link>
      </main>
    );
  const variants = brandVariants(selected),
    symbol = selected.svgElements.find((e) => e.role === 'symbol'),
    wordmark = selected.svgElements.find((e) => e.role === 'brand'),
    colors = [
      ...new Set(
        [
          symbol?.fill || selected.palette.primary,
          symbol?.secondary || selected.palette.secondary,
          symbol?.accent || selected.palette.accent,
          selected.background,
          wordmark?.fill || selected.palette.ink,
        ].filter(validHex),
      ),
    ];
  async function copy(color: string) {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(color);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      notify('Clipboard is unavailable here. Select and copy the HEX text.');
    }
  }
  async function bundle() {
    if (!selected) return;
    setBusy(true);
    try {
      const files: Record<string, string | Blob> = {};
      variants.forEach((v) => {
        files[`logos/${v.slug}.svg`] = v.svg;
      });
      files['raster/primary.png'] = await rasterBlob(selected.svg, 'png');
      files['raster/transparent.png'] = await rasterBlob(
        documentSvg(
          { elements: selected.svgElements, background: selected.background },
          { transparent: true },
        ),
        'png',
      );
      files['palette.json'] = JSON.stringify(
        colors.map((hex) => ({ hex, rgb: hexToRgb(hex) })),
        null,
        2,
      );
      files['brand-project.json'] = JSON.stringify({ brand, concept: selected }, null, 2);
      files['brand-guidelines.txt'] =
        `${brand.brandName} — Brand identity guidelines\n\n${brand.tagline}\n\nPersonality: ${brand.personality.join(', ')}\nIndustry: ${brand.industry}\n\nSemantic Connection\n${selected.semanticConnection}\n\nTypography\nLogo: ${wordmark?.fontFamily || selected.typography.family}\nBody: ${selected.typography.bodyFamily}\n${selected.typography.reasoning}\n\nPalette\n${colors.join('\n')}\n\nUsage\nKeep clear space of at least one quarter of the symbol width. Use the icon-only mark at small sizes. Preserve aspect ratio. Choose white artwork for dark backgrounds and black artwork for light backgrounds. Inspect legibility at the final size. Text remains live in SVG; the exact font depends on installed system fonts. PNG exports freeze the current appearance.\n\nExport contents\nNine SVG variations; primary and transparent PNG at 1800 x 1200; palette JSON; editable project JSON. Mockups are illustrative in-app previews.\nGenerated locally with BrandForge Studio. No API key or image-generation service.\n`;
      await downloadKit(files, brand.brandName);
      notify('Your complete brand kit ZIP is ready.');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Brand kit export failed.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="page-width kit-page">
      <Link to="/editor" className="back-link">
        <ArrowLeft size={16} /> Back to editor
      </Link>
      <div className="page-intro row between">
        <div>
          <span className="eyebrow">ONE IDENTITY. EVERY TOUCHPOINT.</span>
          <h1>The {brand.brandName} brand kit.</h1>
          <p>Your logo, colors, and voice. Ready to go out into the world.</p>
        </div>
        <div className="row">
          <button className="btn btn-outline" onClick={save}>
            <Save size={16} /> Save
          </button>
          <button className="btn btn-primary" disabled={busy} onClick={bundle}>
            {busy ? <LoaderCircle size={17} className="spin" /> : <Download size={17} />}{' '}
            {busy ? 'Preparing kit…' : 'Download brand kit'}
          </button>
        </div>
      </div>
      <div className="kit-tabs" role="tablist" aria-label="Brand kit sections">
        {['Identity', 'Colors & Type', 'Mockups'].map((t) => (
          <button
            role="tab"
            id={'tab-' + t}
            aria-selected={tab === t}
            aria-controls="kit-content"
            className={tab === t ? 'active' : ''}
            key={t}
            onClick={() => setTab(t)}
          >
            {t === 'Identity' ? (
              <PenTool size={16} />
            ) : t === 'Colors & Type' ? (
              <Palette size={16} />
            ) : (
              <Package size={16} />
            )}{' '}
            {t}
          </button>
        ))}
      </div>
      <section id="kit-content" role="tabpanel" aria-labelledby={'tab-' + tab}>
        {tab === 'Identity' && (
          <>
            <div className="kit-overview">
              <div className="kit-primary">
                <LogoPreview concept={selected} />
                <span className="kit-label">PRIMARY SIGNATURE</span>
              </div>
              <div className="kit-story">
                <span className="eyebrow">THE STORY BEHIND YOUR MARK</span>
                <h2>{selected.name}</h2>
                <p>{selected.semanticConnection}</p>
                <div className="tag-row">
                  {brand.personality.map((p) => (
                    <span className="tag" key={p}>
                      {p}
                    </span>
                  ))}
                </div>
                <div className="kit-detail">
                  <span>
                    Industry<strong>{selected.category}</strong>
                  </span>
                  <span>
                    Composition<strong>{selected.layout}</strong>
                  </span>
                </div>
                <Link className="text-link" to="/editor">
                  Fine-tune your logo <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <div className="section-heading kit-heading">
              <div>
                <span className="eyebrow">A FLEXIBLE VISUAL SYSTEM</span>
                <h2>A logo for every moment.</h2>
              </div>
              <span className="muted small">9 scalable SVG variations</span>
            </div>
            <div className="variant-grid">
              {variants.map((v) => (
                <article className="variant-card" key={v.slug}>
                  <div
                    className={
                      'variant-preview ' + (v.background === 'transparent' ? 'checkerboard' : '')
                    }
                    style={{
                      backgroundColor: v.background === 'transparent' ? undefined : v.background,
                    }}
                  >
                    <LogoPreview svg={v.svg} />
                  </div>
                  <div className="variant-caption">
                    <div>
                      <strong>{v.name}</strong>
                      <p>{v.description}</p>
                    </div>
                    <button
                      className="icon-button"
                      title={`Download ${v.name}`}
                      aria-label={`Download ${v.name}`}
                      onClick={() => downloadSVG(v.svg, brand.brandName + '-' + v.slug)}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="usage-box">
              <div>
                <h3>Give your logo room to breathe.</h3>
                <p>
                  Keep clear space of at least one quarter of the icon’s width. Use the icon-only
                  mark in small spaces, preserve proportions, and select the black or white version
                  for strong contrast.
                </p>
              </div>
              <div className="clearspace-demo">
                <span>¼ x</span>
                <LogoPreview svg={variants[2].svg} />
                <span>¼ x</span>
              </div>
            </div>
          </>
        )}
        {tab === 'Colors & Type' && (
          <>
            <div className="section-heading kit-heading">
              <div>
                <span className="eyebrow">YOUR COLOR LANGUAGE</span>
                <h2>A palette with personality.</h2>
              </div>
              <span className="muted small">Colors from your current logo</span>
            </div>
            <div className="color-palette-grid">
              {colors.map((c, i) => {
                const rgb = hexToRgb(c);
                return (
                  <article className="color-spec" key={c}>
                    <div style={{ background: c }}>
                      <span style={{ color: contrast(c, '#ffffff') > 4.5 ? 'white' : '#28212e' }}>
                        {
                          [
                            '01 / PRIMARY',
                            '02 / SECONDARY',
                            '03 / ACCENT',
                            '04 / SURFACE',
                            '05 / INK',
                          ][i]
                        }
                      </span>
                    </div>
                    <section>
                      <strong>{c.toUpperCase()}</strong>
                      <button
                        className="icon-button"
                        title="Copy HEX"
                        aria-label={`Copy ${c}`}
                        onClick={() => copy(c)}
                      >
                        {copied === c ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                      <small>
                        RGB {rgb.r}, {rgb.g}, {rgb.b}
                      </small>
                    </section>
                  </article>
                );
              })}
            </div>
            <div className="contrast-note">
              <Check size={16} />
              <span>
                Current wordmark/background contrast:{' '}
                <strong>
                  {contrast(
                    wordmark?.fill || selected.palette.ink,
                    validHex(selected.background) ? selected.background : '#ffffff',
                  ).toFixed(2)}
                  :1
                </strong>
                . Aim for 4.5:1 for small text. Transparent backgrounds are evaluated against white.
              </span>
            </div>
            <div className="section-heading kit-heading">
              <div>
                <span className="eyebrow">WORDS, WITH CHARACTER</span>
                <h2>Your typographic voice.</h2>
              </div>
            </div>
            <div className="typography-grid">
              <article className="type-spec">
                <span className="eyebrow">LOGO & HEADINGS</span>
                <h3
                  style={{
                    fontFamily: wordmark?.fontFamily || selected.typography.family,
                    fontWeight: wordmark?.fontWeight || selected.typography.weight,
                  }}
                >
                  Aa Bb Cc
                </h3>
                <strong>
                  {(wordmark?.fontFamily || selected.typography.family).split(',')[0]}
                </strong>
                <p style={{ fontFamily: wordmark?.fontFamily || selected.typography.family }}>
                  The quick brown fox jumps over the lazy dog.
                  <br />
                  0123456789 & ! ? @
                </p>
                <small>{selected.typography.reasoning}</small>
              </article>
              <article className="type-spec">
                <span className="eyebrow">BODY & SUPPORTING TEXT</span>
                <h3 style={{ fontFamily: selected.typography.bodyFamily, fontWeight: 400 }}>
                  Aa Bb Cc
                </h3>
                <strong>Arial / Helvetica</strong>
                <p>
                  Clear, familiar letterforms let your content do the talking. Use a regular weight
                  for paragraphs and a bold weight for emphasis.
                </p>
                <small>
                  System font stacks work without downloads. Live SVG text uses fonts installed on
                  the viewing device; PNG preserves the current rendering.
                </small>
              </article>
            </div>
            <div className="usage-box">
              <div>
                <h3>{brand.personality.join(' · ') || 'Balanced · Clear'}</h3>
                <p>
                  Use these traits as a consistency check across headlines, photographs, packaging,
                  and messaging. The brand kit is a starting point for a coherent identity.
                </p>
              </div>
              <Link to="/editor" className="btn btn-outline">
                <PenTool size={16} /> Refine typography
              </Link>
            </div>
          </>
        )}
        {tab === 'Mockups' && (
          <>
            <div className="section-heading kit-heading">
              <div>
                <span className="eyebrow">PICTURE YOUR BRAND OUT THERE</span>
                <h2>From the canvas to the everyday.</h2>
              </div>
              <span className="muted small">Illustrative 2D previews</span>
            </div>
            <BrandMockups concept={selected} brand={brand} />
            <p className="mockup-note">
              Mockups demonstrate visual placement. Replace sample contact details with your own
              when preparing production artwork.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
