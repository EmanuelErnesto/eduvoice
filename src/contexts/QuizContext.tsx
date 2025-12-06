
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Quiz, Difficulty } from '../types';
import { storageService } from '../services/storageService';
import { QUESTIONS } from '../constants';

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

// Função para selecionar perguntas aleatórias
const getRandomQuestions = (count: number) => {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

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
      // Simula um pequeno delay para manter a experiência de "geração"
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const questions = getRandomQuestions(5);
      const newQuiz: Quiz = {
        id: crypto.randomUUID(),
        topic: "Sistemas Multimídia",
        difficulty,
        createdAt: Date.now(),
        questions
      };
      
      storageService.saveQuiz(newQuiz);
      setHistory(storageService.getQuizzes());
      setCurrentQuiz(newQuiz);
    } catch (error: any) {
      console.error(error);
      setGenerationError("Não foi possível gerar o quiz. Tente novamente.");
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
