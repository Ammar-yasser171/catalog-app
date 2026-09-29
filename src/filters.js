// البحث والفلاتر والترتيب وتبديل وضع العرض
import { state } from './state.js';
import { renderProducts, updateStats } from './render.js';

export function applyFilters() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const unit = document.getElementById('unitFilter').value;
    const sortBy = document.getElementById('sortBySelect').value;

    state.filteredProducts = state.products.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(query) ||
                              (item.category || '').toLowerCase().includes(query) ||
                              (item.description && item.description.toLowerCase().includes(query));
        const matchesCategory = !category || item.category === category;
        const matchesUnit = !unit || item.unitType === unit;

        return matchesSearch && matchesCategory && matchesUnit;
    });

    // Sort logic
    state.filteredProducts.sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'priceLow') return parseFloat(a.price) - parseFloat(b.price);
        if (sortBy === 'priceHigh') return parseFloat(b.price) - parseFloat(a.price);
        if (sortBy === 'nameAsc') return a.name.localeCompare(b.name, 'ar');
        return 0;
    });

    state.currentPage = 1;
    updateStats();
    renderProducts();
}

export function setViewMode(mode) {
    state.activeViewMode = mode;
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');

    if (mode === 'grid') {
        gridBtn.className = 'p-1.5 px-2.5 rounded-lg text-emerald-600 bg-white dark:bg-slate-800 shadow-sm transition-all';
        listBtn.className = 'p-1.5 px-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all';
    } else {
        listBtn.className = 'p-1.5 px-2.5 rounded-lg text-emerald-600 bg-white dark:bg-slate-800 shadow-sm transition-all';
        gridBtn.className = 'p-1.5 px-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all';
    }

    renderProducts();
}
