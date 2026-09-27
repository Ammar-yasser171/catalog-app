// حالة التطبيق المشتركة بين كل الموديولز
export const state = {
    products: [],
    filteredProducts: [],
    activeViewMode: 'grid', // 'grid' | 'list'
    currentModalImages: [],
    detailActiveImgIndex: 0,
    activeDetailProduct: null,
    currentPage: 1,
};

export const ITEMS_PER_PAGE = 12;
