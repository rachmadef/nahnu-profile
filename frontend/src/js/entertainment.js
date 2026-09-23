import { renderPublicNavbar, renderPublicFooter } from './components.js';

// Initialize Navbar and Footer
renderPublicNavbar('entertainment');
renderPublicFooter();

// Interactive Filter Buttons
const filterButtons = document.querySelectorAll('.media-filter-btn');
const mediaItems = document.querySelectorAll('.media-item');
const countBadge = document.getElementById('media-count-badge');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    // Update active button state
    filterButtons.forEach(b => {
      b.className = 'media-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] hover:text-white border border-white/[0.06]';
    });
    btn.className = 'media-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/30';

    let visibleCount = 0;
    mediaItems.forEach(item => {
      const category = item.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        item.style.display = 'flex';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (countBadge) {
      countBadge.textContent = `Menampilkan ${visibleCount} Karya Pilihan`;
    }
  });
});

// Interactive Preview Modal Logic
const modal = document.getElementById('media-preview-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const closeModalBtn = document.getElementById('close-modal-btn');

document.querySelectorAll('.media-preview-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const title = trigger.getAttribute('data-title');
    const desc = trigger.getAttribute('data-desc');

    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;

    if (modal) {
      modal.classList.remove('hidden');
    }
  });
});

if (closeModalBtn && modal) {
  closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
    }
  });
}
