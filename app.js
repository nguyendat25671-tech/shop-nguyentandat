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
overlay.addEventListener(
  "click",
  closeCart
);
const searchInput =
document.getElementById("searchInput");

const productImageInput =
document.getElementById("productImage");

const previewImage =
document.getElementById("previewImage");

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

const heroSection =
document.querySelector(".hero");

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
// PREVIEW IMAGE
// =======================

if(productImageInput){

  productImageInput.addEventListener(
    "change",
    function(){

      const file = this.files[0];

      if(file){

        const reader =
        new FileReader();

        reader.onload = function(e){

          previewImage.src =
          e.target.result;

          previewImage.style.display =
          "block";

        };

        reader.readAsDataURL(file);

      }

    }
  );

}

// =======================
// ADMIN
// =======================

let isAdmin =
localStorage.getItem("admin")
=== "true";

if(isAdmin){

  document.getElementById(
    "adminBox"
  ).style.display = "flex";

}

function adminLogin(){

  const password =
  prompt("Nhập mật khẩu admin");

 if(password === "123"){

    isAdmin = true;

    localStorage.setItem(
      "admin",
      "true"
    );

    alert("Đăng nhập thành công");

    document.getElementById(
      "adminBox"
    ).style.display = "flex";

    renderProducts();

  }else{

    alert("Sai mật khẩu");

  }

}

function logoutAdmin(){

  localStorage.removeItem(
    "admin"
  );

  isAdmin = false;

  document.getElementById(
    "adminBox"
  ).style.display = "none";

  renderProducts();

  alert("Đã đăng xuất");

}

// =======================
// CART
// =======================

let cart =
JSON.parse(
  localStorage.getItem("cart")
) || [];

cart = cart.map(item => ({

  ...item,

  quantity:item.quantity || 1

}));

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
  },

  {
    id:3,
    name:"Granola Dâu Tây",
    price:200000,
    image:"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=1200&auto=format&fit=crop"
  },

  {
    id:4,
    name:"Hạt Điều Rang Muối",
    price:150000,
    image:"https://images.unsplash.com/photo-1505253216365-2a78ffcf7e11?q=80&w=1200&auto=format&fit=crop"
  }

];

// =======================
// RENDER PRODUCTS
// =======================

function renderProducts(data = products){

  productsGrid.innerHTML = "";

  if(data.length === 0){

    productsGrid.innerHTML = `

      <h2 class="not-found">
        Không tìm thấy sản phẩm
      </h2>

    `;

    return;

  }

  data.forEach(product => {

    const cartItem =
    cart.find(
      item => item.id === product.id
    );

    const quantity =
    cartItem
    ? cartItem.quantity
    : 0;

    productsGrid.innerHTML += `

      <div class="product-card">

        <img src="${product.image}">

        <div class="product-info">

          <h3>${product.name}</h3>

          <p class="price">
            ${Number(product.price).toLocaleString()}đ
          </p>

          <button
            class="add-cart"
            onclick="addToCart(${product.id})">

            🛒 Thêm vào giỏ

          </button>

          ${
            quantity > 0
            ?
            `
            <div class="quantity-box">

              <button
                class="qty-btn"
                onclick="decreaseQty(${product.id})">

                -

              </button>

              <span class="qty-number">

                ${quantity}

              </span>

              <button
                class="qty-btn"
                onclick="increaseQty(${product.id})">

                +

              </button>

            </div>
            `
            :
            ""
          }

          ${
            isAdmin
            ?
            `
            <button
              class="remove-btn"
              onclick="deleteProduct(${product.id})">

              Xóa sản phẩm

            </button>
            `
            :
            ""
          }

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

  const existing =
  cart.find(
    item => item.id === id
  );

  if(existing){

    existing.quantity += 1;

  }else{

    cart.push({

      ...product,
      quantity:1

    });

  }

  updateCart();

  renderProducts();

  showToast();

  openCart();

}

// =======================
// INCREASE
// =======================

function increaseQty(id){

  const item =
  cart.find(
    product => product.id === id
  );

  if(item){

    item.quantity += 1;

  }

  updateCart();

  renderProducts();

}

// =======================
// DECREASE
// =======================

function decreaseQty(id){

  const item =
  cart.find(
    product => product.id === id
  );

  if(item){

    item.quantity -= 1;

    if(item.quantity <= 0){

      cart =
      cart.filter(
        product => product.id !== id
      );

    }

  }

  updateCart();

  renderProducts();

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

  renderProducts();

}

// =======================
// DELETE PRODUCT
// =======================

function deleteProduct(id){

  if(!isAdmin){

    alert("Không có quyền");

    return;

  }

  const confirmDelete =
  confirm("Bạn chắc chắn muốn xóa?");

  if(confirmDelete){

    products =
    products.filter(
      item => item.id !== id
    );

    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );

    renderProducts();

  }

}

// =======================
// ADD PRODUCT
// =======================

function addProduct(){

  if(!isAdmin){

    alert("Không có quyền");

    return;

  }

  const name =
  document.getElementById("productName").value;

  const price =
  document.getElementById("productPrice").value;

  const imageFile =
  document.getElementById("productImage").files[0];

  if(name === "" || price === "" || !imageFile){

    alert("Vui lòng nhập đầy đủ");

    return;

  }

  const reader =
  new FileReader();

  reader.onload = function(e){

    const newProduct = {

      id:Date.now(),

      name:name,

      price:Number(price),

      image:e.target.result

    };

    products.push(newProduct);

    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );

    renderProducts();

    alert("Đã thêm sản phẩm");

  };

  reader.readAsDataURL(imageFile);

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

  cartCount.innerText =
  totalQuantity;

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
  Number(item.price) *
  Number(item.quantity);

  cartItems.innerHTML += `

    <div class="cart-item">

      <img src="${item.image}">

      <div class="cart-item-info">

        <h4>${item.name}</h4>

        <p>
          ${Number(item.price).toLocaleString()}đ
        </p>

        <div class="cart-actions">

          <button
            class="minus-btn"
            onclick="decreaseQty(${item.id})">

            -

          </button>

          <span class="qty-number">
            ${item.quantity}
          </span>

          <button
            class="plus-btn"
            onclick="increaseQty(${item.id})">

            +

          </button>

          <button
            class="remove-cart-btn"
            onclick="removeCart(${item.id})">

            Xóa

          </button>

        </div>

      </div>

    </div>

  `;

});

  cartTotal.innerText =
  total.toLocaleString() + "đ";

}
// =======================
// TELEGRAM CONFIG
// =======================

const token =
"8290012420:AAEDlZvBKk6y8cNY40qu_frp6ppcy-2atP8";

const chatId =
"7166493375";

// =======================
// ORDERS STORAGE
// =======================

let orders =
JSON.parse(
localStorage.getItem("orders")
) || [];

// =======================
// TOGGLE CHECKOUT FORM
// =======================

function toggleCheckoutForm(){

const form =
document.getElementById(
"checkoutForm"
);

if(form.style.display === "none"){

form.style.display = "block";

}else{

form.style.display = "none";

}

}

// =======================
// CHECKOUT
// =======================

function checkout(){

  // KIỂM TRA GIỎ HÀNG
  if(cart.length === 0){

    alert("Giỏ hàng đang trống");

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

  // KIỂM TRA NHẬP ĐỦ
  if(
    name === "" ||
    phone === "" ||
    address === ""
  ){

    alert("Vui lòng nhập đầy đủ thông tin");

    return;

  }

  // KIỂM TRA SĐT
  if(phone.length < 9){

    alert("Số điện thoại không hợp lệ");

    return;

  }

  const order = {

    id: Date.now(),

    customer: name,

    phone: phone,

    address: address,

    items: [...cart],

    total: cartTotal.innerText,

    status: "Chờ xử lý",

    paid: false,

    time: new Date().toLocaleString()

  };

  orders.push(order);

  localStorage.setItem(
    "orders",
    JSON.stringify(orders)
  );

  let orderText =
  "🛒 ĐƠN HÀNG MỚI%0A%0A";

  cart.forEach(item => {

    orderText +=
    `• ${item.name} x ${item.quantity}%0A`;

  });

  orderText += `%0A👤 Tên: ${name}`;
  orderText += `%0A📞 SĐT: ${phone}`;
  orderText += `%0A📍 Địa chỉ: ${address}`;
  orderText += `%0A💰 Tổng: ${cartTotal.innerText}`;

  fetch(

    `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${orderText}`

  )

  .then(res => res.json())

  .then(data => {

    alert("Đặt hàng thành công");

    cart = [];

    updateCart();

    renderProducts();

    closeCart();

    renderOrders();

    // RESET FORM
    document.getElementById(
      "customerName"
    ).value = "";

    document.getElementById(
      "customerPhone"
    ).value = "";

    document.getElementById(
      "customerAddress"
    ).value = "";

    document.getElementById(
      "checkoutForm"
    ).style.display = "none";

  })

  .catch(err => {

    alert("Lỗi gửi đơn hàng");

  });

}

// =======================
// RENDER ORDERS
// =======================

function renderOrders(){

if(!isAdmin){

return;

}

let adminOrders =
document.getElementById(
"adminOrders"
);

if(!adminOrders){

adminOrders =
document.createElement("div");

adminOrders.id =
"adminOrders";

adminOrders.style.padding =
"30px";

document.body.appendChild(
  adminOrders
);

}

adminOrders.innerHTML =
"📦 Lịch sử đơn hàng";

if(orders.length === 0){

adminOrders.innerHTML +=
"<p>Chưa có đơn hàng</p>";

return;

}

[...orders].reverse().forEach(order => {

let itemsText = "";

order.items.forEach(item => {

  itemsText +=
  `<li>${item.name} x ${item.quantity}</li>`;

});

adminOrders.innerHTML += `

  <div style="
    background:#fff;
    padding:20px;
    margin-top:15px;
    border-radius:12px;
    box-shadow:0 2px 10px rgba(0,0,0,0.1);
  ">

    <h3>
      🧾 Đơn #${order.id}
    </h3>

    <p>
      <b>👤</b>
      ${order.customer}
    </p>

    <p>
      <b>📞</b>
      ${order.phone}
    </p>

    <p>
      <b>📍</b>
      ${order.address}
    </p>

    <p>
      <b>🕒</b>
      ${order.time}
    </p>

    <ul>
      ${itemsText}
    </ul>

    <p>
      <b>💰 Tổng:</b>
      ${order.total}
    </p>

    <p>
      <b>📦 Trạng thái:</b>
      ${order.status}
    </p>

    <p>
      <b>💳 Thanh toán:</b>

      ${
        order.paid
        ? "Đã thanh toán"
        : "Chưa thanh toán"
      }

    </p>

    <button
      onclick="confirmPaid(${order.id})"
      style="
        padding:10px 15px;
        border:none;
        border-radius:8px;
        background:green;
        color:#fff;
        cursor:pointer;
        margin-top:10px;
      ">

      ✅ Xác nhận đã thanh toán

    </button>

    <button
      onclick="markDelivered(${order.id})"
      style="
        padding:10px 15px;
        border:none;
        border-radius:8px;
        background:#0d6efd;
        color:#fff;
        cursor:pointer;
        margin-top:10px;
        margin-left:10px;
      ">

      🚚 Đã giao

    </button>

    <button
      onclick="deleteOrder(${order.id})"
      style="
        padding:10px 15px;
        border:none;
        border-radius:8px;
        background:red;
        color:#fff;
        cursor:pointer;
        margin-top:10px;
        margin-left:10px;
      ">

      🗑 Xóa đơn

    </button>

  </div>

`;

});

}

// =======================
// CONFIRM PAYMENT
// =======================

function confirmPaid(id){

const order =
orders.find(o => o.id === id);

if(order){

order.paid = true;

localStorage.setItem(
  "orders",
  JSON.stringify(orders)
);

renderOrders();

alert("Đã xác nhận thanh toán");

}

}

// =======================
// MARK DELIVERED
// =======================

function markDelivered(id){

const order =
orders.find(o => o.id === id);

if(order){

order.status =
"Đã giao";

localStorage.setItem(
  "orders",
  JSON.stringify(orders)
);

renderOrders();

alert("Đã cập nhật trạng thái");

}

}

// =======================
// DELETE ORDER
// =======================

function deleteOrder(id){

const confirmDelete =
confirm("Xóa đơn hàng này?");

if(confirmDelete){

orders =
orders.filter(
  order => order.id !== id
);

localStorage.setItem(
  "orders",
  JSON.stringify(orders)
);

renderOrders();

}

}
// =======================
// ADMIN LOGIN
// =======================

function adminLogin(){

  const password =
  prompt("Nhập mật khẩu admin");

  if(password === "206209"){

    isAdmin = true;

    localStorage.setItem(
      "admin",
      "true"
    );

    document.getElementById(
      "adminBox"
    ).style.display = "flex";

    renderProducts();

    renderOrders();

    alert("Đăng nhập admin thành công");

  }else{

    alert("Sai mật khẩu");

  }

}
// =======================
// OPEN CART
// =======================

function openCart(){

  cartSidebar.classList.add("active");

  overlay.style.display = "block";

}

function closeCart(){

  cartSidebar.classList.remove("active");

  overlay.style.display = "none";

}
// =======================
// CLOSE CART
// =======================

function closeCart(){

  if(cartSidebar){
    cartSidebar.classList.remove("active");
  }

  if(overlay){
    overlay.style.display = "none";
  }

}

// =======================
// TOAST
// =======================

function showToast(){

  const toast =
  document.createElement("div");

  toast.innerText =
  "Đã thêm vào giỏ hàng";

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
  "12px 20px";

  toast.style.borderRadius =
  "10px";

  toast.style.zIndex =
  "9999";

  document.body.appendChild(toast);

  setTimeout(()=>{

    toast.remove();

  },2000);

}
window.addEventListener("load", () => {

  const loader =
  document.getElementById("loader");

  if(loader){

    loader.style.display = "none";

  }

});

// =======================
// START
// =======================

renderProducts();

updateCart();

renderOrders();