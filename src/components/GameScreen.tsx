import React from 'react';
import { QuizCard } from './QuizCard';
import { GameStatus, Question } from '../types';
import { Button } from './Button';

interface GameScreenProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  selectedOption: number | null;
  status: GameStatus;
  onOptionSelect: (index: number) => void;
  onNavigate: (direction: 'next' | 'prev') => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  score,
  selectedOption,
  status,
  onOptionSelect,
  onNavigate
}) => {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="w-full flex flex-col items-center space-y-4 md:space-y-6 animate-fade-in pb-24 md:pb-20 px-2 md:px-0">
      <div className="w-full flex justify-between items-center text-slate-400 px-2 md:px-4 max-w-2xl text-xs md:text-sm">
        <span className="font-mono">QUESTÃO {currentQuestionIndex + 1}/{totalQuestions}</span>
        <div className="flex items-center space-x-2">
           <span className="text-yellow-500">★</span>
           <span className="font-bold text-white text-base">{score}</span>
        </div>
      </div>
      
      <div className="w-full max-w-2xl h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
        <div 
          className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <QuizCard 
        question={question}
        selectedOption={selectedOption}
        onSelect={onOptionSelect}
        disabled={status === GameStatus.FEEDBACK}
        showResult={status === GameStatus.FEEDBACK}
      />

      <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur border-t border-slate-800 p-3 md:p-4 z-20 safe-area-bottom">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-3">
          <Button 
            variant="secondary"
            onClick={() => onNavigate('prev')}
            disabled={currentQuestionIndex === 0}
            className="flex-1 md:flex-none md:w-[150px] text-sm md:text-base py-2.5 md:py-3"
          >
            ← <span className="hidden sm:inline ml-1">Voltar</span>
          </Button>

          <Button 
            variant="primary"
            onClick={() => onNavigate('next')}
            className="flex-[2] md:flex-none md:w-[200px] flex justify-center items-center gap-2 text-sm md:text-base py-2.5 md:py-3"
          >
            {isLastQuestion ? 'Concluir' : 'Avançar'} 
            {!isLastQuestion && <span>→</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};