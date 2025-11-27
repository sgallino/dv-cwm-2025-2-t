// Este servicio ofrece la instancia de Supabase.
// En este contexto, un servicio es una biblioteca que ofrece funciones o clases
// para trabajar con alguna funcionalidad.
import { createClient } from '@supabase/supabase-js';

// Eventualmente, estos datos podrían salir de un [.env].
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);