import { adminLogin } from './api.js';
import { redirectIfAdminAuth, showToast } from './utils.js';

// Redirect if already logged in
redirectIfAdminAuth();

const form = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const errorDiv = document.getElementById('login-error');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showToast('Email dan password harus diisi.', 'error');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Memproses...</span>
    `;

    errorDiv.className = 'hidden';

    try {
      const res = await adminLogin({ email, password });
      const { token, user } = res.data;

      localStorage.setItem('nahnu_admin_token', token);
      localStorage.setItem('nahnu_admin_user', JSON.stringify(user));

      showToast('Login berhasil! Mengalihkan...', 'success');
      setTimeout(() => {
        window.location.href = '/admin/dashboard.html';
      }, 400);
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Login gagal. Periksa kembali email dan password Anda.';
      errorDiv.className = 'block text-xs py-2.5 px-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 font-medium';
      errorDiv.textContent = msg;
      showToast(msg, 'error');
    } finally {
      loginBtn.disabled = false;
      loginBtn.innerHTML = `
        <span>Masuk ke Dashboard</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      `;
    }
  });
}
