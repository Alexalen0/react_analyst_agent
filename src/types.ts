export interface FileContent {
  type: string;
  content: string | any[];
  preview?: any;
}

export interface AnalysisResponse {
  answer: string;
  visualizations?: any[];
}
