import { authApi } from '../api.js';

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerTab = document.getElementById('register-tab');
const loginTab = document.getElementById('login-tab');
const title = document.getElementById('auth-title');
const subtitle = document.getElementById('auth-subtitle');
const message = document.getElementById('auth-message');

function showMessage(text, type = 'error') {
  message.textContent = text;
  message.className = `message ${type}`;
}

function clearMessage() {
  message.textContent = '';
  message.className = 'message';
}

function setMode(mode) {
  const isRegister = mode === 'register';
  registerForm.classList.toggle('hidden', !isRegister);
  loginForm.classList.toggle('hidden', isRegister);
  registerTab.classList.toggle('is-active', isRegister);
  loginTab.classList.toggle('is-active', !isRegister);
  registerTab.setAttribute('aria-selected', String(isRegister));
  loginTab.setAttribute('aria-selected', String(!isRegister));
  title.textContent = isRegister ? 'Создать аккаунт' : 'С возвращением';
  subtitle.textContent = isRegister
    ? 'Присоединяйтесь — это займёт всего пару минут.'
    : 'Войдите, чтобы продолжить покупки.';
  clearMessage();
}

registerTab.addEventListener('click', () => setMode('register'));
loginTab.addEventListener('click', () => setMode('login'));

document.querySelectorAll('.password-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.password);
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    button.textContent = visible ? 'Скрыть' : 'Показать';
    button.setAttribute('aria-label', visible ? 'Скрыть пароль' : 'Показать пароль');
  });
});

function setLoading(form, loading, label) {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = loading;
  button.querySelector('.button-caption').textContent = loading ? 'Подождите…' : label;
  button.classList.toggle('is-loading', loading);
}

function errorText(error) {
  const raw = String(error?.message || '');
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') return parsed;
    return parsed.message || parsed.massage || 'Не удалось выполнить запрос. Попробуйте ещё раз.';
  } catch {
    return raw.replace(/^"|"$/g, '') || 'Не удалось связаться с сервером. Проверьте подключение.';
  }
}

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();

  if (!registerForm.reportValidity()) return;

  const data = new FormData(registerForm);
  const password = data.get('password');
  const confirmPassword = data.get('confirmPassword');

  if (password !== confirmPassword) {
    showMessage('Пароли не совпадают. Проверьте оба поля.');
    document.getElementById('confirm-password').focus();
    return;
  }

  const userData = {
    name: data.get('name').trim(),
    lastName: data.get('lastName').trim(),
    email: data.get('email').trim(),
    phoneNumber: data.get('phoneNumber').trim(),
    password,
  };

  setLoading(registerForm, true, 'Создать аккаунт');
  try {
    const result = await authApi.register(userData);
    showMessage(typeof result === 'string' ? result : 'Регистрация прошла успешно. Теперь можно войти.', 'success');
    registerForm.reset();
    setTimeout(() => setMode('login'), 1400);
  } catch (error) {
    showMessage(errorText(error));
  } finally {
    setLoading(registerForm, false, 'Создать аккаунт');
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();
  if (!loginForm.reportValidity()) return;

  const data = new FormData(loginForm);
  const credentials = {
    email: data.get('email').trim(),
    password: data.get('password'),
  };

  setLoading(loginForm, true, 'Войти в аккаунт');
  try {
    const user = await authApi.login(credentials);
    // Сервер возвращает объект пользователя; пароль из ответа не сохраняем.
    if (user && typeof user === 'object') {
      const { password, ...safeUser } = user;
      sessionStorage.setItem('shopUser', JSON.stringify(safeUser));
    }
    showMessage('Вы успешно вошли в аккаунт.', 'success');
    loginForm.reset();
    setTimeout(() => { window.location.href = 'index.html'; }, 900);
  } catch (error) {
    showMessage(errorText(error));
  } finally {
    setLoading(loginForm, false, 'Войти в аккаунт');
  }
});
