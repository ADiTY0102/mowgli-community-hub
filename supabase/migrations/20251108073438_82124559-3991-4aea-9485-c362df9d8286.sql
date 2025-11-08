-- Add profile picture to users_profile
ALTER TABLE public.users_profile 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Create feedbacks table
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_text TEXT NOT NULL,
  user_name VARCHAR NOT NULL,
  user_designation VARCHAR,
  user_photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on feedbacks
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Anyone can view feedbacks
CREATE POLICY "Anyone can view feedbacks"
ON public.feedbacks
FOR SELECT
USING (true);

-- Authenticated users can create their own feedback
CREATE POLICY "Users can create feedback"
ON public.feedbacks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own feedback
CREATE POLICY "Users can update their own feedback"
ON public.feedbacks
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own feedback
CREATE POLICY "Users can delete their own feedback"
ON public.feedbacks
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can manage all feedbacks
CREATE POLICY "Admins can manage all feedbacks"
ON public.feedbacks
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));