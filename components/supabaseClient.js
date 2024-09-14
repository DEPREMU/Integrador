import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabaseUrl = "https://hxhofjcblsextrtjbxtw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4aG9mamNibHNleHRydGpieHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxODQxNjQsImV4cCI6MjA0MTc2MDE2NH0.meKflLsd7eWJzBmhLpmUNlozif2Mt527Tqm4TBqBFq0";

const api = axios.create({
  baseURL: `${supabaseUrl}/rest/v1/`,
  headers: {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
  },
});

const supabase = createClient(supabaseUrl, supabaseKey);

export { api, supabase };
