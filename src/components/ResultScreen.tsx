import React from "react";
import { Button } from "./Button";
import { Confetti } from "./Confetti";
import { Mascot } from "./Mascot";

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  totalQuestions,
  onRestart,
}) => {
  const isHappy = score > 5;
  const percentage = Math.round((score / totalQuestions) * 100);

  const getMessage = () => {
    if (percentage >= 80) return "Excelente! Você é um verdadeiro expert!";
    if (percentage >= 60) return "Muito bem! Continue assim!";
    if (percentage >= 40) return "Bom trabalho! Você está no caminho certo!";
    return "Não desista! Continue estudando e você vai melhorar!";
  };

  return (
    <>
      {isHappy && <Confetti />}
      <div className="bg-slate-800/80 backdrop-blur p-6 md:p-8 rounded-2xl border border-slate-700 text-center max-w-lg w-full animate-scale-in mx-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Quiz Finalizado!
        </h2>

        <Mascot isHappy={isHappy} />

        <div className="text-5xl md:text-6xl font-bold text-indigo-400 mb-2">
          {score} / {totalQuestions}
        </div>
        <div className="text-2xl font-semibold text-cyan-400 mb-6">
          {percentage}%
        </div>

        <p className="text-sm md:text-base text-slate-300 mb-4 leading-relaxed font-semibold">
          {getMessage()}
        </p>

        <p className="text-xs md:text-sm text-slate-400 mb-8 leading-relaxed">
          EduVoice Interactive espera por você no próximo desafio.
        </p>

        <Button
          onClick={onRestart}
          variant="primary"
          className="w-full md:w-auto"
        >
          Reiniciar
        </Button>
      </div>
    </>
  );
};
