import Quill from 'quill';
import { renderAdminSidebar } from './components.js';
import { adminGetCategories, adminGetTechnologies, adminGetTeamMembers, adminCreateProject } from './api.js';
import { requireAdminAuth, showToast, slugify } from './utils.js';

if (requireAdminAuth()) {
  renderAdminSidebar('projects');
  initCreateProject();
}

async function initCreateProject() {
  // Initialize Quill
  const quill = new Quill('#quill-editor', {
    theme: 'snow',
    placeholder: 'Tuliskan detail latar belakang, arsitektur, tantangan, dan hasil proyek...',
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
  const coverInput = document.getElementById('cover');
  const coverPreview = document.getElementById('cover-preview-box');
  const techList = document.getElementById('tech-checkbox-list');
  const teamList = document.getElementById('team-checkbox-list');
  const form = document.getElementById('project-form');
  const saveBtn = document.getElementById('save-btn');

  // Auto-fill slug
  titleInput?.addEventListener('input', () => {
    if (!slugInput.dataset.manual) {
      slugInput.value = slugify(titleInput.value);
    }
  });
  slugInput?.addEventListener('input', () => {
    slugInput.dataset.manual = 'true';
  });

  // Cover preview
  coverInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      coverPreview.innerHTML = `<img src="${url}" class="w-full h-full object-cover">`;
    }
  });

  // Fetch initial select & checkboxes data
  try {
    const [catRes, techRes, teamRes] = await Promise.all([
      adminGetCategories(),
      adminGetTechnologies(),
      adminGetTeamMembers()
    ]);

    // Categories
    (catRes.data.data || []).forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      categorySelect.appendChild(opt);
    });

    // Technologies
    techList.innerHTML = (techRes.data.data || []).map(t => `
      <label class="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
        <input type="checkbox" name="technology_ids[]" value="${t.id}" class="rounded border-white/20 bg-[#151722] text-[#ff6b00] focus:ring-0">
        <span>${t.name}</span>
      </label>
    `).join('');

    // Team Members
    teamList.innerHTML = (teamRes.data.data || []).map(m => `
      <label class="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none p-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
        <input type="checkbox" name="team_member_ids[]" value="${m.id}" checked class="rounded border-white/20 bg-[#151722] text-[#ff6b00] focus:ring-0">
        <span class="font-medium">${m.name}</span>
      </label>
    `).join('');

  } catch (err) {
    console.error('Error fetching form metadata:', err);
    showToast('Gagal memuat kategori atau developer.', 'error');
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
    formData.append('title', title);
    if (slugInput.value.trim()) formData.append('slug', slugInput.value.trim());
    if (categorySelect.value) formData.append('category_id', categorySelect.value);
    formData.append('status', document.getElementById('status').value);
    formData.append('short_description', document.getElementById('short_description').value.trim());
    formData.append('demo_url', document.getElementById('demo_url').value.trim());
    formData.append('repository_url', document.getElementById('repository_url').value.trim());

    // Quill HTML content
    const htmlContent = quill.getSemanticHTML ? quill.getSemanticHTML() : quill.root.innerHTML;
    formData.append('description', htmlContent);

    // Cover file
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
    saveBtn.innerHTML = `<span>Menyimpan...</span>`;

    try {
      await adminCreateProject(formData);
      showToast('Project berhasil ditambahkan!', 'success');
      setTimeout(() => {
        window.location.href = '/admin/projects.html';
      }, 500);
    } catch (err) {
      console.error('Create project error:', err);
      const errors = err.response?.data?.errors;
      if (errors) {
        const errorList = Object.values(errors).flat().join('<br>');
        showToast(errorList, 'error', 5000);
      } else {
        const msg = err.response?.data?.message || 'Gagal menyimpan project.';
        showToast(msg, 'error');
      }
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span>Simpan Project</span>`;
    }
  });
}
