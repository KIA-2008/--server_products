import { api } from '../api.js';
import { CONFIG } from '../config.js';

// DOM элементы
const productsTableBody = document.querySelector('#products-table tbody');
const loader = document.getElementById('loader');
const modal = document.getElementById('modal');
const form = document.getElementById('product-form');
const messageBox = document.getElementById('message');
const fileInput = document.getElementById('image');
const previewImg = document.getElementById('image-preview');
const modalTitle = document.getElementById('modal-title');

// Открытие модального окна (создание или редактирование)
async function openModal(productId = null) {
  form.reset();
  previewImg.style.display = 'none';
  form.dataset.id = productId || '';
  modalTitle.textContent = productId ? 'Редактировать товар' : 'Добавить товар';
  
  if (productId) {
    try {
      const product = await api.getProduct(productId);
      form.title.value = product.title;
      form.price.value = product.price;
      form.description.value = product.description;
      
      if (product.image) {
        previewImg.src = `${CONFIG.FILES_URL}/${product.image}`;
        previewImg.style.display = 'block';
      }
    } catch (err) {
      alert('Ошибка загрузки товара: ' + err.message);
      return;
    }
  }
  
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

// Превью картинки
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    previewImg.src = URL.createObjectURL(file);
    previewImg.style.display = 'block';
  }
});

// Отправка формы
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = form.querySelector('button[type="submit"]');
  const productId = form.dataset.id;
  
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Сохранение...';

    const formData = new FormData();
    formData.append('title', form.title.value.trim());
    formData.append('description', form.description.value.trim());
    formData.append('price', form.price.value);
    if (fileInput.files[0]) {
      formData.append('image', fileInput.files[0]);
    }

    if (productId) {
      await api.updateProduct(productId, formData);
    } else {
      await api.createProduct(formData);
    }

    closeModal();
    loadProducts(); // Обновить таблицу
    showMessage('Успешно сохранено!', 'success');

  } catch (err) {
    showMessage('Ошибка: ' + err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Сохранить';
  }
});

// Загрузка таблицы товаров
async function loadProducts() {
  try {
    loader.classList.remove('hidden');
    productsTableBody.innerHTML = '';
    
    const products = await api.getProducts();
    
    if (!products || products.length === 0) {
      productsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Товаров пока нет</td></tr>';
      return;
    }

    products.forEach(product => {
      const imgUrl = product.image 
        ? `${CONFIG.FILES_URL}/${product.image}` 
        : 'https://placehold.co/100x100?text=Нет';
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${imgUrl}" class="table-img" alt="${product.title}"></td>
        <td>${product.title}</td>
        <td>${new Intl.NumberFormat('ru-RU').format(product.price)} ₽</td>
        <td>${product.description.substring(0, 50)}...</td>
        <td class="actions">
          <button class="btn btn-sm btn-edit" data-id="${product._id}">✏️</button>
          <button class="btn btn-sm btn-delete" data-id="${product._id}">🗑️</button>
        </td>
      `;
      productsTableBody.appendChild(tr);
    });

    // Обработчики кнопок
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.onclick = () => openModal(btn.dataset.id);
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
        try {
          await api.deleteProduct(btn.dataset.id);
          loadProducts();
          showMessage('Товар удален', 'success');
        } catch (err) {
          showMessage('Ошибка удаления: ' + err.message, 'error');
        }
      };
    });

  } catch (err) {
    productsTableBody.innerHTML = `<tr><td colspan="5" style="color:red">Ошибка: ${err.message}</td></tr>`;
  } finally {
    loader.classList.add('hidden');
  }
}

// Вспомогательная функция для сообщений
function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = 'message ' + type;
  messageBox.style.display = 'block';
  setTimeout(() => { messageBox.style.display = 'none'; }, 3000);
}

// Инициализация
document.getElementById('btn-add').onclick = () => openModal();
document.getElementById('btn-cancel').onclick = closeModal;
loadProducts();