/* =========================================================
   MERCÈ RIERA · Interacciones
   - Idioma ES / CA (textos con data-l="es" / data-l="ca")
   - Para cambiar el teléfono/WhatsApp o el horario, edita CONFIG
   ========================================================= */

const CONFIG = {
  whatsapp: '34671669247',
  // 0 = domingo … 6 = sábado. Horario de invierno publicado por el salón.
  hours: {
    0: [], 1: [],
    2: ['09:00-13:00', '15:00-19:30'],
    3: ['09:00-13:00', '15:00-19:30'],
    4: ['09:00-18:00'],
    5: ['09:00-18:00'],
    6: ['09:00-14:00']
  }
};

const root = document.documentElement;
root.classList.remove('no-js');
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------- Idioma ---------- */
let lang = 'es';
const applyLang = (l) => {
  lang = l === 'ca' ? 'ca' : 'es';
  root.classList.toggle('lang-ca', lang === 'ca');
  root.lang = lang;
  $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  $$('[data-wa-es]').forEach((a) => { a.href = waLink(a.dataset[lang === 'ca' ? 'waCa' : 'waEs']); });
  $$('option[data-es]').forEach((o) => { o.textContent = o.dataset[lang]; });
  updateOpenState();
  try { localStorage.setItem('mr-lang', lang); } catch (e) { /* sin almacenamiento */ }
};
$$('[data-lang]').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));

/* ---------- Horario: hoy y "Abierto / Cerrado" (hora de Lloret) ---------- */
function updateOpenState() {
  const state = $('[data-open-state]');
  if (!state) return;
  let now;
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    now = { day: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get('weekday')], min: (Number(get('hour')) % 24) * 60 + Number(get('minute')) };
  } catch (e) { const d = new Date(); now = { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() }; }
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const open = (CONFIG.hours[now.day] || []).some((r) => { const [a, b] = r.split('-').map(toMin); return now.min >= a && now.min < b; });
  state.textContent = open ? (lang === 'ca' ? 'Obert ara' : 'Abierto ahora') : (lang === 'ca' ? 'Ara tancat' : 'Ahora cerrado');
  state.classList.toggle('is-open', open);
  state.classList.toggle('is-closed', !open);
  $$('[data-hours] tr').forEach((tr) => tr.classList.toggle('is-today', Number(tr.dataset.day) === now.day));
}

let initial = 'es';
const urlLang = new URLSearchParams(location.search).get('lang');
try { initial = urlLang || localStorage.getItem('mr-lang') || 'es'; } catch (e) { initial = urlLang || 'es'; }
applyLang(initial);

/* ---------- Intro ---------- */
const finishIntro = () => {
  if (document.body.classList.contains('is-loaded')) return;
  document.body.classList.add('is-loaded');
  setTimeout(() => $('.intro')?.remove(), 1200);
};
let seen = false;
try { seen = sessionStorage.getItem('mr-intro') === '1'; sessionStorage.setItem('mr-intro', '1'); } catch (e) { /* */ }
if (reduceMotion || seen) finishIntro();
else { window.addEventListener('load', () => setTimeout(finishIntro, 500)); setTimeout(finishIntro, 2400); }

/* ---------- Cabecera y botón flotante ---------- */
const header = $('[data-header]');
const waFloat = $('.wa-float');
let lastY = 0; let ticking = false;
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('is-solid', y > 40);
  header.classList.toggle('is-hidden', y > 700 && y > lastY && !document.body.classList.contains('menu-open'));
  waFloat.classList.toggle('is-visible', y > window.innerHeight * 0.6);
  lastY = y; ticking = false;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Menú ---------- */
const burger = $('.burger');
const menu = $('#menu');
const setMenu = (open) => {
  burger.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  document.body.classList.toggle('is-locked', open);
  if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); }
  else { menu.classList.remove('is-open'); setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 600); }
};
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
$$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));

/* ---------- Enlace activo ---------- */
const navLinks = $$('.nav a');
const navObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${e.target.id}`)); });
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach((a) => { const s = $(a.getAttribute('href')); if (s) navObs.observe(s); });

/* ---------- Aparición ---------- */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
$$('.reveal').forEach((el) => {
  const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
  const i = sibs.indexOf(el);
  if (i > 0) el.style.setProperty('--rd', `${Math.min(i, 6) * 0.08}s`);
  revealObs.observe(el);
});

/* ---------- Brillo de los botones que sigue al ratón ---------- */
$$('.btn').forEach((b) => b.addEventListener('pointermove', (e) => {
  const r = b.getBoundingClientRect();
  b.style.setProperty('--mx', `${e.clientX - r.left}px`);
  b.style.setProperty('--my', `${e.clientY - r.top}px`);
}));

/* ---------- Visor de imágenes ---------- */
const lb = $('[data-lightbox]');
const lbImg = $('[data-lb-img]');
const lbCap = $('[data-lb-cap]');
let lastFocus = null;
const lbOpen = (item) => {
  lastFocus = item;
  lbImg.src = item.dataset.lb;
  lbImg.alt = $('img', item).alt;
  const cap = $$('figcaption [data-l]', item).find((s) => s.dataset.l === lang);
  lbCap.textContent = cap ? cap.textContent : '';
  lb.hidden = false; document.body.classList.add('is-locked');
  requestAnimationFrame(() => lb.classList.add('is-open'));
  $('[data-lb-close]', lb).focus();
};
const lbClose = () => {
  lb.classList.remove('is-open'); document.body.classList.remove('is-locked');
  setTimeout(() => { lb.hidden = true; lbImg.removeAttribute('src'); }, 400);
  if (lastFocus) lastFocus.focus();
};
$$('[data-lb]').forEach((item) => {
  item.tabIndex = 0; item.setAttribute('role', 'button');
  item.addEventListener('click', () => lbOpen(item));
  item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lbOpen(item); } });
});
$('[data-lb-close]', lb).addEventListener('click', lbClose);
lb.addEventListener('click', (e) => { if (e.target === lb) lbClose(); });
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!lb.hidden) lbClose();
  if (document.body.classList.contains('menu-open')) setMenu(false);
});

/* ---------- Formulario: pedir hora por WhatsApp ---------- */
const form = $('[data-booking]');
if (form) {
  const err = $('[data-form-error]', form);
  const today = new Date();
  form.dia.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.nombre.value.trim();
    form.nombre.classList.toggle('is-invalid', !name);
    if (!name) { err.hidden = false; form.nombre.focus(); return; }
    err.hidden = true;
    const ca = lang === 'ca';
    let dia = '';
    if (form.dia.value) { const [y, m, d] = form.dia.value.split('-'); dia = `${d}/${m}/${y}`; }
    const lines = [
      ca ? `Hola Mercè, sóc ${name}. Voldria demanar hora.` : `Hola Mercè, soy ${name}. Me gustaría pedir hora.`,
      `${ca ? 'Servei' : 'Servicio'}: ${form.servicio.value}`,
      dia ? `${ca ? 'Dia preferit' : 'Día preferido'}: ${dia}` : null,
      form.nota.value.trim() ? `${ca ? 'Comentaris' : 'Comentarios'}: ${form.nota.value.trim()}` : null
    ].filter(Boolean);
    window.open(waLink(lines.join('\n')), '_blank', 'noopener');
  });
}

/* ---------- Mapa diferido ---------- */
const map = $('.map iframe');
if (map) new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { map.src = map.dataset.src; o.disconnect(); } }, { rootMargin: '400px' }).observe(map);

const year = $('[data-year]');
if (year) year.textContent = new Date().getFullYear();
