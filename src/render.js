// رسم المنتجات والإحصائيات في الواجهة
import { state, ITEMS_PER_PAGE } from './state.js';
import { FALLBACK_IMG, escapeHtml, thumbOf } from './utils.js';

export function updateStats() {
    document.getElementById('statTotalProducts').innerText = state.products.length;

    const categories = new Set(state.products.map(p => p.category));
    document.getElementById('statTotalCategories').innerText = categories.size;

    const countUnits = state.products.filter(p => p.unitType === 'عدد').length;
    const weightUnits = state.products.filter(p => p.unitType === 'وزن').length;

    document.getElementById('statCountUnit').innerText = countUnits;
    document.getElementById('statWeightUnit').innerText = weightUnits;
}

export function renderCategoryOptions() {
    const categories = Array.from(new Set(state.products.map(p => p.category).filter(Boolean)));

    // Datalist for form auto-complete
    const datalist = document.getElementById('categoryList');
    datalist.innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">`).join('');

    // Filter dropdown options
    const filterSelect = document.getElementById('categoryFilter');
    const currentVal = filterSelect.value;
    filterSelect.innerHTML = '<option value="">جميع الأنواع / التصنيفات</option>' +
        categories.map(c => `<option value="${escapeHtml(c)}" ${c === currentVal ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('');
}

// وسم الصورة: مصغّرة + تحميل كسول + رجوع للصورة الكاملة ثم للبديلة لو فشلت
function imgTag(mainImg, alt, cls) {
    return `<img src="${escapeHtml(thumbOf(mainImg))}" data-full="${escapeHtml(mainImg)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" class="${cls}" onerror="handleImgError(this)">`;
}

function createGridCard(product) {
    const mainImg = (product.images && product.images.length > 0) ? product.images[0] : FALLBACK_IMG;
    const imageCount = product.images ? product.images.length : 0;

    return `
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
            <div class="relative h-44 bg-slate-100 dark:bg-slate-900 overflow-hidden cursor-pointer" onclick="openDetailModal('${product.id}')">
                ${imgTag(mainImg, product.name, 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300')}

                <div class="absolute top-2 right-2 flex flex-col gap-1">
                    <span class="px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded-lg backdrop-blur-sm shadow-sm">
                        ${escapeHtml(product.category)}
                    </span>
                </div>

                <div class="absolute top-2 left-2">
                    <span class="px-2 py-0.5 ${product.unitType === 'عدد' ? 'bg-emerald-500/90' : 'bg-amber-500/90'} text-white text-[10px] font-bold rounded-md backdrop-blur-sm shadow-sm">
                        ${product.unitType === 'عدد' ? '<i class="fa-solid fa-hashtag ml-0.5"></i> عدد' : '<i class="fa-solid fa-weight-hanging ml-0.5"></i> وزن'}
                    </span>
                </div>

                ${imageCount > 1 ? `
                    <div class="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-sm">
                        <i class="fa-regular fa-images ml-1"></i> ${imageCount}
                    </div>
                ` : ''}
            </div>

            <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    <h3 class="font-bold text-slate-900 dark:text-white text-base line-clamp-1 hover:text-emerald-600 cursor-pointer transition-colors" onclick="openDetailModal('${product.id}')">
                        ${escapeHtml(product.name)}
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        ${escapeHtml(product.description || 'لا يوجد وصف إضافي للمنتج.')}
                    </p>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <div>
                        <span class="text-[10px] text-slate-400 block">السعر</span>
                        <span class="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">${product.price} <span class="text-xs font-normal">ج.م</span></span>
                    </div>

                    <div class="flex items-center gap-1">
                        <button onclick="openDetailModal('${product.id}')" class="p-2 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" title="التفاصيل">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        ${state.userRole === 'admin' ? `
                        <button onclick="openProductModal('${product.id}')" class="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" title="تعديل">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onclick="deleteProduct('${product.id}')" class="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" title="حذف">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createListCard(product) {
    const mainImg = (product.images && product.images.length > 0) ? product.images[0] : FALLBACK_IMG;

    return `
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4">
            <div class="w-full sm:w-28 h-28 rounded-xl bg-slate-100 dark:bg-slate-900 overflow-hidden flex-shrink-0 cursor-pointer" onclick="openDetailModal('${product.id}')">
                ${imgTag(mainImg, product.name, 'w-full h-full object-cover')}
            </div>

            <div class="flex-1 min-w-0 space-y-1 text-center sm:text-right w-full">
                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md">
                        ${escapeHtml(product.category)}
                    </span>
                    <span class="px-2 py-0.5 ${product.unitType === 'عدد' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'} text-xs font-semibold rounded-md">
                        ${product.unitType}
                    </span>
                </div>
                <h3 class="font-bold text-slate-900 dark:text-white text-base truncate hover:text-emerald-600 cursor-pointer" onclick="openDetailModal('${product.id}')">
                    ${escapeHtml(product.name)}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    ${escapeHtml(product.description || 'لا يوجد وصف إضافي للمنتج.')}
                </p>
            </div>

            <div class="flex sm:flex-col items-center justify-between w-full sm:w-auto border-t sm:border-t-0 sm:border-r border-slate-100 dark:border-slate-700 pt-3 sm:pt-0 sm:pr-4 gap-3">
                <div class="text-right sm:text-left">
                    <span class="text-lg font-black text-emerald-600 dark:text-emerald-400">${product.price} <span class="text-xs font-normal">ج.م</span></span>
                </div>

                <div class="flex items-center gap-1">
                    <button onclick="openDetailModal('${product.id}')" class="p-2 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" title="التفاصيل">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    ${state.userRole === 'admin' ? `
                    <button onclick="openProductModal('${product.id}')" class="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" title="تعديل">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="deleteProduct('${product.id}')" class="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" title="حذف">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>` : ''}
                </div>
            </div>
        </div>
    `;
}

export function renderProducts() {
    const container = document.getElementById('productsContainer');
    const emptyState = document.getElementById('emptyState');
    const paginationControls = document.getElementById('paginationControls');

    if (state.filteredProducts.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
        paginationControls.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    emptyState.classList.remove('flex');
    paginationControls.classList.remove('hidden');

    // Pagination calculations
    const totalPages = Math.ceil(state.filteredProducts.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = state.filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Update Pagination UI
    document.getElementById('paginationInfo').innerText = `عرض ${startIndex + 1} - ${Math.min(startIndex + ITEMS_PER_PAGE, state.filteredProducts.length)} من إجمالي ${state.filteredProducts.length}`;
    document.getElementById('currentPageSpan').innerText = state.currentPage;
    document.getElementById('prevPageBtn').disabled = state.currentPage === 1;
    document.getElementById('nextPageBtn').disabled = state.currentPage === totalPages;

    // Render view mode
    if (state.activeViewMode === 'grid') {
        container.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
        container.innerHTML = paginatedItems.map(p => createGridCard(p)).join('');
    } else {
        container.className = 'flex flex-col gap-3';
        container.innerHTML = paginatedItems.map(p => createListCard(p)).join('');
    }
}