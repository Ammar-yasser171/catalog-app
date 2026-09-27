// إشعارات Toast المنبثقة
export function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');

    let bgClass = "bg-slate-800 text-white";
    let icon = "fa-circle-info";

    if (type === 'success') {
        bgClass = "bg-emerald-600 text-white";
        icon = "fa-circle-check";
    } else if (type === 'error') {
        bgClass = "bg-red-600 text-white";
        icon = "fa-circle-xmark";
    }

    toast.className = `p-3 px-4 rounded-xl shadow-lg flex items-center gap-3 text-xs font-semibold ${bgClass} transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto`;
    toast.innerHTML = `<i class="fa-solid ${icon} text-base"></i><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
