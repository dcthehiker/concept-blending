
export interface ConceptCard {
  html: string;
  keywords: string[];
  timestamp: number;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SYNTHESIZING = 'SYNTHESIZING',
  COLLAPSING = 'COLLAPSING',
  ERROR = 'ERROR'
}
