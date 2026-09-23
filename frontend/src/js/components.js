import { adminLogout } from './api.js';
import { showToast } from './utils.js';

export function renderBrandLogo(size = 'md', isLight = false) {
  const isSm = size === 'sm';
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const subtextColor = isLight ? 'text-slate-500' : 'text-slate-400';

  return `
    <div class="flex items-center gap-2.5 group">
      <div class="${isSm ? 'w-8 h-8' : 'w-9 h-9'} flex items-center justify-center p-0.5 shrink-0">
        <img src="/logo-primary.png" alt="NAHNU Logo" class="w-full h-full object-cover">
      </div>
      <div class="flex flex-col">
        <span class="font-extrabold ${isSm ? 'text-base' : 'text-lg'} tracking-wider ${textColor} flex items-center gap-1.5 leading-tight">
          NAHNU <span class="w-1.5 h-1.5 rounded-full bg-[#ff6b00] shadow-sm shadow-[#ff6b00]"></span>
        </span>
        <span class="text-[9px] font-bold tracking-wide uppercase ${subtextColor} font-mono">STUDIO</span>
      </div>
    </div>
  `;
}

export function renderPublicNavbar(activePage = 'home') {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  const currentActive = (activePage === 'projects') ? 'website' : activePage;

  const links = [
    { name: 'Home', href: '/index.html', key: 'home' },
    { name: 'Website', href: '/projects.html', key: 'website' },
    { name: 'Design', href: '/design.html', key: 'design' },
    { name: 'Entertaintment', href: '/entertainment.html', key: 'entertainment' },
    { name: 'About Team', href: '/about.html', key: 'about' },
    { name: 'Contact', href: '/contact.html', key: 'contact' },
  ];

  container.innerHTML = `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-[#0d0f14]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 transition-all">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Brand Logo -->
        <a href="/index.html" class="flex items-center">
          ${renderBrandLogo('md', false)}
        </a>

        <!-- Desktop Navigation Links (Pill Bar) -->
        <div class="hidden lg:flex items-center gap-1 bg-[#151722]/90 p-1.5 rounded-full border border-white/[0.08] shadow-inner">
          ${links.map(link => `
            <a href="${link.href}" class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentActive === link.key
                ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }">
              ${link.name}
            </a>
          `).join('')}
        </div>

        <!-- Right Action Button -->
        <div class="hidden lg:flex items-center gap-3">
          <a href="/contact.html" class="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff7a18] hover:from-[#ff7a18] hover:to-[#ff8a2e] text-white shadow-lg shadow-[#ff6b00]/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2">
            <span>Mulai Diskusi</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>

        <!-- Mobile Three-Dots Overflow Menu -->
        <div class="relative lg:hidden">
          <button id="mobile-menu-btn" aria-label="Menu Navigasi" aria-expanded="false" class="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/[0.08] transition-all flex items-center justify-center shadow-md focus:outline-none">
            <!-- Three Dots Vertical Icon -->
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2.2"></circle>
              <circle cx="12" cy="12" r="2.2"></circle>
              <circle cx="12" cy="19" r="2.2"></circle>
            </svg>
          </button>

          <!-- Floating Popup Menu (Anchored to Top-Right below Three-Dots) -->
          <div id="mobile-menu" class="hidden absolute right-0 top-full mt-2.5 w-64 z-50 origin-top-right animate-popup">
            <div class="bg-[#151722]/98 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-2 shadow-2xl shadow-black/95 ring-1 ring-white/10 flex flex-col gap-1">
              <!-- Menu Header -->
              <div class="px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span class="uppercase font-bold tracking-wider">Menu Navigasi</span>
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff6b00]"></span>
              </div>

              <!-- Navigation Links -->
              ${links.map(link => `
                <a href="${link.href}" class="px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  currentActive === link.key
                    ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }">
                  <span>${link.name}</span>
                  ${currentActive === link.key
                    ? `<span class="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></span>`
                    : `<svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`
                  }
                </a>
              `).join('')}

              <div class="my-0.5 border-t border-white/[0.06]"></div>

              <!-- Action Button in Menu -->
              <a href="/contact.html" class="px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff7a18] hover:from-[#ff7a18] hover:to-[#ff8a2e] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#ff6b00]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                <span>Mulai Diskusi</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;

  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = menu.classList.contains('hidden');
      if (isHidden) {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('bg-white/[0.12]', 'text-[#ff6b00]', 'border-[#ff6b00]/40');
      } else {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('bg-white/[0.12]', 'text-[#ff6b00]', 'border-[#ff6b00]/40');
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!menu.classList.contains('hidden') && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('bg-white/[0.12]', 'text-[#ff6b00]', 'border-[#ff6b00]/40');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('bg-white/[0.12]', 'text-[#ff6b00]', 'border-[#ff6b00]/40');
      }
    });
  }
}

export function renderPublicFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  container.innerHTML = `
    <footer class="border-t border-white/[0.08] bg-[#090b10] pt-16 pb-12 text-slate-400 text-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        <!-- Brand Info -->
        <div class="md:col-span-2 flex flex-col gap-4">
          <div class="flex items-center">
            ${renderBrandLogo('md', false)}
          </div>
          <p class="text-slate-400 max-w-sm leading-relaxed text-xs">
            Three Developers. One Digital Space. Wadah portofolio kolaboratif 3 software developer dengan spesialisasi arsitektur REST API Laravel, antarmuka web modern, karya desain grafis, dan produksi multimedia audio-visual berkinerja tinggi.
          </p>
          <div class="flex items-center gap-3 text-xs text-slate-400 pt-2">
            <span>© ${new Date().getFullYear()} NAHNU. All rights reserved.</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="flex flex-col gap-3">
          <span class="text-white font-bold text-xs tracking-wider uppercase">Menu</span>
          <a href="/index.html" class="text-xs text-slate-400 hover:text-[#ff6b00] transition-colors">Home</a>
          <a href="/projects.html" class="text-xs text-slate-400 hover:text-[#ff6b00] transition-colors">Website Showcase</a>
          <a href="/design.html" class="text-xs text-slate-400 hover:text-[#ff6b00] transition-colors">Design & Visual</a>
          <a href="/entertainment.html" class="text-xs text-slate-400 hover:text-[#ff6b00] transition-colors">Entertaintment & Media</a>
          <a href="/about.html" class="text-xs text-slate-400 hover:text-[#ff6b00] transition-colors">Meet the Team</a>
          <a href="/contact.html" class="text-xs text-slate-400 hover:text-[#ff6b00] transition-colors">Contact Us</a>
        </div>

        <!-- Admin Access -->
        <div class="flex flex-col gap-3">
          <span class="text-white font-bold text-xs tracking-wider uppercase">Portal Internal</span>
          <a href="/admin/login.html" class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff6b00] hover:text-[#ff8e3d] transition-colors">
            <span>Admin Management</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
          <p class="text-xs text-slate-400 leading-relaxed mt-1">
            Dashboard manajemen terpadu untuk mengelola proyek, stack teknologi, anggota tim, dan pesan masuk.
          </p>
        </div>
      </div>
    </footer>
  `;
}

export function renderAdminSidebar(activeKey = 'dashboard') {
  const container = document.getElementById('admin-sidebar-container');
  if (!container) return;

  const user = JSON.parse(localStorage.getItem('nahnu_admin_user') || '{"name":"Admin","email":"admin@nahnu.id"}');

  const menu = [
    { name: 'Dashboard', href: '/admin/dashboard.html', key: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Projects', href: '/admin/projects.html', key: 'projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Categories', href: '/admin/categories.html', key: 'categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { name: 'Technologies', href: '/admin/technologies.html', key: 'technologies', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { name: 'Team Members', href: '/admin/team-members.html', key: 'team', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Messages', href: '/admin/messages.html', key: 'messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Profil Admin', href: '/admin/profile.html', key: 'profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  container.innerHTML = `
    <aside class="w-64 bg-[#12141c] border-r border-white/[0.08] flex flex-col justify-between h-screen fixed top-0 left-0 z-30 transition-all shadow-xl text-slate-300">
      <!-- Top Brand -->
      <div class="p-5 border-b border-white/[0.08] flex items-center justify-between">
        <a href="/admin/dashboard.html" class="flex items-center">
          ${renderBrandLogo('sm', false)}
        </a>
      </div>

      <!-- Navigation Links -->
      <div class="px-3 py-4 flex-1 overflow-y-auto space-y-1">
        ${menu.map(item => `
          <a href="${item.href}" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeKey === item.key
              ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
          }">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path>
            </svg>
            <span>${item.name}</span>
          </a>
        `).join('')}

        <div class="pt-4 mt-4 border-t border-white/[0.06]">
          <a href="/index.html" target="_blank" class="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-[#ff6b00] hover:bg-white/[0.04] transition-all">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              Lihat Website
            </span>
            <span class="text-[10px] bg-[#1e2230] px-1.5 py-0.5 rounded text-amber-400 border border-amber-400/20 font-bold">Live</span>
          </a>
        </div>
      </div>

      <!-- User Info & Logout -->
      <div class="p-4 border-t border-white/[0.08] bg-[#0e1017]">
        <div class="flex items-center justify-between">
          <a href="/admin/profile.html" title="Edit Profil Admin" class="flex items-center gap-2.5 overflow-hidden group hover:opacity-85 transition-opacity">
            <div class="w-8 h-8 rounded-full bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/30 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#ff6b00] group-hover:text-white transition-colors">
              ${(user.name || 'A')[0].toUpperCase()}
            </div>
            <div class="truncate">
              <div class="text-xs font-bold text-white truncate group-hover:text-[#ff6b00] transition-colors">${user.name || 'Admin'}</div>
              <div class="text-[11px] text-slate-400 truncate font-mono">${user.email || 'admin@nahnu.id'}</div>
            </div>
          </a>
          <button id="admin-logout-btn" title="Logout" class="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  `;

  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await adminLogout();
      } catch (e) {}
      localStorage.removeItem('nahnu_admin_token');
      localStorage.removeItem('nahnu_admin_user');
      showToast('Logout berhasil', 'info');
      setTimeout(() => {
        window.location.href = '/admin/login.html';
      }, 500);
    });
  }
}
