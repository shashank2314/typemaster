export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface TestConfig {
  mode: 'time' | 'words';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in seconds
  wordLimit?: number;
  includePunctuation: boolean;
  includeNumbers: boolean;
}

export interface TestResult {
  id: string;
  userId: string;
  config: TestConfig;
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  text: string;
}

export interface TypingStats {
  currentWpm: number;
  currentAccuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}