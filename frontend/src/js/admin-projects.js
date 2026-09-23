import { renderAdminSidebar } from './components.js';
import { adminGetProjects, adminDeleteProject, adminGetCategories } from './api.js';
import { requireAdminAuth, showToast, getAssetUrl } from './utils.js';

if (requireAdminAuth()) {
  renderAdminSidebar('projects');
  initProjectsList();
}

async function initProjectsList() {
  const tbody = document.getElementById('projects-table-body');
  const statusFilter = document.getElementById('filter-status');
  const categoryFilter = document.getElementById('filter-category');
  const searchInput = document.getElementById('search-input');

  // Load categories into filter dropdown
  try {
    const catRes = await adminGetCategories();
    const categories = catRes.data.data || [];
    if (categoryFilter) {
      categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        categoryFilter.appendChild(opt);
      });
    }
  } catch (e) {}

  async function loadData() {
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-400">Memuat data project...</td></tr>`;

    try {
      const params = {};
      if (statusFilter && statusFilter.value) params.status = statusFilter.value;
      if (categoryFilter && categoryFilter.value) params.category_id = categoryFilter.value;
      if (searchInput && searchInput.value.trim()) params.search = searchInput.value.trim();

      const res = await adminGetProjects(params);
      const projects = res.data.data?.data || res.data.data || [];

      if (projects.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-400">Tidak ada project yang sesuai kriteria.</td></tr>`;
        return;
      }

      tbody.innerHTML = projects.map(p => `
        <tr class="hover:bg-white/[0.03] transition-colors">
          <td class="p-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-[#11131c] flex items-center justify-center font-bold text-slate-400 overflow-hidden shrink-0 border border-white/[0.08]">
                ${p.cover ? `<img src="${getAssetUrl(p.cover)}" alt="${p.title}" class="w-full h-full object-cover">` : p.title.charAt(0)}
              </div>
              <div class="max-w-xs">
                <div class="font-bold text-white text-xs truncate">${p.title}</div>
                <div class="text-[11px] text-slate-400 font-mono truncate">/${p.slug}</div>
              </div>
            </div>
          </td>
          <td class="p-4">
            <span class="px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.08] text-[11px] font-medium">
              ${p.category?.name || '-'}
            </span>
          </td>
          <td class="p-4">
            <div class="flex flex-wrap gap-1 max-w-[200px]">
              ${(p.technologies || []).slice(0, 3).map(t => `
                <span class="px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08] text-[10px] font-medium font-mono">${t.name}</span>
              `).join('')}
              ${(p.technologies || []).length > 3 ? `<span class="text-[10px] text-slate-400 font-mono">+${p.technologies.length - 3}</span>` : ''}
            </div>
          </td>
          <td class="p-4">
            <div class="flex items-center -space-x-2 overflow-hidden">
              ${(p.team_members || []).map(m => `
                <div class="w-6 h-6 rounded-full bg-[#ff6b00] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-[#12141c] shadow-xs" title="${m.name}">
                  ${m.name.charAt(0)}
                </div>
              `).join('')}
            </div>
          </td>
          <td class="p-4">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${p.status === 'published' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'}">
              ${p.status}
            </span>
          </td>
          <td class="p-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <a href="/project-detail.html?slug=${p.slug}" target="_blank" class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors" title="Lihat di Web">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </a>
              <a href="/admin/project-edit.html?id=${p.id}" class="p-1.5 text-[#ff6b00] hover:text-[#ff8e3d] rounded-lg hover:bg-[#ff6b00]/10 transition-colors" title="Edit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </a>
              <button data-id="${p.id}" data-title="${p.title}" class="delete-btn p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors" title="Hapus">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const title = e.currentTarget.getAttribute('data-title');
          if (confirm(`Apakah Anda yakin ingin menghapus project "${title}"?`)) {
            try {
              await adminDeleteProject(id);
              showToast(`Project "${title}" berhasil dihapus.`, 'success');
              loadData();
            } catch (err) {
              showToast('Gagal menghapus project.', 'error');
            }
          }
        });
      });
    } catch (err) {
      console.error('Error fetching projects:', err);
      tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-rose-400">Gagal mengambil data project.</td></tr>`;
    }
  }

  statusFilter?.addEventListener('change', loadData);
  categoryFilter?.addEventListener('change', loadData);

  let searchTimeout;
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(loadData, 400);
  });

  loadData();
}
