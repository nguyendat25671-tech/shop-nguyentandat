// =========================
// PRODUCTS STORAGE
// =========================

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
  }

];

// =========================
// DOM
// =========================

const adminProducts =
document.getElementById("adminProducts");

const previewImage =
document.getElementById("previewImage");

const imageInput =
document.getElementById("image");

// =========================
// IMAGE PREVIEW
// =========================

if(imageInput){

  imageInput.addEventListener(
    "change",
    function(){

      const file =
      this.files[0];

      if(file){

        const reader =
        new FileReader();

        reader.onload =
        function(e){

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

// =========================
// ADD PRODUCT
// =========================

function addProduct(){

  const name =
  document.getElementById("name")
  .value.trim();

  const price =
  document.getElementById("price")
  .value.trim();

  const file =
  document.getElementById("image")
  .files[0];

  // VALIDATE

  if(!name || !price || !file){

    showToast(
      "Vui lòng nhập đầy đủ thông tin",
      "error"
    );

    return;

  }

  if(Number(price) <= 0){

    showToast(
      "Giá sản phẩm không hợp lệ",
      "error"
    );

    return;

  }

  // READ IMAGE

  const reader =
  new FileReader();

  reader.onload = function(e){

    const newProduct = {

      id: Date.now(),

      name: name,

      price: Number(price),

      image: e.target.result

    };

    products.unshift(newProduct);

    saveProducts();

    renderAdminProducts();

    resetForm();

    showToast(
      "Đã thêm sản phẩm thành công",
      "success"
    );

  };

  reader.readAsDataURL(file);

}

// =========================
// RENDER PRODUCTS
// =========================

function renderAdminProducts(){

  adminProducts.innerHTML = "";

  // EMPTY

  if(products.length === 0){

    adminProducts.innerHTML = `

      <div class="empty-text">
        Chưa có sản phẩm nào
      </div>

    `;

    return;

  }

  // LOOP

  products.forEach(product => {

    adminProducts.innerHTML += `

      <div class="admin-card">

        <img
          src="${product.image}"
          alt="${product.name}"
        >

        <div class="product-info">

          <h3>
            ${product.name}
          </h3>

          <p>
            💰 ${Number(product.price)
              .toLocaleString()}đ
          </p>

          <div class="product-actions">

            <button
              class="delete-btn"
              onclick="deleteProduct(${product.id})"
            >

              🗑 Xóa sản phẩm

            </button>

          </div>

        </div>

      </div>

    `;

  });

}

// =========================
// DELETE PRODUCT
// =========================

function deleteProduct(id){

  const confirmDelete =
  confirm(
    "Bạn có chắc muốn xóa sản phẩm này?"
  );

  if(!confirmDelete){

    return;

  }

  products =
  products.filter(
    product => product.id !== id
  );

  saveProducts();

  renderAdminProducts();

  showToast(
    "Đã xóa sản phẩm",
    "success"
  );

}

// =========================
// SAVE PRODUCTS
// =========================

function saveProducts(){

  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );

}

// =========================
// RESET FORM
// =========================

function resetForm(){

  document.getElementById("name")
  .value = "";

  document.getElementById("price")
  .value = "";

  document.getElementById("image")
  .value = "";

  previewImage.src = "";

  previewImage.style.display =
  "none";

}

// =========================
// TOAST
// =========================

function showToast(message, type){

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

  toast.style.padding =
  "14px 22px";

  toast.style.borderRadius =
  "12px";

  toast.style.color =
  "#fff";

  toast.style.fontWeight =
  "bold";

  toast.style.fontSize =
  "15px";

  toast.style.zIndex =
  "99999";

  toast.style.boxShadow =
  "0 5px 20px rgba(0,0,0,0.2)";

  toast.style.transition =
  "0.3s";

  toast.style.opacity =
  "0";

  toast.style.transform =
  "translateY(20px)";

  // TYPE

  if(type === "error"){

    toast.style.background =
    "#ff3b30";

  }else{

    toast.style.background =
    "#16a34a";

  }

  document.body.appendChild(
    toast
  );

  setTimeout(()=>{

    toast.style.opacity = "1";

    toast.style.transform =
    "translateY(0)";

  },100);

  setTimeout(()=>{

    toast.style.opacity = "0";

    toast.style.transform =
    "translateY(20px)";

    setTimeout(()=>{

      toast.remove();

    },300);

  },2500);

}

// =========================
// START
// =========================

renderAdminProducts();