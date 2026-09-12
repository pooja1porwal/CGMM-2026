export type ShapeKind =
  | 'rectangle'
  | 'rounded rectangle'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'polygon'
  | 'star'
  | 'line';
export interface SVGElement {
  id: string;
  name: string;
  kind: 'icon' | 'text' | 'shape';
  role?: 'symbol' | 'brand' | 'tagline' | 'decoration';
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  opacity: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  radius: number;
  visible: boolean;
  locked: boolean;
  shape?: ShapeKind;
  icon?: string;
  secondary: string;
  accent: string;
  text?: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  gradient: boolean;
  shadow: boolean;
}
export interface EditorDocument {
  elements: SVGElement[];
  background: string;
}
