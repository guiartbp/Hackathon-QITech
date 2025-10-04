import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? (() => { throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined') })();
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? (() => { throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined') })();

// Cria uma única instância do cliente Supabase para ser reutilizada
export const supabase = createClient(supabaseUrl, supabaseKey)