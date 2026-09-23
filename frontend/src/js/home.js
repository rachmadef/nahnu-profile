import { renderPublicNavbar, renderPublicFooter } from './components.js';
import { fetchPublicTeamMembers, fetchPublicProjects, fetchPublicTechnologies } from './api.js';
import { getAssetUrl } from './utils.js';

renderPublicNavbar('home');
renderPublicFooter();

async function initHome() {
  // Load Team Members
  try {
    const res = await fetchPublicTeamMembers();
    const members = res.data.data || [];

    // Inject avatars into Hero social proof cluster
    const avatarCluster = document.getElementById('hero-avatar-cluster');
    if (avatarCluster && members.length > 0) {
      avatarCluster.innerHTML = members.slice(0, 3).map(m => m.photo ? `
        <img src="${getAssetUrl(m.photo)}" alt="${m.name}" title="${m.name} (${m.role})" class="inline-block h-6 w-6 rounded-full ring-2 ring-[#0d0f14] object-cover">
      ` : `
        <div class="inline-block h-6 w-6 rounded-full ring-2 ring-[#0d0f14] bg-[#ff6b00]/20 text-[#ff6b00] text-[10px] font-bold text-center leading-6" title="${m.name}">${m.name.charAt(0)}</div>
      `).join('');
    }

    const container = document.getElementById('home-team-grid');
    if (container) {
      if (members.length > 0) {
        container.innerHTML = members.map(m => `
          <div class="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5 border border-white/[0.08] hover:border-[#ff6b00]/40">
            <div>
              <!-- Large Photo / Avatar Area -->
              <div class="w-full h-64 bg-[#11131c] relative overflow-hidden flex items-center justify-center border-b border-white/[0.06]">
                ${m.photo ? `
                  <img src="${getAssetUrl(m.photo)}" alt="${m.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                ` : `
                  <div class="w-20 h-20 rounded-2xl bg-[#ff6b00]/10 border border-[#ff6b00]/25 flex items-center justify-center font-bold text-3xl text-[#ff6b00]">
                    ${m.name.charAt(0)}
                  </div>
                `}
                <div class="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#151722]/90 backdrop-blur-md border border-white/10 text-slate-300">
                    Active Specialist
                  </span>
                </div>
              </div>

              <div class="p-6">
                <h3 class="font-bold text-lg text-white group-hover:text-[#ff6b00] transition-colors leading-snug">${m.name}</h3>
                <p class="text-xs font-semibold text-[#ff6b00] mt-0.5 mb-3 font-mono">${m.role}</p>

                <p class="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  ${m.bio || 'Developer handal di balik arsitektur dan ekosistem aplikasi NAHNU.'}
                </p>
              </div>
            </div>

            <div class="px-6 pb-6 pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
              ${(m.skills || []).slice(0, 4).map(skill => `
                <span class="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.08] font-mono font-medium">${skill}</span>
              `).join('')}
            </div>
          </div>
        `).join('');
      } else {
        container.innerHTML = `<div class="col-span-3 text-center py-10 text-slate-400 text-xs">Profil developer sedang dipersiapkan.</div>`;
      }
    }
  } catch (err) {
    console.error('Error fetching team members:', err);
  }

  // Load Featured Projects
  try {
    const res = await fetchPublicProjects({ per_page: 3 });
    const projects = res.data.data?.data || res.data.data || [];
    const container = document.getElementById('home-projects-grid');
    if (container) {
      if (projects.length === 0) {
        container.innerHTML = `<div class="col-span-3 text-center py-12 text-slate-400 text-xs">Belum ada website yang dipublikasikan.</div>`;
      } else {
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
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 backdrop-blur-md border border-amber-500/30 text-amber-300 flex items-center gap-1.5 shadow-md">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Lokal / Sekali Pakai</span>
                  </span>
                ` : `
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ff6b00]/15 backdrop-blur-md border border-[#ff6b00]/30 text-orange-200 flex items-center gap-1.5 shadow-md">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#ff6b00]"></span>
                    <span>Terpublikasi</span>
                  </span>
                `}
              </div>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-base text-white mb-2 group-hover:text-[#ff6b00] transition-colors">
                  <a href="/project-detail.html?slug=${p.slug}">${p.title}</a>
                </h4>
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
      }
    }
  } catch (err) {
    console.error('Error fetching projects:', err);
  }

  // Load Technologies
  try {
    const res = await fetchPublicTechnologies();
    const techs = res.data.data || [];
    const container = document.getElementById('home-tech-list');
    if (container && techs.length > 0) {
      container.innerHTML = techs.map(t => `
        <div class="glass-card px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-slate-300 hover:text-white border border-white/[0.08] hover:border-[#ff6b00]/40 transition-all hover:scale-105 cursor-default shadow-md">
          ${t.icon ? `<i class="${t.icon} text-base text-[#ff6b00]"></i>` : `<span class="w-2 h-2 rounded-full bg-[#ff6b00]"></span>`}
          <span>${t.name}</span>
          ${t.projects_count > 0 ? `<span class="text-[10px] text-[#ff7a18] bg-[#ff6b00]/10 border border-[#ff6b00]/20 px-1.5 py-0.2 rounded-full font-mono font-bold">${t.projects_count}</span>` : ''}
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error fetching technologies:', err);
  }
}

initHome();
