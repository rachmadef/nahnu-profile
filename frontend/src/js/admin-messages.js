import { renderAdminSidebar } from './components.js';
import { adminGetMessages, adminGetMessage, adminToggleMessageRead, adminDeleteMessage } from './api.js';
import { requireAdminAuth, showToast, formatDate } from './utils.js';

if (requireAdminAuth()) {
  renderAdminSidebar('messages');
  initMessages();
}

async function initMessages() {
  const tbody = document.getElementById('messages-table-body');
  const modal = document.getElementById('view-message-modal');
  const closeBtn = document.getElementById('close-msg-modal-btn');
  const filterAllBtn = document.getElementById('filter-all-btn');
  const filterUnreadBtn = document.getElementById('filter-unread-btn');

  let filterUnreadOnly = false;

  function closeModal() {
    modal.classList.add('hidden');
  }

  closeBtn?.addEventListener('click', closeModal);

  filterAllBtn?.addEventListener('click', () => {
    filterUnreadOnly = false;
    filterAllBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25 transition-all';
    filterUnreadBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/[0.05] text-slate-300 hover:text-white border border-white/[0.08] transition-all';
    loadData();
  });

  filterUnreadBtn?.addEventListener('click', () => {
    filterUnreadOnly = true;
    filterUnreadBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25 transition-all';
    filterAllBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/[0.05] text-slate-300 hover:text-white border border-white/[0.08] transition-all';
    loadData();
  });

  async function openMessage(id) {
    try {
      const res = await adminGetMessage(id);
      const msg = res.data.data;

      document.getElementById('msg-sender').textContent = msg.name;
      document.getElementById('msg-email').textContent = msg.email;
      document.getElementById('msg-date').textContent = formatDate(msg.created_at);
      document.getElementById('msg-subject').textContent = msg.subject;
      document.getElementById('msg-body').textContent = msg.message;
      document.getElementById('msg-reply-link').href = `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`;

      modal.classList.remove('hidden');
      loadData(); // refresh read status on table
    } catch (err) {
      showToast('Gagal memuat detail pesan.', 'error');
    }
  }

  async function loadData() {
    tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-400">Memuat pesan...</td></tr>`;

    try {
      const params = {};
      if (filterUnreadOnly) params.is_read = false;

      const res = await adminGetMessages(params);
      const list = res.data.data?.data || res.data.data || [];

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-400">Tidak ada pesan masuk.</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(m => `
        <tr class="hover:bg-white/[0.03] transition-colors ${!m.is_read ? 'bg-[#ff6b00]/[0.03] font-medium' : ''}">
          <td class="p-4">
            <div class="flex items-center gap-2.5">
              ${!m.is_read ? `<span class="w-2 h-2 rounded-full bg-[#ff6b00] shrink-0" title="Belum dibaca"></span>` : ''}
              <div>
                <div class="text-xs font-bold text-white">${m.name}</div>
                <div class="text-[11px] text-slate-400 font-mono">${m.email}</div>
              </div>
            </div>
          </td>
          <td class="p-4">
            <div class="text-xs font-bold text-[#ff6b00] mb-0.5">${m.subject}</div>
            <div class="text-[11px] text-slate-400 line-clamp-1 max-w-sm">${m.message}</div>
          </td>
          <td class="p-4 text-[11px] text-slate-400 font-mono whitespace-nowrap">
            ${formatDate(m.created_at)}
          </td>
          <td class="p-4">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${m.is_read ? 'bg-white/[0.04] text-slate-400 border border-white/[0.08]' : 'bg-[#ff6b00]/15 text-orange-200 border border-[#ff6b00]/30'}">
              ${m.is_read ? 'Dibaca' : 'Baru'}
            </span>
          </td>
          <td class="p-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button data-id="${m.id}" class="view-btn px-2.5 py-1 rounded-lg bg-[#ff6b00]/10 text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white text-xs font-bold transition-colors">
                Baca
              </button>
              <button data-id="${m.id}" class="toggle-btn p-1.5 text-slate-400 hover:text-[#ff6b00] rounded-lg hover:bg-white/[0.06] transition-colors" title="Toggle status baca">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </button>
              <button data-id="${m.id}" class="delete-btn p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors" title="Hapus">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          openMessage(id);
        });
      });

      tbody.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          try {
            await adminToggleMessageRead(id);
            loadData();
          } catch (err) {
            showToast('Gagal mengubah status pesan.', 'error');
          }
        });
      });

      tbody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          if (confirm('Hapus pesan ini secara permanen?')) {
            try {
              await adminDeleteMessage(id);
              showToast('Pesan berhasil dihapus.', 'success');
              loadData();
            } catch (err) {
              showToast('Gagal menghapus pesan.', 'error');
            }
          }
        });
      });

    } catch (err) {
      console.error('Error loading messages:', err);
      tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-rose-400">Gagal mengambil inbox pesan.</td></tr>`;
    }
  }

  loadData();
}
