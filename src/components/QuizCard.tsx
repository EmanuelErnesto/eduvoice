import React from 'react';
import { Question } from '../types';
import { Button } from './Button';

interface QuizCardProps {
  question: Question;
  selectedOption: number | null;
  onSelect: (index: number) => void;
  disabled: boolean;
  showResult?: boolean;
}

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';

export const QuizCard: React.FC<QuizCardProps> = ({ question, selectedOption, onSelect, disabled, showResult }) => {
  
  const getVariant = (idx: number): ButtonVariant => {
    const feedbackVariants: Record<number, ButtonVariant> = {
      [selectedOption ?? -1]: 'danger',
      [question.correctIndex]: 'success'
    };

    const strategies = {
      true: () => feedbackVariants[idx] ?? 'secondary',
      false: () => (selectedOption === idx ? 'primary' : 'secondary')
    };

    return strategies[String(Boolean(showResult)) as 'true' | 'false']();
  };

  const getOpacity = (idx: number): string => {
    const strategies = {
      true: () => (idx !== question.correctIndex && idx !== selectedOption ? 'opacity-50' : 'opacity-100'),
      false: () => 'opacity-100'
    };
    return strategies[String(Boolean(showResult)) as 'true' | 'false']();
  };

  return (
    <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white mb-6 md:mb-8 min-h-[3rem] md:min-h-[4rem] flex items-center justify-center leading-snug">
        {question.text}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {question.options.map((option, idx) => (
          <Button
            key={idx}
            variant={getVariant(idx)}
            onClick={() => onSelect(idx)}
            disabled={disabled}
            className={`w-full h-full min-h-[4rem] px-4 py-3 sm:py-4 text-sm sm:text-base leading-snug whitespace-normal break-words flex items-center justify-center ${getOpacity(idx)}`}
          >
            <span className="w-full">{option}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};