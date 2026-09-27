// نافذة تفاصيل المنتج (المعرض والحذف)
import { state } from './state.js';
import { deleteProductRow, loadProducts } from './api.js';
import { showToast } from './toast.js';
import { applyFilters } from './filters.js';
import { renderCategoryOptions } from './render.js';
import { openProductModal } from './productModal.js';

export function openDetailModal(id) {
    const product = state.products.find(p => p.id === id);
    if (!product) return;

    state.activeDetailProduct = product;
    state.detailActiveImgIndex = 0;

    document.getElementById('detailTitle').innerText = product.name;
    document.getElementById('detailCategory').innerText = product.category;
    document.getElementById('detailUnit').innerText = product.unitType === 'عدد' ? 'بالعدد' : 'بالوزن';
    document.getElementById('detailPrice').innerText = `${product.price} ج.م`;
    document.getElementById('detailDescription').innerText = product.description || 'لا توجد معلومات إضافية متوفرة لهذا المنتج.';

    const dateStr = new Date(product.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('detailCreatedAt').innerText = `تاريخ الإضافة: ${dateStr}`;

    // Buttons
    document.getElementById('detailEditBtn').onclick = () => {
        closeDetailModal();
        openProductModal(product.id);
    };
    document.getElementById('detailDeleteBtn').onclick = () => {
        deleteProduct(product.id);
    };

    updateDetailGallery();
    document.getElementById('detailModal').classList.remove('hidden');
}

export function closeDetailModal() {
    document.getElementById('detailModal').classList.add('hidden');
}

export function updateDetailGallery() {
    const product = state.activeDetailProduct;
    if (!product) return;

    const fallbackImg = 'https://placehold.co/600x400/e2e8f0/64748b?text=%D0%B1%D8%AF%D9%88%D9%86+%D8%B5%D9%88%D8%B1%D8%A9';
    const images = (product.images && product.images.length > 0) ? product.images : [fallbackImg];

    if (state.detailActiveImgIndex >= images.length) state.detailActiveImgIndex = 0;
    if (state.detailActiveImgIndex < 0) state.detailActiveImgIndex = images.length - 1;

    document.getElementById('detailMainImg').src = images[state.detailActiveImgIndex];
    document.getElementById('detailImgBadge').innerText = `${state.detailActiveImgIndex + 1} / ${images.length}`;

    // Render Thumbnails
    const thumbsContainer = document.getElementById('detailThumbnailsContainer');
    if (images.length > 1) {
        thumbsContainer.classList.remove('hidden');
        thumbsContainer.innerHTML = images.map((img, idx) => `
            <button onclick="setDetailActiveImage(${idx})" class="w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 ${idx === state.detailActiveImgIndex ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60'} transition-all">
                <img src="${img}" class="w-full h-full object-cover">
            </button>
        `).join('');
    } else {
        thumbsContainer.classList.add('hidden');
    }
}

export function setDetailActiveImage(idx) {
    state.detailActiveImgIndex = idx;
    updateDetailGallery();
}

export function navigateDetailImage(direction) {
    state.detailActiveImgIndex += direction;
    updateDetailGallery();
}

export async function deleteProduct(id) {
    if (confirm("هل أنت تأكد من إزالة هذا المنتج من الكتالوج؟")) {
        try {
            await deleteProductRow(id);
            await loadProducts();
            renderCategoryOptions();
            applyFilters();
            closeDetailModal();
            showToast("تم حذف المنتج.", "info");
        } catch (err) {
            console.error(err);
            showToast("حدث خطأ أثناء الحذف من قاعدة البيانات.", "error");
        }
    }
}
