import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface InterviewQuestion {
  id: string;
  question: string;
  category: "Technical" | "Behavioral" | "System Design";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  expectedTopics: string[];
  hints: string[];
  sampleSolution: string;
}

export interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  overallFeedback: string;
  idealAnswer: string;
}

export async function generateInterviewQuestion(
  company: string,
  role: string,
  skillLevel: string
): Promise<InterviewQuestion> {
  const prompt = `Generate a highly realistic interview question for a ${role} position at ${company}. 
  The candidate's skill level is ${skillLevel}.
  The question should be challenging and specific to ${company}'s known interview style.
  Include hints, expected topics, and a sample solution.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            category: { type: Type.STRING, enum: ["Technical", "Behavioral", "System Design"] },
            difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
            expectedTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            hints: { type: Type.ARRAY, items: { type: Type.STRING } },
            sampleSolution: { type: Type.STRING },
          },
          required: ["id", "question", "category", "difficulty", "expectedTopics", "hints", "sampleSolution"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    if (error?.message?.includes("RESOURCE_EXHAUSTED") || error?.status === "RESOURCE_EXHAUSTED") {
      throw new Error("API Quota Exceeded: You have reached the limit for the free tier. Please wait a moment or try again later.");
    }
    throw error;
  }
}

export async function evaluateAnswer(
  question: string,
  userAnswer: string,
  company: string,
  role: string
): Promise<Feedback> {
  const prompt = `Evaluate the following interview answer for a ${role} position at ${company}.
  Question: ${question}
  User Answer: ${userAnswer}
  
  Provide a score from 0-100, list strengths, areas for improvement, overall feedback, and an ideal answer that would impress a FAANG interviewer.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            overallFeedback: { type: Type.STRING },
            idealAnswer: { type: Type.STRING },
          },
          required: ["score", "strengths", "improvements", "overallFeedback", "idealAnswer"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    if (error?.message?.includes("RESOURCE_EXHAUSTED") || error?.status === "RESOURCE_EXHAUSTED") {
      throw new Error("API Quota Exceeded: You have reached the limit for the free tier. Please wait a moment or try again later.");
    }
    throw error;
  }
}
