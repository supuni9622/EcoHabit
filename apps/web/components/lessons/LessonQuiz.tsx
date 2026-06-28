'use client';

import { useState } from 'react';

export interface QuizQuestion {
  type: 'multiple-choice' | 'true-false';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Props {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function LessonQuiz({ questions, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = questions[current];
  if (!question) return null;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    const nextIdx = current + 1;
    if (nextIdx >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(nextIdx);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (finished) {
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    const emoji = percentage === 100 ? '🌟' : percentage >= 60 ? '✅' : '💪';

    return (
      <div className="text-center">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="font-bold text-gray-800 text-xl mb-2">Quiz Complete!</h2>
        <div className="bg-green-50 rounded-2xl p-6 mb-6">
          <p className="text-4xl font-bold text-green-600 mb-1">
            {score}/{total}
          </p>
          <p className="text-gray-500 text-sm">correct answers</p>
          {percentage === 100 && (
            <p className="text-green-600 font-medium mt-2">Perfect score! Amazing! 🌿</p>
          )}
          {percentage >= 60 && percentage < 100 && (
            <p className="text-green-600 font-medium mt-2">Great job! Keep learning! 📚</p>
          )}
          {percentage < 60 && (
            <p className="text-yellow-600 font-medium mt-2">Review the lesson and try again! 💪</p>
          )}
        </div>
        <button
          onClick={() => onComplete(score)}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
        >
          Continue →
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-400 font-medium">
          Question {current + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-all ${
                i < current ? 'bg-green-400' : i === current ? 'bg-green-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-blue-500">
          {question.type === 'true-false' ? 'True or False' : 'Multiple Choice'}
        </p>
        <p className="text-gray-800 font-medium leading-relaxed">{question.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {question.options.map((option, idx) => {
          let optionClass =
            'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ';

          if (!answered) {
            optionClass +=
              'border-gray-200 bg-white hover:border-green-400 hover:bg-green-50 text-gray-700';
          } else if (idx === question.correctIndex) {
            optionClass += 'border-green-500 bg-green-50 text-green-800';
          } else if (idx === selected) {
            optionClass += 'border-red-400 bg-red-50 text-red-800';
          } else {
            optionClass += 'border-gray-100 bg-gray-50 text-gray-400';
          }

          const labelChar = String.fromCharCode(65 + idx);
          const marker = answered
            ? idx === question.correctIndex
              ? '✓'
              : idx === selected
              ? '✗'
              : labelChar
            : labelChar;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={optionClass}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold border-current">
                  {marker}
                </span>
                {option}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation (shown after answering) */}
      {answered && (
        <div
          className={`rounded-xl p-4 mb-4 ${
            selected === question.correctIndex
              ? 'bg-green-50 border border-green-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-gray-400">
            Explanation
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* Next / See Results button */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
        >
          {current + 1 >= questions.length ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}
