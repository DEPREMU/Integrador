import { createClient } from "@supabase/supabase-js";
import Config from "react-native-config";


const supabase = createClient(Config.supabaseUrl, Config.supabaseKey);

export { supabase };
