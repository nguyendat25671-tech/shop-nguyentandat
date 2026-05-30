// ======================================================
// FIREBASE IMPORT
// ======================================================
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// ======================================================
// FIREBASE CONFIG
// ======================================================

const firebaseConfig = {

  apiKey:
  "AIzaSyCqFcZe-p8GBB0sdo5K4QAFex52_5--nLQ",

  authDomain:
  "shoptandat-baf8c.firebaseapp.com",

  projectId:
  "shoptandat-baf8c",

  storageBucket:
  "shoptandat-baf8c.appspot.com",

  messagingSenderId:
  "757338881059",

  appId:
  "1:757338881059:web:cc1da8a24693f554a68596"

};

// ======================================================
// INIT FIREBASE
// ======================================================

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

// ======================================================
// TELEGRAM
// ======================================================

const TELEGRAM_BOT_TOKEN =
"8290012420:AAEDlZvBKk6y8cNY40qu_frp6ppcy-2atP8";

const TELEGRAM_CHAT_ID =
"7166493375";

// ======================================================
// SEND TELEGRAM
// ======================================================

async function sendTelegram(message){

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

    console.log(error);

  }

}

// ======================================================
// CLOUDINARY
// ======================================================

const CLOUD_NAME =
"diw9ytkdz";

const UPLOAD_PRESET =
"shop_upload";

// ======================================================
// DOM
// ======================================================

const adminProducts =
document.getElementById("adminProducts");

const adminOrders =
document.getElementById("adminOrders");

const previewImage =
document.getElementById("previewImage");

const imageInput =
document.getElementById("image");

const totalProducts =
document.getElementById("totalProducts");

const totalOrders =
document.getElementById("totalOrders");

const totalCustomers =
document.getElementById("totalCustomers");

const totalRevenue =
document.getElementById("totalRevenue");

const doneOrders =
document.getElementById("doneOrders");

const pendingOrders =
document.getElementById("pendingOrders");

const cancelOrders =
document.getElementById("cancelOrders");

const music =
document.getElementById("adminMusic");

// ======================================================
// DATA
// ======================================================

let products = [];

let orders = [];

// ======================================================
// FORMAT MONEY
// ======================================================

function formatMoney(price){

  return Number(price || 0)
  .toLocaleString("vi-VN") + "đ";

}

// ======================================================
// IMAGE PREVIEW
// ======================================================

if(imageInput){

  imageInput.addEventListener(
    "change",
    function(){

      const file =
      this.files[0];

      if(file){

        previewImage.src =
        URL.createObjectURL(file);

        previewImage.style.display =
        "block";

      }

    }
  );

}

// ======================================================
// UPLOAD IMAGE
// ======================================================

async function uploadImageToCloudinary(file){

  const formData =
  new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "upload_preset",
    UPLOAD_PRESET
  );

  const response =
  await fetch(

    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

    {
      method:"POST",
      body:formData
    }

  );

  const data =
  await response.json();

  return data.secure_url;

}

// ======================================================
// DASHBOARD
// ======================================================

function updateDashboard(){

  totalProducts.innerText =
  products.length;

  totalOrders.innerText =
  orders.length;

  const customers =
  [...new Set(
    orders.map(o => o.phone)
  )];

  totalCustomers.innerText =
  customers.length;

  let revenue = 0;

  let done = 0;

  let pending = 0;

  let cancel = 0;

  orders.forEach(order => {

    if(order.status === "Đã xác nhận"){

      revenue +=
      Number(order.total || 0);

      done++;

    }

    else if(
      order.status === "Đã hủy"
    ){

      cancel++;

    }

    else{

      pending++;

    }

  });

  totalRevenue.innerText =
  formatMoney(revenue);

  doneOrders.innerText =
  done;

  pendingOrders.innerText =
  pending;

  cancelOrders.innerText =
  cancel;

}

// ======================================================
// LOAD PRODUCTS
// ======================================================

async function loadProducts(){

  adminProducts.innerHTML = "";

  products = [];

  const querySnapshot =
  await getDocs(
    collection(db,"products")
  );

  querySnapshot.forEach(docSnap => {

    products.push({

      id:docSnap.id,

      ...docSnap.data()

    });

  });

  if(products.length === 0){

    adminProducts.innerHTML = `
      <p class="empty-text">
        Chưa có sản phẩm
      </p>
    `;

    return;

  }

  products.forEach(product => {

    adminProducts.innerHTML += `

      <div class="admin-card">

        <div class="product-image">

          <img src="${product.image}">

        </div>

        <div class="product-info">

          <div class="product-category">

            ${product.category}

          </div>

          <h3>
            ${product.name}
          </h3>

          <div class="product-price">

            ${formatMoney(product.price)}

          </div>

          <div class="product-actions">

            <button
              class="delete-btn"
              onclick="deleteProduct('${product.id}')"
            >

              Xóa

            </button>

          </div>

        </div>

      </div>

    `;

  });

  updateDashboard();

}

// ======================================================
// LOAD ORDERS
// ======================================================

async function loadOrders(){

  adminOrders.innerHTML = "";

  orders = [];

  const querySnapshot =
  await getDocs(
    collection(db,"orders")
  );

  querySnapshot.forEach(docSnap => {

    orders.push({

      id:docSnap.id,

      ...docSnap.data()

    });

  });

  orders.reverse();

  if(orders.length === 0){

    adminOrders.innerHTML = `
      <p class="empty-text">
        Chưa có đơn hàng
      </p>
    `;

    return;

  }

  orders.forEach(order => {

    let productsHTML = "";

    if(order.items){

      order.items.forEach(item => {

        productsHTML += `

          <div class="order-product-item">

            <span>
              ${item.name}
            </span>

            <strong>
              x${item.quantity}
            </strong>

          </div>

        `;

      });

    }

    let statusClass = "pending";

    if(order.status === "Đã xác nhận"){
      statusClass = "success";
    }

    if(order.status === "Đã hủy"){
      statusClass = "cancel";
    }

    adminOrders.innerHTML += `

      <div class="order-card">

        <div class="order-top">

          <h3>
            Đơn #${order.id}
          </h3>

          <div class="order-status ${statusClass}">

            ${order.status || "Đang xử lý"}

          </div>

        </div>

        <p>
          👤 ${order.customer}
        </p>

        <p>
          📞 ${order.phone}
        </p>

        <p>
          📍 ${order.address}
        </p>

        <div class="order-products">

          ${productsHTML}

        </div>

        <div class="order-total">

          ${formatMoney(order.total)}

        </div>

        <div class="order-actions">

          <button
            class="confirm-btn"
            onclick="confirmOrder('${order.id}')"
          >
            Xác nhận
          </button>

          <button
            class="cancel-btn"
            onclick="cancelOrder('${order.id}')"
          >
            Hủy
          </button>

          <button
            class="delete-btn"
            onclick="deleteOrder('${order.id}')"
          >
            Xóa
          </button>

        </div>

      </div>

    `;

  });

  updateDashboard();

}

// ======================================================
// ADD PRODUCT
// ======================================================

window.addProduct =
async function(){

  try{

    const name =
    document.getElementById("name")
    .value;

    const price =
    document.getElementById("price")
    .value;

    const category =
    document.getElementById("category")
    .value;

    const file =
    document.getElementById("image")
    .files[0];

    if(
      !name ||
      !price ||
      !category
    ){

      alert(
        "Nhập đầy đủ thông tin"
      );

      return;

    }

    let imageUrl = "";

    if(file){

      imageUrl =
      await uploadImageToCloudinary(file);

    }

    await addDoc(
      collection(db,"products"),
      {

        name:name,

        price:Number(price),

        category:category,

        image:imageUrl

      }
    );

    await sendTelegram(

`🆕 SẢN PHẨM MỚI

📦 ${name}

💰 ${formatMoney(price)}

📂 ${category}`

    );

    alert("Đã thêm sản phẩm");

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").value = "";
    document.getElementById("image").value = "";

    previewImage.style.display = "none";

    loadProducts();

  }

  catch(error){

    console.log(error);

    alert("Lỗi thêm sản phẩm");

  }

};

// ======================================================
// DELETE PRODUCT
// ======================================================

window.deleteProduct =
async function(id){

  const ok =
  confirm("Xóa sản phẩm?");

  if(!ok) return;

  await deleteDoc(
    doc(db,"products",id)
  );

  await sendTelegram(

`🗑️ ĐÃ XÓA SẢN PHẨM

🆔 ${id}`

  );

  loadProducts();

};

// ======================================================
// CONFIRM ORDER
// ======================================================

window.confirmOrder =
async function(id){

  await updateDoc(
    doc(db,"orders",id),
    {
      status:"Đã xác nhận"
    }
  );

  await sendTelegram(

`✅ ĐƠN HÀNG ĐÃ XÁC NHẬN

🆔 ${id}`

  );

  loadOrders();

};

// ======================================================
// CANCEL ORDER
// ======================================================

window.cancelOrder =
async function(id){

  await updateDoc(
    doc(db,"orders",id),
    {
      status:"Đã hủy"
    }
  );

  await sendTelegram(

`❌ ĐƠN HÀNG ĐÃ HỦY

🆔 ${id}`

  );

  loadOrders();

};

// ======================================================
// DELETE ORDER
// ======================================================

window.deleteOrder =
async function(id){

  const ok =
  confirm("Xóa đơn hàng?");

  if(!ok) return;

  await deleteDoc(
    doc(db,"orders",id)
  );

  await sendTelegram(

`🗑️ ĐƠN HÀNG ĐÃ XÓA

🆔 ${id}`

  );

  loadOrders();

};

// ======================================================
// SEARCH PRODUCTS
// ======================================================

window.searchProducts =
function(){

  const keyword =
  document.getElementById(
    "searchProduct"
  ).value.toLowerCase();

  const cards =
  document.querySelectorAll(
    ".admin-card"
  );

  cards.forEach(card => {

    const name =
    card.innerText.toLowerCase();

    if(name.includes(keyword)){

      card.style.display =
      "block";

    }

    else{

      card.style.display =
      "none";

    }

  });

};

// ======================================================
// EXPORT EXCEL
// ======================================================

window.exportOrders =
function(){

  const data = orders.map(order => ({

    id:order.id,

    customer:order.customer,

    phone:order.phone,

    address:order.address,

    total:order.total,

    status:order.status

  }));

  const worksheet =
  XLSX.utils.json_to_sheet(data);

  const workbook =
  XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Orders"
  );

  XLSX.writeFile(
    workbook,
    "orders.xlsx"
  );

};

// ======================================================
// SCROLL FORM
// ======================================================

window.scrollToForm =
function(){

  document.getElementById(
    "productForm"
  ).scrollIntoView({

    behavior:"smooth"

  });

};

// ======================================================
// MUSIC
// ======================================================

window.toggleMusic =
function(){

  if(music.paused){

    music.play();

  }

  else{

    music.pause();

  }

};

// ======================================================
// LOADER
// ======================================================

window.addEventListener(
  "load",
  ()=>{

    const loader =
    document.getElementById(
      "loader"
    );

    setTimeout(()=>{

      loader.style.display =
      "none";

    },700);

  }
);
// ======================================================
// REALTIME ORDER NOTIFICATION
// ======================================================
function showRealtimeNotification(message){

  const notification =
  document.createElement("div");

  notification.className =
  "realtime-notification";

  notification.innerHTML = `
    <i class="fa-solid fa-bell"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  setTimeout(()=>{
    notification.classList.add("show");
  },100);

  setTimeout(()=>{

    notification.classList.remove("show");

    setTimeout(()=>{
      notification.remove();
    },500);

  },5000);

}

let firstLoad = true;

function listenNewOrders(){

  const ordersRef =
  collection(db,"orders");

  onSnapshot(ordersRef,(snapshot)=>{

    if(firstLoad){
      firstLoad = false;
      return;
    }

    snapshot.docChanges().forEach(change=>{

      if(change.type === "added"){

        const order =
        change.doc.data();

        showRealtimeNotification(
          `🛒 Đơn hàng mới từ ${order.customer}`
        );

      }

    });

  });

}
// ======================================================
// START
// ======================================================
loadProducts();

loadOrders();

listenNewOrders();