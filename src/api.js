// كل عمليات التعامل مع قاعدة بيانات Supabase (جدول products)
import { supabaseClient } from './supabaseClient.js';
import { state } from './state.js';

// تحويل صف من قاعدة البيانات لصيغة المنتج المستخدمة في الواجهة
function mapRowToProduct(row) {
    return {
        id: String(row.id),
        name: row.title,
        category: row.category,
        price: row.price,
        unitType: row.unit_type === 'weight' ? 'وزن' : 'عدد',
        description: row.description,
        images: row.images || [],
        createdAt: row.created_at
    };
}

export async function loadProducts() {
    const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        state.products = [];
        throw error;
    }
    state.products = (data || []).map(mapRowToProduct);
}

export async function insertProduct(row) {
    const { error } = await supabaseClient.from('products').insert(row);
    if (error) throw error;
}

export async function updateProduct(id, row) {
    const { error } = await supabaseClient.from('products').update(row).eq('id', id);
    if (error) throw error;
}

export async function deleteProductRow(id) {
    const { error } = await supabaseClient.from('products').delete().eq('id', id);
    if (error) throw error;
}

export async function bulkInsertProducts(rows) {
    const { error } = await supabaseClient.from('products').insert(rows);
    if (error) throw error;
}
