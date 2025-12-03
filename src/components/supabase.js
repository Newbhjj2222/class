// components/supabase.js
import { createClient } from "@supabase/supabase-js";

// 👉 Supabase project configuration (direct in code)
const SUPABASE_URL = "https://buxronmhidqrhoczzpfh.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1eHJvbm1oaWRxcmhvY3p6cGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzkzMDAsImV4cCI6MjA3OTg1NTMwMH0.SRInvRweUkyX3HtXdPSW2Qrx7OjF20neiHAd2zGdgLI";

// 👉 Prevent multiple Supabase clients in Next.js (same logic as getApps in Firebase)
let supabase;

if (!global._supabase) {
  global._supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

supabase = global._supabase;

export { supabase };
