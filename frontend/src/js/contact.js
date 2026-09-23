import { renderPublicNavbar, renderPublicFooter } from './components.js';
import { submitContactMessage } from './api.js';
import { showToast } from './utils.js';

renderPublicNavbar('contact');
renderPublicFooter();

const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const feedback = document.getElementById('form-feedback');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Semua field wajib diisi.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Mengirim Pesan...</span>
    `;

    feedback.className = 'hidden';

    try {
      const res = await submitContactMessage({ name, email, subject, message });

      form.reset();
      showToast('Pesan berhasil terkirim! Tim kami akan segera merespons.', 'success');

      feedback.className = 'block text-xs py-3 px-4 rounded-xl font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shadow-md';
      feedback.textContent = res.data.message || 'Terima kasih, pesan Anda telah berhasil diterima.';
    } catch (err) {
      console.error('Submit contact error:', err);
      const errorMsg = err.response?.data?.message || 'Gagal mengirim pesan. Silakan coba lagi.';
      showToast(errorMsg, 'error');

      feedback.className = 'block text-xs py-3 px-4 rounded-xl font-medium bg-rose-500/10 border border-rose-500/30 text-rose-300 shadow-md';
      feedback.textContent = errorMsg;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Kirim Pesan Sekarang</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      `;
    }
  });
}
