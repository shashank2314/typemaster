
import React, { useState, useEffect, useRef } from 'react';
import { TestConfig, TypingStats } from '../../types';
import { generateText } from '../../utils/textGenerator';
import { RotateCcw, Pause, Play } from 'lucide-react';

interface TypingInterfaceProps {
  config: TestConfig;
  onTestComplete: (stats: TypingStats, timeSpent: number, text: string) => void;
  onRestart: () => void;
}

export function TypingInterface({ config, onTestComplete, onRestart }: TypingInterfaceProps) {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const userInputRef = useRef(''); // 🔄 Track latest user input

  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const startTimeRef = useRef<Date | null>(null); // 🔄 Track start time
  const [timeLeft, setTimeLeft] = useState(config.timeLimit || 0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const wordCount = config.mode === 'words' ? config.wordLimit! : 100;
    const generatedText = generateText(wordCount, config.difficulty, config.includePunctuation, config.includeNumbers);
    setText(generatedText);
    setTimeLeft(config.timeLimit || 0);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [config]);

  useEffect(() => {
    if (startTime && !isPaused && !isCompleted && config.mode === 'time') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTime, isPaused, isCompleted, config.mode]);

  const handleInputChange = (value: string) => {
    if (!startTime) {
      const now = new Date();
      setStartTime(now);
      startTimeRef.current = now;
    }

    setUserInput(value);
    userInputRef.current = value;
    setCurrentIndex(value.length);

    const words = value.trim().split(/\s+/).filter(word => word.length > 0);
    setWordsTyped(words.length);

    if (config.mode === 'words' && words.length >= config.wordLimit!) {
      handleTestComplete();
    }
  };

  const handleTestComplete = () => {
    if (isCompleted) return;

    setIsCompleted(true);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const input = userInputRef.current;
    const endTime = new Date();
    const rawTime = startTimeRef.current ? (endTime.getTime() - startTimeRef.current.getTime()) / 1000 : 0;
    const timeSpentSeconds = config.mode === 'time' ? config.timeLimit! : rawTime;

    const correctChars = calculateCorrectChars(input);
    const totalChars = input.length;
    const incorrectChars = totalChars - correctChars;
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
    const wordsCount = input.trim().split(/\s+/).filter(word => word.length > 0).length;
    const wpm = timeSpentSeconds > 0 ? (wordsCount / timeSpentSeconds) * 60 : 0;

    const stats: TypingStats = {
      currentWpm: Math.round(wpm),
      currentAccuracy: Math.round(accuracy),
      correctChars,
      incorrectChars,
      totalChars
    };

    onTestComplete(stats, timeSpentSeconds, text);
  };

  const calculateCorrectChars = (input: string): number => {
    let correct = 0;
    const minLength = Math.min(input.length, text.length);
    for (let i = 0; i < minLength; i++) {
      if (input[i] === text[i]) correct++;
    }
    return correct;
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getCharacterClass = (index: number): string => {
    if (index >= userInput.length) {
      return index === currentIndex ? 'bg-blue-500 text-white animate-pulse' : 'text-gray-600';
    }
    return userInput[index] === text[index]
      ? 'text-green-600 bg-green-50'
      : 'text-red-600 bg-red-50';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStats = {
    wpm:
      startTimeRef.current && !isCompleted
        ? Math.round((wordsTyped / ((Date.now() - startTimeRef.current.getTime()) / 1000)) * 60) || 0
        : 0,
    accuracy: userInput.length > 0 ? Math.round((calculateCorrectChars(userInput) / userInput.length) * 100) : 100
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Stats Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{currentStats.wpm}</div>
            <div className="text-sm text-gray-600">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{currentStats.accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          {config.mode === 'time' && (
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{formatTime(timeLeft)}</div>
              <div className="text-sm text-gray-600">Time Left</div>
            </div>
          )}
          {config.mode === 'words' && (
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {wordsTyped}/{config.wordLimit}
              </div>
              <div className="text-sm text-gray-600">Words</div>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={togglePause}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={isCompleted}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          <button
            onClick={onRestart}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Text Display */}
      <div className="relative">
        <div className="text-lg leading-relaxed p-4 bg-gray-50 rounded-lg border-2 border-gray-200 font-mono min-h-[200px] whitespace-pre-wrap">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className={`${getCharacterClass(index)} ${index === currentIndex ? 'relative' : ''}`}
            >
              {char}
              {index === currentIndex && (
                <span className="absolute top-0 left-0 w-0.5 h-full bg-blue-500 animate-pulse" />
              )}
            </span>
          ))}
        </div>

        {/* Hidden Input */}
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={isPaused || isCompleted}
          className="absolute inset-0 w-full h-full opacity-0 resize-none"
          placeholder="Start typing..."
        />
      </div>

      {/* Instructions */}
      <div className="text-center text-gray-600">
        {isCompleted ? (
          <p className="text-lg font-medium text-green-600">Test completed! 🎉</p>
        ) : isPaused ? (
          <p>Test paused. Click play to continue.</p>
        ) : !startTime ? (
          <p>Click in the text area and start typing to begin the test.</p>
        ) : (
          <p>Keep typing! Focus on accuracy over speed.</p>
        )}
      </div>
    </div>
  );
}
