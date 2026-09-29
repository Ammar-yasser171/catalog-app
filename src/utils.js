// دوال مساعدة مشتركة

// صورة بديلة تُنشأ محليًا (بدون طلب شبكة، ومصححة من الخطأ القديم في الرابط)
const fallbackSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">` +
    `<rect width="100%" height="100%" fill="#e2e8f0"/>` +
    `<text x="50%" y="50%" fill="#64748b" font-family="sans-serif" font-size="22" ` +
    `text-anchor="middle" dominant-baseline="middle">بدون صورة</text></svg>`;
export const FALLBACK_IMG = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fallbackSvg);

// حماية من XSS عند وضع نصوص المستخدم داخل innerHTML
export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// رابط الصورة المصغرة (للصور المرفوعة على Supabase فقط)
// الصور القديمة أو الروابط الخارجية ترجع كما هي
export function thumbOf(url) {
    if (
        url &&
        url.includes('/storage/v1/object/public/product-images/') &&
        url.endsWith('.webp') &&
        !url.endsWith('_thumb.webp')
    ) {
        return url.replace(/\.webp$/, '_thumb.webp');
    }
    return url;
}