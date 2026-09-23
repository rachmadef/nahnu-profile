import { renderPublicNavbar, renderPublicFooter } from './components.js';
import { fetchPublicTeamMembers } from './api.js';
import { getAssetUrl } from './utils.js';

renderPublicNavbar('about');
renderPublicFooter();

async function initAbout() {
  const container = document.getElementById('about-team-grid');
  if (!container) return;

  try {
    const res = await fetchPublicTeamMembers();
    const members = res.data.data || [];

    if (members.length === 0) {
      container.innerHTML = `<div class="col-span-3 text-center py-10 text-slate-400 text-xs">Data profil tim sedang diperbarui.</div>`;
      return;
    }

    container.innerHTML = members.map(m => `
      <div class="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5 border border-white/[0.08] hover:border-[#ff6b00]/40">
        <div>
          <!-- Large Photo / Avatar Banner -->
          <div class="w-full h-64 sm:h-72 bg-[#11131c] relative overflow-hidden flex items-center justify-center border-b border-white/[0.06]">
            ${m.photo ? `
              <img src="${getAssetUrl(m.photo)}" alt="${m.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            ` : `
              <div class="w-24 h-24 rounded-3xl bg-[#ff6b00]/10 border border-[#ff6b00]/25 flex items-center justify-center font-bold text-4xl text-[#ff6b00]">
                ${m.name.charAt(0)}
              </div>
            `}
            <div class="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
          </div>

          <div class="p-6 sm:p-7">
            <h3 class="text-xl font-bold text-white mb-1 group-hover:text-[#ff6b00] transition-colors leading-snug">${m.name}</h3>
            <p class="text-xs font-semibold text-[#ff6b00] mb-3 font-mono">${m.role}</p>

            <p class="text-xs text-slate-400 leading-relaxed mb-6">
              ${m.bio || 'Developer profesional yang fokus pada rekayasa solusi perangkat lunak mutakhir.'}
            </p>

            <!-- Skills Tagger -->
            <div class="pt-4 border-t border-white/[0.06]">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2.5 font-mono">Keahlian Utama</span>
              <div class="flex flex-wrap gap-1.5">
                ${(m.skills || []).map(skill => `
                  <span class="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 font-mono font-medium">${skill}</span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media Icons -->
        <div class="px-6 sm:px-7 pb-6 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-slate-400">
          ${m.github_url ? `
            <a href="${m.github_url}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-colors" title="GitHub">
              <i class="devicon-github-original text-lg"></i>
            </a>
          ` : ''}
          ${m.linkedin_url ? `
            <a href="${m.linkedin_url}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-xl text-slate-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/10 border border-transparent hover:border-[#ff6b00]/20 transition-colors" title="LinkedIn">
              <i class="devicon-linkedin-plain text-lg"></i>
            </a>
          ` : ''}
          ${m.instagram_url ? `
            <a href="${m.instagram_url}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors" title="Instagram">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          ` : ''}
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error fetching team members:', err);
    container.innerHTML = `<div class="col-span-3 text-center py-10 text-rose-400">Gagal memuat data developer tim.</div>`;
  }
}

initAbout();
