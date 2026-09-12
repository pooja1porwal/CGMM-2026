export const industries = [
  'Technology',
  'Finance',
  'Food',
  'Fashion',
  'Education',
  'Healthcare',
  'Gaming',
  'Sports',
  'Travel',
  'Real Estate',
  'Beauty',
  'Entertainment',
  'Automobile',
  'E-commerce',
  'Legal',
  'Agriculture',
  'Logistics',
  'Construction',
  'Photography',
  'Consulting',
  'Energy',
  'Nonprofit',
  'Hospitality',
  'Manufacturing',
  'Personal Brand',
  'Other',
] as const;
export type Industry = (typeof industries)[number];
export interface BrandInput {
  brandName: string;
  tagline: string;
  industry: Industry;
  description: string;
  personality: string[];
  logoStyle: string;
  colorPreference: string;
  customColor: string;
  fontPersonality: string;
}
export interface SemanticResult {
  category: Industry;
  keywords: string[];
  source: string;
  symbols: string[];
  theme: string;
  rationale: string;
}
export interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  ink: string;
}
export interface Typography {
  name: string;
  family: string;
  weight: number;
  spacing: number;
  bodyFamily: string;
  reasoning: string;
}
