-- Add fundraising_goal to site_metrics
ALTER TABLE public.site_metrics
ADD COLUMN IF NOT EXISTS fundraising_goal numeric DEFAULT 100000;

-- Add status column to fund_transactions
ALTER TABLE public.fund_transactions
ADD COLUMN IF NOT EXISTS status character varying DEFAULT 'success';

-- Add comment to clarify the column
COMMENT ON COLUMN public.fund_transactions.status IS 'Transaction status: success, failed, or refunded';