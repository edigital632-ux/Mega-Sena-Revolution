export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Em um app real, isso seria um hash
  createdAt: string;
}

export interface LotteryGame {
  numbers: number[];
  reasoning: string;
  historicalCheck: boolean; // Confirms validation against past results
  quadrantAnalysis: {
    q1: number; // Count of numbers in Quadrant 1
    q2: number;
    q3: number;
    q4: number;
  };
  probabilityScore: number; // 0-100
}

export interface GenerationResponse {
  games: LotteryGame[];
  generalAnalysis: string;
}

export enum Quadrant {
  Q1 = 'Q1', // Top Left
  Q2 = 'Q2', // Top Right
  Q3 = 'Q3', // Bottom Left
  Q4 = 'Q4'  // Bottom Right
}

// Stats for charts
export interface StatPoint {
  name: string;
  value: number;
}