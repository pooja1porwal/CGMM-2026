import type { BrandInput, Palette, Typography, Industry } from './brand';
import type { SVGElement } from '../editor/editorTypes';
export type Layout = 'stacked' | 'horizontal' | 'emblem' | 'split' | 'minimal' | 'badge';
export interface LogoConcept {
  id: string;
  name: string;
  category: Industry;
  semanticConnection: string;
  palette: Palette;
  typography: Typography;
  svgElements: SVGElement[];
  svg: string;
  layout: Layout;
  background: string;
}
export interface BrandProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  brand: BrandInput;
  concept: LogoConcept;
}
