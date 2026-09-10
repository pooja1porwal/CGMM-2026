import { useState } from "react";
import Scene from "./components/scene/Scene";
import {
  FurnitureLibrary,
  Inspector,
  ScenePanel,
} from "./components/ui/ControlPanel";
import { useSceneState } from "./hooks/useSceneState";

export default function App() {
  const scene = useSceneState();
  const [settings, setSettings] = useState({
    grid: true,
    axes: true,
    shadows: true,
    lightsOn: true,
    lighting: "Day",
    cameraMode: "Perspective",
  });
  const [transformMode, setTransformMode] = useState("translate");
  const [resetCameraKey, setResetCameraKey] = useState(0);
  const [notice, setNotice] = useState("");
  const update = (id, patch) => {
    if (id === "__mode__") setTransformMode(patch.mode);
    else scene.update(id, patch);
  };
  const capture = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "furniture-room-preview.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };
  const load = () => {
    const ok = scene.load();
    setNotice(ok ? "Saved scene loaded." : "No valid saved scene found.");
    setTimeout(() => setNotice(""), 2800);
  };
  return (
    <main className="app-shell">
      <header>
        <div className="brand-mark">F</div>
        <div className="brand">
          <span>FORM & SPACE</span>
          <small>COMPUTER GRAPHICS LAB</small>
        </div>
        <div className="header-actions">
          <button
            onClick={() => {
              scene.save();
              setNotice("Scene saved locally.");
              setTimeout(() => setNotice(""), 2200);
            }}
          >
            Save scene
          </button>
          <button onClick={load}>Load</button>
          <button className="primary" onClick={capture}>
            Capture preview
          </button>
        </div>
      </header>
      {notice && <div className="toast">{notice}</div>}
      <div className="workspace">
        <aside className="sidebar">
          <FurnitureLibrary onAdd={scene.add} />
          <Inspector
            selected={scene.selected}
            onUpdate={update}
            onDelete={scene.remove}
            transformMode={transformMode}
          />
          <ScenePanel
            settings={settings}
            setSettings={setSettings}
            onReset={scene.reset}
            onResetCamera={() => setResetCameraKey((k) => k + 1)}
          />
        </aside>
        <section className="stage">
          <div className="stage-label">
            <span>LIVE 3D VIEWPORT</span>
            <small>XYZ coordinate space · click object to select</small>
          </div>
          <Scene
            {...settings}
            furniture={scene.furniture}
            selected={scene.selected}
            selectedId={scene.selectedId}
            onSelect={scene.setSelectedId}
            onUpdate={scene.update}
            transformMode={transformMode}
            resetCameraKey={resetCameraKey}
          />
          <div className="hint">
            <kbd>Drag</kbd> orbit <kbd>Scroll</kbd> zoom <kbd>Right drag</kbd>{" "}
            pan
          </div>
        </section>
      </div>
    </main>
  );
}
