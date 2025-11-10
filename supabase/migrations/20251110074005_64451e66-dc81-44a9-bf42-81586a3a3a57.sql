-- Create storage policies for profile picture uploads in gallery_images bucket

-- Policy to allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload their own profile pictures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gallery_images' AND
  (storage.foldername(name))[1] = 'profiles' AND
  auth.uid() IS NOT NULL
);

-- Policy to allow users to update their own profile pictures
CREATE POLICY "Users can update their own profile pictures"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'gallery_images' AND
  (storage.foldername(name))[1] = 'profiles' AND
  auth.uid() IS NOT NULL
);

-- Policy to allow users to delete their own profile pictures
CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'gallery_images' AND
  (storage.foldername(name))[1] = 'profiles' AND
  auth.uid() IS NOT NULL
);

-- Policy to allow public viewing of all images in gallery_images bucket
CREATE POLICY "Anyone can view gallery images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery_images');