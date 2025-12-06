import React, { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import { Loader } from "./Loader";
import { useQuiz } from "../contexts/QuizContext";
import { Difficulty } from "../types";

export const IntroScreen: React.FC = () => {
  const {
    generateQuiz,
    setCurrentQuiz,
    deleteQuiz,
    isGenerating,
    generationError,
    history,
  } = useQuiz();
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleStartQuiz = async () => {
    await generateQuiz("Sistemas Multimídia", difficulty);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteQuiz(id);
  };

  const getDifficultyLabel = (diff: Difficulty) => {
    const labels = { easy: "Fácil", medium: "Médio", hard: "Difícil" };
    return labels[diff];
  };

  const getDifficultyColor = (diff: Difficulty) => {
    const colors = {
      easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
      hard: "text-red-400 bg-red-400/10 border-red-400/20",
    };
    return colors[diff] || "text-slate-400";
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center animate-fade-in-up px-3 sm:px-4 md:px-6 pb-20">
      <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 mb-6 sm:mb-8 md:mb-12 mt-4 md:mt-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white tracking-tight leading-tight px-2">
          EduVoice
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-xs sm:max-w-lg mx-auto leading-relaxed">
          Quiz interativo sobre Sistemas Multimídia com narração por voz.
        </p>
      </div>

      <div className="w-full max-w-lg space-y-4 sm:space-y-6 md:space-y-8 min-h-[400px]">
        {isGenerating ? (
          <div className="h-full flex items-center justify-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur">
            <Loader text="Preparando Quiz..." />
          </div>
        ) : (
          <>
            <div className="bg-slate-800/50 backdrop-blur p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-700 shadow-xl transition-all duration-300 hover:shadow-indigo-500/10">
              <h2 className="text-white font-bold text-lg md:text-xl mb-3 md:mb-4 text-center">
                Sistemas Multimídia
              </h2>
              <div className="flex flex-col space-y-3 md:space-y-4">
                <p className="text-slate-400 text-sm text-center">
                  Responda 5 perguntas aleatórias sobre multimídia
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`py-2 text-xs md:text-sm font-medium rounded-lg border transition-all duration-200 ${
                        difficulty === d
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                          : "bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {getDifficultyLabel(d)}
                    </button>
                  ))}
                </div>

                {generationError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 animate-fade-in">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-400 shrink-0 mt-0.5"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span className="text-xs text-red-300 font-medium leading-relaxed text-left">
                      {generationError}
                    </span>
                  </div>
                )}

                <Button
                  onClick={handleStartQuiz}
                  className="w-full flex justify-center items-center py-3 text-sm md:text-base"
                >
                  Iniciar Quiz
                </Button>
              </div>
            </div>

            {history.length > 0 && (
              <div className="space-y-3 md:space-y-4 animate-fade-in pb-8 md:pb-0">
                <h3 className="text-slate-400 font-semibold uppercase text-xs sm:text-sm tracking-wider pl-1">
                  Seus Quizzes
                </h3>
                <div className="grid gap-2 md:gap-3 max-h-56 md:max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((quiz) => (
                    <div
                      key={quiz.id}
                      onClick={() => setCurrentQuiz(quiz)}
                      className="group flex items-center justify-between p-3 md:p-4 bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-all duration-200"
                    >
                      <div className="overflow-hidden mr-2">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-white font-medium text-sm md:text-base group-hover:text-indigo-300 transition-colors truncate">
                            {quiz.topic}
                          </h4>
                          {quiz.difficulty && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded border ${getDifficultyColor(
                                quiz.difficulty
                              )} uppercase tracking-wide font-bold`}
                            >
                              {getDifficultyLabel(quiz.difficulty)[0]}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] md:text-xs text-slate-500">
                          {new Date(quiz.createdAt).toLocaleDateString()} •{" "}
                          {quiz.questions.length} q.
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, quiz.id)}
                        className="p-1.5 md:p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700/50 shrink-0"
                        title="Excluir"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
