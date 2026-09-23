import { renderPublicNavbar, renderPublicFooter } from './components.js';
import { fetchPublicProjects, fetchPublicCategories } from './api.js';
import { getAssetUrl } from './utils.js';

renderPublicNavbar('website');
renderPublicFooter();

let currentCategory = '';
let currentSearch = '';
let searchDebounceTimeout = null;

async function loadCategories() {
  try {
    const res = await fetchPublicCategories();
    const categories = res.data.data || [];
    const container = document.getElementById('category-filter-container');
    if (!container) return;

    container.innerHTML = `
      <button data-slug="" class="cat-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${
        currentCategory === ''
          ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/30'
          : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] hover:text-white border border-white/[0.06]'
      }">
        Semua
      </button>
      ${categories.map(c => `
        <button data-slug="${c.slug}" class="cat-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          currentCategory === c.slug
            ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/30'
            : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] hover:text-white border border-white/[0.06]'
        }">
          ${c.name}
        </button>
      `).join('')}
    `;

    container.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentCategory = e.currentTarget.getAttribute('data-slug');
        loadCategories();
        loadProjects();
      });
    });
  } catch (err) {
    console.error('Error loading categories:', err);
  }
}

async function loadProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card rounded-2xl overflow-hidden animate-pulse h-80 bg-[#151722]"></div>
    <div class="glass-card rounded-2xl overflow-hidden animate-pulse h-80 bg-[#151722]"></div>
    <div class="glass-card rounded-2xl overflow-hidden animate-pulse h-80 bg-[#151722]"></div>
  `;

  try {
    const params = {};
    if (currentCategory) params.category = currentCategory;
    if (currentSearch) params.search = currentSearch;

    const res = await fetchPublicProjects(params);
    const projects = res.data.data?.data || res.data.data || [];

    if (projects.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center glass-card rounded-2xl p-8 border border-white/[0.08]">
          <div class="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center mx-auto mb-3 text-slate-400 border border-white/10">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 class="text-white font-bold text-base mb-1">Tidak ada project ditemukan</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto mb-5">Coba ubah kata kunci pencarian atau pilih filter kategori yang lain.</p>
          <button id="reset-filters-btn" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ff6b00] hover:bg-[#ff7a18] text-white shadow-lg shadow-[#ff6b00]/25 transition-all">Reset Filter</button>
        </div>
      `;

      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = '';
          currentSearch = '';
          const searchInput = document.getElementById('search-input');
          if (searchInput) searchInput.value = '';
          loadCategories();
          loadProjects();
        });
      }
      return;
    }

    container.innerHTML = projects.map(p => `
      <div class="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/[0.08] hover:border-[#ff6b00]/40">
        <div class="aspect-video bg-[#11131c] relative overflow-hidden border-b border-white/[0.06] flex items-center justify-center">
          ${p.cover ? `
            <img src="${getAssetUrl(p.cover)}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          ` : `
            <div class="text-center p-6">
              <div class="w-12 h-12 rounded-xl bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/25 flex items-center justify-center mx-auto mb-2 text-lg font-bold">
                ${p.title.charAt(0)}
              </div>
              <span class="text-[11px] text-slate-400 uppercase font-mono tracking-wider">${p.category?.name || 'NAHNU Project'}</span>
            </div>
          `}
          <div class="absolute top-3 right-3">
            ${p.category?.slug === 'website-sekali-pakai-lokal' ? `
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 backdrop-blur-md border border-amber-500/30 text-amber-300 shadow-md flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Lokal / Sekali Pakai</span>
              </span>
            ` : `
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ff6b00]/15 backdrop-blur-md border border-[#ff6b00]/30 text-orange-200 shadow-md flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff6b00]"></span>
                <span>Terpublikasi</span>
              </span>
            `}
          </div>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-base text-white mb-2 group-hover:text-[#ff6b00] transition-colors">
              <a href="/project-detail.html?slug=${p.slug}">${p.title}</a>
            </h3>
            <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
              ${p.short_description || ''}
            </p>
          </div>
          <div class="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div class="flex items-center gap-1.5 overflow-hidden">
              ${(p.technologies || []).slice(0, 3).map(t => `
                <span class="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/[0.08] font-medium font-mono">${t.name}</span>
              `).join('')}
            </div>
            <a href="/project-detail.html?slug=${p.slug}" class="text-xs font-bold text-[#ff6b00] hover:text-[#ff8e3d] flex items-center gap-1 group/link">
              <span>Detail</span>
              <svg class="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error fetching projects:', err);
    container.innerHTML = `<div class="col-span-full py-10 text-center text-rose-400">Gagal memuat daftar project.</div>`;
  }
}

const searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(() => {
      currentSearch = e.target.value.trim();
      loadProjects();
    }, 400);
  });
}

loadCategories();
loadProjects();
