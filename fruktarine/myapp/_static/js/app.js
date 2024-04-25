// Код для топового меню
let burgerButton = document.querySelector(".burger");
let topBar = document.querySelector(".top-bar");
let burgerMenu = document.querySelector(".burger__menu");
burgerButton.addEventListener("click", function () {
  this.classList.toggle("burger--active");
  topBar.classList.toggle("top-bar--active");
  burgerMenu.classList.toggle("burger__menu--active");
});

// обработчик событий для клика вне topBar
document.addEventListener("click", function (event) {
  let isClickInside = topBar.contains(event.target);
  let isBurger = burgerButton.contains(event.target);
  if (!isClickInside && !isBurger) {
    topBar.classList.remove("top-bar--active");
    burgerMenu.classList.remove("burger__menu--active");
    burgerButton.classList.remove("burger--active");
  }
});

// обработчик событий для клика на ссылку внутри burgerMenu
let menuLinks = document.querySelectorAll(".burger__menu a");
menuLinks.forEach(link => {
  link.addEventListener("click", function () {
    topBar.classList.remove("top-bar--active");
    burgerMenu.classList.remove("burger__menu--active");
    burgerButton.classList.remove("burger--active");
  });
});

// Для свайпера
// // import Swiper bundle with all modules installed
// import Swiper from "swi"
//
// // import styles bundle
// import 'swiper/css/bundle';

// init Swiper:
const swiper = new Swiper('#product-swiper', {
  loop: true,
  slidesPerView: 3,
  spaceBetween: 16,
  navigation: {
    nextEl: ".swiper-btn-next",
    prevEl: ".swiper-btn-prev",
  },
});

fetch("{% static "db/products.json" %}")
  .then(response => response.json())
  .then(data => {
    data.products.forEach(product => {
      // Check if product is in stock
      if (product.available === false) {
        return; // Skip this product
      }

      // Determine if 'to-swipe' class should be added
      let toSwipe = product.available === true;

      if (toSwipe) {
        let container = document.querySelector('.container-swipe');
        let card = createProductCard(product, 'card-swipe');
        container.appendChild(card);
      }

      // Add products to gallery container
      let container = document.querySelector('.container-gallery');
      let card = createProductCard(product, 'card-gallery');
      container.appendChild(card);
    });
  })
  .catch(error => console.error('Error:', error));

let modal = document.querySelector('#product-modal');
let modalContent = modal.querySelector('.modal-content');

// Function to create product card
function createProductCard(product, type) {
  let card = document.createElement('div');
  card.classList.add('product-div', type);

  let imgBox = document.createElement('div');
  imgBox.classList.add('img-box', 'show-modal');

  let img = document.createElement('img');
  let imgAlt = product['product-name'];
  img.src = product.image;
  img.className = 'product-img';
  img.setAttribute("alt", imgAlt);
  imgBox.appendChild(img);
  card.appendChild(imgBox);

  let priceBox = document.createElement('div');
  let price = document.createElement('p');
  price.textContent = product.price;
  price.className = 'basic-price';
  priceBox.appendChild(price);

  if (type === 'card-swipe') {
    card.classList.add('to-swipe', 'swiper-slide', 'pointer');
    imgBox.classList.add('swiper_img-box');
    priceBox.classList.add('swiper__product-description');
    card.appendChild(priceBox);

  } else if (type === 'card-gallery') {
    card.classList.add('product-item');
    imgBox.classList.add('product-item__image');
    let name = document.createElement('h2');
    name.textContent = product['product-name'];
    name.className = 'product-item__heading';
    let description = document.createElement('p');
    description.textContent = product.description;
    description.className = 'product-item__text';
    // priceBox.appendChild(price);
    card.appendChild(name);
    card.appendChild(description);
    // Append button with SVG
    let button = document.createElement('button');
    button.innerHTML = `<span class="basic-price price-in-button margin__none">${product.price}</span><svg class="btn__cart" width="20" height="20" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
      '        <path d="M1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H5.59274C6.0537 2 6.45495 2.3151 6.56423 2.76293L11.2125 21.8106C11.5403 23.154 12.744 24.0993 14.1269 24.0993H28.0527C28.6049 24.0993 29.0527 23.6516 29.0527 23.0993C29.0527 22.5471 28.6049 22.0993 28.0527 22.0993H14.1269C13.666 22.0993 13.2647 21.7842 13.1554 21.3364L12.4376 18.395H29.0371C29.9273 18.395 30.7104 17.8066 30.9581 16.9515L33.5902 7.86552C33.9608 6.5863 33.001 5.30902 31.6692 5.30902H9.88892C9.67084 5.30902 9.46242 5.3434 9.26806 5.40659L8.50721 2.28878C8.17936 0.945304 6.97564 0 5.59274 0H1Z" fill="#869FA6" />\n' +
      '        <path d="M15.8599 29.9578C15.8599 31.6412 14.4952 33.006 12.8117 33.006C11.1283 33.006 9.76353 31.6412 9.76353 29.9578C9.76353 28.2743 11.1283 26.9096 12.8117 26.9096C14.4952 26.9096 15.8599 28.2743 15.8599 29.9578Z" fill="#869FA6" />\n' +
      '        <path d="M32.6249 29.9578C32.6249 31.6412 31.2602 33.006 29.5767 33.006C27.8933 33.006 26.5286 31.6412 26.5286 29.9578C26.5286 28.2743 27.8933 26.9096 29.5767 26.9096C31.2602 26.9096 32.6249 28.2743 32.6249 29.9578Z" fill="#869FA6" />\n' +
      '      </svg>`; // Replace with your SVG
    button.classList.add('btn-reset', 'btn-basic', 'product-item__btn');
    card.appendChild(button);  }


  // При клике на карточку продукта, заполняем и открываем модальное окно
  imgBox.addEventListener('click', function () {
    populateModal(modalContent, product);
    modal.style.display = "flex";
  });

  return card;
}

// Populate modal with product info
function populateModal(modalContent, product) {
  // clear current content
  modalContent.innerHTML = '';

  // Add Yellow Top Bar
  let topBar = document.createElement('div');
  topBar.classList.add('modal-content__top-bar');
  modalContent.appendChild(topBar);


  // Create and append the product name
  let name = document.createElement('h2');
  name.textContent = product['product-name'];
  name.className = 'modal-window__name';
  modalContent.appendChild(name);

  // Create and append closeButton
  let closeButton = document.createElement("span");
  closeButton.classList.add("close-btn");
  closeButton.innerHTML = "&times;";
  modalContent.appendChild(closeButton);

  //Add name and Close button to Yellow stripe
  topBar.appendChild(name);
  topBar.appendChild(closeButton);

  //Add area for image and text
  let contentZone = document.createElement("div");
  contentZone.classList.add('mw-description__content')

  //Add box for image
  let imgBox = document.createElement('div');
  imgBox.classList.add('img-box', 'modal-image');
  let img = document.createElement("img");
  img.src = product.image;
  img.className = "product-img";
  img.alt = product['product-name'];
  imgBox.appendChild(img);

  //Add box for description
  let textDescription = document.createElement("div");
  textDescription.classList.add('mw-description__text-box')

  //Add содержимое лукошка
  let cartContence = document.createElement("p");
  cartContence.textContent = product.contents;
  cartContence.classList.add('fruits')

  // Create and append the price
  let price = document.createElement('p');
  price.textContent = product.price;
  price.className = 'basic-price';

  // Create and append the button Add to Cart
  let button = document.createElement('button');
  button.innerHTML = `<span class="margin__none">Добавить в корзину</span><svg class="btn__cart" width="20" height="20" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
      '        <path d="M1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H5.59274C6.0537 2 6.45495 2.3151 6.56423 2.76293L11.2125 21.8106C11.5403 23.154 12.744 24.0993 14.1269 24.0993H28.0527C28.6049 24.0993 29.0527 23.6516 29.0527 23.0993C29.0527 22.5471 28.6049 22.0993 28.0527 22.0993H14.1269C13.666 22.0993 13.2647 21.7842 13.1554 21.3364L12.4376 18.395H29.0371C29.9273 18.395 30.7104 17.8066 30.9581 16.9515L33.5902 7.86552C33.9608 6.5863 33.001 5.30902 31.6692 5.30902H9.88892C9.67084 5.30902 9.46242 5.3434 9.26806 5.40659L8.50721 2.28878C8.17936 0.945304 6.97564 0 5.59274 0H1Z" fill="#869FA6" />\n' +
      '        <path d="M15.8599 29.9578C15.8599 31.6412 14.4952 33.006 12.8117 33.006C11.1283 33.006 9.76353 31.6412 9.76353 29.9578C9.76353 28.2743 11.1283 26.9096 12.8117 26.9096C14.4952 26.9096 15.8599 28.2743 15.8599 29.9578Z" fill="#869FA6" />\n' +
      '        <path d="M32.6249 29.9578C32.6249 31.6412 31.2602 33.006 29.5767 33.006C27.8933 33.006 26.5286 31.6412 26.5286 29.9578C26.5286 28.2743 27.8933 26.9096 29.5767 26.9096C31.2602 26.9096 32.6249 28.2743 32.6249 29.9578Z" fill="#869FA6" />\n' +
      '      </svg>`; // Replace with your SVG
  button.classList.add('btn-reset', 'btn-basic', 'add-to-cart');

  textDescription.appendChild(cartContence);
  textDescription.appendChild(price);
  textDescription.appendChild(button);

  contentZone.appendChild(imgBox);
  contentZone.appendChild(textDescription);

  modalContent.appendChild(contentZone);

  // Close modal on close button click
  closeButton.addEventListener('click', function () {
    modal.style.display = "none";
  });
  // Для закрытия модального окна при клике на его фон
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Close the modal on 'esc' key press
  document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
      modal.style.display = "none";
    }
  });
}

fetch("{% url "cart:cart_detail" %}", {
  method: 'GET',
})
  .then(response => response.text()) // получаем текст ответа
  .then(html => {
    document.querySelector('#cart').innerHTML = html; // вставляем HTML
  })
  .catch(err => console.log('An error happened: ', err)); // обрабатываем ошибки, если они есть
