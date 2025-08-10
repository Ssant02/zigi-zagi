// ===== utils =====
document.getElementById('year').textContent = new Date().getFullYear();

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== lazy loading for images =====
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img.lazy[data-src]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.style.display = 'block';
          img.classList.remove('lazy');
          obs.unobserve(img);
          // Remove skeleton placeholder
          const skeleton = img.previousElementSibling;
          if (skeleton && skeleton.classList.contains('skeleton')) skeleton.remove();
        }
      });
    }, { rootMargin: '200px' });
    lazyImages.forEach(img => observer.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.style.display = 'block';
      const skeleton = img.previousElementSibling;
      if (skeleton && skeleton.classList.contains('skeleton')) skeleton.remove();
    });
  }
});

// ===== dark mode toggle =====
const darkToggle = document.getElementById('darkToggle');
darkToggle.addEventListener('click', () => {
  const enabled = document.body.classList.toggle('dark');
  darkToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  localStorage.setItem('zz_dark', enabled ? '1' : '0');
});

// Initialize theme from localStorage
if (localStorage.getItem('zz_dark') === '1') {
  document.body.classList.add('dark');
  darkToggle.setAttribute('aria-pressed', 'true');
}

// ===== modal (flavor details) =====
const flavorModal = document.getElementById('flavorModal');

function openFlavor(key) {
  const flavors = {
    strawberry_mojito: {
      title: 'Клубника-Мохито',
      body: 'Свежая клубника и мята. Освежает и радует.'
    },
    tarragon: {
      title: 'Тархун',
      body: 'Яркий травяной аромат — классика советских лимонадов.'
    },
    pear: {
      title: 'Груша',
      body: 'Нежный вкус сочной груши, без лишней сладости.'
    }
  };
  const data = flavors[key] || { title: 'Вкус', body: '' };
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalBody').textContent = data.body;
  flavorModal.classList.add('show');
  flavorModal.setAttribute('aria-hidden', 'false');
  flavorModal.querySelector('.close').focus();
}

function closeModal() {
  flavorModal.classList.remove('show');
  flavorModal.setAttribute('aria-hidden', 'true');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && flavorModal.classList.contains('show')) {
    closeModal();
  }
});

// ===== form submission with honeypot and feedback =====
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

form.addEventListener('submit', (e) => {
  const honeypot = form.querySelector('input[name="website"]');
  if (honeypot && honeypot.value) {
    e.preventDefault();
    feedback.textContent = 'Обнаружен спам — форма не отправлена.';
    return;
  }
  feedback.textContent = 'Отправка…';
  // Formspree handles actual submission, simulate success message
  setTimeout(() => {
    feedback.textContent = 'Спасибо! Мы получили ваше сообщение.';
    form.reset();
  }, 900);
});

// ===== social sharing =====
function share(platform) {
  const url = encodeURIComponent(location.href);
  const text = encodeURIComponent('Попробуйте натуральный лимонад Zigi-Zagi!');
  let shareUrl = '';

  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case 'vk':
      shareUrl = `https://vk.com/share.php?url=${url}`;
      break;
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
      break;
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
      break;
  }
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=500');
  }
}

// ===== buy button placeholder =====
function buy(sku) {
  alert(`Купить: ${sku} — интеграция оплаты (заглушка).`);
}

// ===== Leaflet map initialization =====
(function initMap() {
  try {
    const map = L.map('map', { scrollWheelZoom: false }).setView([51.169392, 71.449074], 12); // Алматы
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const points = [
      { name: 'Zigi-Zagi — Центр', coords: [51.169392, 71.449074] },
      { name: 'Zigi-Zagi — Восток', coords: [51.175, 71.46] }
    ];

    points.forEach(p => L.marker(p.coords).addTo(map).bindPopup(`<b>${p.name}</b>`));
  } catch (e) {
    console.warn('Map error:', e);
    const mapEl = document.getElementById('map');
    if (mapEl) mapEl.innerHTML = '<p class="muted">Карта недоступна</p>';
  }
})();

// ===== Service Worker registration =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker зарегистрирован'))
    .catch(e => console.warn('Ошибка регистрации Service Worker:', e));
}
