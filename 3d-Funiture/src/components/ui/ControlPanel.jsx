import { FURNITURE } from "../../data/furniture";

const Button = ({ children, active, ...props }) => (
  <button className={active ? "active" : ""} {...props}>
    {children}
  </button>
);
const Toggle = ({ label, value, onChange }) => (
  <label className="toggle">
    <span>{label}</span>
    <input
      type="checkbox"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
    />
    <i />
  </label>
);

export function FurnitureLibrary({ onAdd }) {
  return (
    <section>
      <p className="eyebrow">Object library</p>
      <h2>Furniture</h2>
      <div className="furniture-grid">
        {FURNITURE.map((item) => (
          <button
            key={item.type}
            className="furniture-card"
            onClick={() => onAdd(item.type)}
          >
            <b>{item.icon}</b>
            <span>{item.name}</span>
            <small>ADD +</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function AxisControl({ label, values, onChange, rotation = false }) {
  return (
    <div className="axis-control">
      <span>{label}</span>
      {["X", "Y", "Z"].map((axis, i) => (
        <label key={axis}>
          <em>{axis}</em>
          <input
            type="number"
            step={rotation ? 0.1 : 0.1}
            min={rotation ? -6.28 : -10}
            max={rotation ? 6.28 : 10}
            value={Number(values[i].toFixed(2))}
            onChange={(e) => {
              const next = [...values];
              next[i] = Number(e.target.value);
              onChange(next);
            }}
          />
        </label>
      ))}
    </div>
  );
}
export function Inspector({ selected, onUpdate, onDelete, transformMode }) {
  if (!selected)
    return (
      <section className="inspector empty">
        <p className="eyebrow">Inspector</p>
        <h2>No selection</h2>
        <p>
          Select a furniture object in the room to edit its model transform and
          material.
        </p>
      </section>
    );
  return (
    <section className="inspector">
      <div className="inspector-title">
        <div>
          <p className="eyebrow">Selected object</p>
          <h2>{selected.name}</h2>
        </div>
        <button className="danger" onClick={onDelete}>
          Delete
        </button>
      </div>
      <div className="gizmo-mode">
        <span>Gizmo</span>
        {["translate", "rotate", "scale"].map((mode) => (
          <Button
            key={mode}
            active={transformMode === mode}
            onClick={() => onUpdate("__mode__", { mode })}
          >
            {mode}
          </Button>
        ))}
      </div>
      <AxisControl
        label="Position (XYZ)"
        values={selected.position}
        onChange={(position) => onUpdate(selected.id, { position })}
      />
      <AxisControl
        label="Rotation (rad)"
        values={selected.rotation}
        rotation
        onChange={(rotation) => onUpdate(selected.id, { rotation })}
      />
      <div className="scale-row">
        <span>Uniform scale</span>
        <input
          type="range"
          min=".35"
          max="2.2"
          step=".05"
          value={selected.scale[0]}
          onChange={(e) => {
            const v = Number(e.target.value);
            onUpdate(selected.id, { scale: [v, v, v] });
          }}
        />
        <output>{selected.scale[0].toFixed(2)}×</output>
      </div>
      <div className="customize">
        <label>
          Color
          <input
            type="color"
            value={selected.color}
            onChange={(e) => onUpdate(selected.id, { color: e.target.value })}
          />
        </label>
        <label>
          Material
          <select
            value={selected.material}
            onChange={(e) =>
              onUpdate(selected.id, { material: e.target.value })
            }
          >
            {["Wood", "Fabric", "Metal", "Plastic", "Glass"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
export function ScenePanel({ settings, setSettings, onReset, onResetCamera }) {
  const set = (key) => (value) => setSettings((s) => ({ ...s, [key]: value }));
  return (
    <section className="scene-panel">
      <p className="eyebrow">Scene lab</p>
      <h2>Display & lighting</h2>
      <div className="toggles">
        <Toggle label="Grid" value={settings.grid} onChange={set("grid")} />
        <Toggle label="Axes" value={settings.axes} onChange={set("axes")} />
        <Toggle
          label="Shadows"
          value={settings.shadows}
          onChange={set("shadows")}
        />
        <Toggle
          label="Lights"
          value={settings.lightsOn}
          onChange={set("lightsOn")}
        />
      </div>
      <p className="micro-label">Lighting preset</p>
      <div className="segmented">
        {["Day", "Warm Interior", "Night"].map((v) => (
          <Button
            key={v}
            active={settings.lighting === v}
            onClick={() => setSettings((s) => ({ ...s, lighting: v }))}
          >
            {v}
          </Button>
        ))}
      </div>
      <p className="micro-label">Camera / projection</p>
      <div className="camera-buttons">
        {["Perspective", "Top", "Front", "Side"].map((v) => (
          <Button
            key={v}
            active={settings.cameraMode === v}
            onClick={() => setSettings((s) => ({ ...s, cameraMode: v }))}
          >
            {v}
          </Button>
        ))}
      </div>
      <div className="panel-actions">
        <Button onClick={onResetCamera}>Reset camera</Button>
        <Button onClick={onReset}>Reset scene</Button>
      </div>
    </section>
  );
}
