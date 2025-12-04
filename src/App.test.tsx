import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import App from './App';
import { audioService } from './services/audioService';
import { ttsService } from './services/ttsService';

declare const jest: any;
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeEach: any;

jest.useFakeTimers();

describe('App Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders intro screen initially', () => {
    render(<App />);
    expect(screen.getByText('EduVoice')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Experiência')).toBeInTheDocument();
  });

  it('completes the full game flow', async () => {
    render(<App />);

    // Start Game
    await act(async () => {
      fireEvent.click(screen.getByText('Iniciar Experiência'));
    });

    expect(audioService.initialize).toHaveBeenCalled();
    expect(screen.getByText(/Questão 1 de/)).toBeInTheDocument();

    // Loop through 3 questions (based on constants.ts)
    const totalQuestions = 3;
    
    for (let i = 0; i < totalQuestions; i++) {
        const optionButtons = screen.getAllByRole('button');
        // Filter out audio controls, find quiz options (primary/secondary variants)
        const quizOption = optionButtons.find(b => b.className.includes('bg-slate-700') || b.className.includes('bg-indigo-600'));
        
        if (quizOption) {
            await act(async () => {
                fireEvent.click(quizOption);
            });

            // Fast forward feedback delay + transition delay
            await act(async () => {
                jest.advanceTimersByTime(5000);
            });
        }
    }

    // Check Final Screen
    await waitFor(() => {
      expect(screen.getByText('Quiz Finalizado!')).toBeInTheDocument();
      expect(screen.getByText('Reiniciar')).toBeInTheDocument();
    });
  });
});