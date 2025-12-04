import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GameStatus, QuizState, Question } from '../types';
import { audioService } from '../services/audioService';
import { ttsService } from '../services/ttsService';
import { NarratorHandle } from '../components/Narrator';

const INITIAL_STATE: QuizState = {
  status: GameStatus.INTRO,
  currentQuestionIndex: 0,
  score: 0,
  selectedOption: null,
  isAudioPlaying: false, 
};

export const useGameLogic = (
  questions: Question[], 
  narratorRef: React.RefObject<NarratorHandle>,
  onGameFinish?: () => void
) => {
  const [gameState, setGameState] = useState<QuizState>(INITIAL_STATE);
  const isMounted = useRef(true);
  
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const safeSetState = useCallback((updater: (prev: QuizState) => QuizState) => {
    if (isMounted.current) setGameState(updater);
  }, []);

  const setNarratorState = useCallback((speaking: boolean) => {
    if (narratorRef.current) {
        narratorRef.current.setSpeaking(speaking);
    }
  }, [narratorRef]);

  const playNarration = useCallback(async (text: string) => {
    setNarratorState(true);
    
    try {
      await ttsService.speak(text);
    } catch (error) {
      console.error(error);
    } finally {
      setNarratorState(false);
    }
  }, [setNarratorState]);

  useEffect(() => {
    const handleTTSEnded = () => {
      setNarratorState(false);
    };
    ttsService.on('TTS_ENDED', handleTTSEnded);
    return () => ttsService.off('TTS_ENDED', handleTTSEnded);
  }, [setNarratorState]);

  const startGame = useCallback(async () => {
    if (questions.length === 0) return;

    safeSetState(prev => ({ 
      ...INITIAL_STATE, 
      status: GameStatus.PLAYING
    }));

    audioService.initialize().then(() => {
        audioService.startAmbientMusic();
    }).catch(() => {});
    
    ttsService.resume(); 
    playNarration(questions[0].text);

  }, [safeSetState, playNarration, questions]);

  const navigateQuestion = useCallback((direction: 'next' | 'prev') => {
    const nextIndex = gameState.currentQuestionIndex + (direction === 'next' ? 1 : -1);
    
    if (nextIndex < 0) return;

    const navStrategies = {
      finish: () => {
        safeSetState(prev => ({ ...prev, status: GameStatus.FINISHED }));
        playNarration(`Quiz finalizado. Você acertou ${gameState.score} de ${questions.length} questões.`);
      },
      playing: () => {
        safeSetState(prev => ({
          ...prev,
          status: GameStatus.PLAYING,
          currentQuestionIndex: nextIndex,
          selectedOption: null
        }));

        ttsService.cancel(); 
        audioService.playSFX('click');
        playNarration(questions[nextIndex].text);
      }
    };

    const actionKey = nextIndex >= questions.length ? 'finish' : 'playing';
    navStrategies[actionKey]();

  }, [gameState.currentQuestionIndex, gameState.score, questions, playNarration, safeSetState]);

  const handleOptionSelect = useCallback((index: number) => {
    if (gameState.selectedOption !== null) return;

    const currentQ = questions[gameState.currentQuestionIndex];
    const isCorrect = index === currentQ.correctIndex;
    const newScore = isCorrect ? gameState.score + 1 : gameState.score;

    setNarratorState(true);

    safeSetState(prev => ({
      ...prev,
      selectedOption: index,
      status: GameStatus.FEEDBACK,
      score: newScore
    }));

    const feedbackStrategies = {
      correct: () => ({
        text: `Resposta correta! ${currentQ.explanation}`,
        sfx: 'correct' as const
      }),
      wrong: () => ({
        text: `Resposta incorreta! ${currentQ.explanation}`,
        sfx: 'wrong' as const
      })
    };

    const result = isCorrect ? feedbackStrategies.correct() : feedbackStrategies.wrong();
    
    ttsService.cancel(); 
    audioService.playSFX(result.sfx);
    
    ttsService.speak(result.text).finally(() => {
        setNarratorState(false);
    });

  }, [gameState.selectedOption, gameState.currentQuestionIndex, gameState.score, questions, safeSetState, setNarratorState]);

  const restartGame = useCallback(() => {
    const restartStrategies = {
      exit: () => onGameFinish && onGameFinish(),
      restart: () => startGame()
    };
    
    const key = onGameFinish ? 'exit' : 'restart';
    restartStrategies[key]();
  }, [onGameFinish, startGame]);

  return {
    gameState,
    startGame,
    handleOptionSelect,
    navigateQuestion,
    restartGame
  };
};