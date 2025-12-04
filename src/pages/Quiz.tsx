import React, { useEffect, useState, useRef } from "react";
import { IntroScreen } from "@/components/IntroScreen";
import { GameScreen } from "@/components/GameScreen";
import { ResultScreen } from "@/components/ResultScreen";
import { Narrator, NarratorHandle } from "@/components/Narrator";
import { QuizProvider, useQuiz } from "@/contexts/QuizContext";
import { AudioProvider } from "@/contexts/AudioContext";
import { useGameLogic } from "@/hooks/useGameLogic";
import { GameStatus } from "@/types";
import { ttsService } from "@/services/ttsService";
import { getAssetPath } from "@/utils/assets";

export const Quiz: React.FC = () => {
  return (
    <QuizProvider>
      <AudioProvider>
        <QuizContent />
      </AudioProvider>
    </QuizProvider>
  );
};

const MultimediaBackground: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <img
        key="quiz-background"
        src={getAssetPath("assets/background.png")}
        alt="EduVoice Background"
        className="absolute top-0 left-0 w-full h-full object-cover animate-fade-in"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900/90"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
    </div>
  );
};

const GameSession: React.FC = () => {
  const { currentQuiz, exitQuiz } = useQuiz();
  const narratorRef = useRef<NarratorHandle>(null);

  if (!currentQuiz) return null;

  const { gameState, startGame, handleOptionSelect, navigateQuestion } =
    useGameLogic(currentQuiz.questions, narratorRef, exitQuiz);

  useEffect(() => {
    startGame();
    return () => {
      ttsService.cancel();
    };
  }, [startGame]);

  const viewStrategies = {
    [GameStatus.PLAYING]: () => (
      <GameScreen
        question={currentQuiz.questions[gameState.currentQuestionIndex]}
        currentQuestionIndex={gameState.currentQuestionIndex}
        totalQuestions={currentQuiz.questions.length}
        score={gameState.score}
        selectedOption={gameState.selectedOption}
        status={gameState.status}
        onOptionSelect={handleOptionSelect}
        onNavigate={navigateQuestion}
      />
    ),
    [GameStatus.FEEDBACK]: () => (
      <GameScreen
        question={currentQuiz.questions[gameState.currentQuestionIndex]}
        currentQuestionIndex={gameState.currentQuestionIndex}
        totalQuestions={currentQuiz.questions.length}
        score={gameState.score}
        selectedOption={gameState.selectedOption}
        status={gameState.status}
        onOptionSelect={handleOptionSelect}
        onNavigate={navigateQuestion}
      />
    ),
    [GameStatus.FINISHED]: () => (
      <ResultScreen
        score={gameState.score}
        totalQuestions={currentQuiz.questions.length}
        onRestart={exitQuiz}
      />
    ),
    [GameStatus.INTRO]: () => null,
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center pt-8 relative">
      <button
        onClick={exitQuiz}
        className="fixed top-24 sm:top-[5.5rem] left-3 sm:left-4 p-2 rounded-full bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200 z-50 group shadow-lg"
        aria-label="Sair do Quiz"
        title="Sair para o menu inicial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:scale-90 transition-transform"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="mb-4 text-indigo-300/80 text-xs font-bold tracking-[0.2em] uppercase border border-indigo-500/30 px-3 py-1 rounded-full bg-indigo-500/10">
        {currentQuiz.topic}
      </div>

      <Narrator ref={narratorRef} />

      {viewStrategies[gameState.status]?.()}
    </div>
  );
};

const QuizContent: React.FC = () => {
  const { currentQuiz } = useQuiz();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 pt-20 relative overflow-x-hidden">
      <MultimediaBackground />

      <main className="z-10 w-full flex flex-col items-center justify-center flex-1">
        {!currentQuiz ? <IntroScreen /> : <GameSession />}
      </main>

      <footer className="absolute bottom-4 text-slate-500 text-xs font-medium z-0 hidden md:block">
        EduVoice Interactive • Sistema Multimídia
      </footer>
    </div>
  );
};
