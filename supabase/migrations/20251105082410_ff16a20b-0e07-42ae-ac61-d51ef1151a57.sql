-- Create trigger function to update site_metrics when fund_transactions are inserted
CREATE OR REPLACE FUNCTION public.update_site_metrics_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total_funds by adding the new transaction amount
  UPDATE public.site_metrics
  SET 
    total_funds = total_funds + NEW.amount,
    last_updated = NOW()
  WHERE id = 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger that fires after insert on fund_transactions
CREATE TRIGGER update_metrics_after_transaction
AFTER INSERT ON public.fund_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_site_metrics_on_transaction();

-- Create trigger function to update site_metrics when pets are adopted
CREATE OR REPLACE FUNCTION public.update_site_metrics_on_adoption()
RETURNS TRIGGER AS $$
BEGIN
  -- When adoption request is approved, increment pets_adopted counter
  IF NEW.request_status = 'approved' AND (OLD.request_status IS NULL OR OLD.request_status != 'approved') THEN
    UPDATE public.site_metrics
    SET 
      total_pets_adopted = total_pets_adopted + 1,
      last_updated = NOW()
    WHERE id = 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for adoption approvals
CREATE TRIGGER update_metrics_after_adoption
AFTER UPDATE ON public.adoption_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_site_metrics_on_adoption();

-- Create trigger function to update site_metrics when donation requests are approved
CREATE OR REPLACE FUNCTION public.update_site_metrics_on_donation()
RETURNS TRIGGER AS $$
BEGIN
  -- When donation request is approved, increment pets_donated counter
  IF NEW.request_status = 'approved' AND (OLD.request_status IS NULL OR OLD.request_status != 'approved') THEN
    UPDATE public.site_metrics
    SET 
      total_pets_donated = total_pets_donated + 1,
      last_updated = NOW()
    WHERE id = 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for donation approvals
CREATE TRIGGER update_metrics_after_donation
AFTER UPDATE ON public.donation_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_site_metrics_on_donation();

-- Fix gallery table - make uploaded_by nullable and remove any problematic foreign keys
ALTER TABLE public.gallery 
ALTER COLUMN uploaded_by DROP NOT NULL;

-- Ensure RLS policies allow insertion
DROP POLICY IF EXISTS "Admins can manage gallery" ON public.gallery;

CREATE POLICY "Admins can insert gallery"
ON public.gallery FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery"
ON public.gallery FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery"
ON public.gallery FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));