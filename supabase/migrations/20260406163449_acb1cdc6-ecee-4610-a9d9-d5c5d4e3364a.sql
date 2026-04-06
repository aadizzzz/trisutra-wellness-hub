
-- 1. Add admin-only write policy on user_roles to prevent privilege escalation
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. Remove orders from realtime publication to prevent data leaks
ALTER PUBLICATION supabase_realtime DROP TABLE public.orders;

-- 3. Fix orders INSERT policy to require authentication
DROP POLICY "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);
