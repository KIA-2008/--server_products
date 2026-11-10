import { api } from '../api.js';
import { CONFIG } from '../config.js';

const grid = document.getElementById('products-grid');
const loader = document.getElementById('loader');
const empty = document.getElementById('empty');

async function loadProducts() {
  try {
    const products = await api.getProducts();
    loader.classList.add('hidden');

    if (!products || products.length === 0) {
      empty.classList.remove('hidden');
      return;
    }

    products.forEach((product, index) => {
      // Создаем ссылку <a>, чтобы работал переход
      const card = document.createElement('a');
      // Формируем ссылку на страницу товара с его ID
      card.href = `product.html?id=${product._id}`;
      card.className = 'product-card';
      card.style.textDecoration = 'none'; 
      
      // Задержка для каскадной анимации
      card.style.animationDelay = `${index * 0.1}s`;

      const imgUrl = product.image 
        ? `${CONFIG.FILES_URL}/${product.image}` 
        : 'https://placehold.co/400x300?text=Нет+фото';

      const price = new Intl.NumberFormat('ru-RU').format(product.price);

      card.innerHTML = `
        <img src="${imgUrl}" alt="${product.title}" class="product-card__img" loading="lazy">
        <div class="product-card__content">
          <h3 class="product-card__title">${product.title}</h3>
          <p class="product-card__price">${price} ₽</p>
          <p class="product-card__desc">${product.description}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    loader.classList.add('hidden');
    grid.innerHTML = `<p style="color:red; font-size: 1.2rem;">Ошибка загрузки: ${err.message}</p>`;
  }
}

loadProducts();