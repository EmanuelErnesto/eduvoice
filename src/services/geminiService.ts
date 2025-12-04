import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { Question, Difficulty } from "../types";
import { env } from "../env";
import { ERROR_CODES } from "../constants";

const getAI = () => {
  if (!env.API_KEY) {
    console.warn("API Key is missing.");
    // Retorna uma instância dummy ou lança erro controlado se preferir,
    // mas aqui deixamos o SDK validar na chamada ou a validação de env.ts capturar.
  }
  return new GoogleGenerativeAI(env.API_KEY);
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  if (!env.API_KEY) {
    console.warn("API Key is missing. TTS will not function.");
    return null;
  }

  try {
    const ai = getAI();
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text }] }],
    });

    const response = result.response;
    const audioData = response.text();

    return audioData || null;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
};

export const generateQuizQuestions = async (
  topic: string,
  difficulty: Difficulty
): Promise<Question[]> => {
  if (!env.API_KEY) throw new Error("API Key não configurada");

  const difficultyPrompts = {
    easy: "Nível: FÁCIL (Iniciante). Perguntas diretas, fundamentais e com vocabulário simples.",
    medium:
      "Nível: MÉDIO (Intermediário). Perguntas que exigem algum raciocínio e conexão de ideias.",
    hard: "Nível: DIFÍCIL (Avançado/Expert). Perguntas complexas, detalhadas, específicas e desafiadoras.",
  };

  const difficultyInstruction =
    difficultyPrompts[difficulty] || difficultyPrompts.medium;

  const ai = getAI();
  const model = ai.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json",
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
  });

  const prompt = `Atue como um filtro de conteúdo educacional e gerador de quizzes.
    
    1. ANALISE O TEMA: "${topic}".
    2. VERIFICAÇÃO DE SEGURANÇA: Se o tema envolver conteúdo sexual, ódio, violência explícita, palavrões, drogas ilícitas ou for desrespeitoso, RETORNE UM ARRAY VAZIO [] imediatamente. Não gere explicações, apenas o array vazio.
    3. GERAÇÃO: Se o tema for seguro e educacional, gere um quiz com 10 perguntas seguindo estritamente este nível de dificuldade:
    
    ${difficultyInstruction}
    
    As perguntas devem ser coerentes com o nível solicitado. 
    A explicação deve ser concisa e educativa.
    Retorne APENAS um array JSON com objetos no seguinte formato:
    [
      {
        "id": 1,
        "text": "Pergunta do quiz",
        "options": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
        "correctIndex": 0,
        "explanation": "Explicação educativa"
      }
    ]`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) throw new Error(ERROR_CODES.CONTENT_BLOCKED);

  try {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error(ERROR_CODES.INVALID_FORMAT);
    }

    const jsonStr = text.substring(start, end + 1);
    const questions = JSON.parse(jsonStr) as Question[];

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error(ERROR_CODES.IMPROPER_CONTENT);
    }

    return questions;
  } catch (e: any) {
    if (
      e.message === ERROR_CODES.IMPROPER_CONTENT ||
      e.message === ERROR_CODES.INVALID_FORMAT
    ) {
      throw e;
    }
    console.error("Erro ao parsear JSON do Gemini", e);
    throw new Error(ERROR_CODES.INVALID_FORMAT);
  }
};
