import { api } from '../api.js';
import { CONFIG } from '../config.js';

const loader = document.getElementById('loader');
const details = document.getElementById('product-details');
const errorBox = document.getElementById('error');

async function loadProduct() {
  try {
    // 1. Достаем ID из адресной строки
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    console.log("ID из ссылки:", productId); // Для отладки

    let product;

    if (productId) {
      // Пытаемся получить конкретный товар
      try {
        product = await api.getProduct(productId);
      } catch (e) {
        console.warn("Не удалось загрузить по ID, ищем в общем списке...");
        // Если бэкенд выдал ошибку, берем всех и ищем нужного
        const allProducts = await api.getProducts();
        product = allProducts.find(p => p._id === productId);
      }
    }

    // Если товар так и не нашли (или нет ID), берем первый
    if (!product) {
      const allProducts = await api.getProducts();
      if (!allProducts || allProducts.length === 0) throw new Error("Товаров нет");
      product = allProducts[0];
    }
    
    // --- ОТРИСОВКА ---
    loader.classList.add('hidden');
    details.classList.remove('hidden');

    const imgUrl = product.image 
      ? `${CONFIG.FILES_URL}/${product.image}` 
      : 'https://placehold.co/600x400?text=Нет+фото';

    const price = new Intl.NumberFormat('ru-RU').format(product.price);

    details.innerHTML = `
      <div class="product-details__image-wrapper">
        <img src="${imgUrl}" alt="${product.title}" class="product-details__img">
      </div>
      <div class="product-details__info">
        <h1 class="product-details__title">${product.title}</h1>
        <p class="product-details__price">${price} ₽</p>
        <div class="product-details__desc">
          <h3>Описание</h3>
          <p>${product.description}</p>
        </div>
        <button class="btn btn-primary" style="margin-top: 2rem; width: 100%;">Добавить в корзину</button>
      </div>
    `;

  } catch (err) {
    loader.classList.add('hidden');
    errorBox.textContent = 'Ошибка: ' + err.message;
    errorBox.classList.remove('hidden');
  }
}

loadProduct();