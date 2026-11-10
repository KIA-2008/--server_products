import { CONFIG } from './config.js';

const handleResponse = async (res) => {
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Ошибка сервера: ${res.status}`);
  try { return JSON.parse(text); } catch { return text; }
};

export const api = {
  // Получить все товары
  getProducts: () => 
    fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.products}`).then(handleResponse),

  // Получить один товар
  getProduct: (id) => 
    fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.products}/${id}`).then(handleResponse),

  // Создать товар
  createProduct: (formData) =>
    fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.addProduct}`, {
      method: 'POST',
      body: formData,
    }).then(handleResponse),

  // Обновить товар
  updateProduct: (id, formData) =>
    fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.products}/${id}`, {
      method: 'PUT',
      body: formData,
    }).then(handleResponse),

  // Удалить товар
  deleteProduct: (id) =>
    fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.products}/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),
};

// Регистрация и авторизация — существующие серверные маршруты.
export const authApi = {
  register: (userData) =>
    fetch(`${CONFIG.API_URL}/registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(handleResponse),

  login: (credentials) =>
    fetch(`${CONFIG.API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(handleResponse),
};
