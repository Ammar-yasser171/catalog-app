# كتالوج وإدارة المنتجات الذكي

تطبيق ويب لإدارة كتالوج منتجات، متصل بقاعدة بيانات Supabase، ومبني بـ Vite + JavaScript عادي (بدون فريمورك).

## هيكل المشروع

```
catalog-app/
├── index.html              # هيكل الصفحة (HTML)
├── src/
│   ├── main.js              # نقطة الدخول
│   ├── style.css            # تنسيقات مخصصة
│   ├── supabaseClient.js    # الاتصال بـ Supabase
│   ├── state.js             # حالة التطبيق المشتركة
│   ├── api.js                # عمليات قاعدة البيانات (CRUD)
│   ├── render.js             # رسم بطاقات المنتجات والإحصائيات
│   ├── filters.js            # البحث والفلاتر والترتيب
│   ├── productModal.js       # نافذة إضافة/تعديل منتج
│   ├── detailModal.js        # نافذة تفاصيل المنتج والحذف
│   ├── exportImport.js       # تصدير/استيراد نسخة JSON احتياطية
│   ├── events.js             # ربط كل مستمعي الأحداث
│   └── theme.js / toast.js   # الوضع الليلي والإشعارات
├── supabase/schema.sql       # كود إنشاء جدول المنتجات
├── .env.example              # نموذج بيانات الاتصال بـ Supabase
├── netlify.toml               # إعدادات النشر على Netlify
└── package.json
```

## 1) التشغيل محليًا

يتطلب [Node.js](https://nodejs.org) مثبت على جهازك (نسخة 18 أو أحدث).

```bash
# داخل مجلد المشروع
npm install
```

اعمل نسخة من `.env.example` باسم `.env`:

```bash
cp .env.example .env
```

وافتح `.env` وحط بيانات مشروعك (من Supabase Dashboard > Project Settings > API):

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=المفتاح-العام-anon-key
```

بعدين شغّل السيرفر المحلي للتجربة:

```bash
npm run dev
```

هيديك رابط زي `http://localhost:5173` افتحه في المتصفح.

## 2) قاعدة البيانات

لو لسه معملتش الجدول، شغّل الكود اللي في `supabase/schema.sql` من تبويب **SQL Editor** في Supabase.

⚠️ **ملحوظة أمان**: الجدول بيتعمل افتراضيًا من غير Row Level Security، يعني أي حد معاه مفتاح الـ anon (المفتاح العام في الكود) يقدر يضيف/يعدل/يحذف بيانات مباشرة. ده مناسب للتجربة والاستخدام الداخلي. لو التطبيق هيبقى عام على الإنترنت وعايز حماية أكتر، راجع الملاحظات المكتوبة في نفس الملف لتفعيل RLS وربطه بنظام تسجيل دخول (Supabase Auth).

## 3) الرفع على Netlify

### الطريقة الأسهل (سحب وإفلات، بدون Git)

1. شغّل الأمر ده لبناء نسخة الإنتاج:
   ```bash
   npm run build
   ```
   هيتكون مجلد اسمه `dist` فيه الموقع جاهز.
2. روح على [app.netlify.com/drop](https://app.netlify.com/drop)
3. اسحب مجلد `dist` وحطه في الصفحة — هيديك رابط شغال فورًا.

⚠️ بما إن المتغيرات (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) بتتقرأ وقت الـ build، لازم تتأكد إن ملف `.env` موجود عندك محليًا وبالبيانات الصحيحة قبل ما تعمل `npm run build`.

### الطريقة الموصى بها (ربط مباشر بـ Git، بتحديث تلقائي)

1. ارفع المشروع على GitHub (أو GitLab/Bitbucket).
2. من Netlify Dashboard اختار **Add new site > Import an existing project** وحدد الريبو.
3. Netlify هيكتشف تلقائيًا من ملف `netlify.toml`:
   - أمر البناء: `npm run build`
   - مجلد النشر: `dist`
4. **مهم جدًا**: قبل أول Deploy، روح لـ **Site settings > Environment variables** وضيف:
   - `VITE_SUPABASE_URL` = رابط مشروعك
   - `VITE_SUPABASE_ANON_KEY` = المفتاح العام
   (ملف `.env` متعمد إنه ميترفعش على Git لحماية بياناتك، فلازم تحطهم يدويًا هنا)
5. اضغط Deploy، وأي تعديل جديد ترفعه على Git هيتحدث تلقائيًا على الموقع.

## ملاحظة عن الصور

رفع الصور من الجهاز حاليًا بيحولها لصيغة base64 وبيخزنها كنص جوا عمود `images`. ده شغال لكن مش الأمثل لو الصور كبيرة أو كتير. لتحسين الأداء مستقبلًا يُفضّل استخدام **Supabase Storage** لرفع الصور والاحتفاظ بروابطها فقط.
