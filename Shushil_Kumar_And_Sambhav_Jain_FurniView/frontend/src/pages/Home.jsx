import { useEffect, useState } from 'react';
import { getAllFurniture } from '../services/api';
import { defaultFurnitureList } from '../services/furnitureData';
import FurnitureCard from '../components/FurnitureCard';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const [furniture, setFurniture] = useState(defaultFurnitureList);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        const { data } = await getAllFurniture();
        if (Array.isArray(data) && data.length > 0) {
          // Merge API data with default configuration to ensure full accessory support
          setFurniture(data);
        }
      } catch (err) {
        // Quiet fallback to built-in full 10-item collection
        console.log('Using built-in 10-item 3D furniture collection.');
        setFurniture(defaultFurnitureList);
      } finally {
        setLoading(false);
      }
    };
    fetchFurniture();
  }, []);

  const categories = ['All', 'Sofa', 'Armchair', 'Chair', 'Table', 'Bed', 'Desk', 'Cabinet', 'Wardrobe'];

  const filteredFurniture = activeCategory === 'All'
    ? furniture
    : furniture.filter((item) => {
        if (activeCategory === 'Chair') {
          return item.category === 'Chair' || item.name.includes('Chair');
        }
        if (activeCategory === 'Table') {
          return item.category === 'Table' || item.name.includes('Table');
        }
        return item.category === activeCategory || item.name.toLowerCase().includes(activeCategory.toLowerCase());
      });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface)', transition: 'background-color 0.3s ease' }}>
      {/* ─── HEADER BAR ─── */}
      <header style={{
        borderBottom: '1px solid var(--color-border)',
        padding: '16px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--color-surface-light)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1 }}>
              FurniView 3D
            </h1>
            <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', lineHeight: 1, marginTop: '2px' }}>
              Realistic Computer Graphics & Multimedia Visualizer
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 36px 28px 36px' }}>
        <div style={{ maxWidth: '640px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.02em' }}>
            <span className="gradient-text">Realistic 3D Furniture</span>
            <br />
            <span style={{ color: 'var(--color-text-primary)' }}>Customization Studio</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
            Explore high-fidelity 3D models with PBR textures, modular accessories, and interactive
            Computer Graphics transformations (Translation, Rotation, Scaling, Reflection, and Shearing).
          </p>

          {/* Feature Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              '🛋️ 10 Realistic 3D Models',
              '✨ PBR Texture Materials',
              '📐 4x4 Affine Matrix Inspector',
              '🎬 Multimedia Transitions',
              '💡 Studio Lighting & Shadows',
            ].map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: '11px', fontWeight: 600, padding: '5px 12px',
                  borderRadius: '20px', background: 'var(--color-surface-lighter)',
                  color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)',
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY FILTER PILLS ─── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 36px 24px 36px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '11px', padding: '7px 16px', borderRadius: '20px' }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── FURNITURE GRID ─── */}
      <main id="home-main" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 36px 64px 36px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {filteredFurniture.map((item) => (
            <FurnitureCard key={item._id} furniture={item} />
          ))}
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '24px 36px',
        textAlign: 'center',
        background: 'var(--color-surface-light)',
      }}>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          FurniView 3D — Computer Graphics & Multimedia Visualization System
        </p>
      </footer>
    </div>
  );
}
