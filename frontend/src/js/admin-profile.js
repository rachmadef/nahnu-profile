import { renderAdminSidebar } from './components.js';
import { adminGetProfile, adminUpdateProfile, adminUpdatePassword } from './api.js';
import { showToast, formatDate } from './utils.js';

// Protect admin route
const token = localStorage.getItem('nahnu_admin_token');
if (!token) {
  window.location.href = '/admin/login.html';
}

// Render sidebar with active menu 'profile'
renderAdminSidebar('profile');

// DOM Elements
const profileForm = document.getElementById('profile-form');
const passwordForm = document.getElementById('password-form');
const nameInput = document.getElementById('profile-name');
const emailInput = document.getElementById('profile-email');
const displayName = document.getElementById('profile-display-name');
const avatarBadge = document.getElementById('profile-avatar-badge');
const joinedText = document.getElementById('profile-joined-text');
const saveProfileBtn = document.getElementById('save-profile-btn');
const savePasswordBtn = document.getElementById('save-password-btn');

// Setup password visibility toggles
document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (!input) return;

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    // Update icon
    button.innerHTML = isPassword
      ? `<svg class="w-4 h-4 eye-off" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>`
      : `<svg class="w-4 h-4 eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`;
  });
});

// Update UI with user data
function populateUserData(user) {
  if (!user) return;
  if (nameInput) nameInput.value = user.name || '';
  if (emailInput) emailInput.value = user.email || '';
  if (displayName) displayName.textContent = user.name || 'Administrator';
  if (avatarBadge) avatarBadge.textContent = (user.name || 'A')[0].toUpperCase();
  if (joinedText) {
    joinedText.textContent = user.created_at
      ? `Terdaftar: ${formatDate(user.created_at)}`
      : 'Terdaftar: NAHNU Platform';
  }
}

// Fetch Profile
async function loadProfile() {
  try {
    const res = await adminGetProfile();
    const user = res.data.user;
    populateUserData(user);
    // Sync local storage
    localStorage.setItem('nahnu_admin_user', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));
  } catch (err) {
    console.error('Failed to load profile:', err);
    // Fallback to local storage if offline / temporary failure
    const cached = JSON.parse(localStorage.getItem('nahnu_admin_user') || '{}');
    populateUserData(cached);
  }
}

// Handle Profile Form Submit
if (profileForm) {
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
      showToast('Nama dan email wajib diisi.', 'error');
      return;
    }

    const originalBtnHtml = saveProfileBtn.innerHTML;
    saveProfileBtn.disabled = true;
    saveProfileBtn.innerHTML = `
      <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span>Menyimpan...</span>
    `;

    try {
      const res = await adminUpdateProfile({ name, email });
      const updatedUser = res.data.user;

      // Update cached user & UI
      localStorage.setItem('nahnu_admin_user', JSON.stringify({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      }));

      populateUserData(updatedUser);

      // Re-render sidebar so the bottom user info refreshes immediately
      renderAdminSidebar('profile');

      showToast(res.data.message || 'Profil berhasil diperbarui.', 'success');
    } catch (err) {
      console.error('Failed to update profile:', err);
      const msg = err.response?.data?.message || 'Gagal memperbarui profil.';
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0];
        showToast(Array.isArray(firstError) ? firstError[0] : firstError, 'error');
      } else {
        showToast(msg, 'error');
      }
    } finally {
      saveProfileBtn.disabled = false;
      saveProfileBtn.innerHTML = originalBtnHtml;
    }
  });
}

// Handle Password Form Submit
if (passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('password-confirmation').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Semua kolom password wajib diisi.', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showToast('Password baru minimal 8 karakter.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi password baru tidak cocok.', 'error');
      return;
    }

    const originalBtnHtml = savePasswordBtn.innerHTML;
    savePasswordBtn.disabled = true;
    savePasswordBtn.innerHTML = `
      <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span>Memperbarui...</span>
    `;

    try {
      const res = await adminUpdatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      showToast(res.data.message || 'Password berhasil diperbarui.', 'success');
      passwordForm.reset();
    } catch (err) {
      console.error('Failed to update password:', err);
      const msg = err.response?.data?.message || 'Gagal memperbarui password.';
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0];
        showToast(Array.isArray(firstError) ? firstError[0] : firstError, 'error');
      } else {
        showToast(msg, 'error');
      }
    } finally {
      savePasswordBtn.disabled = false;
      savePasswordBtn.innerHTML = originalBtnHtml;
    }
  });
}

// Init
loadProfile();
