export type Language = "en" | "ja";

export interface Player {
  id: string;
  player_number: string;
  name: string;
  age: number;
  language: Language;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  station_number: number;
  title_en: string;
  title_ja: string;
  description_en: string | null;
  description_ja: string | null;
  max_score: number;
  active: boolean;
  route: string;
  created_at: string;
}

export type ScoreSource =
  | "player-submission"
  | "operator-manual-entry"
  | "operator-edit";

export interface Score {
  id: string;
  player_id: string | null;
  player_number: string;
  game_id: string;
  score: number;
  max_score: number;
  source: ScoreSource;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardRow {
  player_id: string;
  player_number: string;
  name: string;
  age: number;
  total_score: number;
  games_completed: number;
  average_percentage: number;
  latest_completion: string | null;
}
