import { useState, useRef, useEffect, useCallback } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MousePointer2,
  Type,
  Shapes,
  PenTool,
  PaintBucket,
  Layers,
  Palette,
  Undo2,
  Redo2,
  Save,
  ArrowRight,
  ArrowLeft,
  Plus,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Move,
} from 'lucide-react';
import { useStudio } from '../components/StudioContext';
import ExportButtons from '../components/ExportButtons';
import { useEditorState } from '../editor/useEditorState';
import {
  makeElement,
  documentSvg,
  elementMarkup,
  transform,
  reorder,
  uid,
} from '../editor/editorUtils';
import type { SVGElement, ShapeKind, EditorDocument } from '../editor/editorTypes';
import type { LogoConcept } from '../types/logo';
import { iconDescriptions } from '../generator/iconLibrary';
import { analyzeBrand } from '../generator/semanticAnalyzer';
import { fonts } from '../data/presets';
import { createTypography } from '../generator/typographyEngine';
import { validHex } from '../utils/colorUtils';
const shapeNames: ShapeKind[] = [
  'rectangle',
  'rounded rectangle',
  'circle',
  'ellipse',
  'triangle',
  'polygon',
  'star',
  'line',
];
const toolList = [
  ['Select', MousePointer2],
  ['Add Text', Type],
  ['Add Shape', Shapes],
  ['Add Icon', PenTool],
  ['Background', PaintBucket],
  ['Layers', Layers],
  ['Colors', Palette],
] as const;
interface Drag {
  mode: 'move' | 'resize' | 'rotate';
  start: { x: number; y: number };
  element: SVGElement;
  document: EditorDocument;
}
export default function Editor() {
  const { selected } = useStudio();
  if (!selected)
    return (
      <main className="empty-state">
        <PenTool size={45} />
        <h1>A mark worth making your own.</h1>
        <p>Choose a logo concept to open the vector editor.</p>
        <Link className="btn btn-primary" to="/generate">
          Choose a concept <ArrowRight size={17} />
        </Link>
      </main>
    );
  return <EditorWorkspace key={selected.id} initial={selected} />;
}
function EditorWorkspace({ initial }: { initial: LogoConcept }) {
  const { brand, update, save, notify } = useStudio(),
    navigate = useNavigate(),
    state = useEditorState({ elements: initial.svgElements, background: initial.background }),
    { doc, change, undo, redo } = state;
  const [selectedId, setSelectedId] = useState(
      initial.svgElements.find((e) => e.role === 'symbol')?.id || '',
    ),
    [tool, setTool] = useState('Select'),
    [zoom, setZoom] = useState(100),
    [icon, setIcon] = useState(analyzeBrand(brand).symbols[0]),
    svgRef = useRef<SVGSVGElement>(null),
    drag = useRef<Drag | null>(null);
  const selected = doc.elements.find((e) => e.id === selectedId),
    current = {
      ...initial,
      svgElements: doc.elements,
      background: doc.background,
      svg: documentSvg(doc, { title: brand.brandName }),
    };
  useEffect(() => {
    update({
      ...initial,
      svgElements: doc.elements,
      background: doc.background,
      svg: documentSvg(doc, { title: brand.brandName }),
    });
  }, [doc]);
  const patch = useCallback(
    (values: Partial<SVGElement>) => {
      if (selected?.locked) return;
      change({
        ...doc,
        elements: doc.elements.map((e) => (e.id === selectedId ? { ...e, ...values } : e)),
      });
    },
    [doc, selectedId, selected?.locked, change],
  );
  const layer = (id: string, action: string) => {
    const e = doc.elements.find((x) => x.id === id);
    if (!e) return;
    if (action === 'lock' || action === 'show') {
      change({
        ...doc,
        elements: doc.elements.map((x) =>
          x.id === id
            ? {
                ...x,
                [action === 'lock' ? 'locked' : 'visible']:
                  action === 'lock' ? !x.locked : !x.visible,
              }
            : x,
        ),
      });
      return;
    }
    if (e.locked) {
      notify('Unlock this layer before changing it.');
      return;
    }
    if (action === 'delete') {
      change({ ...doc, elements: doc.elements.filter((x) => x.id !== id) });
      setSelectedId('');
    } else if (action === 'duplicate') {
      const copy = {
        ...e,
        id: uid(),
        name: e.name + ' copy',
        role: 'decoration' as const,
        x: e.x + 15,
        y: e.y + 15,
      };
      change({ ...doc, elements: [...doc.elements, copy] });
      setSelectedId(copy.id);
    } else change({ ...doc, elements: reorder(doc.elements, id, action === 'up' ? 1 : -1) });
  };
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input,textarea,select,[contenteditable=true]')) return;
      const modifier = e.ctrlKey || e.metaKey;
      if (modifier && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (modifier && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (modifier && e.key.toLowerCase() === 's') {
        e.preventDefault();
        save();
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
        e.preventDefault();
        layer(selected.id, 'delete');
      } else if (selected && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const n = e.shiftKey ? 10 : 1;
        patch({
          x: selected.x + (e.key === 'ArrowRight' ? n : e.key === 'ArrowLeft' ? -n : 0),
          y: selected.y + (e.key === 'ArrowDown' ? n : e.key === 'ArrowUp' ? -n : 0),
        });
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [selected, doc, undo, redo, patch, save]);
  function add(values: Partial<SVGElement>) {
    const el = makeElement({
      fill: initial.palette.primary,
      secondary: initial.palette.secondary,
      accent: initial.palette.accent,
      ...values,
    });
    change({ ...doc, elements: [...doc.elements, el] });
    setSelectedId(el.id);
  }
  function point(e: ReactPointerEvent) {
    const svg = svgRef.current,
      ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return { x: 0, y: 0 };
    const p = svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    const q = p.matrixTransform(ctm.inverse());
    return { x: q.x, y: q.y };
  }
  function start(e: ReactPointerEvent, el: SVGElement, mode: Drag['mode']) {
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelectedId(el.id);
    if (el.locked) return;
    state.begin();
    drag.current = { mode, start: point(e), element: { ...el }, document: doc };
    svgRef.current?.setPointerCapture(e.pointerId);
  }
  function move(e: ReactPointerEvent) {
    const d = drag.current;
    if (!d) return;
    const p = point(e),
      dx = p.x - d.start.x,
      dy = p.y - d.start.y,
      el = { ...d.element };
    if (d.mode === 'move') {
      el.x = Math.round(d.element.x + dx);
      el.y = Math.round(d.element.y + dy);
    }
    if (d.mode === 'resize') {
      const angle = (el.rotation * Math.PI) / 180;
      el.width = Math.max(
        10,
        Math.round(el.width + (dx * Math.cos(angle) + dy * Math.sin(angle)) / el.scaleX),
      );
      el.height = Math.max(
        10,
        Math.round(el.height + (-dx * Math.sin(angle) + dy * Math.cos(angle)) / el.scaleY),
      );
      if (e.shiftKey) el.height = (el.width * d.element.height) / d.element.width;
    }
    if (d.mode === 'rotate') {
      const angle =
        (Math.atan2(
          p.y - (el.y + (el.height * el.scaleY) / 2),
          p.x - (el.x + (el.width * el.scaleX) / 2),
        ) *
          180) /
          Math.PI +
        90;
      el.rotation = (Math.round(angle / (e.shiftKey ? 15 : 1)) * (e.shiftKey ? 15 : 1) + 360) % 360;
    }
    state.preview({
      ...d.document,
      elements: d.document.elements.map((x) => (x.id === el.id ? el : x)),
    });
  }
  function end(e: ReactPointerEvent) {
    if (!drag.current) return;
    drag.current = null;
    state.end();
    if (svgRef.current?.hasPointerCapture(e.pointerId))
      svgRef.current.releasePointerCapture(e.pointerId);
  }
  function useTool(name: string) {
    setTool(name);
    if (name === 'Add Text')
      add({
        kind: 'text',
        name: 'Custom text',
        text: 'Your text',
        width: 260,
        height: 65,
        x: 170,
        y: 305,
        fontSize: 30,
      });
  }
  return (
    <main className="editor-page">
      <div className="editor-toolbar">
        <div className="row">
          <Link to="/generate" className="icon-button" aria-label="Back to concepts">
            <ArrowLeft size={19} />
          </Link>
          <div className="editor-title">
            <strong>{brand.brandName}</strong>
            <span>{initial.name} · Vector editor</span>
          </div>
        </div>
        <div className="editor-history">
          <button
            className="icon-button"
            disabled={!state.canUndo}
            onClick={undo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 size={18} />
          </button>
          <button
            className="icon-button"
            disabled={!state.canRedo}
            onClick={redo}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
          >
            <Redo2 size={18} />
          </button>
        </div>
        <div className="row editor-top-actions">
          <button className="btn btn-outline btn-small" onClick={save}>
            <Save size={16} /> Save project
          </button>
          <button className="btn btn-primary btn-small" onClick={() => navigate('/brand-kit')}>
            Brand Kit <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div className="editor-layout">
        <aside className="editor-tools" aria-label="Editor tools">
          {toolList.map(([name, Icon]) => (
            <button
              className={tool === name ? 'active' : ''}
              onClick={() => useTool(name)}
              key={name}
              title={name}
              aria-pressed={tool === name}
            >
              <Icon size={21} />
              <span>{name}</span>
            </button>
          ))}
        </aside>
        <aside className="editor-left-panel">
          <div className="panel-heading">
            <strong>{tool === 'Select' ? 'Design layers' : tool}</strong>
            <span className="muted small">{doc.elements.length}</span>
          </div>
          {tool === 'Add Shape' && (
            <div className="shape-picker">
              {shapeNames.map((s, i) => (
                <button
                  key={s}
                  onClick={() =>
                    add({
                      name: s,
                      shape: s,
                      strokeWidth: s === 'line' ? 4 : 0,
                      width: s === 'line' ? 150 : 100,
                      height: s === 'line' ? 20 : 100,
                    })
                  }
                >
                  <span>{['□', '▢', '○', '⬭', '△', '⬡', '☆', '╱'][i]}</span>
                  {s}
                </button>
              ))}
            </div>
          )}
          {tool === 'Add Icon' && (
            <div className="panel-block">
              <p className="panel-note">Add an original symbol from the SVG library.</p>
              <label className="field">
                Symbol
                <select value={icon} onChange={(e) => setIcon(e.target.value)}>
                  {Object.keys(iconDescriptions).map((k) => (
                    <option key={k} value={k}>
                      {k.replaceAll('-', ' ')}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="btn btn-primary btn-small wide"
                onClick={() =>
                  add({
                    kind: 'icon',
                    role: 'decoration',
                    name: icon,
                    icon,
                    width: 100,
                    height: 100,
                  })
                }
              >
                <Plus size={15} /> Add symbol
              </button>
            </div>
          )}
          {tool === 'Background' && (
            <div className="panel-block">
              <ColorField
                label="Canvas color"
                value={doc.background === 'transparent' ? '#ffffff' : doc.background}
                onChange={(background) => change({ ...doc, background })}
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={doc.background === 'transparent'}
                  onChange={(e) =>
                    change({
                      ...doc,
                      background: e.target.checked ? 'transparent' : initial.background,
                    })
                  }
                />{' '}
                Transparent background
              </label>
              <button
                className="btn btn-ghost btn-small"
                onClick={() => change({ ...doc, background: initial.background })}
              >
                <RotateCcw size={13} /> Restore background
              </button>
            </div>
          )}
          {tool === 'Colors' && (
            <div className="panel-block">
              <p className="panel-note">Apply a palette color to the selected layer.</p>
              <div className="editor-swatches">
                {Object.values(initial.palette).map((c, i) => (
                  <button
                    key={i}
                    style={{ background: c }}
                    title={c}
                    aria-label={`Apply ${c}`}
                    disabled={!selected || selected.locked}
                    onClick={() => patch({ fill: c })}
                  />
                ))}
              </div>
              <p className="panel-note">Symbol accent colors can be changed in Properties.</p>
            </div>
          )}
          {tool === 'Add Text' && (
            <div className="panel-block">
              <p className="panel-note">
                Text added. Change the words, font, and spacing in Properties.
              </p>
              <button
                className="btn btn-outline btn-small wide"
                onClick={() =>
                  add({
                    kind: 'text',
                    name: 'Custom text',
                    text: 'Your text',
                    x: 170,
                    y: 290,
                    width: 260,
                    height: 65,
                    fontSize: 30,
                  })
                }
              >
                <Plus size={14} /> Add another text layer
              </button>
            </div>
          )}
          <div className="layers-heading">
            <Layers size={13} /> Layers <span>Top to bottom</span>
          </div>
          <div className="layer-list">
            {[...doc.elements].reverse().map((el) => (
              <div
                className={
                  'layer-row ' +
                  (el.id === selectedId ? 'selected' : '') +
                  (!el.visible ? ' hidden-layer' : '')
                }
                key={el.id}
              >
                <button className="layer-select" onClick={() => setSelectedId(el.id)}>
                  {el.kind === 'text' ? (
                    <Type size={14} />
                  ) : el.kind === 'icon' ? (
                    <PenTool size={14} />
                  ) : (
                    <Shapes size={14} />
                  )}
                  <span>{el.name}</span>
                </button>
                <button
                  className="icon-button"
                  onClick={() => layer(el.id, 'show')}
                  title={el.visible ? 'Hide layer' : 'Show layer'}
                  aria-label={`${el.visible ? 'Hide' : 'Show'} ${el.name}`}
                >
                  {el.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button
                  className="icon-button"
                  onClick={() => layer(el.id, 'lock')}
                  title={el.locked ? 'Unlock layer' : 'Lock layer'}
                  aria-label={`${el.locked ? 'Unlock' : 'Lock'} ${el.name}`}
                >
                  {el.locked ? <Lock size={12} /> : <Unlock size={12} />}
                </button>
              </div>
            ))}
          </div>
          {!doc.elements.length && (
            <p className="panel-note panel-block">
              Your canvas is empty. Add a shape, icon, or text to begin.
            </p>
          )}
          <div className="editor-layer-actions">
            <button
              className="icon-button"
              disabled={!selected || selected.locked}
              onClick={() => layer(selectedId, 'up')}
              title="Move layer up"
              aria-label="Move layer up"
            >
              <ChevronUp size={17} />
            </button>
            <button
              className="icon-button"
              disabled={!selected || selected.locked}
              onClick={() => layer(selectedId, 'down')}
              title="Move layer down"
              aria-label="Move layer down"
            >
              <ChevronDown size={17} />
            </button>
            <button
              className="icon-button"
              disabled={!selected || selected.locked}
              onClick={() => layer(selectedId, 'duplicate')}
              title="Duplicate layer"
              aria-label="Duplicate layer"
            >
              <Copy size={15} />
            </button>
            <button
              className="icon-button"
              disabled={!selected || selected.locked}
              onClick={() => layer(selectedId, 'delete')}
              title="Delete layer"
              aria-label="Delete layer"
            >
              <Trash2 size={15} />
            </button>
          </div>
          <div className="panel-block editor-help">
            <Move size={17} />
            <p>
              Drag to move. Use the square to resize and the dot to rotate. Hold Shift for 15°
              rotation or proportional resizing.
            </p>
            <small>
              Arrow keys: move 1 px
              <br />
              Shift + arrows: move 10 px
            </small>
          </div>
        </aside>
        <section className="canvas-section" aria-label="Logo canvas">
          <div className="canvas-meta">
            <span>ARTBOARD 01</span>
            <span>600 × 400</span>
          </div>
          <div className="canvas-scroll">
            <div
              className="artboard-wrap"
              style={{ width: `${zoom}%`, minWidth: zoom > 100 ? `${zoom}%` : undefined }}
            >
              <svg
                ref={svgRef}
                className="editor-svg"
                viewBox="0 0 600 400"
                role="img"
                aria-label={`${brand.brandName} editable logo. Select a layer to change its properties.`}
                onPointerMove={move}
                onPointerUp={end}
                onPointerCancel={end}
                onPointerDown={(e) => {
                  if (e.target === e.currentTarget) setSelectedId('');
                }}
              >
                <rect
                  width="600"
                  height="400"
                  fill={doc.background === 'transparent' ? 'transparent' : doc.background}
                  onPointerDown={() => setSelectedId('')}
                />
                {doc.elements.map((el) => (
                  <g
                    key={el.id}
                    onPointerDown={(e) => start(e, el, 'move')}
                    style={{ cursor: el.locked ? 'default' : 'move' }}
                    dangerouslySetInnerHTML={{ __html: elementMarkup(el) }}
                  />
                ))}
                {selected && selected.visible && (
                  <g
                    transform={transform(selected)}
                    className="selection-box"
                    fill="none"
                    stroke="#8751eb"
                    strokeWidth={1 / selected.scaleX}
                    style={{ pointerEvents: 'none' }}
                  >
                    <rect
                      width={selected.width}
                      height={selected.height}
                      strokeDasharray={selected.locked ? '4 4' : undefined}
                    />
                    {!selected.locked && (
                      <>
                        <line x1={selected.width / 2} y1={0} x2={selected.width / 2} y2={-22} />
                        <circle
                          cx={selected.width / 2}
                          cy={-26}
                          r={5}
                          fill="white"
                          style={{ pointerEvents: 'all', cursor: 'grab' }}
                          onPointerDown={(e) => start(e, selected, 'rotate')}
                        />
                        <rect
                          x={selected.width - 5}
                          y={selected.height - 5}
                          width={10}
                          height={10}
                          fill="white"
                          style={{ pointerEvents: 'all', cursor: 'nwse-resize' }}
                          onPointerDown={(e) => start(e, selected, 'resize')}
                        />
                      </>
                    )}
                  </g>
                )}
              </svg>
            </div>
          </div>
          <div className="canvas-bottom">
            <span>
              <Check size={13} /> Editable SVG · {doc.elements.filter((e) => e.visible).length}{' '}
              visible layers
            </span>
            <div className="zoom-controls">
              <button
                className="icon-button"
                disabled={zoom <= 50}
                onClick={() => setZoom((z) => z - 25)}
                aria-label="Zoom out"
              >
                <ZoomOut size={16} />
              </button>
              <button onClick={() => setZoom(100)} title="Reset zoom">
                {zoom}%
              </button>
              <button
                className="icon-button"
                disabled={zoom >= 200}
                onClick={() => setZoom((z) => z + 25)}
                aria-label="Zoom in"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          </div>
          <div className="canvas-export">
            <ExportButtons concept={current} full />
          </div>
        </section>
        <aside className="properties-panel">
          <div className="panel-heading">
            <strong>Properties</strong>
            {selected?.locked ? <Lock size={14} /> : <SlidersIcon />}
          </div>
          {selected ? (
            <>
              <div className="panel-block">
                <span className="property-subtitle">{selected.kind.toUpperCase()} LAYER</span>
                <input
                  className="layer-name-input"
                  aria-label="Layer name"
                  value={selected.name}
                  disabled={selected.locked}
                  onChange={(e) => patch({ name: e.target.value })}
                />
                {selected.locked && (
                  <p className="panel-note">Unlock this layer in Layers to edit it.</p>
                )}
              </div>
              <fieldset disabled={selected.locked} className="properties-fields">
                <div className="property-section">
                  <h4>Transform</h4>
                  <div className="property-grid">
                    <NumberField
                      label="X position"
                      value={selected.x}
                      min={-1200}
                      max={1800}
                      onChange={(x) => patch({ x })}
                    />
                    <NumberField
                      label="Y position"
                      value={selected.y}
                      min={-800}
                      max={1200}
                      onChange={(y) => patch({ y })}
                    />
                    <NumberField
                      label="Width"
                      value={selected.width}
                      min={1}
                      max={1600}
                      onChange={(width) => patch({ width })}
                    />
                    <NumberField
                      label="Height"
                      value={selected.height}
                      min={1}
                      max={1200}
                      onChange={(height) => patch({ height })}
                    />
                    <NumberField
                      label="Scale X"
                      value={selected.scaleX}
                      min={0.1}
                      max={5}
                      step={0.1}
                      onChange={(scaleX) => patch({ scaleX })}
                    />
                    <NumberField
                      label="Scale Y"
                      value={selected.scaleY}
                      min={0.1}
                      max={5}
                      step={0.1}
                      onChange={(scaleY) => patch({ scaleY })}
                    />
                  </div>
                  <RangeField
                    label="Rotation"
                    value={selected.rotation}
                    max={360}
                    suffix="°"
                    onChange={(rotation) => patch({ rotation })}
                  />
                  <RangeField
                    label="Opacity"
                    value={Math.round(selected.opacity * 100)}
                    max={100}
                    suffix="%"
                    onChange={(opacity) => patch({ opacity: opacity / 100 })}
                  />
                </div>
                <div className="property-section">
                  <h4>Appearance</h4>
                  <ColorField
                    label="Fill"
                    value={selected.fill}
                    onChange={(fill) => patch({ fill })}
                  />
                  {selected.kind === 'icon' && (
                    <>
                      <ColorField
                        label="Secondary"
                        value={selected.secondary}
                        onChange={(secondary) => patch({ secondary })}
                      />
                      <ColorField
                        label="Accent"
                        value={selected.accent}
                        onChange={(accent) => patch({ accent })}
                      />
                    </>
                  )}
                  <ColorField
                    label="Stroke"
                    value={selected.stroke}
                    onChange={(stroke) => patch({ stroke })}
                  />
                  <NumberField
                    label="Stroke width"
                    value={selected.strokeWidth}
                    min={0}
                    max={15}
                    step={0.5}
                    onChange={(strokeWidth) => patch({ strokeWidth })}
                  />
                  {selected.shape === 'rounded rectangle' && selected.kind === 'shape' && (
                    <NumberField
                      label="Border radius"
                      value={selected.radius}
                      min={0}
                      max={50}
                      onChange={(radius) => patch({ radius })}
                    />
                  )}
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selected.gradient}
                      onChange={(e) => patch({ gradient: e.target.checked })}
                    />{' '}
                    {selected.kind === 'shape' ? 'Radial' : 'Linear'} gradient
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selected.shadow}
                      onChange={(e) => patch({ shadow: e.target.checked })}
                    />{' '}
                    Soft drop shadow
                  </label>
                </div>
                {selected.kind === 'text' && (
                  <div className="property-section">
                    <h4>Typography</h4>
                    <label className="field">
                      Text
                      <textarea
                        rows={2}
                        maxLength={120}
                        value={selected.text}
                        onChange={(e) => patch({ text: e.target.value })}
                      />
                    </label>
                    <label className="field">
                      Font family
                      <select
                        value={selected.fontFamily}
                        onChange={(e) => patch({ fontFamily: e.target.value })}
                      >
                        {[
                          ...new Set(
                            fonts.map(
                              (f) => createTypography({ ...brand, fontPersonality: f }).family,
                            ),
                          ),
                        ].map((f) => (
                          <option key={f} value={f}>
                            {f.split(',')[0]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="property-grid">
                      <NumberField
                        label="Font size"
                        value={selected.fontSize}
                        min={8}
                        max={160}
                        onChange={(fontSize) => patch({ fontSize })}
                      />
                      <NumberField
                        label="Weight"
                        value={selected.fontWeight}
                        min={100}
                        max={900}
                        step={100}
                        onChange={(fontWeight) => patch({ fontWeight })}
                      />
                    </div>
                    <NumberField
                      label="Letter spacing"
                      value={selected.letterSpacing}
                      min={-5}
                      max={20}
                      step={0.5}
                      onChange={(letterSpacing) => patch({ letterSpacing })}
                    />
                    <p className="panel-note">
                      Long text fits within its layer width. Enlarge the width to give letters more
                      room.
                    </p>
                  </div>
                )}
              </fieldset>
            </>
          ) : (
            <div className="panel-block">
              <MousePointer2 size={27} />
              <p className="panel-note">
                Select a layer on the canvas or in Layers to edit its position, shape, and
                appearance.
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
function SlidersIcon() {
  return <Shapes size={15} />;
}
function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <label className="number-field">
      {label}
      <input
        type="number"
        value={Math.round(value * 100) / 100}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          if (e.target.value === '') return;
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
      />
    </label>
  );
}
function RangeField({
  label,
  value,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="range-field">
      <span>
        {label}
        <strong>
          {Math.round(value)}
          {suffix}
        </strong>
      </span>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  return (
    <label className="color-field">
      <span>{label}</span>
      <div>
        <input
          aria-label={`${label} color picker`}
          type="color"
          value={validHex(value) ? value : '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          aria-label={`${label} HEX`}
          value={text}
          maxLength={7}
          onChange={(e) => {
            setText(e.target.value);
            if (validHex(e.target.value)) onChange(e.target.value);
          }}
          onBlur={() => {
            if (!validHex(text)) setText(value);
          }}
        />
      </div>
    </label>
  );
}
