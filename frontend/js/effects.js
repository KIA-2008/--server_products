// 1. ЭФФЕКТ ФОНА (Летающие частицы)
const canvas = document.createElement('canvas');
canvas.id = 'bg-canvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Создаем частицы
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 2 + 1
  });
}

// Анимация фона
function animateBg() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(139, 92, 246, 0.4)'; // Фиолетовые частицы

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    // Отталкивание от краев
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animateBg);
}
animateBg();

// 2. 3D ЭФФЕКТ ДЛЯ КАРТОЧЕК И БЛИК
document.addEventListener('mousemove', (e) => {
  // Находим все карточки на странице
  const cards = document.querySelectorAll('.product-card');
  
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Если мышка над карточкой
    if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
      // Вычисляем наклон (максимум 10 градусов)
      const rotateX = ((y - rect.height / 2) / rect.height) * -15;
      const rotateY = ((x - rect.width / 2) / rect.width) * 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Передаем координаты для блика (в CSS)
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    } else {
      // Возвращаем в исходное положение
      card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    }
  });
});

// 3. МАГНИТНЫЕ КНОПКИ
document.addEventListener('mousemove', (e) => {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(btn => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const distance = Math.sqrt(x*x + y*y);

    // Если курсор близко к кнопке (в радиусе 50px)
    if (distance < 50) {
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    } else {
      btn.style.transform = `translate(0px, 0px)`;
    }
  });
});