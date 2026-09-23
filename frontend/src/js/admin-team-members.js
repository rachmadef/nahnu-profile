import { renderAdminSidebar } from './components.js';
import { adminGetTeamMembers, adminCreateTeamMember, adminUpdateTeamMember, adminDeleteTeamMember } from './api.js';
import { requireAdminAuth, showToast, slugify, getAssetUrl } from './utils.js';

if (requireAdminAuth()) {
  renderAdminSidebar('team');
  initTeamMembers();
}

async function initTeamMembers() {
  const container = document.getElementById('team-cards-grid');
  const modal = document.getElementById('member-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('member-form');
  const idInput = document.getElementById('member-id');
  const nameInput = document.getElementById('m-name');
  const slugInput = document.getElementById('m-slug');
  const roleInput = document.getElementById('m-role');
  const bioInput = document.getElementById('m-bio');
  const skillsInput = document.getElementById('m-skills');
  const githubInput = document.getElementById('m-github');
  const linkedinInput = document.getElementById('m-linkedin');
  const instaInput = document.getElementById('m-instagram');
  const photoInput = document.getElementById('m-photo');
  const addBtn = document.getElementById('add-member-btn');
  const closeBtn = document.getElementById('close-modal-btn');

  function openModal(isEdit = false, item = null) {
    modal.classList.remove('hidden');
    if (isEdit && item) {
      modalTitle.textContent = 'Edit Data Developer';
      idInput.value = item.id;
      nameInput.value = item.name;
      slugInput.value = item.slug;
      roleInput.value = item.role;
      bioInput.value = item.bio || '';
      skillsInput.value = (item.skills || []).join(', ');
      githubInput.value = item.github_url || '';
      linkedinInput.value = item.linkedin_url || '';
      instaInput.value = item.instagram_url || '';
    } else {
      modalTitle.textContent = 'Tambah Developer Baru';
      idInput.value = '';
      nameInput.value = '';
      slugInput.value = '';
      roleInput.value = '';
      bioInput.value = '';
      skillsInput.value = '';
      githubInput.value = '';
      linkedinInput.value = '';
      instaInput.value = '';
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
    container.innerHTML = `
      <div class="glass-card p-6 rounded-2xl animate-pulse h-64 bg-slate-100"></div>
      <div class="glass-card p-6 rounded-2xl animate-pulse h-64 bg-slate-100"></div>
      <div class="glass-card p-6 rounded-2xl animate-pulse h-64 bg-slate-100"></div>
    `;

    try {
      const res = await adminGetTeamMembers();
      const list = res.data.data || [];

      if (list.length === 0) {
        container.innerHTML = `<div class="col-span-3 text-center py-8 text-slate-400">Belum ada anggota tim terdaftar.</div>`;
        return;
      }

      container.innerHTML = list.map(m => `
        <div class="glass-card p-6 rounded-3xl flex flex-col justify-between group border border-white/[0.08] hover:border-[#ff6b00]/40">
          <div>
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="w-20 h-20 rounded-2xl bg-[#11131c] text-[#ff6b00] border border-white/[0.08] flex items-center justify-center font-bold text-2xl overflow-hidden shrink-0 shadow-md">
                ${m.photo ? `<img src="${getAssetUrl(m.photo)}" class="w-full h-full object-cover">` : m.name.charAt(0)}
              </div>
              <div class="flex items-center gap-1">
                <button data-item='${JSON.stringify(m)}' class="edit-btn p-1.5 text-[#ff6b00] hover:text-[#ff8e3d] rounded-lg hover:bg-[#ff6b00]/10 transition-colors" title="Edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button data-id="${m.id}" data-name="${m.name}" class="delete-btn p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors" title="Hapus">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>

            <h3 class="font-bold text-white text-base">${m.name}</h3>
            <p class="text-xs font-semibold text-[#ff6b00] mb-2 font-mono">${m.role}</p>
            <p class="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">${m.bio || '-'}</p>
          </div>

          <div>
            <div class="pt-3 border-t border-white/[0.06] mb-3 flex flex-wrap gap-1">
              ${(m.skills || []).slice(0, 4).map(s => `
                <span class="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300 font-mono font-medium">${s}</span>
              `).join('')}
            </div>
            <div class="text-[11px] text-slate-500 font-mono">
              ${m.projects_count || 0} project terkait
            </div>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const item = JSON.parse(e.currentTarget.getAttribute('data-item'));
          openModal(true, item);
        });
      });

      container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const name = e.currentTarget.getAttribute('data-name');
          if (confirm(`Hapus data developer "${name}"?`)) {
            try {
              await adminDeleteTeamMember(id);
              showToast(`Data developer "${name}" berhasil dihapus.`, 'success');
              loadData();
            } catch (err) {
              showToast('Gagal menghapus data developer.', 'error');
            }
          }
        });
      });

    } catch (err) {
      console.error('Error loading team members:', err);
      container.innerHTML = `<div class="col-span-3 text-center py-8 text-rose-500">Gagal mengambil data developer.</div>`;
    }
  }

  function normalizeUrl(val) {
    if (!val) return '';
    val = val.trim();
    if (val === 'http://' || val === 'https://') return '';
    if (!/^https?:\/\//i.test(val)) return 'https://' + val;
    return val;
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = idInput.value;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'SIMPAN';

    const formData = new FormData();
    formData.append('name', nameInput.value.trim());
    formData.append('slug', slugInput.value.trim());
    formData.append('role', roleInput.value.trim());
    formData.append('bio', bioInput.value.trim());
    formData.append('skills', skillsInput.value.trim());
    formData.append('github_url', normalizeUrl(githubInput.value));
    formData.append('linkedin_url', normalizeUrl(linkedinInput.value));
    formData.append('instagram_url', normalizeUrl(instaInput.value));

    if (photoInput.files[0]) {
      formData.append('photo', photoInput.files[0]);
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Menyimpan...</span>';
    }

    try {
      if (id) {
        formData.append('_method', 'PUT');
        await adminUpdateTeamMember(id, formData);
        showToast('Data developer berhasil diperbarui.', 'success');
      } else {
        await adminCreateTeamMember(formData);
        showToast('Developer baru berhasil ditambahkan.', 'success');
      }
      closeModal();
      loadData();
    } catch (err) {
      console.error('Error saving team member:', err.response?.data);
      const errors = err.response?.data?.errors;
      if (errors) {
        const errorList = Object.values(errors).flat().join('<br>');
        showToast(errorList, 'error', 5000);
      } else {
        const msg = err.response?.data?.message || 'Gagal menyimpan data developer.';
        showToast(msg, 'error');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });

  loadData();
}
