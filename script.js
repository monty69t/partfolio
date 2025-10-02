// Theme init
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(mode) {
  if (mode === 'dark') root.setAttribute('data-theme', 'dark');
  else if (mode === 'light') root.setAttribute('data-theme', '');
  else root.setAttribute('data-theme', prefersDark ? 'dark' : '');

  document.getElementById('icon-sun').style.display = (root.getAttribute('data-theme') === 'dark') ? 'none' : 'block';
  document.getElementById('icon-moon').style.display = (root.getAttribute('data-theme') === 'dark') ? 'block' : 'none';
}

setTheme(storedTheme || 'auto');

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  localStorage.setItem('theme', next);
});

// Mobile menu
const menuBtn = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuBtn?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Phone Mask RU
const phoneInput = document.getElementById('phone');
function formatPhone(value) {
  const digits = value.replace(/\D/g, '');
  const parts = ['+7'];
  const d = digits.replace(/^7?/, '');
  if (d.length > 0) parts.push(' (', d.substring(0,3));
  if (d.length >= 3) parts.push(') ', d.substring(3,6));
  if (d.length >= 6) parts.push('-', d.substring(6,8));
  if (d.length >= 8) parts.push('-', d.substring(8,10));
  return parts.join('');
}

phoneInput.addEventListener('input', (e) => {
  const start = e.target.selectionStart;
  e.target.value = formatPhone(e.target.value);
  e.target.setSelectionRange(e.target.value.length, e.target.value.length);
});

phoneInput.addEventListener('blur', (e) => {
  if (!/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/.test(e.target.value)) {
    showError('phone', 'Введите корректный номер телефона');
  } else {
    clearError('phone');
  }
});

// Budget formatting
const budgetInput = document.getElementById('budget');
const nf = new Intl.NumberFormat('ru-RU');

budgetInput.addEventListener('input', (e) => {
  const digits = e.target.value.replace(/\D/g,'');
  e.target.value = digits ? nf.format(+digits) + ' ₽' : '';
});

// Form validation
const form = document.getElementById('briefForm');
const status = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const spinner = submitBtn.querySelector('.spinner');
const label = submitBtn.querySelector('.btn-label');

function showError(field, msg) {
  const el = document.getElementById('err-' + field);
  if (el) el.textContent = msg;
  const input = document.getElementById(field);
  input?.setAttribute('aria-invalid', 'true');
  input?.style.setProperty('border-color', 'var(--danger)');
}

function clearError(field) {
  const el = document.getElementById('err-' + field);
  if (el) el.textContent = '';
  const input = document.getElementById(field);
  input?.removeAttribute('aria-invalid');
  input?.style.removeProperty('border-color');
}

function validateEmail(v) { 
  return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); 
}

function validate() {
  let ok = true;
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value;
  const tg = document.getElementById('telegram').value.trim();
  const em = document.getElementById('email').value.trim();
  const msg = document.getElementById('message').value.trim();

  if (!name) { showError('name','Введите имя'); ok=false; } else clearError('name');
  if (!/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/.test(phone)) { showError('phone','Введите корректный номер телефона'); ok=false; } else clearError('phone');
  if (!tg && !em) { showError('contact','Укажите Telegram или Email'); ok=false; } else if (em && !validateEmail(em)) { showError('contact','Некорректный Email'); ok=false; } else clearError('contact');
  if (msg.length < 10) { showError('message','Сообщение не может быть пустым (мин. 10 символов)'); ok=false; } else clearError('message');

  return ok;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = '';
  status.className = 'status';
  if (!validate()) return;

  submitBtn.disabled = true;
  spinner.style.display = 'inline-block';
  label.textContent = 'Отправка...';

  await new Promise(r => setTimeout(r, 900));

  submitBtn.disabled = false;
  spinner.style.display = 'none';
  label.textContent = 'Отправить бриф';
  status.textContent = 'Спасибо! Ответ в Telegram в ближайшее время.';
  status.classList.add('success');

  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);

  form.reset();
});

// Spin animation
const style = document.createElement('style');
style.innerHTML = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(style);