
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Quiz, Difficulty } from '../types';
import { generateQuizQuestions } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { ERROR_CODES } from '../constants';

interface QuizContextType {
  currentQuiz: Quiz | null;
  history: Quiz[];
  isGenerating: boolean;
  generationError: string | null;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  generateQuiz: (topic: string, difficulty: Difficulty) => Promise<void>;
  deleteQuiz: (id: string) => void;
  exitQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [history, setHistory] = useState<Quiz[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    setHistory(storageService.getQuizzes());
  }, []);

  const generateQuiz = useCallback(async (topic: string, difficulty: Difficulty) => {
    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      const questions = await generateQuizQuestions(topic, difficulty);
      const newQuiz: Quiz = {
        id: crypto.randomUUID(),
        topic,
        difficulty,
        createdAt: Date.now(),
        questions
      };
      
      storageService.saveQuiz(newQuiz);
      setHistory(storageService.getQuizzes());
      setCurrentQuiz(newQuiz);
    } catch (error: any) {
      console.error(error);
      const errorStrategies: Record<string, string> = {
        [ERROR_CODES.IMPROPER_CONTENT]: "Tema identificado como impróprio ou inseguro. Por favor, escolha um tema educacional.",
        [ERROR_CODES.CONTENT_BLOCKED]: "Tema identificado como impróprio ou inseguro. Por favor, escolha um tema educacional.",
        [ERROR_CODES.INVALID_FORMAT]: "Não foi possível estruturar o quiz corretamente. Tente reformular o tema.",
        DEFAULT: "Não foi possível gerar o quiz. Verifique sua conexão e tente novamente."
      };

      const msg = errorStrategies[error.message] || errorStrategies.DEFAULT;
      setGenerationError(msg);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const deleteQuiz = useCallback((id: string) => {
    storageService.deleteQuiz(id);
    setHistory(storageService.getQuizzes());
  }, []);

  const exitQuiz = useCallback(() => {
    setCurrentQuiz(null);
  }, []);

  return (
    <QuizContext.Provider value={{
      currentQuiz,
      history,
      isGenerating,
      generationError,
      setCurrentQuiz,
      generateQuiz,
      deleteQuiz,
      exitQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
};
