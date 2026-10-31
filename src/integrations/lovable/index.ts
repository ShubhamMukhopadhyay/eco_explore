// Stub for local development.
// The @lovable.dev/cloud-auth-js package is only available on the Lovable platform.
// Google OAuth still works via Supabase's built-in provider.

import { supabase } from "../supabase/client";

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const lovable = {
  auth: {
    signInWithOAuth: async (provider: "google" | "apple" | "microsoft" | "lovable", opts?: SignInOptions) => {
      // Fall back to Supabase's built-in OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider === "lovable" ? "google" : provider,
        options: {
          redirectTo: opts?.redirect_uri,
        },
      });
      if (error) return { error };
      // Supabase handles the redirect itself
      return { redirected: true };
    },
  },
};
