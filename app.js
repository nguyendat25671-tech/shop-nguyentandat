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

const heroSection =
document.querySelector(".hero");

// =======================
// OVERLAY
// =======================

if(overlay){

  overlay.addEventListener(
    "click",
    closeCart
  );

}

// =======================
// HERO SLIDER
// =======================

const heroImages = [

  "anh1.jpg",

  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1600&auto=format&fit=crop",

  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop",

  "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop"

];

let currentHero = 0;

if(heroSection){

  setInterval(()=>{

    currentHero++;

    if(currentHero >= heroImages.length){

      currentHero = 0;

    }

    heroSection.style.background = `

      linear-gradient(
        rgba(0,0,0,0.45),
        rgba(0,0,0,0.45)
      ),

      url('${heroImages[currentHero]}')

    `;

    heroSection.style.backgroundSize =
    "cover";

    heroSection.style.backgroundPosition =
    "center";

  },4000);

}

// =======================
// PRODUCTS
// =======================

let products =
JSON.parse(
  localStorage.getItem("products")
) || [

  {
    id:1,
    name:"Hạt Dẻ Cười Premium",
    price:119000,
    image:"https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1200&auto=format&fit=crop"
  },

  {
    id:2,
    name:"Hạt Macca Úc",
    price:350000,
    image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop"
  }

];

// =======================
// CART
// =======================

let cart =
JSON.parse(
  localStorage.getItem("cart")
) || [];

cart = cart.map(item => ({

  ...item,

  quantity:
  item.quantity || 1

}));

// =======================
// RENDER PRODUCTS
// =======================

function renderProducts(data = products){

  if(!productsGrid){

    return;

  }

  productsGrid.innerHTML = "";

  if(data.length === 0){

    productsGrid.innerHTML = `

      <div class="empty-products">
        Không tìm thấy sản phẩm
      </div>

    `;

    return;

  }

  data.forEach(product => {

    productsGrid.innerHTML += `

      <div class="product-card">

        <img
          src="${product.image}"
          class="product-image"
          alt="${product.name}"
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
// SEARCH
// =======================

if(searchInput){

  searchInput.addEventListener(
    "keyup",
    searchProduct
  );

}

function removeVietnameseTones(str){

  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/đ/g,"d")
    .replace(/Đ/g,"D");

}

function searchProduct(){

  const keyword =
  removeVietnameseTones(
    searchInput.value.toLowerCase()
  );

  const filtered =
  products.filter(product => {

    const productName =
    removeVietnameseTones(
      product.name.toLowerCase()
    );

    return productName.includes(keyword);

  });

  renderProducts(filtered);

}

// =======================
// ADD TO CART
// =======================

function addToCart(id){

  const product =
  products.find(
    item => item.id === id
  );

  if(!product){

    return;

  }

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

  showToast(
    "Đã thêm vào giỏ hàng"
  );

  openCart();

}

// =======================
// INCREASE
// =======================

function increaseQty(id){

  const item =
  cart.find(
    item => item.id === id
  );

  if(item){

    item.quantity++;

  }

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

  if(item){

    item.quantity--;

    if(item.quantity <= 0){

      removeCart(id);

      return;

    }

  }

  updateCart();

}

// =======================
// REMOVE CART
// =======================

function removeCart(id){

  cart =
  cart.filter(
    item => item.id !== id
  );

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

  let totalQuantity = 0;

  cart.forEach(item => {

    totalQuantity += item.quantity;

  });

  if(cartCount){

    cartCount.innerText =
    totalQuantity;

  }

  if(!cartItems){

    return;

  }

  cartItems.innerHTML = "";

  let total = 0;

  if(cart.length === 0){

    cartItems.innerHTML = `

      <p class="empty-cart">
        Giỏ hàng đang trống
      </p>

    `;

  }

  cart.forEach(item => {

    total +=
    item.price *
    item.quantity;

    cartItems.innerHTML += `

      <div class="cart-item">

        <img
          src="${item.image}"
        >

        <div class="cart-item-info">

          <h4>
            ${item.name}
          </h4>

          <p>
            ${Number(item.price)
              .toLocaleString()}đ
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

            <button
              class="remove-cart-btn"
              onclick="removeCart(${item.id})"
            >
              Xóa
            </button>

          </div>

        </div>

      </div>

    `;

  });

  if(cartTotal){

    cartTotal.innerText =
    total.toLocaleString() + "đ";

  }

}

// =======================
// TOGGLE CHECKOUT FORM
// =======================

function toggleCheckoutForm(){

  const form =
  document.getElementById(
    "checkoutForm"
  );

  if(!form){
    return;
  }

  if(
    form.style.display === "none" ||
    form.style.display === ""
  ){

    form.style.display = "block";

  }else{

    form.style.display = "none";

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

  if(cart.length === 0){

    showToast(
      "Giỏ hàng đang trống"
    );

    return;

  }

  const name =
  document.getElementById(
    "customerName"
  ).value.trim();

  const phone =
  document.getElementById(
    "customerPhone"
  ).value.trim();

  const address =
  document.getElementById(
    "customerAddress"
  ).value.trim();

  if(
    !name ||
    !phone ||
    !address
  ){

    showToast(
      "Vui lòng nhập đầy đủ thông tin"
    );

    return;

  }

  let orderText =
  "🛒 ĐƠN HÀNG MỚI%0A%0A";

  cart.forEach(item => {

    orderText +=
    `• ${item.name} x ${item.quantity}%0A`;

  });

  orderText += `%0A👤 ${name}`;
  orderText += `%0A📞 ${phone}`;
  orderText += `%0A📍 ${address}`;
  orderText += `%0A💰 ${cartTotal.innerText}`;

  fetch(
    `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${orderText}`
  )

  .then(res => res.json())

  .then(()=>{

    showToast(
      "Đặt hàng thành công"
    );

    cart = [];

    updateCart();

    closeCart();

  })

  .catch(()=>{

    showToast(
      "Lỗi gửi đơn hàng"
    );

  });

}

// =======================
// CART SIDEBAR
// =======================

function openCart(){

  if(cartSidebar){

    cartSidebar.classList.add(
      "active"
    );

  }

  if(overlay){

    overlay.classList.add(
      "active"
    );

  }

}

function closeCart(){

  if(cartSidebar){

    cartSidebar.classList.remove(
      "active"
    );

  }

  if(overlay){

    overlay.classList.remove(
      "active"
    );

  }

}

// =======================
// TOAST
// =======================

function showToast(message){

  const toast =
  document.createElement("div");

  toast.innerText =
  message;

  toast.style.position =
  "fixed";

  toast.style.bottom =
  "30px";

  toast.style.right =
  "30px";

  toast.style.background =
  "#111";

  toast.style.color =
  "#fff";

  toast.style.padding =
  "14px 22px";

  toast.style.borderRadius =
  "12px";

  toast.style.zIndex =
  "9999";

  document.body.appendChild(
    toast
  );

  setTimeout(()=>{

    toast.remove();

  },2000);

}

// =======================
// LOADER
// =======================

window.addEventListener(
  "load",
  ()=>{

    const loader =
    document.getElementById(
      "loader"
    );

    if(loader){

      loader.style.display =
      "none";

    }

  }
);

// =======================
// START
// =======================

renderProducts();

updateCart();