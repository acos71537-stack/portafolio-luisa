/* ==========================================================================
   MAIN.JS — Interactividad del Portafolio Lp (Luisa)
   - Menú móvil responsive
   - Toggle de tema
   - Filtros dinámicos y buscador en Portafolio
   - Animaciones suaves al hacer scroll
   - Validación y confirmación del formulario de Contacto
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initThemeToggle();
  initScrollAnimations();
  initPortfolioFilters();
  initContactForm();
  initVideoModal();
  initAlmaCarousel();
});

/* 1. Menú móvil */
function initMobileMenu() {
  const burger = document.querySelector('.navbar__burger');
  const menu = document.querySelector('.navbar__menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* 2. Toggle de tema */
function initThemeToggle() {
  const toggleBtn = document.querySelector('.theme-toggle');
  if (!toggleBtn) return;

  if (localStorage.getItem('lp-theme') === 'light') {
    document.body.classList.add('light-theme');
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const mode = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('lp-theme', mode);
  });
}

/* 3. Animaciones suaves al hacer scroll */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
}

/* 4. Galería dinámica con filtros y buscador (portafolio.html) */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-pill[data-filter]');
  const searchInput = document.getElementById('portfolio-search');
  const cards = document.querySelectorAll('.project-card[data-category]');
  const emptyState = document.getElementById('portfolio-empty');

  if (!cards.length) return;

  let activeFilter = 'todos';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const categories = (card.dataset.category || '').toLowerCase();
      const title = (card.dataset.title || '').toLowerCase();

      const matchesCategory = activeFilter === 'todos' || categories.includes(activeFilter);
      const matchesSearch = !searchQuery || title.includes(searchQuery) || categories.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter.toLowerCase();
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/* 5. Formulario de contacto (contacto.html) */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.querySelector('#nombre').value.trim();
    const correo = form.querySelector('#correo').value.trim();
    const mensaje = form.querySelector('#mensaje').value.trim();

    if (!nombre || !correo || !mensaje) {
      feedback.textContent = 'Por favor completa todos los campos antes de enviar.';
      feedback.className = 'form-feedback form-feedback--error';
      feedback.hidden = false;
      return;
    }

    feedback.textContent = `¡Gracias, ${nombre}! Tu mensaje ha sido enviado. Te responderé muy pronto.`;
    feedback.className = 'form-feedback form-feedback--success';
    feedback.hidden = false;
    form.reset();
  });
}

/* 6. Simulación de vista previa de reel en proyecto.html */
function initVideoModal() {
  const playBtn = document.querySelector('.media-play-btn');
  if (!playBtn) return;

  playBtn.addEventListener('click', () => {
    const label = playBtn.querySelector('.media-play-tooltip');
    if (label) {
      label.textContent = 'Vista previa del trailer disponible próximamente';
      label.classList.add('show');
      setTimeout(() => label.classList.remove('show'), 2800);
    }
  });
}

/* 7. Galería interactiva 1 en 1 en alma.html */
function initAlmaCarousel() {
  const carousel = document.getElementById('alma-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.alma-slide');
  const prevBtn = carousel.querySelector('.alma-carousel__btn--prev');
  const nextBtn = carousel.querySelector('.alma-carousel__btn--next');
  const dots = document.querySelectorAll('.alma-dot');
  const caption = document.getElementById('alma-caption');
  const counter = document.getElementById('alma-counter');

  let current = 0;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));

    if (caption) caption.textContent = slides[current].dataset.caption || '';
    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
  }

  prevBtn?.addEventListener('click', () => showSlide(current - 1));
  nextBtn?.addEventListener('click', () => showSlide(current + 1));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => showSlide(Number(dot.dataset.index)));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showSlide(current - 1);
    if (e.key === 'ArrowRight') showSlide(current + 1);
  });
}
