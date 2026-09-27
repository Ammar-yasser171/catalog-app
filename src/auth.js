import { supabaseClient } from './supabaseClient.js';
import { state } from './state.js';

export async function signIn(email, password) {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await loadCurrentUserProfile();
}

export async function signOut() {
    await supabaseClient.auth.signOut();
    state.currentUser = null;
    state.userRole = null;
}

export async function getSession() {
    const { data } = await supabaseClient.auth.getSession();
    return data.session;
}

export async function loadCurrentUserProfile() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        state.currentUser = null;
        state.userRole = null;
        return;
    }
    const { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    state.currentUser = user;
    state.userRole = error ? 'user' : profile.role;
}

export function isAdmin() {
    return state.userRole === 'admin';
}

export function applyRoleUI() {
    document.querySelectorAll('[data-admin-only]').forEach(el => {
        el.classList.toggle('hidden', !isAdmin());
    });
}