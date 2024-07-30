const popoverTrigger = document.getElementById("cartPopover");
const popover = new bootstrap.Popover(popoverTrigger, {
  container: "body",
  html: true,
  content: function () {
    return document.getElementById("popover-content").innerHTML;
  },
});

let cart = [];

document.addEventListener("DOMContentLoaded", function () {
  updatePopover();
});

function initialize() {
  loadCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const cartStr = localStorage.getItem("cart");
  if (cartStr !== null) cart = JSON.parse(cartStr);
}

function updatePopover() {
  const popover = document.getElementById("popover-content");
  popover.innerHTML = ""
  const popoverControls = document.createElement("div");
  popoverControls.className = "d-flex flex-column gap-2 mt-3";
  cart.forEach((product) => {
    const productImage = document.createElement("img");
    productImage.className = "w-100";
    productImage.src = product.image;
    const row = document.createElement("div");
    row.className = "row mb-2";
    const col1 = document.createElement("div");
    col1.className = "col-4";
    const col2 = document.createElement("div");
    col2.className = "col-8";
    const col3 = document.createElement("div");
    col3.className = "d-flex justify-content-between";
    const row1 = document.createElement("div");
    row1.className = "row"
    row1.innerHTML = product.name;
    const row2 = document.createElement("div");
    row2.className = "row"
    col3.innerHTML = `x ${product.quantity} <strong>$${product.price}</strong>`;
    row2.append(col3);
    col2.append(row1);
    col2.append(row2);
    col1.append(productImage);
    row.append(col1);
    row.append(col2);
    popover.appendChild(row);
  });
  const viewCartBtn = document.createElement("a");
  const checkoutBtn = document.createElement("a");
  viewCartBtn.innerHTML = "View Cart";
  checkoutBtn.innerHTML = "Checkout";
  viewCartBtn.className = "btn btn-primary btn-sm";
  checkoutBtn.className = "btn btn-secondary btn-sm";
  const totalPriceElement = document.createElement("div");
  totalPriceElement.className = "d-flex justify-content-end"
  console.log(cart)
  let totalPrice = cart ? cart.reduce((accumulator, current) => accumulator + current.price, 0) : null;
  totalPriceElement.innerHTML = `<div>Total Pirce: <strong>$${totalPrice}</strong></div>`
  popoverControls.append(viewCartBtn);
  popover.appendChild(totalPriceElement);
  popover.appendChild(popoverControls);
}

export const addProductToCart = (product) => {
  const inCartProduct = cart.find((i) => i.id === product.id);
  if (inCartProduct === undefined) {
    product.quantity = 1;
    cart.push(product);
  } else {
    inCartProduct.quantity += 1;
  }
  saveCart();
  updatePopover();
};

initialize();
