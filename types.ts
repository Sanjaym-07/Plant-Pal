
export interface CropData {
  name: string;
  reasoning: string;
  visualDescription: string;
  imageUrl?: string;
}

export interface FertilizerData {
  type: string;
  quantity: string;
  schedule: string;
  reasoning: string;
}

export interface PestData {
    pestOrDisease: string;
    description: string;
    confidence: number;
    remedy: string;
}

export interface YieldData {
    estimatedYield: string;
    confidence: string;
    advice: string[];
}

export interface SustainabilityData {
    waterUsageScore: number;
    carbonFootprintScore: number;
    soilHealthScore: number;
    recommendations: string[];
}