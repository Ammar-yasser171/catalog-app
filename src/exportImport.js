// تصدير واستيراد نسخة احتياطية بصيغة JSON
import { state } from './state.js';
import { bulkInsertProducts, loadProducts } from './api.js';
import { showToast } from './toast.js';
import { applyFilters } from './filters.js';
import { renderCategoryOptions } from './render.js';

export function exportDataJSON() {
    if (state.products.length === 0) {
        showToast("لا توجد بيانات لتصديرها.", "info");
        return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `products_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("تم تصدير نسخة البيانات بنجاح!", "success");
}

export function importDataJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const importedProducts = JSON.parse(event.target.result);
            if (Array.isArray(importedProducts)) {
                const rows = importedProducts.map(p => ({
                    title: p.name,
                    category: p.category,
                    price: p.price,
                    unit_type: p.unitType === 'وزن' ? 'weight' : 'count',
                    description: p.description,
                    images: p.images || []
                }));
                await bulkInsertProducts(rows);
                await loadProducts();
                renderCategoryOptions();
                applyFilters();
                showToast("تم استيراد الكتالوج بنجاح!", "success");
            } else {
                showToast("ملف غير صالح.", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("فشل قراءة الملف أو رفعه لقاعدة البيانات.", "error");
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}
