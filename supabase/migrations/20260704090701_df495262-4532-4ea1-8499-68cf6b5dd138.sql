
-- players
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.players TO anon, authenticated;
GRANT ALL ON public.players TO service_role;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read players" ON public.players FOR SELECT USING (true);
CREATE POLICY "public insert players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "public update players" ON public.players FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public delete players" ON public.players FOR DELETE USING (true);

-- games
CREATE TABLE public.games (
  id TEXT PRIMARY KEY,
  station_number INTEGER NOT NULL,
  title_en TEXT NOT NULL,
  title_ja TEXT NOT NULL,
  description_en TEXT,
  description_ja TEXT,
  max_score INTEGER NOT NULL DEFAULT 100,
  active BOOLEAN NOT NULL DEFAULT true,
  route TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.games TO anon, authenticated;
GRANT ALL ON public.games TO service_role;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read games" ON public.games FOR SELECT USING (true);
CREATE POLICY "public write games" ON public.games FOR ALL USING (true) WITH CHECK (true);

-- scores
CREATE TABLE public.scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  player_number TEXT NOT NULL,
  game_id TEXT REFERENCES public.games(id),
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 100,
  source TEXT NOT NULL DEFAULT 'player-submission',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scores TO anon, authenticated;
GRANT ALL ON public.scores TO service_role;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read scores" ON public.scores FOR SELECT USING (true);
CREATE POLICY "public insert scores" ON public.scores FOR INSERT WITH CHECK (true);
CREATE POLICY "public update scores" ON public.scores FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public delete scores" ON public.scores FOR DELETE USING (true);

-- app_settings
CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO anon, authenticated;
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "public write settings" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER trg_players_updated BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_scores_updated BEFORE UPDATE ON public.scores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- player number generator (atomic via advisory lock)
CREATE OR REPLACE FUNCTION public.generate_player_number() RETURNS TEXT AS $$
DECLARE next_num INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(42);
  SELECT COALESCE(MAX(CAST(SUBSTRING(player_number FROM 4) AS INTEGER)), 0) + 1 INTO next_num FROM public.players;
  RETURN 'FD-' || LPAD(next_num::TEXT, 3, '0');
END; $$ LANGUAGE plpgsql SET search_path = public;

-- seed games
INSERT INTO public.games (id, station_number, title_en, title_ja, description_en, description_ja, max_score, active, route) VALUES
('password-challenge', 1, 'Password Challenge', 'パスワードチャレンジ', 'Pick the strongest password in each round.', '各ラウンドで最も強いパスワードを選びましょう。', 100, true, '/games/password-challenge'),
('security-quiz', 2, 'Security Quiz', 'セキュリティクイズ', 'Test your cyber safety knowledge.', 'サイバーセーフティの知識を試そう。', 100, true, '/games/security-quiz'),
('incident-clicker', 3, 'Incident Clicker', 'インシデントクリッカー', 'Tap incidents to resolve them fast!', 'インシデントをタップして素早く解決！', 100, true, '/games/incident-clicker'),
('station-4', 4, 'Station 4', 'ステーション4', 'Coming soon.', '近日公開。', 100, true, '/games/station-4'),
('station-5', 5, 'Station 5', 'ステーション5', 'Coming soon.', '近日公開。', 100, true, '/games/station-5');

-- seed settings
INSERT INTO public.app_settings (key, value) VALUES
('submissions_open', 'true'::jsonb),
('operator_pin', '"1234"'::jsonb),
('event_name', '"Family Day Game Stations"'::jsonb);

-- realtime
ALTER TABLE public.scores REPLICA IDENTITY FULL;
ALTER TABLE public.players REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
