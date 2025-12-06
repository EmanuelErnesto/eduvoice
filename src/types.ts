export const GameStatus = {
  INTRO: "INTRO",
  PLAYING: "PLAYING",
  FEEDBACK: "FEEDBACK",
  FINISHED: "FINISHED",
} as const;

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];

export type SoundTrack = "voz-violao" | "violao-background" | "piano" | "upload";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  topic: string;
  difficulty: Difficulty;
  createdAt: number;
  questions: Question[];
}

export interface QuizState {
  status: GameStatus;
  currentQuestionIndex: number;
  score: number;
  selectedOption: number | null;
  isAudioPlaying: boolean;
}

export interface AudioConfig {
  musicVolume: number;
  voiceVolume: number;
  isMuted: boolean;
  activeTrack: SoundTrack;
  customFileBlobUrl?: string;
  customFileName?: string;
}
