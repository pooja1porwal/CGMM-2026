import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, Flag, List, Navigation, Volume2, VolumeX } from "lucide-react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { PlaceSphere } from "./StreetExperience";

function RouteMiniMap({ route, index }) {
  const points = route.path?.length ? route.path : [
    { x: route.source.mapX, y: route.source.mapY },
    { x: route.destination.mapX, y: route.destination.mapY },
  ];
  const progress = route.media.length > 1 ? index / (route.media.length - 1) : 1;
  const segment = Math.min(Math.floor(progress * (points.length - 1)), points.length - 2);
  const local = progress * (points.length - 1) - segment;
  const here = {
    x: points[segment].x + (points[segment + 1].x - points[segment].x) * local,
    y: points[segment].y + (points[segment + 1].y - points[segment].y) * local,
  };
  return (
    <div className="journey-minimap">
      <img src="/sgsits-campus-map.png" alt="Journey route map" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={points.map((point) => `${point.x},${point.y}`).join(" ")} />
        <circle className="map-start" cx={points[0].x} cy={points[0].y} r="2" />
        <circle className="map-end" cx={points.at(-1).x} cy={points.at(-1).y} r="2" />
        <circle className="map-here" cx={here.x} cy={here.y} r="2.3" />
      </svg>
      <span><Navigation /> You are here</span>
    </div>
  );
}

function PanoramaNode({ route, index, move }) {
  const host = useRef(null);
  useEffect(() => {
    const viewer = new Viewer({
      container: host.current,
      panorama: route.media[index].dataUrl,
      caption: route.media[index].caption || `Position ${index + 1}`,
      navbar: ["autorotate", "zoom", "move", "caption", "fullscreen"],
      defaultZoomLvl: 35,
      mousewheelCtrlKey: false,
      touchmoveTwoFingers: true,
      plugins: [[MarkersPlugin, { markers: [] }]],
    });
    const markers = viewer.getPlugin(MarkersPlugin);
    viewer.addEventListener("ready", () => {
      if (index > 0) markers.addMarker({ id: "previous", position: { yaw: "180deg", pitch: "-20deg" }, html: '<button class="street-arrow back">‹</button>', anchor: "center center", tooltip: "Previous panorama" });
      markers.addMarker({ id: "next", position: { yaw: "0deg", pitch: "-20deg" }, html: '<button class="street-arrow">↑</button>', anchor: "center center", tooltip: index === route.media.length - 1 ? "Arrive" : "Move forward" });
    }, { once: true });
    markers.addEventListener("select-marker", ({ marker }) => move(marker.id === "next" ? index + 1 : index - 1));
    return () => viewer.destroy();
  }, [route, index, move]);
  return <div className="street-view" ref={host} />;
}

export default function JourneyExperience({ route, back }) {
  const [index, setIndex] = useState(0);
  const [voice, setVoice] = useState(false);
  const [instructions, setInstructions] = useState(false);
  const arrived = index >= route.media.length;
  const move = useCallback((next) => setIndex(Math.max(0, Math.min(route.media.length, next))), [route.media.length]);

  useEffect(() => {
    const keyboard = (event) => {
      if (event.key === "ArrowRight") move(index + 1);
      if (event.key === "ArrowLeft") move(index - 1);
      if (event.key === "Escape") back();
    };
    addEventListener("keydown", keyboard);
    return () => removeEventListener("keydown", keyboard);
  }, [index, move, back]);

  useEffect(() => {
    if (!voice || arrived) return undefined;
    speechSynthesis.cancel();
    const text = route.instructions[index] || `Continue to panorama position ${index + 1}`;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = .92;
    speechSynthesis.speak(speech);
    return () => speechSynthesis.cancel();
  }, [voice, arrived, index, route]);

  return (
    <main className="navigation-mode">
      <header className="navigation-header">
        <button className="nav-exit" onClick={back}><ArrowLeft /> Exit</button>
        <div><b>{route.title}</b><small>{route.source.title} → {route.destination.title}</small></div>
        <div className="navigation-progress"><span><i style={{ width: `${Math.min(100, (index / Math.max(route.media.length, 1)) * 100)}%` }} /></span><small>{Math.min(index + 1, route.media.length)} of {route.media.length} positions</small></div>
        <button className={voice ? "nav-tool active" : "nav-tool"} onClick={() => setVoice(!voice)}>{voice ? <VolumeX /> : <Volume2 />} Voice</button>
        <button className="nav-tool" onClick={() => setInstructions(!instructions)}><List /> Steps</button>
      </header>
      {!arrived && route.media.length > 0 ? <>
        <PanoramaNode route={route} index={index} move={move} />
        <div className="navigation-card">
          <span className="maneuver"><Navigation /></span>
          <div><small>NEXT</small><b>{route.instructions[index] || "Continue along the highlighted campus path"}</b><span>{Math.max(0, Math.round(route.distanceMeters * (1 - index / route.media.length)))} m remaining</span></div>
          <button disabled={!index} onClick={() => move(index - 1)}><ArrowLeft /></button>
          <button className="primary" onClick={() => move(index + 1)}>{index === route.media.length - 1 ? <Flag /> : <ArrowRight />}</button>
        </div>
        <RouteMiniMap route={route} index={index} />
        {instructions && <aside className="instruction-drawer"><h3>Journey steps</h3>{route.media.map((media, step) => <button className={step === index ? "active" : ""} key={media.id} onClick={() => move(step)}><span>{step < index ? <CheckCircle2 /> : step + 1}</span><div><b>{route.instructions[step] || media.caption || `Panorama ${step + 1}`}</b><small>{step < index ? "Completed" : step === index ? "Current position" : "Upcoming"}</small></div></button>)}</aside>}
      </> : <section className="journey-arrival"><CheckCircle2 /><p className="eyebrow">Journey complete</p><h1>You’ve arrived at {route.destination.title}</h1><p>{route.destination.story}</p><div className="arrival-sphere"><PlaceSphere place={route.destination} /></div><button className="primary" onClick={back}><Compass /> Continue exploring</button></section>}
    </main>
  );
}
