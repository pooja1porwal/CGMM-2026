import type { LogoConcept } from '../types/logo';
import type { BrandInput } from '../types/brand';
import { brandVariants } from '../generator/brandKitGenerator';
import { documentSvg } from '../editor/editorUtils';
import LogoPreview from './LogoPreview';
export default function BrandMockups({
  concept,
  brand,
}: {
  concept: LogoConcept;
  brand: BrandInput;
}) {
  const variants = brandVariants(concept),
    primary = documentSvg(
      { elements: concept.svgElements, background: concept.background },
      { transparent: true },
    ),
    dark = documentSvg(
      { elements: concept.svgElements, background: 'transparent' },
      { transparent: true, monochrome: '#ffffff' },
    ),
    light = documentSvg(
      { elements: concept.svgElements, background: 'transparent' },
      { transparent: true, monochrome: '#30283c' },
    );
  return (
    <div className="mockup-grid">
      <article className="mockup-card">
        <div className="mockup-scene business-scene">
          <div className="business-back">
            <span>{brand.brandName}</span>
            <div className="business-lines">
              <b>YOUR NAME</b>
              <span>Founder & creative lead</span>
              <hr />
              <small>
                your@email.com
                <br />
                Your website · Your location
              </small>
            </div>
          </div>
          <div className="business-front" style={{ background: concept.palette.secondary }}>
            <LogoPreview svg={dark} />
          </div>
        </div>
        <div className="mockup-caption">
          <strong>Business card</strong>
          <span>A memorable first introduction</span>
        </div>
      </article>
      <article className="mockup-card">
        <div className="mockup-scene app-scene">
          <div className="phone-shell">
            <div className="phone-status">
              <span>9:41</span>
              <span>••• ▰</span>
            </div>
            <div className="app-icon">
              <LogoPreview svg={variants[2].svg} />
            </div>
            <strong>{brand.brandName}</strong>
            <span className="phone-dots">● ● ●</span>
            <div className="phone-dock">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
        <div className="mockup-caption">
          <strong>Mobile app icon</strong>
          <span>Your symbol, at a glance</span>
        </div>
      </article>
      <article className="mockup-card">
        <div className="mockup-scene website-scene">
          <div className="website-window">
            <div className="browser-top">
              <i />
              <i />
              <i />
              <span>your-brand.com</span>
            </div>
            <div className="mock-website-header">
              <LogoPreview svg={light} />
              <span>Discover</span>
              <span>Our story</span>
              <i>Explore ↗</i>
            </div>
            <div className="mock-website-main">
              <small>WELCOME TO {brand.brandName.toUpperCase()}</small>
              <h3>{brand.tagline || 'Something worth discovering.'}</h3>
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
              <span style={{ background: concept.palette.primary }}>Discover more ↗</span>
            </div>
          </div>
        </div>
        <div className="mockup-caption">
          <strong>Website header</strong>
          <span>A cohesive digital presence</span>
        </div>
      </article>
      <article className="mockup-card">
        <div className="mockup-scene social-scene">
          <div className="social-profile">
            <div className="social-cover" style={{ background: concept.palette.primary }} />
            <div className="social-avatar">
              <LogoPreview svg={variants[2].svg} />
            </div>
            <strong>{brand.brandName}</strong>
            <span>@{brand.brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'yourbrand'}</span>
            <p>{brand.tagline || 'Follow our story.'}</p>
            <div className="social-posts">
              {[concept.palette.primary, concept.palette.secondary, concept.palette.accent].map(
                (c, i) => (
                  <div key={i} style={{ background: c }}>
                    {i === 1 && <LogoPreview svg={dark} />}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
        <div className="mockup-caption">
          <strong>Social media profile</strong>
          <span>Consistent, from feed to profile</span>
        </div>
      </article>
      <article className="mockup-card">
        <div className="mockup-scene packaging-scene">
          <div className="package-bag">
            <div className="bag-fold" />
            <div
              className="bag-label"
              style={{
                background: concept.background === 'transparent' ? '#ffffff' : concept.background,
              }}
            >
              <LogoPreview svg={primary} />
              <div className="package-rule" />
              <small>CRAFTED WITH PURPOSE</small>
            </div>
            <div className="bag-bottom" />
          </div>
        </div>
        <div className="mockup-caption">
          <strong>Product packaging</strong>
          <span>A brand you can hold</span>
        </div>
      </article>
      <article className="mockup-card">
        <div className="mockup-scene letterhead-scene">
          <div className="letter-paper">
            <LogoPreview svg={light} />
            <div className="letter-date">Your date · Your reference</div>
            <h4>A note from {brand.brandName}.</h4>
            <div className="letter-lines">
              {Array.from({ length: 7 }, (_, i) => (
                <i key={i} style={{ width: i === 3 ? '64%' : i === 6 ? '38%' : '100%' }} />
              ))}
            </div>
            <span style={{ color: concept.palette.primary }}>Thank you,</span>
            <b>{brand.brandName}</b>
            <div className="letter-footer" style={{ borderColor: concept.palette.primary }}>
              YOUR EMAIL · YOUR WEBSITE
            </div>
          </div>
        </div>
        <div className="mockup-caption">
          <strong>Letterhead</strong>
          <span>Bring your identity to every page</span>
        </div>
      </article>
      <article className="mockup-card shirt-card">
        <div className="mockup-scene shirt-scene">
          <div className="shirt-flat">
            <div className="shirt-neck" />
            <LogoPreview svg={light} />
          </div>
        </div>
        <div className="mockup-caption">
          <strong>T-shirt · flat preview</strong>
          <span>A wearable expression of your brand</span>
        </div>
      </article>
    </div>
  );
}
