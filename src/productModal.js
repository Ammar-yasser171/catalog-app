// نافذة إضافة/تعديل منتج
import { state } from './state.js';
import { insertProduct, updateProduct, loadProducts } from './api.js';
import { showToast } from './toast.js';
import { applyFilters } from './filters.js';
import { renderCategoryOptions } from './render.js';

export function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('modalTitle');

    form.reset();
    state.currentModalImages = [];

    if (productId) {
        const prod = state.products.find(p => p.id === productId);
        if (prod) {
            title.innerHTML = `<i class="fa-solid fa-pen-to-square text-emerald-600"></i> تعديل المنتج`;
            document.getElementById('productId').value = prod.id;
            document.getElementById('inputName').value = prod.name;
            document.getElementById('inputCategory').value = prod.category;
            document.getElementById('inputPrice').value = prod.price;
            document.getElementById('inputDescription').value = prod.description || '';

            const unitRadios = document.querySelectorAll('input[name="unitType"]');
            unitRadios.forEach(r => r.checked = (r.value === prod.unitType));

            state.currentModalImages = [...(prod.images || [])];
        }
    } else {
        title.innerHTML = `<i class="fa-solid fa-box-archive text-emerald-600"></i> إضافة منتج جديد`;
        document.getElementById('productId').value = '';
    }

    updateUnitRadioStyle();
    renderModalImagesPreview();
    modal.classList.remove('hidden');
}

export function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
}

export function updateUnitRadioStyle() {
    const countRadio = document.querySelector('input[name="unitType"][value="عدد"]');
    const countLabel = document.getElementById('unitCountLabel');
    const weightLabel = document.getElementById('unitWeightLabel');

    if (countRadio.checked) {
        countLabel.className = "flex items-center justify-center p-2.5 border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl cursor-pointer text-xs font-bold transition-all";
        weightLabel.className = "flex items-center justify-center p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300";
    } else {
        weightLabel.className = "flex items-center justify-center p-2.5 border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-xl cursor-pointer text-xs font-bold transition-all";
        countLabel.className = "flex items-center justify-center p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300";
    }
}

// Image gallery modal logic
export function handleAddUrlImage() {
    const urlInput = document.getElementById('imageUrlInput');
    const url = urlInput.value.trim();
    if (!url) return;

    state.currentModalImages.push(url);
    urlInput.value = '';
    renderModalImagesPreview();
}

export function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            state.currentModalImages.push(event.target.result);
            renderModalImagesPreview();
        };
        reader.readAsDataURL(file);
    });
    e.target.value = '';
}

export function removeModalImage(index) {
    state.currentModalImages.splice(index, 1);
    renderModalImagesPreview();
}

function renderModalImagesPreview() {
    const container = document.getElementById('imagesPreviewContainer');
    if (state.currentModalImages.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-400 text-center w-full">لم يتم إضافة صور بعد. سيتم استخدام صورة افتراضية في حال التجاوز.</p>`;
        return;
    }

    container.innerHTML = state.currentModalImages.map((img, idx) => `
        <div class="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group img-preview-card">
            <img src="${img}" class="w-full h-full object-cover">
            <button type="button" onclick="removeModalImage(${idx})" class="remove-img-btn absolute top-1 left-1 bg-red-600 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `).join('');
}

export async function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('productId').value;
    const name = document.getElementById('inputName').value.trim();
    const category = document.getElementById('inputCategory').value.trim();
    const price = parseFloat(document.getElementById('inputPrice').value);
    const unitType = document.querySelector('input[name="unitType"]:checked').value;
    const description = document.getElementById('inputDescription').value.trim();

    let images = state.currentModalImages;
    if (id && state.currentModalImages.length === 0) {
        const existing = state.products.find(p => p.id === id);
        images = existing ? existing.images : [];
    }

    const row = {
        title: name,
        category,
        price,
        unit_type: unitType === 'وزن' ? 'weight' : 'count',
        description,
        images
    };

    try {
        if (id) {
            await updateProduct(id, row);
            showToast("تم تعديل المنتج بنجاح!", "success");
        } else {
            await insertProduct(row);
            showToast("تمت إضافة المنتج بنجاح!", "success");
        }
        await loadProducts();
        renderCategoryOptions();
        applyFilters();
        closeProductModal();
    } catch (err) {
        console.error(err);
        showToast("حدث خطأ أثناء الحفظ في قاعدة البيانات.", "error");
    }
}
