-- Drop and recreate the trigger to ensure it works properly
DROP TRIGGER IF EXISTS update_metrics_on_new_transaction ON public.fund_transactions;

-- Recreate the trigger
CREATE TRIGGER update_metrics_on_new_transaction
  AFTER INSERT ON public.fund_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_site_metrics_on_transaction();