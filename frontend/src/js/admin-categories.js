import { renderAdminSidebar } from './components.js';
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from './api.js';
import { requireAdminAuth, showToast, slugify } from './utils.js';

if (requireAdminAuth()) {
  renderAdminSidebar('categories');
  initCategories();
}

async function initCategories() {
  const tbody = document.getElementById('categories-table-body');
  const modal = document.getElementById('category-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('category-form');
  const idInput = document.getElementById('category-id');
  const nameInput = document.getElementById('cat-name');
  const slugInput = document.getElementById('cat-slug');
  const addBtn = document.getElementById('add-category-btn');
  const closeBtn = document.getElementById('close-modal-btn');

  function openModal(isEdit = false, item = null) {
    modal.classList.remove('hidden');
    if (isEdit && item) {
      modalTitle.textContent = 'Edit Kategori';
      idInput.value = item.id;
      nameInput.value = item.name;
      slugInput.value = item.slug;
    } else {
      modalTitle.textContent = 'Tambah Kategori Baru';
      idInput.value = '';
      nameInput.value = '';
      slugInput.value = '';
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
    tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-slate-400">Memuat kategori...</td></tr>`;
    try {
      const res = await adminGetCategories();
      const categories = res.data.data || [];

      if (categories.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-slate-400">Belum ada kategori terdaftar.</td></tr>`;
        return;
      }

      tbody.innerHTML = categories.map(c => `
        <tr class="hover:bg-white/[0.03] transition-colors">
          <td class="p-4 font-bold text-white">${c.name}</td>
          <td class="p-4 font-mono text-slate-400 text-xs">${c.slug}</td>
          <td class="p-4">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/25">
              ${c.projects_count || 0} project
            </span>
          </td>
          <td class="p-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button data-item='${JSON.stringify(c)}' class="edit-btn p-1.5 text-[#ff6b00] hover:text-[#ff8e3d] rounded-lg hover:bg-[#ff6b00]/10 transition-colors" title="Edit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </button>
              <button data-id="${c.id}" data-name="${c.name}" class="delete-btn p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors" title="Hapus">
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
          if (confirm(`Hapus kategori "${name}"?`)) {
            try {
              await adminDeleteCategory(id);
              showToast(`Kategori "${name}" berhasil dihapus.`, 'success');
              loadData();
            } catch (err) {
              showToast('Gagal menghapus kategori.', 'error');
            }
          }
        });
      });
    } catch (err) {
      console.error('Error fetching categories:', err);
      tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-rose-400">Gagal mengambil data kategori.</td></tr>`;
    }
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = idInput.value;
    const name = nameInput.value.trim();
    const slug = slugInput.value.trim();

    try {
      if (id) {
        await adminUpdateCategory(id, { name, slug });
        showToast('Kategori berhasil diperbarui.', 'success');
      } else {
        await adminCreateCategory({ name, slug });
        showToast('Kategori berhasil ditambahkan.', 'success');
      }
      closeModal();
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan kategori.', 'error');
    }
  });

  loadData();
}
