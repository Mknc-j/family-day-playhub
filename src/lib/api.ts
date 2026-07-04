import { supabase } from "@/integrations/supabase/client";
import type { Game, LeaderboardRow, Player, Score } from "./types";

export async function fetchGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("station_number");
  if (error) throw error;
  return (data ?? []) as Game[];
}

export async function fetchPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("player_number");
  if (error) throw error;
  return (data ?? []) as Player[];
}

export async function fetchScores(): Promise<Score[]> {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Score[];
}

export async function getSetting<T>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return (data?.value ?? null) as T | null;
}

export async function setSetting(key: string, value: unknown) {
  const { error } = await supabase
    .from("app_settings")
    .update({ value: value as never, updated_at: new Date().toISOString() })
    .eq("key", key);
  if (error) throw error;
}

export async function findPlayerByNumber(playerNumber: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("player_number", playerNumber.trim().toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as Player | null;
}

export async function submitScore(params: {
  playerNumber: string;
  gameId: string;
  score: number;
  maxScore: number;
  source?: string;
}): Promise<Player> {
  const submissionsOpen = await getSetting<boolean>("submissions_open");
  if (submissionsOpen === false) {
    throw new Error("SUBMISSIONS_CLOSED");
  }
  const player = await findPlayerByNumber(params.playerNumber);
  if (!player) throw new Error("PLAYER_NOT_FOUND");
  if (params.score < 0 || params.score > params.maxScore) {
    throw new Error("INVALID_SCORE");
  }
  const { error } = await supabase.from("scores").insert({
    player_id: player.id,
    player_number: player.player_number,
    game_id: params.gameId,
    score: Math.round(params.score),
    max_score: params.maxScore,
    source: params.source ?? "player-submission",
  });
  if (error) throw error;
  return player;
}

export async function registerPlayer(params: {
  name: string;
  age: number;
  language: string;
}): Promise<Player> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: numData, error: numErr } = await supabase.rpc("generate_player_number");
    if (numErr) throw numErr;
    const playerNumber = numData as unknown as string;
    const { data, error } = await supabase
      .from("players")
      .insert({
        player_number: playerNumber,
        name: params.name.trim(),
        age: params.age,
        language: params.language,
      })
      .select()
      .single();
    if (!error && data) return data as Player;
    if (error && !error.message.includes("duplicate")) throw error;
  }
  throw new Error("REGISTRATION_FAILED");
}

// ---- derived leaderboard / stations ----

export function computeLeaderboard(
  players: Player[],
  games: Game[],
  scores: Score[],
): LeaderboardRow[] {
  const activeGames = games.filter((g) => g.active);
  const activeIds = new Set(activeGames.map((g) => g.id));

  const rows = players.map((p) => {
    const playerScores = scores.filter(
      (s) => s.player_id === p.id && activeIds.has(s.game_id),
    );
    const bestByGame = new Map<string, Score>();
    for (const s of playerScores) {
      const cur = bestByGame.get(s.game_id);
      if (!cur || s.score > cur.score) bestByGame.set(s.game_id, s);
    }
    let total = 0;
    let maxTotal = 0;
    let latest: string | null = null;
    for (const [, s] of bestByGame) {
      total += s.score;
      maxTotal += s.max_score;
      if (!latest || s.created_at > latest) latest = s.created_at;
    }
    const gamesCompleted = bestByGame.size;
    const avg = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
    return {
      player_id: p.id,
      player_number: p.player_number,
      name: p.name,
      age: p.age,
      total_score: total,
      games_completed: gamesCompleted,
      average_percentage: avg,
      latest_completion: latest,
    } as LeaderboardRow;
  });

  rows.sort((a, b) => {
    if (b.total_score !== a.total_score) return b.total_score - a.total_score;
    if (b.games_completed !== a.games_completed)
      return b.games_completed - a.games_completed;
    const at = a.latest_completion ?? "9999";
    const bt = b.latest_completion ?? "9999";
    return at.localeCompare(bt);
  });

  return rows;
}

export interface StationRow {
  player_id: string;
  player_number: string;
  name: string;
  completed: Record<string, boolean>;
  completedCount: number;
  totalActive: number;
}

export function computeStations(
  players: Player[],
  games: Game[],
  scores: Score[],
): StationRow[] {
  const activeGames = games.filter((g) => g.active);
  return players
    .map((p) => {
      const completed: Record<string, boolean> = {};
      let count = 0;
      for (const g of activeGames) {
        const done = scores.some(
          (s) => s.player_id === p.id && s.game_id === g.id,
        );
        completed[g.id] = done;
        if (done) count++;
      }
      return {
        player_id: p.id,
        player_number: p.player_number,
        name: p.name,
        completed,
        completedCount: count,
        totalActive: activeGames.length,
      };
    })
    .sort((a, b) => a.player_number.localeCompare(b.player_number));
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = rows.map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
