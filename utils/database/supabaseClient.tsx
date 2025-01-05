import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL;
const supabaseKey = Constants.expoConfig?.extra?.SUPABASE_KEY;

const supabase: SupabaseClient<any, "public", any> = createClient(
  String(supabaseUrl),
  String(supabaseKey)
);

export { supabase };
