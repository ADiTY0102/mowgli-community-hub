-- Fix RLS policies for fund_transactions and pets tables

-- Allow authenticated users to insert fund transactions (for Razorpay donations)
CREATE POLICY "Users can insert their own fund transactions"
ON public.fund_transactions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow anyone to insert fund transactions (for anonymous Razorpay donations)
CREATE POLICY "Anyone can insert fund transactions"
ON public.fund_transactions
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to insert pets when donating
CREATE POLICY "Users can insert pets for donation"
ON public.pets
FOR INSERT
TO authenticated
WITH CHECK (
  donor_id IN (
    SELECT id FROM public.users_profile WHERE user_id = auth.uid()
  )
);