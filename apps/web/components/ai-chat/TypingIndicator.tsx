import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start gap-2">
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-base flex-shrink-0">
        🤖
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
        <div className="flex items-center gap-1.5">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
