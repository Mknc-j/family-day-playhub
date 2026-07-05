DELETE FROM public.scores WHERE game_id IN ('station-4','station-5');
DELETE FROM public.games WHERE id IN ('station-4','station-5');
INSERT INTO public.games (id, station_number, title_en, title_ja, description_en, description_ja, max_score, active, route) VALUES
('primary-quiz', 4, 'Cyber Safety Heroes', 'サイバーセーフティ・ヒーロー', 'Primary school cyber safety quiz for ages 6-10.', '6〜10歳向けの小学生サイバーセーフティクイズ。', 10, true, '/games/primary-quiz'),
('junior-quiz', 5, 'Internet Defense Challenge', 'インターネット防衛チャレンジ', 'Junior high scenario quiz for ages 11-14.', '11〜14歳向けの中学生シナリオクイズ。', 10, true, '/games/junior-quiz'),
('highschool-quiz', 6, 'Cyber Risk Analyst', 'サイバーリスクアナリスト', 'High school security judgment quiz for ages 15-18.', '15〜18歳向けの高校生セキュリティ判断クイズ。', 10, true, '/games/highschool-quiz')
ON CONFLICT (id) DO UPDATE SET
  station_number = EXCLUDED.station_number,
  title_en = EXCLUDED.title_en, title_ja = EXCLUDED.title_ja,
  description_en = EXCLUDED.description_en, description_ja = EXCLUDED.description_ja,
  max_score = EXCLUDED.max_score, active = EXCLUDED.active, route = EXCLUDED.route;