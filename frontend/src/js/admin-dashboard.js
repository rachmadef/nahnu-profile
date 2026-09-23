import { renderAdminSidebar } from './components.js';
import { adminGetDashboard } from './api.js';
import { requireAdminAuth, formatDate, getAssetUrl } from './utils.js';

if (requireAdminAuth()) {
  renderAdminSidebar('dashboard');
  initDashboard();
}

async function initDashboard() {
  const statsContainer = document.getElementById('stats-container');
  const projectsList = document.getElementById('recent-projects-list');
  const messagesList = document.getElementById('recent-messages-list');

  try {
    const res = await adminGetDashboard();
    const { stats, recent_projects, recent_messages } = res.data.data;

    // Render Stats
    if (statsContainer) {
      statsContainer.innerHTML = `
        <!-- Card 1: Projects -->
        <div class="glass-card p-5 rounded-2xl flex items-center justify-between border border-white/[0.08]">
          <div>
            <span class="text-xs font-semibold text-slate-400 block mb-1">Total Project</span>
            <span class="text-2xl font-extrabold text-white">${stats.total_projects}</span>
            <div class="text-[11px] text-slate-400 mt-1 flex gap-2 font-mono">
              <span class="text-emerald-400 font-bold">${stats.published_projects} Live</span>
              <span>•</span>
              <span class="text-amber-400 font-bold">${stats.draft_projects} Draft</span>
            </div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/25 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
        </div>

        <!-- Card 2: Team Members -->
        <div class="glass-card p-5 rounded-2xl flex items-center justify-between border border-white/[0.08]">
          <div>
            <span class="text-xs font-semibold text-slate-400 block mb-1">Developer Tim</span>
            <span class="text-2xl font-extrabold text-white">${stats.total_team_members}</span>
            <div class="text-[11px] text-[#ff6b00] mt-1 font-bold font-mono">Core Talents</div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-white/[0.04] text-slate-300 border border-white/10 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
        </div>

        <!-- Card 3: Technologies & Categories -->
        <div class="glass-card p-5 rounded-2xl flex items-center justify-between border border-white/[0.08]">
          <div>
            <span class="text-xs font-semibold text-slate-400 block mb-1">Stack & Kategori</span>
            <span class="text-2xl font-extrabold text-white">${stats.total_technologies}</span>
            <div class="text-[11px] text-slate-400 mt-1 font-mono">${stats.total_categories} Kategori Terdaftar</div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          </div>
        </div>

        <!-- Card 4: Messages -->
        <div class="glass-card p-5 rounded-2xl flex items-center justify-between border border-white/[0.08]">
          <div>
            <span class="text-xs font-semibold text-slate-400 block mb-1">Pesan Masuk</span>
            <span class="text-2xl font-extrabold text-white">${stats.total_messages}</span>
            <div class="text-[11px] mt-1 font-mono ${stats.unread_messages > 0 ? 'text-[#ff6b00] font-bold' : 'text-slate-400'}">
              ${stats.unread_messages} Belum Dibaca
            </div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/25 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
        </div>
      `;
    }

    // Render Recent Projects
    if (projectsList) {
      if (recent_projects.length === 0) {
        projectsList.innerHTML = `<div class="text-xs text-slate-400 py-6 text-center">Belum ada project yang dibuat.</div>`;
      } else {
        projectsList.innerHTML = recent_projects.map(p => `
          <div class="p-3 rounded-xl bg-[#11131c] border border-white/[0.06] flex items-center justify-between gap-4 hover:border-white/10 transition-colors">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="w-10 h-10 rounded-lg bg-[#151722] border border-white/[0.08] flex items-center justify-center font-bold text-xs text-slate-300 overflow-hidden shrink-0">
                ${p.cover ? `<img src="${getAssetUrl(p.cover)}" class="w-full h-full object-cover">` : p.title.charAt(0)}
              </div>
              <div class="truncate">
                <div class="text-xs font-bold text-white truncate">${p.title}</div>
                <div class="text-[11px] text-slate-400 truncate">${p.category?.name || 'Uncategorized'}</div>
              </div>
            </div>
            <div class="flex items-center gap-2.5 shrink-0">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono ${p.status === 'published' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'}">
                ${p.status}
              </span>
              <a href="/admin/project-edit.html?id=${p.id}" class="p-1 text-slate-400 hover:text-[#ff6b00] rounded hover:bg-white/[0.06] transition-colors" title="Edit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </a>
            </div>
          </div>
        `).join('');
      }
    }

    // Render Recent Messages
    if (messagesList) {
      if (recent_messages.length === 0) {
        messagesList.innerHTML = `<div class="text-xs text-slate-400 py-6 text-center">Inbox masih kosong.</div>`;
      } else {
        messagesList.innerHTML = recent_messages.map(m => `
          <div class="p-3 rounded-xl bg-[#11131c] border border-white/[0.06] flex items-start justify-between gap-3 hover:border-white/10 transition-colors">
            <div class="overflow-hidden">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold text-white truncate">${m.name}</span>
                ${!m.is_read ? `<span class="w-2 h-2 rounded-full bg-[#ff6b00] shrink-0" title="Belum dibaca"></span>` : ''}
              </div>
              <div class="text-[11px] text-[#ff6b00] font-semibold truncate mb-0.5">${m.subject}</div>
              <p class="text-[11px] text-slate-400 line-clamp-1">${m.message}</p>
            </div>
            <span class="text-[10px] text-slate-500 shrink-0 font-mono">${formatDate(m.created_at)}</span>
          </div>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Error loading dashboard data:', err);
  }
}
