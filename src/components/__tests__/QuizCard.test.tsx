import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizCard } from '../QuizCard';
import { Question } from '../../types';

declare const jest: any;
declare const describe: any;
declare const it: any;
declare const expect: any;

const mockQuestion: Question = {
  id: 1,
  text: "Test Question?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctIndex: 1,
  explanation: "Explanation text."
};

describe('QuizCard Component', () => {
  it('displays the question and options', () => {
    render(
      <QuizCard 
        question={mockQuestion} 
        selectedOption={null} 
        onSelect={jest.fn()} 
        disabled={false} 
      />
    );

    expect(screen.getByText("Test Question?")).toBeInTheDocument();
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it('calls onSelect with correct index when clicked', () => {
    const handleSelect = jest.fn();
    render(
      <QuizCard 
        question={mockQuestion} 
        selectedOption={null} 
        onSelect={handleSelect} 
        disabled={false} 
      />
    );

    fireEvent.click(screen.getByText("Option B"));
    expect(handleSelect).toHaveBeenCalledWith(1);
  });

  it('shows correct feedback styles when showing results', () => {
    render(
      <QuizCard 
        question={mockQuestion} 
        selectedOption={0} 
        onSelect={jest.fn()} 
        disabled={true} 
        showResult={true}
      />
    );

    const wrongOption = screen.getByText("Option A"); // Selected (0), but wrong (correct is 1)
    const correctOption = screen.getByText("Option B"); // Correct (1)

    expect(wrongOption.className).toContain('bg-red-500');
    expect(correctOption.className).toContain('bg-emerald-500');
  });

  it('dims irrelevant options during feedback', () => {
    render(
      <QuizCard 
        question={mockQuestion} 
        selectedOption={0} 
        onSelect={jest.fn()} 
        disabled={true} 
        showResult={true}
      />
    );

    const irrelevantOption = screen.getByText("Option C");
    expect(irrelevantOption.className).toContain('opacity-50');
  });
});