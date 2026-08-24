import React from 'react';
import { 
  Mic, 
  Clock, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  Volume2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { VoiceCommandHistory, ShoppingListItem } from '../types';

interface HomeScreenProps {
  userName: string;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onRunQuickPrompt: (prompt: string) => void;
  recentCommands: VoiceCommandHistory[];
  lastSpokenFeedback?: string;
  activeTranscript?: string;
  onNavigateToTab: (tab: 'home' | 'list' | 'search' | 'smart' | 'profile') => void;
  shoppingList: ShoppingListItem[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName,
  isListening,
  onStartListening,
  onStopListening,
  onRunQuickPrompt,
  recentCommands,
  lastSpokenFeedback,
  activeTranscript,
  onNavigateToTab,
  shoppingList
}) => {
  const trySayingPrompts = [
    { label: 'Add apples', query: 'Add 1 kg Shimla apples to my list' },
    { label: 'My grocery list', query: 'Show my grocery list' },
    { label: 'Find almond milk', query: 'Find Epigamia almond milk under ₹250' },
    { label: 'Substituted items', query: 'Show recommended substitutes' },
    { label: 'दूध और मक्खन जोड़ो', query: 'Amul doodh aur butter add karo' }
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Greeting Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5">
          <span>Hi {userName || 'there'},</span>
        </h1>
        <p className="text-sm text-gray-500 font-normal">
          What can I help you add to your cart today?
        </p>
      </div>

      {/* Main Big Voice Activation Mic Area */}
      <div className="flex flex-col items-center justify-center py-6 bg-radial from-emerald-50/80 via-white to-white rounded-3xl border border-emerald-100/70 p-6 shadow-xs relative overflow-hidden">
        
        {/* Animated Rings when listening */}
        {isListening && (
          <>
            <motion.div
              className="absolute w-44 h-44 rounded-full bg-emerald-300/30 -z-0"
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0.1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-56 h-56 rounded-full bg-emerald-200/20 -z-0"
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0.05, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
          </>
        )}

        {/* The Big Mic Button */}
        <button
          onClick={isListening ? onStopListening : onStartListening}
          id="main-voice-mic-button"
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 ring-8 ring-red-100 text-white animate-pulse'
              : 'bg-emerald-700 hover:bg-emerald-800 active:scale-95 ring-8 ring-emerald-100/80 text-white shadow-emerald-200'
          }`}
          title={isListening ? 'Tap to stop listening' : 'Tap to speak voice command'}
        >
          <Mic className={`w-10 h-10 ${isListening ? 'animate-bounce' : ''}`} />
        </button>

        {/* Status Text & Visualizer */}
        <div className="mt-4 text-center z-10 space-y-1">
          <div className="text-xs font-bold tracking-wider uppercase text-emerald-950">
            {isListening ? 'Listening & Processing...' : 'Tap to Speak'}
          </div>
          
          <AudioVisualizer isListening={isListening} color={isListening ? 'bg-emerald-600' : 'bg-gray-300'} barCount={16} />
        </div>

        {/* Live Audio Transcript Display */}
        <AnimatePresence>
          {(activeTranscript || isListening) && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-2 px-3 py-1.5 bg-emerald-100/70 border border-emerald-200 rounded-full text-xs text-emerald-900 font-medium max-w-xs truncate text-center"
            >
              {activeTranscript ? `"${activeTranscript}"` : 'Listening for grocery items...'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spoken Feedback Confirmation Banner */}
      {lastSpokenFeedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5 shadow-xs"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Volume2 className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
              Voice Assistant
            </div>
            <p className="text-xs text-emerald-950 font-medium mt-0.5">
              "{lastSpokenFeedback}"
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick Summary Pill if items exist */}
      {shoppingList.length > 0 && (
        <div 
          onClick={() => onNavigateToTab('list')}
          className="cursor-pointer bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white font-bold text-sm">
              {shoppingList.length}
            </div>
            <div>
              <div className="text-xs font-semibold">Shopping List Active</div>
              <div className="text-[11px] text-emerald-100">
                Total ₹{shoppingList.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0)} • Tap to review
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-200" />
        </div>
      )}

      {/* TRY SAYING... Quick Prompt Chips */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Try Saying...
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            Tap to test NLP
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {trySayingPrompts.map((item, idx) => (
            <button
              key={idx}
              id={`quick-prompt-${idx}`}
              onClick={() => onRunQuickPrompt(item.query)}
              className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 text-gray-800 text-xs font-medium border border-gray-200 hover:border-emerald-300 transition-all flex items-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-95"
            >
              <Mic className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RECENT COMMANDS */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Recent Commands
          </span>
          <span className="text-[11px] text-gray-400">
            History
          </span>
        </div>

        <div className="space-y-2">
          {recentCommands.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center text-xs text-gray-500">
              No recent voice commands yet. Tap the mic above to try!
            </div>
          ) : (
            recentCommands.map(cmd => (
              <div
                key={cmd.id}
                className="p-3 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-3 hover:border-emerald-200 transition-all group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-100 transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      "{cmd.commandText}"
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {cmd.timeAgo}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">{cmd.actionTaken}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRunQuickPrompt(cmd.commandText)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors shrink-0"
                  title="Re-run this voice command"
                >
                  Run
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
