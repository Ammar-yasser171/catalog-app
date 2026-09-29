// كل عمليات التعامل مع قاعدة بيانات Supabase (جدول products)
import { supabaseClient } from './supabaseClient.js';
import { state } from './state.js';

const BUCKET = 'product-images';
const PUBLIC_MARKER = `/storage/v1/object/public/${BUCKET}/`;

// تحويل صف من قاعدة البيانات لصيغة المنتج المستخدمة في الواجهة
function mapRowToProduct(row) {
    return {
        id: String(row.id),
        name: row.title,
        category: row.category,
        price: row.price,
        unitType: row.unit_type === 'weight' ? 'وزن' : 'عدد',
        description: row.description,
        images: row.images || [],
        createdAt: row.created_at
    };
}

export async function loadProducts() {
    const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        state.products = [];
        throw error;
    }
    state.products = (data || []).map(mapRowToProduct);
}

// ضغط الصورة قبل الرفع
async function compressImage(file, maxSize = 1000, quality = 0.8) {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    return new Promise(res => canvas.toBlob(res, 'image/webp', quality));
}

// رفع صورة كاملة + نسخة مصغرة (للكروت) وإرجاع رابط الصورة الكاملة
export async function uploadImage(file) {
    const id = crypto.randomUUID();
    const [full, thumb] = await Promise.all([
        compressImage(file, 1000, 0.8),
        compressImage(file, 400, 0.75)
    ]);

    const opts = { contentType: 'image/webp', cacheControl: '31536000' };
    const storage = supabaseClient.storage.from(BUCKET);
    const [a, b] = await Promise.all([
        storage.upload(`${id}.webp`, full, opts),
        storage.upload(`${id}_thumb.webp`, thumb, opts)
    ]);

    if (a.error || b.error) {
        await storage.remove([`${id}.webp`, `${id}_thumb.webp`]); // تنظيف لو فشل واحد منهم
        throw a.error || b.error;
    }
    return storage.getPublicUrl(`${id}.webp`).data.publicUrl;
}

// استخراج مسار الملف داخل الـ bucket من الرابط العام
function pathFromUrl(url) {
    const i = url.indexOf(PUBLIC_MARKER);
    if (i === -1) return null; // رابط خارجي (ملصوق يدويًا) لا نحذفه
    return decodeURIComponent(url.slice(i + PUBLIC_MARKER.length).split('?')[0]);
}

// حذف ملفات الصور (والنسخة المصغرة) من Storage
// مهم: استدعِها بعد تحديث state.products عشان نتأكد إن الصورة مش مستخدمة في منتج آخر
export async function deleteImagesFromStorage(urls = []) {
    const stillUsed = new Set(state.products.flatMap(p => p.images || []));
    const paths = [];

    for (const url of urls) {
        if (stillUsed.has(url)) continue; // منتج آخر بيستخدم نفس الصورة (مثلاً بعد الاستيراد)
        const p = pathFromUrl(url);
        if (!p) continue;
        paths.push(p);
        if (p.endsWith('.webp') && !p.endsWith('_thumb.webp')) {
            paths.push(p.replace(/\.webp$/, '_thumb.webp'));
        }
    }
    if (!paths.length) return;

    const { data, error } = await supabaseClient.storage.from(BUCKET).remove(paths);
    if (error) {
        console.error('Storage delete failed:', error);
    } else if (data && data.length === 0) {
        // غالبًا سياسة الحذف (delete policy) ناقصة في Supabase
        console.warn('لم يتم حذف أي ملف من Storage. راجع سياسة الحذف (الخطوة 12).');
    }
}

export async function insertProduct(row) {
    const { data, error } = await supabaseClient
        .from('products').insert(row).select().single();
    if (error) throw error;
    state.products.unshift(mapRowToProduct(data));
}

export async function updateProduct(id, row) {
    const { data, error } = await supabaseClient
        .from('products').update(row).eq('id', id).select().single();
    if (error) throw error;
    const i = state.products.findIndex(p => p.id === id);
    if (i !== -1) state.products[i] = mapRowToProduct(data);
}

export async function deleteProductRow(id) {
    // .select('id') عشان نعرف هل اتحذف صف فعلًا؛ من غيرها Supabase بيرجع "نجاح" حتى لو مفيش حاجة اتحذفت
    const { data, error } = await supabaseClient
        .from('products').delete().eq('id', id).select('id');
    if (error) throw error;
    if (!data || data.length === 0) {
        throw new Error('لم يتم حذف أي صف (تحقق من الصلاحيات).');
    }
    state.products = state.products.filter(p => p.id !== id);
}

export async function bulkInsertProducts(rows) {
    const { error } = await supabaseClient.from('products').insert(rows);
    if (error) throw error;
}