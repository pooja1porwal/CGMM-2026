import React, { useEffect, useMemo, useState } from "react";
import {
  Accessibility,
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  MapPinned,
  Minus,
  Moon,
  Plus,
  Route,
  Sun,
  Wifi,
  WifiOff,
} from "lucide-react";

export function CampusDashboard({ places, routes }) {
  const panoramaCount = routes.reduce((sum, route) => sum + route.media.length, 0) + places.length;
  const categories = new Set(places.map((place) => place.category)).size;

  return (
    <section className="campus-dashboard" aria-label="Campus tour overview">
      <article><Building2 /><span><b>{places.length}</b><small>Campus places</small></span></article>
      <article><Route /><span><b>{routes.length}</b><small>Guided journeys</small></span></article>
      <article><Eye /><span><b>{panoramaCount}</b><small>360° viewpoints</small></span></article>
      <article><MapPinned /><span><b>{categories}</b><small>Place categories</small></span></article>
    </section>
  );
}

export function JourneySuggestions({ routes, start, explore }) {
  if (!routes.length) return null;
  return (
    <section className="journey-suggestions">
      <div className="section-title">
        <div>
          <p className="eyebrow">Ready-made campus walks</p>
          <h2>Popular guided journeys</h2>
          <p>Start immediately or preview the destination first.</p>
        </div>
      </div>
      <div className="journey-card-grid">
        {routes.slice(0, 6).map((route, index) => (
          <article key={route.id}>
            <div className="journey-number">0{index + 1}</div>
            <span className="route-status"><CheckCircle2 /> Published</span>
            <h3>{route.title}</h3>
            <p>{route.source.title} <span>→</span> {route.destination.title}</p>
            <div className="journey-meta">
              <span><Clock3 /> {route.durationMinutes} min</span>
              <span><Route /> {route.distanceMeters} m</span>
              <span><Eye /> {route.media.length} views</span>
            </div>
            <div className="journey-actions">
              <button className="primary" onClick={() => start(route)}>Start journey</button>
              <button className="secondary" onClick={() => explore(route.destination)}>View destination</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AccessibilityDock() {
  const [open, setOpen] = useState(false);
  const [contrast, setContrast] = useState(() => localStorage.getItem("campus-contrast") === "true");
  const [scale, setScale] = useState(() => Number(localStorage.getItem("campus-font-scale") || 1));
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", contrast);
    document.documentElement.style.setProperty("--font-scale", scale);
    localStorage.setItem("campus-contrast", contrast);
    localStorage.setItem("campus-font-scale", scale);
  }, [contrast, scale]);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    addEventListener("online", update);
    addEventListener("offline", update);
    return () => {
      removeEventListener("online", update);
      removeEventListener("offline", update);
    };
  }, []);

  return (
    <div className={`accessibility-dock ${open ? "open" : ""}`}>
      {open && <div className="accessibility-menu">
        <b>Accessibility</b>
        <button onClick={() => setContrast((value) => !value)}>
          {contrast ? <Sun /> : <Moon />} {contrast ? "Standard colours" : "High contrast"}
        </button>
        <div className="font-controls">
          <span>Text size</span>
          <button aria-label="Decrease text size" onClick={() => setScale(Math.max(.9, scale - .1))}><Minus /></button>
          <b>{Math.round(scale * 100)}%</b>
          <button aria-label="Increase text size" onClick={() => setScale(Math.min(1.3, scale + .1))}><Plus /></button>
        </div>
        <small className={online ? "online" : "offline"}>{online ? <Wifi /> : <WifiOff />}{online ? "Online" : "Offline mode"}</small>
      </div>}
      <button className="accessibility-trigger" aria-label="Accessibility settings" onClick={() => setOpen((value) => !value)}>
        <Accessibility />
      </button>
    </div>
  );
}
