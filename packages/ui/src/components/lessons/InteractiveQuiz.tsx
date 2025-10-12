import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface InteractiveQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
  className?: string;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  questions,
  onComplete,
  className,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };
  
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      const score = questions.reduce((acc, question, index) => {
        return acc + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
      }, 0);
      onComplete(score, questions.length);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  
  if (showResults) {
    const score = questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    
    return (
      <div className={cn('text-center space-y-4', className)}>
        <h3 className="text-2xl font-bold">Quiz Complete!</h3>
        <div className="text-4xl font-bold text-primary">
          {score}/{questions.length}
        </div>
        <p className="text-muted-foreground">
          You scored {Math.round((score / questions.length) * 100)}%
        </p>
      </div>
    );
  }
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <div className="w-32 bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold">{question.question}</h3>
      
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={cn(
              'w-full p-3 text-left rounded-lg border transition-colors',
              selectedAnswer === index
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            )}
          >
            {option}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Button
          onClick={nextQuestion}
          disabled={selectedAnswer === undefined}
        >
          {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};
