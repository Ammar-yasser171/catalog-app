import './style.css';

import { loadThemePreference } from './theme.js';
import { setupEventListeners } from './events.js';
import { loadProducts } from './api.js';
import { renderCategoryOptions } from './render.js';
import { applyFilters } from './filters.js';
import { showToast } from './toast.js';

import { openProductModal, removeModalImage } from './productModal.js';
import { openDetailModal, deleteProduct, setDetailActiveImage } from './detailModal.js';

// بعض الأزرار مُنشأة ديناميكيًا كنص HTML (onclick="...") لذلك لازم
// نعرّض الدوال دي على window عشان الأزرار تقدر توصلها
window.openDetailModal = openDetailModal;
window.openProductModal = openProductModal;
window.deleteProduct = deleteProduct;
window.removeModalImage = removeModalImage;
window.setDetailActiveImage = setDetailActiveImage;

async function initApp() {
    loadThemePreference();
    setupEventListeners();
    try {
        await loadProducts();
    } catch (err) {
        console.error('Error loading products:', err);
        showToast('تعذر تحميل المنتجات من قاعدة البيانات. تأكد من رابط ومفتاح Supabase في ملف .env', 'error');
    }
    renderCategoryOptions();
    applyFilters();
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
