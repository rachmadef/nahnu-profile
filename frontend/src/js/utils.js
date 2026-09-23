/**
 * Helper utility functions
 */

// Toast notification (Light Mode)
export function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-[#151722]/95 border-emerald-500/30 text-emerald-300 shadow-2xl shadow-emerald-500/10',
    error: 'bg-[#151722]/95 border-rose-500/30 text-rose-300 shadow-2xl shadow-rose-500/10',
    info: 'bg-[#151722]/95 border-[#ff6b00]/30 text-orange-200 shadow-2xl shadow-[#ff6b00]/10',
    warning: 'bg-[#151722]/95 border-amber-500/30 text-amber-300 shadow-2xl shadow-amber-500/10',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  const iconBg = {
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    error: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    info: 'bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  };

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto text-xs font-semibold ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `
    <span class="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${iconBg[type] || iconBg.info}">${icons[type] || '•'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Format Indonesian date
export function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Generate URL slug
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Auth Guards
export function requireAdminAuth() {
  const token = localStorage.getItem('nahnu_admin_token');
  if (!token) {
    window.location.href = '/admin/login.html';
    return false;
  }
  return true;
}

export function redirectIfAdminAuth() {
  const token = localStorage.getItem('nahnu_admin_token');
  if (token) {
    window.location.href = '/admin/dashboard.html';
  }
}

// Convert relative storage/media paths to complete backend URLs
export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  const backendBase = apiBase.replace(/\/api\/?$/, '');
  return `${backendBase}${path.startsWith('/') ? '' : '/'}${path}`;
}
