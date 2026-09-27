-- شغّل هذا الكود مرة واحدة في Supabase Dashboard > SQL Editor
-- عشان تنشئ جدول المنتجات (لو لسه معملوش)

create table if not exists products (
  id bigserial primary key, -- رقم متزايد تلقائي
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  category text,
  unit_type text check (unit_type in ('count', 'weight')) default 'count',
  price numeric not null,
  images text[] default '{}', -- مصفوفة روابط الصور
  description text
);

-- تنبيه أمان مهم:
-- الجدول ده افتراضيًا الـ Row Level Security (RLS) عليه مقفول، يعني أي حد
-- معاه مفتاح anon (وهو المفتاح العام في الكود) يقدر يقرأ/يضيف/يعدل/يحذف بحرية.
-- ده مناسب لو التطبيق داخلي/تجريبي بس. لو هيبقى عام على الإنترنت وعايز تحميه،
-- فعّل RLS وحط Policies تحدد مين يقدر يعمل إيه، مثلاً:
--
-- alter table products enable row level security;
--
-- create policy "قراءة عامة للجميع" on products
--   for select using (true);
--
-- create policy "الإضافة والتعديل والحذف لأصحاب حساب مسجل فقط" on products
--   for all using (auth.role() = 'authenticated');
