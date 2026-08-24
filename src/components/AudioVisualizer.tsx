import React from 'react';
import { motion } from 'motion/react';

interface AudioVisualizerProps {
  isListening: boolean;
  color?: string;
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isListening,
  color = 'bg-emerald-600',
  barCount = 18
}) => {
  return (
    <div className="flex items-center justify-center gap-1 h-12 px-4 py-2">
      {Array.from({ length: barCount }).map((_, index) => {
        // Pseudo-random height animation when listening
        const randomMultiplier = ((index % 5) + 1) * 0.2;
        return (
          <motion.div
            key={index}
            className={`w-1 rounded-full ${color}`}
            animate={{
              height: isListening 
                ? [6, 28 * randomMultiplier + 8, 12, 36 * randomMultiplier + 6, 8] 
                : 6,
              opacity: isListening ? [0.6, 1, 0.7, 1, 0.6] : 0.3
            }}
            transition={{
              duration: 0.8 + (index % 3) * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (index * 0.05) % 0.4
            }}
          />
        );
      })}
    </div>
  );
};
