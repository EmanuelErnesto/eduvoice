import { renderHook, act } from '@testing-library/react';
import { useGameLogic } from '../useGameLogic';
import { audioService } from '../../services/audioService';
import { ttsService } from '../../services/ttsService';
import { GameStatus, Question } from '../../types';

declare const jest: any;
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeEach: any;

jest.useFakeTimers();

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Question 1",
    options: ["Option A", "Option B"],
    correctIndex: 1,
    explanation: "Explanation 1"
  },
  {
    id: 2,
    text: "Question 2",
    options: ["Option C", "Option D"],
    correctIndex: 0,
    explanation: "Explanation 2"
  }
];

const mockNarratorRef = {
  current: {
    setSpeaking: jest.fn()
  }
};

describe('useGameLogic Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with INTRO status', () => {
    const { result } = renderHook(() => useGameLogic(mockQuestions, mockNarratorRef as any));
    expect(result.current.gameState.status).toBe(GameStatus.INTRO);
  });

  it('startGame initializes services and moves to PLAYING', async () => {
    const { result } = renderHook(() => useGameLogic(mockQuestions, mockNarratorRef as any));

    await act(async () => {
      await result.current.startGame();
    });

    // Advance timers for setTimeout in startGame
    await act(async () => {
        jest.advanceTimersByTime(20);
    });

    expect(audioService.initialize).toHaveBeenCalled();
    expect(ttsService.init).toHaveBeenCalled();
    expect(audioService.startAmbientMusic).toHaveBeenCalled();
    expect(result.current.gameState.status).toBe(GameStatus.PLAYING);
  });

  it('handleOptionSelect processes correct answer and updates score', async () => {
    const { result } = renderHook(() => useGameLogic(mockQuestions, mockNarratorRef as any));

    await act(async () => {
      await result.current.startGame();
    });

    // Advance timers for startGame
    await act(async () => {
        jest.advanceTimersByTime(20);
    });

    // Mock correct answer for question 1 (index 1 is correct in mockQuestions[0])
    await act(async () => {
      await result.current.handleOptionSelect(1); 
    });

    // Immediate state updates
    expect(result.current.gameState.selectedOption).toBe(1);
    expect(result.current.gameState.status).toBe(GameStatus.FEEDBACK);
    expect(result.current.gameState.score).toBe(1);

    // Audio effects happen in setTimeout
    await act(async () => {
        jest.advanceTimersByTime(20);
    });

    expect(ttsService.cancel).toHaveBeenCalled();
    expect(audioService.playSFX).toHaveBeenCalledWith('correct');
  });

  it('advances to next question automatically after feedback', async () => {
    const { result } = renderHook(() => useGameLogic(mockQuestions, mockNarratorRef as any));

    await act(async () => {
      await result.current.startGame();
    });

    // Advance timers for startGame
    await act(async () => {
        jest.advanceTimersByTime(20);
    });

    await act(async () => {
      await result.current.handleOptionSelect(1);
    });

    // Advance past feedback delay
    await act(async () => {
      jest.advanceTimersByTime(5000); 
    });

    expect(result.current.gameState.status).toBe(GameStatus.PLAYING);
    expect(result.current.gameState.currentQuestionIndex).toBe(1);
    expect(result.current.gameState.selectedOption).toBeNull();
  });
});