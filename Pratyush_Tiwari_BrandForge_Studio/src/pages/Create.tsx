import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles, Lightbulb, RotateCcw } from 'lucide-react';
import { useStudio } from '../components/StudioContext';
import { industries } from '../types/brand';
import { personalities, styles, fonts, colors } from '../data/presets';
import { swatches } from '../generator/paletteEngine';
import { analyzeBrand } from '../generator/semanticAnalyzer';
import DemoModal from '../components/DemoModal';
const steps = [
  'Brand information',
  'Brand personality',
  'Logo style',
  'Color preference',
  'Font personality',
];
const subtitles = [
  'Every great identity starts with a story.',
  'How should your brand make people feel?',
  'Choose the starting point for your visual identity.',
  'Set the mood with a color direction.',
  'Give your words a personality of their own.',
];
export default function Create() {
  const { brand, setBrand } = useStudio(),
    [step, setStep] = useState(0),
    [demo, setDemo] = useState(false),
    [error, setError] = useState(''),
    navigate = useNavigate(),
    semantic = analyzeBrand(brand);
  const change = (field: keyof typeof brand, value: string | string[]) =>
    setBrand({ ...brand, [field]: value });
  function next() {
    if (!brand.brandName.trim()) {
      setStep(0);
      setError('Your brand needs a name.');
      return;
    }
    setError('');
    if (step < 4) setStep(step + 1);
    else navigate('/generate', { state: { generate: true } });
  }
  return (
    <main className="page-width wizard-page">
      <div className="page-intro row between">
        <div>
          <span className="eyebrow">THE CREATIVE BRIEF</span>
          <h1>Let’s find your identity.</h1>
          <p>A few details now. A brand that feels like you.</p>
        </div>
        <button className="btn btn-outline" onClick={() => setDemo(true)}>
          <Sparkles size={17} /> Use a demo brand
        </button>
      </div>
      <div className="wizard-layout">
        <aside className="wizard-sidebar">
          <ol className="wizard-steps">
            {steps.map((s, i) => (
              <li key={s} className={i === step ? 'current' : i < step ? 'done' : ''}>
                <button
                  onClick={() => {
                    if (i > 0 && !brand.brandName.trim()) {
                      setError('Enter a brand name to continue.');
                      return;
                    }
                    setStep(i);
                  }}
                >
                  <span>{i < step ? <Check size={15} /> : i + 1}</span>
                  {s}
                </button>
              </li>
            ))}
          </ol>
          <div className="brief-tip">
            <Lightbulb size={23} />
            <h4>A name with meaning.</h4>
            <p>
              Be specific in your description. “Chai café” and “pizza kitchen” create different
              symbols, even in the same industry.
            </p>
          </div>
        </aside>
        <section className="wizard-form">
          <div className="row between">
            <span className="eyebrow">STEP {step + 1} OF 5</span>
            <span className="muted small">Your creative direction</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${(step + 1) * 20}%` }} />
          </div>
          <h2>{steps[step]}</h2>
          <p className="muted">{subtitles[step]}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
          >
            {step === 0 && (
              <div className="form-fields">
                <label>
                  Brand name <span className="required">*</span>
                  <input
                    autoFocus
                    value={brand.brandName}
                    onChange={(e) => {
                      change('brandName', e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. Vadapav, NovaTech, Finora"
                    required
                    maxLength={48}
                  />
                  <small>Up to 48 characters. This is the starting point for your symbols.</small>
                </label>
                <label>
                  Tagline <span className="muted">optional</span>
                  <input
                    value={brand.tagline}
                    onChange={(e) => change('tagline', e.target.value)}
                    placeholder="A few words that say it all"
                    maxLength={80}
                  />
                </label>
                <label>
                  Industry
                  <select
                    value={brand.industry}
                    onChange={(e) => change('industry', e.target.value)}
                  >
                    {industries.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Brand description <span className="muted">optional</span>
                  <textarea
                    value={brand.description}
                    onChange={(e) => change('description', e.target.value)}
                    placeholder="What do you make? Who is it for? What makes it different?"
                    rows={3}
                    maxLength={1000}
                  />
                </label>
                {brand.brandName.trim() && (
                  <div className="semantic-insight">
                    <Sparkles size={18} />
                    <div>
                      <strong>Detected: {semantic.theme}</strong>
                      <p>
                        {semantic.keywords.length
                          ? `Found ${semantic.keywords.join(', ')} · ${semantic.source}`
                          : semantic.rationale}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {step === 1 && (
              <>
                <p className="selection-count">
                  Choose up to 3 <strong>{brand.personality.length} / 3</strong>
                </p>
                <div className="personality-grid">
                  {[...new Set([...personalities, ...brand.personality])].map((p, i) => (
                    <button
                      type="button"
                      className={
                        'choice personality ' + (brand.personality.includes(p) ? 'selected' : '')
                      }
                      key={p}
                      disabled={!brand.personality.includes(p) && brand.personality.length >= 3}
                      aria-pressed={brand.personality.includes(p)}
                      onClick={() =>
                        change(
                          'personality',
                          brand.personality.includes(p)
                            ? brand.personality.filter((x) => x !== p)
                            : [...brand.personality, p],
                        )
                      }
                    >
                      <span className="personality-symbol">
                        {['◒', '○', '♛', '▥', '✳', '■', '❋', '✷', '◇', '☺', '▲', '❧'][i % 12]}
                      </span>
                      {p}
                      {brand.personality.includes(p) && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 2 && (
              <div className="style-grid">
                {styles.map((s, i) => (
                  <button
                    type="button"
                    className={'choice style-choice ' + (brand.logoStyle === s ? 'selected' : '')}
                    key={s}
                    onClick={() => change('logoStyle', s)}
                    aria-pressed={brand.logoStyle === s}
                  >
                    <span className={'style-sample sample-' + i}>
                      {i === 0 ? (
                        <>
                          <i>✦</i> forge
                        </>
                      ) : i === 1 ? (
                        <>
                          <i>✦</i> BF
                        </>
                      ) : i === 2 ? (
                        <>
                          <i>✦</i> brand
                        </>
                      ) : i === 3 || i === 9 ? (
                        <span className="sample-seal">
                          ✦<small>BRAND</small>
                        </span>
                      ) : i === 8 ? (
                        <span>◕‿◕</span>
                      ) : (
                        <span className="style-geometry">{['◇', '✧', '⬡', '◈'][i % 4]}</span>
                      )}
                    </span>
                    <span>{s}</span>
                    {brand.logoStyle === s && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
            {step === 3 && (
              <>
                <div className="color-grid">
                  {[...new Set([...colors, brand.colorPreference])].map((c) => (
                    <button
                      type="button"
                      className={
                        'choice color-choice ' + (brand.colorPreference === c ? 'selected' : '')
                      }
                      key={c}
                      onClick={() => change('colorPreference', c)}
                      aria-pressed={brand.colorPreference === c}
                    >
                      <span
                        style={{
                          background:
                            c === 'Auto'
                              ? 'conic-gradient(#703ee8,#2563eb,#258354,#dca824,#ed7425,#703ee8)'
                              : c === 'Custom'
                                ? brand.customColor
                                : swatches[c] || '#703ee8',
                        }}
                      >
                        {brand.colorPreference === c && <Check color="white" size={20} />}
                      </span>
                      {c}
                    </button>
                  ))}
                </div>
                {brand.colorPreference === 'Custom' && (
                  <label className="custom-color">
                    Your signature color
                    <input
                      type="color"
                      value={brand.customColor}
                      onChange={(e) => change('customColor', e.target.value)}
                    />
                    <code>{brand.customColor.toUpperCase()}</code>
                  </label>
                )}
                <div className="brief-tip inline">
                  <Lightbulb size={22} />
                  <p>
                    We build a coordinated palette around your preference, balancing accent colors
                    with readable text.
                  </p>
                </div>
              </>
            )}
            {step === 4 && (
              <div className="font-grid">
                {fonts.map((f, i) => (
                  <button
                    type="button"
                    key={f}
                    className={
                      'choice font-choice ' + (brand.fontPersonality === f ? 'selected' : '')
                    }
                    onClick={() => change('fontPersonality', f)}
                    aria-pressed={brand.fontPersonality === f}
                  >
                    <span
                      style={{
                        fontFamily:
                          i === 1 || i === 7
                            ? 'Georgia,serif'
                            : i === 5
                              ? 'Consolas,monospace'
                              : i === 4
                                ? 'Trebuchet MS,sans-serif'
                                : 'Arial,sans-serif',
                        fontWeight: i === 3 ? 400 : 700,
                        letterSpacing: i === 3 ? 3 : 0,
                      }}
                    >
                      {brand.brandName || 'BrandForge'}
                    </span>
                    <small>{f}</small>
                    {brand.fontPersonality === f && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <div className="wizard-footer">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft size={17} /> Back
              </button>
              <button type="submit" className="btn btn-primary">
                {step === 4 ? 'Generate 6 concepts' : 'Continue'}
                {step === 4 ? <Sparkles size={18} /> : <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </section>
      </div>
      <div className="wizard-bottom">
        <RotateCcw size={14} /> Your brief stays in this tab while you explore.
      </div>
      <DemoModal
        open={demo}
        onClose={() => {
          setDemo(false);
          setStep(0);
        }}
      />
    </main>
  );
}
