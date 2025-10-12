import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';

export interface StoryCarouselProps {
  stories: Array<{
    id: string;
    title: string;
    content: string;
    image?: string;
  }>;
  className?: string;
}

export const StoryCarousel: React.FC<StoryCarouselProps> = ({
  stories,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };
  
  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };
  
  const currentStory = stories[currentIndex];
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        {currentStory.image && (
          <img
            src={currentStory.image}
            alt={currentStory.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <h3 className="text-xl font-semibold mb-2">{currentStory.title}</h3>
        <p className="text-muted-foreground">{currentStory.content}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStory}
          disabled={stories.length <= 1}
        >
          Previous
        </Button>
        
        <div className="flex gap-1">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === currentIndex ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          onClick={nextStory}
          disabled={stories.length <= 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
