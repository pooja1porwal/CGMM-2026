import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowDown,
  PenTool,
  Shapes,
  Move,
  Palette,
  Layers,
  ScanLine,
  Type,
  Image,
  Blend,
  Package,
  RotateCcw,
} from 'lucide-react';
import { hexToRgb } from '../utils/colorUtils';
const concepts = [
  [
    'Vector graphics',
    PenTool,
    'Logos are SVG documents: shapes and text described mathematically. Their edges remain crisp at different resolutions.',
    'Try: download SVG and zoom in.',
  ],
  [
    'Geometric primitives',
    Shapes,
    'Circles, ellipses, rectangles, polygons, and lines form each mark. Paths combine straight segments and Bézier curves for organic forms.',
    'Try: compare the bun curve and circuit lines.',
  ],
  [
    '2D transformations',
    Move,
    'Translation changes position; rotation changes orientation; scaling changes size. Group transforms keep complex symbols together.',
    'Try: drag, rotate, and resize an editor layer.',
  ],
  [
    'Color models',
    Palette,
    'HEX encodes three RGB channels. Each channel has 256 possible values. Foreground contrast is calculated from relative luminance.',
    'Try: edit a HEX value and inspect the brand palette.',
  ],
  [
    'Gradient interpolation',
    Blend,
    'A linear gradient blends colors along an axis. A radial gradient blends outward from a center. Stops define where each color occurs.',
    'Try: enable gradients on a symbol or shape.',
  ],
  [
    'Layering & z-order',
    Layers,
    'SVG uses the painter’s algorithm: elements later in the document paint over earlier ones. Reordering layers changes overlap.',
    'Try: move a shape above and below the wordmark.',
  ],
  [
    'Transparency',
    ScanLine,
    'Opacity ranges from 0 to 1. Lower alpha blends an element with the layers behind it. A transparent artboard has no background rectangle.',
    'Try: reduce opacity and export transparent PNG.',
  ],
  [
    'Typography rendering',
    Type,
    'Fonts convert characters into glyph outlines. Size, weight, letter spacing, and a constrained text width control the composition.',
    'Try: change the font and letter spacing.',
  ],
  [
    'Rasterization',
    Image,
    'The browser decodes SVG into an image. Canvas samples it into an 1800 × 1200 pixel bitmap, then encodes it as PNG or JPEG.',
    'Try: download SVG and PNG and compare them.',
  ],
  [
    'Multimedia & mockups',
    Package,
    'The same visual identity is composed into business cards, packaging, screens, and documents using SVG, HTML, and CSS.',
    'Try: open the seven previews in Brand Kit.',
  ],
] as const;
const pipeline = [
  ['User Input', 'Name, context, and preferences'],
  ['Semantic Analyzer', 'Weighted keyword matching'],
  ['Design Rule Engine', 'Category, personality, and style'],
  ['SVG Icon Library', 'Original paths and primitives'],
  ['Palette Engine', 'Coordinated RGB colors'],
  ['Typography Engine', 'Font family, weight, and spacing'],
  ['Logo Variation Generator', 'Six distinct compositions'],
  ['Interactive Editor', 'Transforms, layers, and history'],
  ['Brand Kit Generator', 'Identity variants and mockups'],
  ['Export Engine', 'SVG, PNG, JPEG, and ZIP'],
];
export default function AboutCG() {
  const [x, setX] = useState(180),
    [y, setY] = useState(130),
    [rotation, setRotation] = useState(0),
    [scale, setScale] = useState(1),
    [opacity, setOpacity] = useState(100),
    [fill, setFill] = useState('#703ee8'),
    rgb = hexToRgb(fill);
  return (
    <main className="page-width about-page">
      <div className="about-intro">
        <span className="eyebrow">THE SCIENCE BEHIND THE STUDIO</span>
        <h1>
          Computer Graphics
          <br />
          Behind BrandForge.
        </h1>
        <p>
          A name becomes a symbol. A symbol becomes an identity.
          <br />
          Here’s the geometry, color, and composition that make it happen.
        </p>
      </div>
      <div className="about-callout">
        <span className="purple-icon">
          <ScanLine size={24} />
        </span>
        <div>
          <h3>A semantic graphics engine, working locally.</h3>
          <p>
            BrandForge uses transparent rules, not a trained image model. Name keywords receive the
            strongest weight; taglines, descriptions, and the selected industry add context.
            Personality, style, color, and font preferences shape a full gallery of visual
            directions. No API keys or online image services are involved.
          </p>
        </div>
      </div>
      <section className="cg-playground">
        <div className="section-heading">
          <div>
            <span className="eyebrow">AN INTERACTIVE GRAPHICS LAB</span>
            <h2>Meet the transformation matrix.</h2>
          </div>
          <button
            className="btn btn-outline btn-small"
            onClick={() => {
              setX(180);
              setY(130);
              setRotation(0);
              setScale(1);
              setOpacity(100);
              setFill('#703ee8');
            }}
          >
            <RotateCcw size={15} /> Reset
          </button>
        </div>
        <div className="cg-lab-layout">
          <div className="cg-stage">
            <svg viewBox="0 0 360 260" role="img" aria-label="Interactive transformed symbol">
              <defs>
                <pattern id="cg-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M20 0H0V20" fill="none" stroke="#e8e1f0" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="360" height="260" fill="url(#cg-grid)" />
              <path d="M0 130H360M180 0V260" stroke="#c6b3de" strokeDasharray="4 4" />
              <g
                transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}
                opacity={opacity / 100}
              >
                <rect x="-40" y="-40" width="80" height="80" rx="14" fill={fill} />
                <path d="M-20 0L0 -23L22 0L0 23Z" fill="#fff" />
                <circle cx="0" cy="0" r="8" fill={fill} />
              </g>
              <circle cx={x} cy={y} r="3" fill="#ed7425" />
            </svg>
            <code>
              translate({x}, {y}) rotate({rotation}°) scale({scale})
            </code>
          </div>
          <div className="cg-controls">
            {[
              ['Translate X', x, setX, 60, 300, 1],
              ['Translate Y', y, setY, 60, 200, 1],
              ['Rotation', rotation, setRotation, 0, 360, 1],
              ['Scale', scale, setScale, 0.3, 1.8, 0.1],
              ['Opacity', opacity, setOpacity, 0, 100, 1],
            ].map(([label, value, set, min, max, step]) => (
              <label key={String(label)}>
                <span>
                  {String(label)}
                  <strong>{String(value)}</strong>
                </span>
                <input
                  type="range"
                  min={Number(min)}
                  max={Number(max)}
                  step={Number(step)}
                  value={Number(value)}
                  onChange={(e) => (set as (n: number) => void)(Number(e.target.value))}
                />
              </label>
            ))}
            <label className="cg-color">
              <span>Fill color</span>
              <input type="color" value={fill} onChange={(e) => setFill(e.target.value)} />
              <code>{fill}</code>
            </label>
            <p>
              RGB ({rgb.r}, {rgb.g}, {rgb.b})
            </p>
          </div>
        </div>
        <div className="matrix-note">
          <code>p′ = T · R · S · p</code>
          <p>
            With column vectors, the rightmost operation runs first: scale the local point, rotate
            it, then translate it. The orange point is the group’s origin. In the logo editor,
            rotation is centered on the selected layer.
          </p>
        </div>
      </section>
      <section className="cg-concepts">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CONCEPTS YOU CAN DEMONSTRATE</span>
            <h2>A graphics syllabus, in action.</h2>
          </div>
        </div>
        <div className="cg-concept-grid">
          {concepts.map(([title, Icon, copy, example], i) => (
            <article key={title}>
              <div className="row between">
                <Icon size={23} />
                <span>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <small>{example}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="architecture-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FROM INPUT TO OUTPUT</span>
            <h2>The studio architecture.</h2>
          </div>
        </div>
        <div className="architecture-grid">
          {pipeline.map(([title, copy], i) => (
            <div className="architecture-step" key={title}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              {i < 9 && <ArrowDown size={17} />}
            </div>
          ))}
        </div>
        <div className="architecture-note">
          <h3>What the rules can—and can’t—understand.</h3>
          <p>
            Matching is deterministic, with category-specific dictionaries and dedicated food
            subcategories. Ambiguous names may follow the selected industry or stronger contextual
            keywords. Unknown names use an explicitly explained geometric fallback. The algorithm
            does not infer arbitrary meanings, translate every language, or verify trademark
            originality. You can inspect its decision before generating.
          </p>
          <Link className="text-link" to="/create">
            Try a name of your own <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
