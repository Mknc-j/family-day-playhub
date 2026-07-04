import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchGames, fetchPlayers, fetchScores } from "@/lib/api";
import type { Game, Player, Score } from "@/lib/types";

export function useEventData() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const [p, g, s] = await Promise.all([fetchPlayers(), fetchGames(), fetchScores()]);
      setPlayers(p);
      setGames(g);
      setScores(s);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    const channel = supabase
      .channel("event-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "scores" }, () => reload())
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, () => reload())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [reload]);

  return { players, games, scores, loading, error, reload };
}
