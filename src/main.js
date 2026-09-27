import './style.css';

import { loadThemePreference } from './theme.js';
import { setupEventListeners } from './events.js';
import { loadProducts } from './api.js';
import { renderCategoryOptions } from './render.js';
import { applyFilters } from './filters.js';
import { showToast } from './toast.js';
import { getSession, loadCurrentUserProfile, applyRoleUI } from './auth.js';

import { openProductModal, removeModalImage } from './productModal.js';
import { openDetailModal, deleteProduct, setDetailActiveImage } from './detailModal.js';

window.openDetailModal = openDetailModal;
window.openProductModal = openProductModal;
window.deleteProduct = deleteProduct;
window.removeModalImage = removeModalImage;
window.setDetailActiveImage = setDetailActiveImage;

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

    await loadCurrentUserProfile();
    document.getElementById('loginScreen').classList.add('hidden');
    applyRoleUI();
    await loadAppData();
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});