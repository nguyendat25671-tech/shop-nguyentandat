// =======================
// DOM
// =======================

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

let products = [];

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

// =======================
// LOAD PRODUCTS
// =======================

async function loadProducts(){

  try{

    const response =
    await fetch("products.json");

    products =
    await response.json();

    renderProducts();

  }catch(error){

    console.log(error);

  }

}

// =======================
// RENDER PRODUCTS
// =======================

function renderProducts(data = products){

  productsGrid.innerHTML = "";

  data.forEach(product => {

    productsGrid.innerHTML += `

      <div class="product-card">

        <img
          src="${product.image}"
          class="product-image"
        >

        <div class="product-info">

          <h3 class="product-title">
            ${product.name}
          </h3>

          <div class="product-price">
            ${Number(product.price)
              .toLocaleString()}đ
          </div>

          <button
            class="add-cart-btn"
            onclick="addToCart(${product.id})"
          >

            🛒 Thêm vào giỏ

          </button>

        </div>

      </div>

    `;

  });

}

// =======================
// ADD CART
// =======================

function addToCart(id){

  const product =
  products.find(
    item => item.id === id
  );

  const existing =
  cart.find(
    item => item.id === id
  );

  if(existing){

    existing.quantity++;

  }else{

    cart.push({

      ...product,

      quantity:1

    });

  }

  updateCart();

}

// =======================
// UPDATE CART
// =======================

function updateCart(){

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  let total = 0;
  let totalQuantity = 0;

  cartItems.innerHTML = "";

  cart.forEach(item => {

    total +=
    item.price * item.quantity;

    totalQuantity += item.quantity;

    cartItems.innerHTML += `

      <div class="cart-item">

        <img src="${item.image}">

        <div class="cart-item-info">

          <h4>${item.name}</h4>

          <p>
            ${item.price.toLocaleString()}đ
          </p>

          <div class="cart-actions">

            <button
              class="minus-btn"
              onclick="decreaseQty(${item.id})"
            >
              -
            </button>

            <span>
              ${item.quantity}
            </span>

            <button
              class="plus-btn"
              onclick="increaseQty(${item.id})"
            >
              +
            </button>

          </div>

        </div>

      </div>

    `;

  });

  cartCount.innerText =
  totalQuantity;

  cartTotal.innerText =
  total.toLocaleString() + "đ";

}

// =======================
// INCREASE
// =======================

function increaseQty(id){

  const item =
  cart.find(
    item => item.id === id
  );

  item.quantity++;

  updateCart();

}

// =======================
// DECREASE
// =======================

function decreaseQty(id){

  const item =
  cart.find(
    item => item.id === id
  );

  item.quantity--;

  if(item.quantity <= 0){

    cart =
    cart.filter(
      p => p.id !== id
    );

  }

  updateCart();

}

// =======================
// OPEN CART
// =======================

function openCart(){

  cartSidebar.classList.add(
    "active"
  );

  overlay.classList.add(
    "active"
  );

}

// =======================
// CLOSE CART
// =======================

function closeCart(){

  cartSidebar.classList.remove(
    "active"
  );

  overlay.classList.remove(
    "active"
  );

}

// =======================
// CHECKOUT
// =======================

function toggleCheckoutForm(){

  const form =
  document.getElementById(
    "checkoutForm"
  );

  if(
    form.style.display === "block"
  ){

    form.style.display = "none";

  }else{

    form.style.display = "block";

    setTimeout(()=>{

      form.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });

    },100);

  }

}

// =======================
// TELEGRAM
// =======================

const token =
"8290012420:AAEDlZvBKk6y8cNY40qu_frp6ppcy-2atP8";

const chatId =
"7166493375";

// =======================
// CHECKOUT
// =======================

function checkout(){

  const name =
  document.getElementById(
    "customerName"
  ).value;

  const phone =
  document.getElementById(
    "customerPhone"
  ).value;

  const address =
  document.getElementById(
    "customerAddress"
  ).value;

  let text =
  "🛒 ĐƠN HÀNG MỚI%0A%0A";

  cart.forEach(item => {

    text +=
    `${item.name} x ${item.quantity}%0A`;

  });

  text += `%0A👤 ${name}`;
  text += `%0A📞 ${phone}`;
  text += `%0A📍 ${address}`;
  text += `%0A💰 ${cartTotal.innerText}`;

  fetch(
    `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}`
  )

  .then(()=>{

    alert(
      "Đặt hàng thành công"
    );

    cart = [];

    updateCart();

    closeCart();

  });

}

// =======================
// START
// =======================

loadProducts();

updateCart();