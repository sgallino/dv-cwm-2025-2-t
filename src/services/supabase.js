// Este servicio ofrece la instancia de Supabase.
// En este contexto, un servicio es una biblioteca que ofrece funciones o clases
// para trabajar con alguna funcionalidad.
import { createClient } from '@supabase/supabase-js';

// Eventualmente, estos datos podrían salir de un [.env].
const SUPABASE_URL = 'https://rmkesfzagwrdbpkhtsjg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I9c40loLKHN8TriEC64U0Q_rVFw6r5A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);