import './style.css';

import { loadThemePreference } from './theme.js';
import { setupEventListeners } from './events.js';
import { loadProducts } from './api.js';
import { renderCategoryOptions } from './render.js';
import { applyFilters } from './filters.js';
import { showToast } from './toast.js';
import { getSession, loadCurrentUserProfile, applyRoleUI } from './auth.js';
import { FALLBACK_IMG } from './utils.js';

import { openProductModal, removeModalImage } from './productModal.js';
import { openDetailModal, deleteProduct, setDetailActiveImage } from './detailModal.js';

window.openDetailModal = openDetailModal;
window.openProductModal = openProductModal;
window.deleteProduct = deleteProduct;
window.removeModalImage = removeModalImage;
window.setDetailActiveImage = setDetailActiveImage;

// لو الصورة المصغرة فشلت نجرب الكاملة، ولو فشلت نعرض الصورة البديلة
window.handleImgError = (img) => {
    const full = img.dataset.full;
    if (full && !img.dataset.tried && img.getAttribute('src') !== full) {
        img.dataset.tried = '1';
        img.src = full;
    } else {
        img.onerror = null;
        img.src = FALLBACK_IMG;
    }
};

export async function loadAppData() {
    try {
        await loadProducts();
    } catch (err) {
        console.error('Error loading products:', err);
        showToast('تعذر تحميل المنتجات من قاعدة البيانات.', 'error');
    }
    renderCategoryOptions();
    applyFilters();
}

async function initApp() {
    loadThemePreference();
    setupEventListeners();

    const session = await getSession();
    if (!session) {
        document.getElementById('loginScreen').classList.remove('hidden');
        return;
    }

    document.getElementById('loginScreen').classList.add('hidden');

    // نحمّل الصلاحية والمنتجات في نفس الوقت بدل ما يستنوا بعض
    await Promise.all([
        loadCurrentUserProfile(),
        loadProducts().catch(err => {
            console.error('Error loading products:', err);
            showToast('تعذر تحميل المنتجات من قاعدة البيانات.', 'error');
        })
    ]);

    applyRoleUI();
    renderCategoryOptions();
    applyFilters();
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});