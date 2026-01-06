
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserProfile, DietPlan } from "../types";

export class GeminiService {
  private genAI: GoogleGenAI;

  constructor() {
    // Always use process.env.API_KEY directly
    this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Uses gemini-flash-lite-latest for fast health tips
  async getQuickTip(profile: UserProfile): Promise<string> {
    const response = await this.genAI.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `Based on a ${profile.age}-year-old ${profile.gender} with a ${profile.specialization} profile and ${profile.activityLevel} activity, give one short, actionable health tip (max 30 words).`,
    });
    // Use .text property directly (not a method)
    return response.text || "Stay hydrated and keep moving!";
  }

  // Generates feedback based on specific daily logs
  async getFeedbackOnActivity(profile: UserProfile, logs: { food: string; water: number; exercise: string }): Promise<string> {
    const response = await this.genAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a health coach for a ${profile.age}-year-old with specialization in ${profile.specialization}, provide specific feedback on today's activities:
      - Food eaten: ${logs.food}
      - Water intake: ${logs.water} Liters
      - Exercise: ${logs.exercise}
      
      Keep the feedback concise, encouraging, and science-backed. Focus on how this aligns with their ${profile.specialization} goal.`,
    });
    // Use .text property directly
    return response.text || "Keep up the good work!";
  }

  // Uses gemini-3-flash-preview with search grounding for up-to-date research
  async searchHealthTopic(query: string) {
    const response = await this.genAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return {
      // Ensure text is always a string for the component state
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
    };
  }

  // Uses gemini-3-pro-preview for deep medical/diet reasoning
  async generateWeeklyDiet(profile: UserProfile): Promise<DietPlan[]> {
    const response = await this.genAI.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a 7-day healthy diet plan for a ${profile.age}-year-old ${profile.gender} with specialization: ${profile.specialization}. Activity: ${profile.activityLevel}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              breakfast: { type: Type.STRING },
              lunch: { type: Type.STRING },
              dinner: { type: Type.STRING },
              snacks: { type: Type.STRING },
              calories: { type: Type.NUMBER }
            },
            required: ["day", "breakfast", "lunch", "dinner", "snacks", "calories"]
          }
        }
      }
    });
    // Use .text property directly
    return JSON.parse(response.text || "[]");
  }

  // Chatbot using gemini-3-pro-preview
  async getChatResponse(message: string, profile: UserProfile) {
    const chat = this.genAI.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are a professional health coach for Health Monetisation. The user is ${profile.age} years old and interested in ${profile.specialization}. Provide empathetic, science-backed health advice.`,
      },
    });
    const result = await chat.sendMessage({ message });
    // Use .text property directly
    return result.text || "";
  }
}
