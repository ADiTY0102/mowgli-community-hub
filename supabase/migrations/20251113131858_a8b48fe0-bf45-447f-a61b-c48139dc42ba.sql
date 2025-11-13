-- Drop duplicate triggers on fund_transactions
DROP TRIGGER IF EXISTS update_metrics_after_transaction ON public.fund_transactions;
DROP TRIGGER IF EXISTS update_metrics_on_new_transaction ON public.fund_transactions;

-- Recreate a single trigger with proper naming
CREATE TRIGGER update_metrics_on_fund_transaction
  AFTER INSERT ON public.fund_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_site_metrics_on_transaction();

-- Recalculate total_funds from actual transaction data
UPDATE public.site_metrics
SET total_funds = (
  SELECT COALESCE(SUM(amount), 0)
  FROM public.fund_transactions
  WHERE status = 'success'
),
last_updated = NOW()
WHERE id = 1;