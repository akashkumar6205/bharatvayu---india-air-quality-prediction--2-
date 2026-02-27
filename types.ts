
export enum AQILevel {
  GOOD = 'Good',
  MODERATE = 'Moderate',
  UNHEALTHY_SENSITIVE = 'Unhealthy for Sensitive Groups',
  UNHEALTHY = 'Unhealthy',
  VERY_UNHEALTHY = 'Very Unhealthy',
  HAZARDOUS = 'Hazardous'
}

export interface Pollutants {
  pm2_5: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

export interface Weather {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

export interface AQIData {
  aqi: number;
  location: string;
  timestamp: string;
  pollutants: Pollutants;
  weather: Weather;
  level: AQILevel;
  color: string;
}

export interface ForecastPoint {
  time: string;
  aqi: number;
  confidence: number;
}

export interface WeatherForecastPoint {
  day: string;
  temp: number;
  aqi: number;
  condition: string;
}

export interface HistoryPoint {
  time: string;
  aqi: number;
  temp: number;
}

export interface HealthAdvisory {
  general: string;
  children: string;
  elderly: string;
  sensitiveGroups: string;
  activities: string[];
}

export interface AIAnalysis {
  forecast: ForecastPoint[];
  weatherForecast: WeatherForecastPoint[];
  history: HistoryPoint[];
  advisory: HealthAdvisory;
  sourceAnalysis: string;
  confidenceLevel: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UserProfile {
  name: string;
  avatarSeed: string;
  tier: 'Free' | 'Pro' | 'Expert';
  bio: string;
}
