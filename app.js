// ======================================================
// FIREBASE
// ======================================================

import { db }
from "./firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ======================================================
// TELEGRAM CONFIG
// ======================================================

const TELEGRAM_BOT_TOKEN =
"8290012420:AAEDlZvBKk6y8cNY40qu_frp6ppcy-2atP8";

const TELEGRAM_CHAT_ID =
"7166493375";

// ======================================================
// DOM
// ======================================================

const productsGrid =
document.getElementById("productsGrid");

const cartCount =
document.getElementById("cartCount");

const cartSidebar =
document.getElementById("cartSidebar");

const cartItems =
document.getElementById("cartItems");

const cartTotal =
document.getElementById("cartTotal");

const overlay =
document.getElementById("overlay");

const searchInput =
document.getElementById("searchInput");

const loader =
document.getElementById("loader");

const navbar =
document.getElementById("navbar");

const music =
document.getElementById("backgroundMusic");

const musicToggle =
document.getElementById("musicToggle");

const backToTop =
document.getElementById("backToTop");

// ======================================================
// DATA
// ======================================================

let products = [];

let cart =
JSON.parse(
  localStorage.getItem("cart")
) || [];

let isPlaying = false;

// ======================================================
// FORMAT PRICE
// ======================================================

function formatPrice(price){

  return Number(price || 0)
  .toLocaleString("vi-VN") + "đ";

}

// ======================================================
// TELEGRAM SEND
// ======================================================

async function sendTelegramMessage(message){

  try{

    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          chat_id:TELEGRAM_CHAT_ID,

          text:message,

          parse_mode:"HTML"

        })

      }
    );

  }

  catch(error){

    console.log(
      "Telegram Error:",
      error
    );

  }

}

// ======================================================
// TOAST
// ======================================================

function showToast(message){

  const toast =
  document.createElement("div");

  toast.className = "toast";

  toast.innerHTML = message;

  document.body.appendChild(toast);

  setTimeout(()=>{

    toast.classList.add("show");

  },100);

  setTimeout(()=>{

    toast.classList.remove("show");

    setTimeout(()=>{

      toast.remove();

    },400);

  },2500);

}

// ======================================================
// SAVE CART
// ======================================================

function saveCart(){

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

}

// ======================================================
// LOADER
// ======================================================

function hideLoader(){

  if(loader){

    setTimeout(()=>{

      loader.style.opacity = "0";

      setTimeout(()=>{

        loader.style.display = "none";

      },500);

    },700);

  }

}

// ======================================================
// LOAD PRODUCTS
// ======================================================

async function loadProducts(){

  try{

    productsGrid.innerHTML = `

      <div class="loading-products">

        Đang tải sản phẩm...

      </div>

    `;

    const snapshot =
    await getDocs(
      collection(db,"products")
    );

    products = [];

    snapshot.forEach(doc => {

      products.push({

        id:doc.id,

        ...doc.data()

      });

    });

    renderProducts(products);

  }

  catch(error){

    console.log(error);

    productsGrid.innerHTML = `

      <div class="empty-product">

        <h3>
          Không tải được sản phẩm
        </h3>

      </div>

    `;

  }

}

// ======================================================
// RENDER PRODUCTS
// ======================================================

function renderProducts(data = []){

  productsGrid.innerHTML = "";

  if(data.length === 0){

    productsGrid.innerHTML = `

      <div class="empty-product">

        <h3>
          Không có sản phẩm
        </h3>

      </div>

    `;

    return;

  }

  data.forEach(product => {

    productsGrid.innerHTML += `

      <div class="product-card">

        <div class="product-image-wrap">

          <img
            src="${product.image}"
            class="product-image"
            loading="lazy"
            onerror="this.src='https://via.placeholder.com/500'"
          >

        </div>

        <div class="product-info">

          <div class="product-category">

            ${product.category || "Gạo sạch"}

          </div>

          <h3 class="product-title">

            ${product.name || ""}

          </h3>

          <div class="product-price">

            ${formatPrice(product.price)}

          </div>

          <button
            class="add-cart-btn"
            onclick="addToCart('${product.id}')"
          >

            <i class="fa-solid fa-cart-shopping"></i>

            Thêm vào giỏ

          </button>

        </div>

      </div>

    `;

  });

  initReveal();

}

// ======================================================
// SEARCH
// ======================================================

function searchProducts(){

  const keyword =
  searchInput.value.toLowerCase();

  const filtered =
  products.filter(product => {

    return product.name
    .toLowerCase()
    .includes(keyword);

  });

  renderProducts(filtered);

}

if(searchInput){

  searchInput.addEventListener(
    "keyup",
    searchProducts
  );

}

// ======================================================
// FILTER BUTTON
// ======================================================

function setupFilterButtons(){

  const buttons =
  document.querySelectorAll(".filter-btn");

  buttons.forEach(button => {

    button.addEventListener(
      "click",
      ()=>{

        buttons.forEach(btn => {

          btn.classList.remove("active");

        });

        button.classList.add("active");

        const filter =
        button.dataset.filter;

        if(filter === "all"){

          renderProducts(products);

        }

        else{

          const filtered =
          products.filter(product => {

            return product.category === filter;

          });

          renderProducts(filtered);

        }

      }
    );

  });

}

// ======================================================
// ADD TO CART
// ======================================================

function addToCart(id){

  const product =
  products.find(item => item.id === id);

  if(!product){

    showToast("Không tìm thấy sản phẩm");

    return;

  }

  const existing =
  cart.find(item => item.id === id);

  if(existing){

    existing.quantity++;

  }

  else{

    cart.push({

      ...product,

      quantity:1

    });

  }

  updateCart();

  openCart();

  showToast("Đã thêm vào giỏ hàng");

}

// ======================================================
// UPDATE CART
// ======================================================

function updateCart(){

  saveCart();

  cartItems.innerHTML = "";

  let total = 0;

  let quantity = 0;

  if(cart.length === 0){

    cartItems.innerHTML = `

      <div class="empty-cart">

        <i class="fa-solid fa-cart-shopping"></i>

        <p>
          Giỏ hàng đang trống
        </p>

      </div>

    `;

  }

  cart.forEach(item => {

    total +=
    item.price * item.quantity;

    quantity += item.quantity;

    cartItems.innerHTML += `

      <div class="cart-item">

        <img src="${item.image}">

        <div class="cart-item-info">

          <h4>

            ${item.name}

          </h4>

          <p>

            ${formatPrice(item.price)}

          </p>

          <div class="cart-actions">

            <button
              onclick="decreaseQty('${item.id}')"
            >
              -
            </button>

            <span>
              ${item.quantity}
            </span>

            <button
              onclick="increaseQty('${item.id}')"
            >
              +
            </button>

          </div>

        </div>

      </div>

    `;

  });

  cartCount.innerText = quantity;

  cartTotal.innerText =
  formatPrice(total);

}

// ======================================================
// INCREASE QTY
// ======================================================

function increaseQty(id){

  const item =
  cart.find(item => item.id === id);

  if(item){

    item.quantity++;

  }

  updateCart();

}

// ======================================================
// DECREASE QTY
// ======================================================

function decreaseQty(id){

  const item =
  cart.find(item => item.id === id);

  if(item){

    item.quantity--;

    if(item.quantity <= 0){

      cart =
      cart.filter(p => p.id !== id);

      showToast("Đã xóa sản phẩm");

    }

  }

  updateCart();

}

// ======================================================
// OPEN CART
// ======================================================

function openCart(){

  cartSidebar.classList.add("active");

  overlay.classList.add("active");

  document.body.style.overflow = "hidden";

}

// ======================================================
// CLOSE CART
// ======================================================

function closeCart(){

  cartSidebar.classList.remove("active");

  overlay.classList.remove("active");

  document.body.style.overflow = "auto";

}

overlay.addEventListener(
  "click",
  closeCart
);

// ======================================================
// CHECKOUT FORM
// ======================================================

function toggleCheckoutForm(){

  const form =
  document.getElementById("checkoutForm");

  if(form.style.display === "block"){

    form.style.display = "none";

  }

  else{

    form.style.display = "block";

  }

}

// ======================================================
// CHECKOUT
// ======================================================

async function checkout(){

  if(cart.length === 0){

    showToast("Giỏ hàng đang trống");

    return;

  }

  const customerName =
  document.getElementById("customerName")
  .value.trim();

  const customerPhone =
  document.getElementById("customerPhone")
  .value.trim();

  const customerAddress =
  document.getElementById("customerAddress")
  .value.trim();

  if(
    !customerName ||
    !customerPhone ||
    !customerAddress
  ){

    showToast("Nhập đầy đủ thông tin");

    return;

  }

  let total = 0;

  let productText = "";

  cart.forEach(item => {

    total +=
    item.price * item.quantity;

    productText +=
    `• ${item.name} x${item.quantity}\n`;

  });

  const order = {

    customer:customerName,

    phone:customerPhone,

    address:customerAddress,

    items:cart,

    total:total,

    status:"Đang xử lý",

    createdAt:serverTimestamp()

  };

  try{

    await addDoc(
      collection(db,"orders"),
      order
    );

    // ======================================================
    // SEND TELEGRAM
    // ======================================================

    const telegramMessage = `

🛒 <b>ĐƠN HÀNG MỚI</b>

👤 <b>Khách:</b> ${customerName}

📞 <b>SĐT:</b> ${customerPhone}

📍 <b>Địa chỉ:</b>
${customerAddress}

━━━━━━━━━━━━━━

📦 <b>Sản phẩm:</b>

${productText}

━━━━━━━━━━━━━━

💰 <b>Tổng tiền:</b>
${formatPrice(total)}

🕒 <b>Trạng thái:</b>
Đang xử lý

`;

    await sendTelegramMessage(
      telegramMessage
    );

    showToast("Đặt hàng thành công");

    cart = [];

    updateCart();

    closeCart();

    document.getElementById(
      "customerName"
    ).value = "";

    document.getElementById(
      "customerPhone"
    ).value = "";

    document.getElementById(
      "customerAddress"
    ).value = "";

  }

  catch(error){

    console.log(error);

    showToast("Lỗi gửi đơn hàng");

  }

}

// ======================================================
// MENU MOBILE
// ======================================================

function toggleMenu(){

  navbar.classList.toggle("show");

}

// ======================================================
// MUSIC
// ======================================================

if(musicToggle && music){

  musicToggle.addEventListener(
    "click",
    ()=>{

      if(isPlaying){

        music.pause();

        musicToggle.innerHTML =
        '<i class="fa-solid fa-music"></i>';

      }

      else{

        music.play();

        musicToggle.innerHTML =
        '<i class="fa-solid fa-pause"></i>';

      }

      isPlaying = !isPlaying;

    }
  );

}

// ======================================================
// BACK TO TOP
// ======================================================

window.addEventListener(
  "scroll",
  ()=>{

    if(window.scrollY > 300){

      backToTop.style.display = "flex";

    }

    else{

      backToTop.style.display = "none";

    }

  }
);

backToTop.addEventListener(
  "click",
  ()=>{

    window.scrollTo({

      top:0,

      behavior:"smooth"

    });

  }
);

// ======================================================
// HEADER SCROLL
// ======================================================

window.addEventListener(
  "scroll",
  ()=>{

    const header =
    document.querySelector(".header");

    if(window.scrollY > 80){

      header.style.background =
      "rgba(5,8,22,.92)";

    }

    else{

      header.style.background =
      "rgba(5,8,22,.6)";

    }

  }
);

// ======================================================
// REVEAL EFFECT
// ======================================================

function initReveal(){

  const elements =
  document.querySelectorAll(
    ".product-card,.feature-box,.review-card,.blog-card"
  );

  const observer =
  new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if(entry.isIntersecting){

        entry.target.classList.add(
          "show-element"
        );

      }

    });

  },{
    threshold:.1
  });

  elements.forEach(el => {

    el.classList.add("hidden-element");

    observer.observe(el);

  });

}
// ======================================================
// PREMIUM HERO SLIDER
// ======================================================

const heroImages =
document.querySelectorAll(".hero-bg");

let currentHero = 0;

setInterval(()=>{

  heroImages[currentHero]
  .classList.remove("active");

  currentHero++;

  if(currentHero >= heroImages.length){

    currentHero = 0;

  }

  heroImages[currentHero]
  .classList.add("active");

},5000);

// ======================================================
// GLOBAL
// ======================================================

window.addToCart = addToCart;

window.increaseQty = increaseQty;

window.decreaseQty = decreaseQty;

window.openCart = openCart;

window.closeCart = closeCart;

window.toggleCheckoutForm =
toggleCheckoutForm;

window.checkout = checkout;

window.toggleMenu = toggleMenu;

// ======================================================
// START
// ======================================================

window.addEventListener(
  "load",
  async ()=>{

    hideLoader();

    await loadProducts();

    updateCart();

    setupFilterButtons();

  }
);