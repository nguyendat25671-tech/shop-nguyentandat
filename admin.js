let products = JSON.parse(localStorage.getItem("products")) || [

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


function addProduct(){

  const name = document.getElementById("name").value;

  const price = document.getElementById("price").value;

  const image = document.getElementById("image").value;

  if(!name || !price || !image){
    alert("Nhập đầy đủ thông tin");
    return;
  }

  const newProduct = {
    id: Date.now(),
    name,
    price:Number(price),
    image
  };

  products.push(newProduct);

  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );

  renderAdminProducts();

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";

}

function deleteProduct(index){

  products.splice(index,1);

  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );

  renderAdminProducts();

}

renderAdminProducts();