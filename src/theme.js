// التحكم في الوضع الليلي/النهاري (يُحفظ محليًا في المتصفح فقط)
export function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.getElementById('themeIcon').className = 'fa-solid fa-sun text-lg text-amber-400';
    } else {
        document.documentElement.classList.remove('dark');
        document.getElementById('themeIcon').className = 'fa-solid fa-moon text-lg text-slate-600';
    }
}

export function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        document.getElementById('themeIcon').className = 'fa-solid fa-moon text-lg text-slate-600';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        document.getElementById('themeIcon').className = 'fa-solid fa-sun text-lg text-amber-400';
    }
}
