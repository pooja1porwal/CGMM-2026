export type ThemeId = 'editorial' | 'modern' | 'vibrant' | 'nordic' | 'swiss';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  fontHeader: string;
  fontBody: string;
  fontBadge: string;
  background: string;
  canvasBg: string;
  cardBg: string;
  borderColor: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPrimary: string;
  accentSecondary: string;
  palette: string[];
  pattern?: 'dots' | 'grid' | 'clean' | 'lines';
  badgeStyle: string;
}

export type AspectRatio = '16:9' | '9:16' | '1:1';

export type TransitionType = 'morph' | 'push' | 'fade' | 'zoom' | 'wipe';

export type ChartType = 
  | 'metric'
  | 'bar'
  | 'donut'
  | 'line'
  | 'versus'
  | 'timeline'
  | 'funnel'
  | 'grid';

export interface MetricItem {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: string;
  icon?: string;
}

export interface MetricData {
  primaryValue: number;
  prefix?: string;
  suffix?: string;
  label: string;
  subLabel?: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  secondaryMetrics?: MetricItem[];
}

export interface BarItem {
  id: string;
  label: string;
  value: number;
  formattedValue?: string;
  sublabel?: string;
  color?: string;
  highlight?: boolean;
}

export interface BarData {
  items: BarItem[];
  maxValue?: number;
  unit?: string;
  showTargetLine?: boolean;
  targetValue?: number;
  targetLabel?: string;
}

export interface DonutItem {
  id: string;
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface DonutData {
  items: DonutItem[];
  centerLabel?: string;
  centerValue?: string;
  centerSub?: string;
}

export interface LinePoint {
  id: string;
  x: string;
  y: number;
  formattedY?: string;
}

export interface LineSeries {
  id: string;
  name: string;
  color: string;
  points: LinePoint[];
}

export interface LineData {
  series: LineSeries[];
  unit?: string;
  minY?: number;
  maxY?: number;
  highlightPointIndex?: number;
}

export interface VersusEntity {
  id: string;
  name: string;
  score: number;
  formattedScore: string;
  winner?: boolean;
  color: string;
  icon?: string;
  stats: { label: string; value: string }[];
}

export interface VersusData {
  entityA: VersusEntity;
  entityB: VersusEntity;
  metricName: string;
  verdictText?: string;
}

export interface TimelineMilestone {
  id: string;
  dateOrStep: string;
  title: string;
  description: string;
  value?: string;
  status?: 'completed' | 'active' | 'upcoming';
  icon?: string;
}

export interface TimelineData {
  milestones: TimelineMilestone[];
  progressPercentage?: number;
}

export interface FunnelStage {
  id: string;
  name: string;
  value: number;
  formattedValue: string;
  conversionRate?: string;
  color?: string;
}

export interface FunnelData {
  stages: FunnelStage[];
  baselineLabel?: string;
}

export interface GridCard {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  delta?: string;
  icon?: string;
  color?: string;
}

export interface GridData {
  cards: GridCard[];
}

export type SceneData = 
  | { type: 'metric'; data: MetricData }
  | { type: 'bar'; data: BarData }
  | { type: 'donut'; data: DonutData }
  | { type: 'line'; data: LineData }
  | { type: 'versus'; data: VersusData }
  | { type: 'timeline'; data: TimelineData }
  | { type: 'funnel'; data: FunnelData }
  | { type: 'grid'; data: GridData };

export interface Scene {
  id: string;
  title: string;
  subtitle?: string;
  chartType: ChartType;
  duration: number; // in seconds
  transition: TransitionType;
  takeaway?: string;
  notes?: string;
  data: MetricData | BarData | DonutData | LineData | VersusData | TimelineData | FunnelData | GridData;
}

export interface InfographicProject {
  id: string;
  title: string;
  category: 'business' | 'education' | 'news' | 'marketing';
  theme: ThemeId;
  aspectRatio: AspectRatio;
  scenes: Scene[];
}
