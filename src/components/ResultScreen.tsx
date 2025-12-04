
import React from 'react';
import { Button } from './Button';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, onRestart }) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur p-6 md:p-8 rounded-2xl border border-slate-700 text-center max-w-lg w-full animate-scale-in mx-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Quiz Finalizado!</h2>
      <div className="text-5xl md:text-6xl font-bold text-indigo-400 mb-6">{score} / {totalQuestions}</div>
      <p className="text-sm md:text-base text-slate-300 mb-8 leading-relaxed">
        Parabéns por completar o módulo. EduVoice Interactive espera por você no próximo desafio.
      </p>
      <Button onClick={onRestart} variant="primary" className="w-full md:w-auto">
        Reiniciar
      </Button>
    </div>
  );
};
