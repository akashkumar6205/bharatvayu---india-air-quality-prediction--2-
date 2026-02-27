
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AQIData, AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Service to get AI analysis of air quality data using Google Gemini
export const getAIAnalysis = async (data: AQIData): Promise<AIAnalysis> => {
  const prompt = `
    As an expert environmental scientist and health advisor specifically focused on the Indian context (Bharat), analyze the current air quality and weather data for ${data.location}.
    Current AQI: ${data.aqi} (${data.level})
    Pollutants: PM2.5: ${data.pollutants.pm2_5}, PM10: ${data.pollutants.pm10}, NO2: ${data.pollutants.no2}, O3: ${data.pollutants.o3}
    Weather: ${data.weather.temp}°C, ${data.weather.humidity}% humidity, ${data.weather.windSpeed}km/h wind.
    
    Tasks:
    1. Predict AQI for the next 24 hours (hourly trend).
    2. Provide a 7-day extended forecast for both AQI and Temperature.
    3. Generate a simulated 24-hour historical trend based on current conditions to show progress.
    4. Provide specific health advisories for children, elderly, and sensitive groups in India.
    5. Analyze potential pollution sources (e.g., traffic, stubble burning if applicable, industrial).
    6. Provide an overall confidence level (0-1).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          forecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                aqi: { type: Type.NUMBER },
                confidence: { type: Type.NUMBER }
              },
              required: ["time", "aqi", "confidence"]
            }
          },
          weatherForecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                temp: { type: Type.NUMBER },
                aqi: { type: Type.NUMBER },
                condition: { type: Type.STRING }
              },
              required: ["day", "temp", "aqi", "condition"]
            }
          },
          history: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                aqi: { type: Type.NUMBER },
                temp: { type: Type.NUMBER }
              },
              required: ["time", "aqi", "temp"]
            }
          },
          advisory: {
            type: Type.OBJECT,
            properties: {
              general: { type: Type.STRING },
              children: { type: Type.STRING },
              elderly: { type: Type.STRING },
              sensitiveGroups: { type: Type.STRING },
              activities: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["general", "children", "elderly", "sensitiveGroups", "activities"]
          },
          sourceAnalysis: { type: Type.STRING },
          confidenceLevel: { type: Type.NUMBER }
        },
        required: ["forecast", "weatherForecast", "history", "advisory", "sourceAnalysis", "confidenceLevel"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from AI model");
  }
  return JSON.parse(text.trim());
};

// Create a new chat session for user interaction
export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are BharatVayu AI Assistant, dedicated to providing accurate air quality information for India. Keep your responses extremely brief and concise. Use short lines and avoid long paragraphs. Aim for 1-2 sentences maximum per response. Be professional, empathetic towards health concerns, and punchy.',
    },
  });
};
