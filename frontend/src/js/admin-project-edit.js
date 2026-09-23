import Quill from 'quill';
import { renderAdminSidebar } from './components.js';
import { adminGetCategories, adminGetTechnologies, adminGetTeamMembers, adminGetProject, adminUpdateProject } from './api.js';
import { requireAdminAuth, showToast, getAssetUrl } from './utils.js';

if (requireAdminAuth()) {
  renderAdminSidebar('projects');
  initEditProject();
}

async function initEditProject() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    window.location.href = '/admin/projects.html';
    return;
  }

  // Initialize Quill
  const quill = new Quill('#quill-editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'clean']
      ]
    }
  });

  const titleInput = document.getElementById('title');
  const slugInput = document.getElementById('slug');
  const categorySelect = document.getElementById('category_id');
  const statusSelect = document.getElementById('status');
  const shortDescInput = document.getElementById('short_description');
  const demoUrlInput = document.getElementById('demo_url');
  const repoUrlInput = document.getElementById('repository_url');
  const coverInput = document.getElementById('cover');
  const coverPreview = document.getElementById('cover-preview-box');
  const techList = document.getElementById('tech-checkbox-list');
  const teamList = document.getElementById('team-checkbox-list');
  const form = document.getElementById('project-form');
  const saveBtn = document.getElementById('save-btn');

  // Cover preview on local select
  coverInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      coverPreview.innerHTML = `<img src="${url}" class="w-full h-full object-cover">`;
    }
  });

  try {
    const [catRes, techRes, teamRes, projRes] = await Promise.all([
      adminGetCategories(),
      adminGetTechnologies(),
      adminGetTeamMembers(),
      adminGetProject(projectId)
    ]);

    const project = projRes.data.data;
    if (!project) throw new Error('Project tidak ditemukan');

    // Populate Categories
    (catRes.data.data || []).forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      if (project.category_id == c.id) opt.selected = true;
      categorySelect.appendChild(opt);
    });

    // Populate Technologies
    const activeTechIds = (project.technologies || []).map(t => t.id);
    techList.innerHTML = (techRes.data.data || []).map(t => `
      <label class="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
        <input type="checkbox" name="technology_ids[]" value="${t.id}" ${activeTechIds.includes(t.id) ? 'checked' : ''} class="rounded border-white/20 bg-[#151722] text-[#ff6b00] focus:ring-0">
        <span>${t.name}</span>
      </label>
    `).join('');

    // Populate Team Members
    const activeMemberIds = (project.team_members || []).map(m => m.id);
    teamList.innerHTML = (teamRes.data.data || []).map(m => `
      <label class="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none p-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
        <input type="checkbox" name="team_member_ids[]" value="${m.id}" ${activeMemberIds.includes(m.id) ? 'checked' : ''} class="rounded border-white/20 bg-[#151722] text-[#ff6b00] focus:ring-0">
        <span class="font-medium">${m.name}</span>
      </label>
    `).join('');

    // Fill fields
    titleInput.value = project.title || '';
    slugInput.value = project.slug || '';
    statusSelect.value = project.status || 'published';
    shortDescInput.value = project.short_description || '';
    demoUrlInput.value = project.demo_url || '';
    repoUrlInput.value = project.repository_url || '';

    if (project.cover) {
      coverPreview.innerHTML = `<img src="${getAssetUrl(project.cover)}" class="w-full h-full object-cover">`;
    }

    if (project.description) {
      quill.root.innerHTML = project.description;
    }

  } catch (err) {
    console.error('Error initializing edit project:', err);
    showToast('Gagal memuat data project.', 'error');
  }

  // Handle Form Submit
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    if (!title) {
      showToast('Judul project harus diisi.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', title);
    if (slugInput.value.trim()) formData.append('slug', slugInput.value.trim());
    if (categorySelect.value) formData.append('category_id', categorySelect.value);
    formData.append('status', statusSelect.value);
    formData.append('short_description', shortDescInput.value.trim());
    formData.append('demo_url', demoUrlInput.value.trim());
    formData.append('repository_url', repoUrlInput.value.trim());

    // Quill HTML
    const htmlContent = quill.getSemanticHTML ? quill.getSemanticHTML() : quill.root.innerHTML;
    formData.append('description', htmlContent);

    // Cover
    if (coverInput.files[0]) {
      formData.append('cover', coverInput.files[0]);
    }

    // Technologies
    const selectedTechs = form.querySelectorAll('input[name="technology_ids[]"]:checked');
    selectedTechs.forEach(cb => formData.append('technology_ids[]', cb.value));

    // Team members
    const selectedMembers = form.querySelectorAll('input[name="team_member_ids[]"]:checked');
    selectedMembers.forEach(cb => formData.append('team_member_ids[]', cb.value));

    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span>Memperbarui...</span>`;

    try {
      await adminUpdateProject(projectId, formData);
      showToast('Project berhasil diperbarui!', 'success');
      setTimeout(() => {
        window.location.href = '/admin/projects.html';
      }, 500);
    } catch (err) {
      console.error('Update project error:', err);
      const errors = err.response?.data?.errors;
      if (errors) {
        const errorList = Object.values(errors).flat().join('<br>');
        showToast(errorList, 'error', 5000);
      } else {
        const msg = err.response?.data?.message || 'Gagal memperbarui project.';
        showToast(msg, 'error');
      }
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span>Simpan Perubahan</span>`;
    }
  });
}
