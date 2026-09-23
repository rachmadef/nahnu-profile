import { renderAdminSidebar } from './components.js';
import { adminGetTechnologies, adminCreateTechnology, adminUpdateTechnology, adminDeleteTechnology } from './api.js';
import { requireAdminAuth, showToast, slugify } from './utils.js';

if (requireAdminAuth()) {
  renderAdminSidebar('technologies');
  initTechnologies();
}

async function initTechnologies() {
  const tbody = document.getElementById('tech-table-body');
  const modal = document.getElementById('tech-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('tech-form');
  const idInput = document.getElementById('tech-id');
  const nameInput = document.getElementById('tech-name');
  const slugInput = document.getElementById('tech-slug');
  const iconInput = document.getElementById('tech-icon');
  const addBtn = document.getElementById('add-tech-btn');
  const closeBtn = document.getElementById('close-modal-btn');

  function openModal(isEdit = false, item = null) {
    modal.classList.remove('hidden');
    if (isEdit && item) {
      modalTitle.textContent = 'Edit Teknologi';
      idInput.value = item.id;
      nameInput.value = item.name;
      slugInput.value = item.slug;
      iconInput.value = item.icon || '';
    } else {
      modalTitle.textContent = 'Tambah Teknologi Baru';
      idInput.value = '';
      nameInput.value = '';
      slugInput.value = '';
      iconInput.value = '';
    }
  }

  function closeModal() {
    modal.classList.add('hidden');
    form.reset();
  }

  addBtn?.addEventListener('click', () => openModal(false));
  closeBtn?.addEventListener('click', closeModal);

  nameInput?.addEventListener('input', () => {
    if (!idInput.value) {
      slugInput.value = slugify(nameInput.value);
    }
  });

  async function loadData() {
    tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-400">Memuat data teknologi...</td></tr>`;
    try {
      const res = await adminGetTechnologies();
      const list = res.data.data || [];

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-400">Belum ada teknologi terdaftar.</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(t => `
        <tr class="hover:bg-white/[0.03] transition-colors">
          <td class="p-4">
            <div class="w-8 h-8 rounded-lg bg-[#11131c] border border-white/[0.08] flex items-center justify-center text-base text-[#ff6b00]">
              ${t.icon ? `<i class="${t.icon}"></i>` : `<span class="w-2 h-2 rounded-full bg-[#ff6b00]"></span>`}
            </div>
          </td>
          <td class="p-4 font-bold text-white">${t.name}</td>
          <td class="p-4 font-mono text-slate-400 text-xs">${t.slug}</td>
          <td class="p-4">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/25">
              ${t.projects_count || 0} project
            </span>
          </td>
          <td class="p-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button data-item='${JSON.stringify(t)}' class="edit-btn p-1.5 text-[#ff6b00] hover:text-[#ff8e3d] rounded-lg hover:bg-[#ff6b00]/10 transition-colors" title="Edit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </button>
              <button data-id="${t.id}" data-name="${t.name}" class="delete-btn p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors" title="Hapus">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const item = JSON.parse(e.currentTarget.getAttribute('data-item'));
          openModal(true, item);
        });
      });

      tbody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const name = e.currentTarget.getAttribute('data-name');
          if (confirm(`Hapus teknologi "${name}"?`)) {
            try {
              await adminDeleteTechnology(id);
              showToast(`Teknologi "${name}" berhasil dihapus.`, 'success');
              loadData();
            } catch (err) {
              showToast('Gagal menghapus teknologi.', 'error');
            }
          }
        });
      });
    } catch (err) {
      console.error('Error fetching technologies:', err);
      tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-rose-400">Gagal mengambil data teknologi.</td></tr>`;
    }
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = idInput.value;
    const name = nameInput.value.trim();
    const slug = slugInput.value.trim();
    const icon = iconInput.value.trim();

    try {
      if (id) {
        await adminUpdateTechnology(id, { name, slug, icon });
        showToast('Teknologi berhasil diperbarui.', 'success');
      } else {
        await adminCreateTechnology({ name, slug, icon });
        showToast('Teknologi berhasil ditambahkan.', 'success');
      }
      closeModal();
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan teknologi.', 'error');
    }
  });

  loadData();
}
