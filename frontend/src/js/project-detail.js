import { renderPublicNavbar, renderPublicFooter } from './components.js';
import { fetchPublicProjectDetail } from './api.js';
import { formatDate, getAssetUrl } from './utils.js';

renderPublicNavbar('website');
renderPublicFooter();

async function initProjectDetail() {
  const container = document.getElementById('project-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    container.innerHTML = `
      <div class="glass-card p-12 text-center rounded-3xl border border-white/[0.08]">
        <h2 class="text-xl font-bold text-white mb-2">Project Tidak Ditemukan</h2>
        <p class="text-xs text-slate-400 mb-6">Parameter slug project tidak ditemukan pada URL.</p>
        <a href="/projects.html" class="px-5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a18] text-white text-xs font-bold shadow-lg shadow-[#ff6b00]/25 transition-all">Kembali ke Website</a>
      </div>
    `;
    return;
  }

  try {
    const res = await fetchPublicProjectDetail(slug);
    const p = res.data.data;

    if (!p) throw new Error('Data null');

    document.title = `${p.title} — NAHNU`;

    const isLocal = p.category?.slug === 'website-sekali-pakai-lokal' || (p.demo_url && p.demo_url.includes('localhost'));

    container.innerHTML = `
      <div>
        <!-- Top Breadcrumb & Tags -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <a href="/projects.html" class="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#ff6b00] transition-colors group">
            <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            <span>Kembali ke Galeri Website</span>
          </a>

          <div class="flex flex-wrap items-center gap-2.5">
            ${isLocal ? `
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-md">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>${p.category?.name || 'Sistem Lokal / Sekali Pakai'}</span>
              </span>
            ` : `
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-[#ff6b00]/15 text-orange-200 border border-[#ff6b00]/30 flex items-center gap-1.5 shadow-md">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff6b00]"></span>
                <span>${p.category?.name || 'Website Terpublikasi'}</span>
              </span>
            `}

            ${p.published_at ? `
              <span class="text-xs text-slate-400 flex items-center gap-1.5 font-medium font-mono px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                ${formatDate(p.published_at)}
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Header Section -->
        <div class="space-y-4 mb-8">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
            ${p.title}
          </h1>

          ${p.short_description ? `
            <p class="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl font-normal">
              ${p.short_description}
            </p>
          ` : ''}
        </div>

        <!-- Action Buttons Strip -->
        <div class="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-white/[0.08]">
          ${isLocal ? `
            <div class="px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-200 border border-amber-500/25 text-xs font-bold flex items-center gap-3 shadow-md">
              <span class="w-2.5 h-2.5 rounded-full bg-[#ff6b00] animate-pulse shrink-0"></span>
              <div>
                <span class="block text-[10px] uppercase tracking-wider text-amber-400 font-mono font-extrabold">Environment Sistem</span>
                <span class="font-mono text-xs text-slate-200">${p.demo_url || 'Berjalan di Lingkungan Lokal / Intranet'}</span>
              </div>
            </div>
          ` : (p.demo_url ? `
            <a href="${p.demo_url}" target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff7a18] hover:from-[#ff7a18] hover:to-[#ff8a2e] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-[#ff6b00]/25 hover:scale-[1.02] active:scale-[0.98]">
              <span>Buka Website Publik</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          ` : '')}

          ${p.repository_url ? `
            <a href="${p.repository_url}" target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/10 transition-all shadow-md hover:scale-[1.02]">
              <i class="devicon-github-original text-base"></i>
              <span>Source Repository</span>
            </a>
          ` : ''}
        </div>

        <!-- Browser Mockup Preview Frame -->
        ${p.cover ? `
          <div class="rounded-3xl overflow-hidden bg-[#11131c] border border-white/[0.1] shadow-2xl mb-12">
            <!-- Faux Browser Header Bar -->
            <div class="px-5 py-3.5 bg-[#151722] border-b border-white/[0.08] flex items-center justify-between gap-4">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-[#ef4444] inline-block opacity-80"></span>
                <span class="w-3 h-3 rounded-full bg-[#f59e0b] inline-block opacity-80"></span>
                <span class="w-3 h-3 rounded-full bg-[#10b981] inline-block opacity-80"></span>
              </div>
              <div class="flex-1 max-w-md mx-auto hidden sm:flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#0d0f14] border border-white/[0.08] text-[11px] font-mono text-slate-400">
                <svg class="w-3 h-3 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <span class="truncate">${p.demo_url || (p.slug + '.nahnu.id')}</span>
              </div>
              <div class="w-12"></div>
            </div>
            <!-- Image Showcase (No awkward crop) -->
            <div class="bg-[#090b10] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
              <img src="${getAssetUrl(p.cover)}" alt="${p.title}" class="w-full max-h-[580px] object-contain rounded-2xl shadow-xl">
            </div>
          </div>
        ` : ''}

        <!-- Two Column Main Layout -->
        <div class="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
          <!-- Left Column: Rich Project Description -->
          <div class="w-full lg:flex-1 min-w-0 space-y-6">
            <div class="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
              <span class="w-2.5 h-2.5 rounded-full bg-[#ff6b00]"></span>
              <h2 class="text-xl font-bold text-white tracking-tight">Gambaran & Spesifikasi Proyek</h2>
            </div>
            <div class="quill-content text-slate-300 text-sm sm:text-base leading-relaxed break-words">
              ${p.description || '<p class="text-slate-400">Belum ada deskripsi rinci untuk project ini.</p>'}
            </div>
          </div>

          <!-- Right Column: Sidebar (Sticky on desktop) -->
          <div class="w-full lg:w-80 xl:w-96 shrink-0 space-y-6 lg:sticky lg:top-28">
            <!-- Tech Stack -->
            <div class="glass-card p-6 rounded-2xl border border-white/[0.08]">
              <span class="text-[11px] font-mono uppercase font-bold tracking-wider text-[#ff6b00] block mb-4">Teknologi Digunakan</span>
              <div class="flex flex-wrap gap-2">
                ${(p.technologies && p.technologies.length > 0) ? p.technologies.map(t => `
                  <div class="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center gap-2 text-xs font-semibold text-slate-300 font-mono">
                    ${t.icon ? `<i class="${t.icon} text-sm text-[#ff6b00]"></i>` : `<span class="w-1.5 h-1.5 rounded-full bg-[#ff6b00]"></span>`}
                    <span>${t.name}</span>
                  </div>
                `).join('') : '<span class="text-xs text-slate-400">-</span>'}
              </div>
            </div>

            <!-- Team Members Involved -->
            <div class="glass-card p-6 rounded-2xl border border-white/[0.08]">
              <span class="text-[11px] font-mono uppercase font-bold tracking-wider text-[#ff6b00] block mb-4">Developer Terlibat</span>
              <div class="space-y-3.5">
                ${(p.team_members && p.team_members.length > 0) ? p.team_members.map(m => `
                  <div class="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div class="w-11 h-11 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/25 flex items-center justify-center font-bold text-sm text-[#ff6b00] overflow-hidden shrink-0 shadow-md">
                      ${m.photo ? `<img src="${getAssetUrl(m.photo)}" alt="${m.name}" class="w-full h-full object-cover">` : m.name.charAt(0)}
                    </div>
                    <div class="truncate">
                      <h4 class="text-sm font-bold text-white truncate">${m.name}</h4>
                      <p class="text-[11px] font-semibold text-[#ff6b00] font-mono truncate">${m.role}</p>
                    </div>
                  </div>
                `).join('') : '<span class="text-xs text-slate-400">Tim NAHNU</span>'}
              </div>
            </div>

            <!-- Metadata Info Card -->
            <div class="glass-card p-6 rounded-2xl border border-white/[0.08] text-xs space-y-3 font-mono">
              <span class="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Spesifikasi Detail</span>
              <div class="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <span class="text-slate-400">Kategori</span>
                <span class="text-white font-medium">${p.category?.name || 'General'}</span>
              </div>
              <div class="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <span class="text-slate-400">Status</span>
                <span class="text-emerald-400 font-bold uppercase">${p.status || 'Published'}</span>
              </div>
              ${p.published_at ? `
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">Tanggal Rilis</span>
                  <span class="text-slate-300 font-medium">${formatDate(p.published_at)}</span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error('Error fetching project detail:', err);
    container.innerHTML = `
      <div class="glass-card p-12 text-center rounded-3xl border border-white/[0.08]">
        <h2 class="text-xl font-bold text-white mb-2">Project Tidak Ditemukan</h2>
        <p class="text-xs text-slate-400 mb-6">Proyek yang Anda cari mungkin telah diarsipkan atau belum dipublikasikan.</p>
        <a href="/projects.html" class="px-5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a18] text-white text-xs font-bold shadow-lg shadow-[#ff6b00]/25 transition-all">Kembali ke Website</a>
      </div>
    `;
  }
}

initProjectDetail();
