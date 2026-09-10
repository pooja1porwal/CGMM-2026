import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Heart,
  Images,
  Info,
  MapPin,
  Navigation,
  Route,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Viewer } from "@photo-sphere-viewer/core";

export function PlaceSphere({ place }) {
  const host = useRef(null);

  useEffect(() => {
    if (!host.current || !place?.panoramaDataUrl) return undefined;
    const viewer = new Viewer({
      container: host.current,
      panorama: place.panoramaDataUrl,
      caption: place.title,
      navbar: ["autorotate", "zoom", "move", "caption", "fullscreen"],
      defaultZoomLvl: 35,
      mousewheelCtrlKey: false,
      touchmoveTwoFingers: true,
    });
    return () => viewer.destroy();
  }, [place]);

  return <div className="place-sphere" ref={host} />;
}

function getFavorites() {
  try { return JSON.parse(localStorage.getItem("campus-favorites") || "[]"); }
  catch { return []; }
}

export function PlaceView({ place, routes, close, directions }) {
  const connected = routes.filter(
    (route) => route.sourceId === place.id || route.destinationId === place.id,
  );
  const [favorite, setFavorite] = useState(() => getFavorites().includes(place.id));
  const [speaking, setSpeaking] = useState(false);
  const [tab, setTab] = useState("about");

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("campus-recent") || "[]");
    localStorage.setItem("campus-recent", JSON.stringify([place.id, ...recent.filter((id) => id !== place.id)].slice(0, 5)));
    return () => speechSynthesis?.cancel();
  }, [place.id]);

  const toggleFavorite = () => {
    const next = favorite ? getFavorites().filter((id) => id !== place.id) : [...new Set([...getFavorites(), place.id])];
    localStorage.setItem("campus-favorites", JSON.stringify(next));
    setFavorite(!favorite);
  };

  const toggleAudio = () => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const narration = new SpeechSynthesisUtterance(place.audioGuide || `${place.story} ${place.history}`);
    narration.lang = "en-IN";
    narration.rate = .92;
    narration.onend = () => setSpeaking(false);
    setSpeaking(true);
    speechSynthesis.speak(narration);
  };

  const share = async () => {
    const data = { title: place.title, text: `Explore ${place.title} at SGSITS Virtual Campus`, url: location.href };
    if (navigator.share) await navigator.share(data);
    else await navigator.clipboard.writeText(`${data.text} — ${data.url}`);
  };

  return (
    <main className="place-explorer">
      <div className="place-toolbar">
        <button className="secondary" onClick={close}><ArrowLeft /> Campus map</button>
        <div><b>{place.title}</b><small><MapPin /> {place.district} · {place.category}</small></div>
        <button className={favorite ? "tool active" : "tool"} onClick={toggleFavorite}><Heart /> {favorite ? "Saved" : "Save"}</button>
        <button className="tool" onClick={share}><Share2 /> Share</button>
        <button className="tool" onClick={toggleAudio}>{speaking ? <VolumeX /> : <Volume2 />} {speaking ? "Stop" : "Listen"}</button>
        <button className="primary" onClick={() => directions(place.id)}><Navigation /> Directions</button>
      </div>
      <div className="sphere-wrap">
        <PlaceSphere place={place} />
        <div className="sphere-badge"><span /> Live 360° panorama</div>
        <div className="sphere-help">Drag to look · Scroll to zoom · Use fullscreen for immersion</div>
      </div>
      <nav className="place-tabs">
        <button className={tab === "about" ? "active" : ""} onClick={() => setTab("about")}><Info /> Overview</button>
        <button className={tab === "gallery" ? "active" : ""} onClick={() => setTab("gallery")}><Images /> Gallery ({place.gallery?.length || 0})</button>
        <button className={tab === "routes" ? "active" : ""} onClick={() => setTab("routes")}><Route /> Connected routes ({connected.length})</button>
      </nav>
      {tab === "about" && <section className="place-info">
        <article><p className="eyebrow">Campus location</p><h2>{place.title}</h2><p>{place.story}</p><h3>History and significance</h3><p>{place.history}</p></article>
        <aside><b>Visitor information</b><span><small>ZONE</small>{place.district}</span><span><small>VISITING NOTE</small>{place.bestTime || "Open during institute hours"}</span><span><small>ACCESSIBILITY</small>{place.accessibility || "Contact the campus help desk"}</span></aside>
      </section>}
      {tab === "gallery" && <section className="place-gallery">{place.gallery?.length ? place.gallery.map((image) => <figure key={image.id}><img src={image.dataUrl} alt={image.caption || place.title}/><figcaption>{image.caption || place.title}</figcaption></figure>) : <div className="empty-state"><Images /><h3>No gallery photographs yet</h3><p>The administrator can add supporting photographs for this location.</p></div>}</section>}
      {tab === "routes" && <section className="connected-routes">{connected.length ? connected.map((route) => <article key={route.id}><Route /><div><b>{route.title}</b><small><Clock3 /> {route.durationMinutes} min · {route.distanceMeters} m · {route.media.length} panoramas</small></div><button className="primary" onClick={() => directions(place.id)}>Get directions</button></article>) : <div className="empty-state"><Route /><h3>No route connected yet</h3><p>This place remains available for independent 360° exploration.</p></div>}</section>}
    </main>
  );
}
