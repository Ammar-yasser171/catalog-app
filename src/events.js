// ربط كل مستمعي الأحداث (event listeners) بعناصر الواجهة
import { signIn, signOut, applyRoleUI } from './auth.js';
import { loadAppData } from './main.js';
import { state } from './state.js';
import { toggleTheme } from './theme.js';
import { applyFilters, setViewMode } from './filters.js';
import { renderProducts } from './render.js';
import {
    openProductModal,
    closeProductModal,
    handleAddUrlImage,
    handleFileUpload,
    handleFormSubmit,
    updateUnitRadioStyle
} from './productModal.js';
import { closeDetailModal, navigateDetailImage } from './detailModal.js';
import { exportDataJSON, importDataJSON } from './exportImport.js';
import { ITEMS_PER_PAGE } from './state.js';

export function setupEventListeners() {
        // Login / Logout
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('loginError');
        errorEl.classList.add('hidden');
        try {
            await signIn(email, password);
            document.getElementById('loginScreen').classList.add('hidden');
            applyRoleUI();
            await loadAppData();
        } catch (err) {
            errorEl.classList.remove('hidden');
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await signOut();
        location.reload();
    });
    // Theme toggle
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

    // Modals toggle
    document.getElementById('openAddModalBtn').addEventListener('click', () => openProductModal());
    document.getElementById('closeModalBtn').addEventListener('click', closeProductModal);
    document.getElementById('cancelModalBtn').addEventListener('click', closeProductModal);
    document.getElementById('closeDetailModalBtn').addEventListener('click', closeDetailModal);

    // Search and Filters
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        document.getElementById('clearSearchBtn').classList.toggle('hidden', !searchInput.value);
        applyFilters();
    });
    document.getElementById('clearSearchBtn').addEventListener('click', () => {
        searchInput.value = '';
        document.getElementById('clearSearchBtn').classList.add('hidden');
        applyFilters();
    });
    document.getElementById('resetSearchBtn').addEventListener('click', () => {
        searchInput.value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('unitFilter').value = '';
        document.getElementById('sortBySelect').value = 'newest';
        document.getElementById('clearSearchBtn').classList.add('hidden');
        applyFilters();
    });

    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('unitFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBySelect').addEventListener('change', applyFilters);

    // View modes
    document.getElementById('gridViewBtn').addEventListener('click', () => setViewMode('grid'));
    document.getElementById('listViewBtn').addEventListener('click', () => setViewMode('list'));

    // Pagination
    document.getElementById('prevPageBtn').addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderProducts();
        }
    });
    document.getElementById('nextPageBtn').addEventListener('click', () => {
        const totalPages = Math.ceil(state.filteredProducts.length / ITEMS_PER_PAGE);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderProducts();
        }
    });

    // Add Image Handlers
    document.getElementById('addUrlImgBtn').addEventListener('click', handleAddUrlImage);
    document.getElementById('fileImageInput').addEventListener('change', handleFileUpload);

    document.getElementById('openFilePickerBtn')?.addEventListener('click', () => {
        document.getElementById('fileImageInput').click();
    });
    // Form Submit
    document.getElementById('productForm').addEventListener('submit', handleFormSubmit);

    // Radio unit selection styling
    const unitRadios = document.querySelectorAll('input[name="unitType"]');
    unitRadios.forEach(radio => {
        radio.addEventListener('change', updateUnitRadioStyle);
    });

    // Export & Import
    document.getElementById('exportDataBtn').addEventListener('click', exportDataJSON);
    document.getElementById('importDataBtn').addEventListener('click', () => document.getElementById('importFileInput').click());
    document.getElementById('importFileInput').addEventListener('change', importDataJSON);

    // Detail Carousel
    document.getElementById('detailPrevImgBtn').addEventListener('click', () => navigateDetailImage(-1));
    document.getElementById('detailNextImgBtn').addEventListener('click', () => navigateDetailImage(1));
}
