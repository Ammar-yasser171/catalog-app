import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
        'تنبيه: بيانات Supabase غير مضبوطة. تأكد من وجود ملف .env يحتوي على ' +
        'VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY (راجع .env.example).'
    );
}

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
