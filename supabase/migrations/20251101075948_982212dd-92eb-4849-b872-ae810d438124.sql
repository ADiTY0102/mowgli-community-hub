-- Fix security issue: Add search_path to update_timestamp function
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;