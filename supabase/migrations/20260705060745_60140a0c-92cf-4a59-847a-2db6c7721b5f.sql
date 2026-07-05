CREATE OR REPLACE FUNCTION public.generate_player_number() RETURNS text
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE next_num INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(42);
  SELECT COALESCE(MAX(CAST(player_number AS INTEGER)), 0) + 1 INTO next_num
  FROM public.players WHERE player_number ~ '^[0-9]+$';
  RETURN next_num::TEXT;
END; $$;