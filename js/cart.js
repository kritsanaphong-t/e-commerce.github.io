const popoverTrigger = document.getElementById("cartPopover");
const popover = new bootstrap.Popover(popoverTrigger, {
  container: "body",
  html: true,
  content: function () {
    return document.getElementById("popover-content").innerHTML;
  },
});

const toastLiveAddProduct = document.getElementById("liveToast");
const cartItemsContainer = document.getElementById("cart-items");

let cart = [];

document.addEventListener("DOMContentLoaded", function () {
  if (cartItemsContainer) displayCartItems();

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
  popover.innerHTML = "";
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
    row1.className = "row";
    row1.innerHTML = product.name;
    const row2 = document.createElement("div");
    row2.className = "row";
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
  viewCartBtn.href = "./cart.html";
  const totalPriceElement = document.createElement("div");
  totalPriceElement.className = "d-flex justify-content-end";
  console.log(cart);
  let totalPrice = cart
    ? cart.reduce((accumulator, current) => accumulator + current.price, 0)
    : null;
  totalPriceElement.innerHTML = `<div>Total Pirce: <strong>$${totalPrice}</strong></div>`;
  popoverControls.append(viewCartBtn);
  popover.appendChild(totalPriceElement);
  popover.appendChild(popoverControls);
}

// Function to display cart items
function displayCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemRow = document.createElement("div");
    itemRow.className = "col-12 mb-3";
    itemRow.innerHTML = `
          <div class="card">
              <div class="row g-0">
                  <div class="col-5 col-md-2">
                      <img src="${
                        item.image
                      }" class="img-fluid rounded-start w-100" alt="${
      item.name
    }">
                  </div>
                  <div class="col-7 col-md-10">
                      <div class="card-body">
                          <h5 class="card-title">${item.name}</h5>
                          <p class="card-text">$${item.price.toFixed(2)} x ${
      item.quantity
    } = $${itemTotal.toFixed(2)}</p>
                          <div class="d-flex justify-content-between">
                              <div class="btn-group" role="group">
                                  <button type="button" class="btn btn-outline-secondary" data-action="decrease" data-id="${
                                    item.id
                                  }">-</button>
                                  <button type="button" class="btn btn-outline-secondary" data-action="increase" data-id="${
                                    item.id
                                  }">+</button>
                              </div>
                              <button class="btn btn-danger" data-action="remove" data-id="${
                                item.id
                              }">Remove</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      `;
    cartItemsContainer.appendChild(itemRow);
  });

  document.getElementById("cart-total").textContent = total.toFixed(2);

  // Add event listeners for buttons
  document.querySelectorAll('[data-action="decrease"]').forEach((button) => {
    button.addEventListener("click", function () {
      updateQuantity(parseInt(this.dataset.id), -1);
    });
  });
  document.querySelectorAll('[data-action="increase"]').forEach((button) => {
    button.addEventListener("click", function () {
      updateQuantity(parseInt(this.dataset.id), 1);
    });
  });
  document.querySelectorAll('[data-action="remove"]').forEach((button) => {
    button.addEventListener("click", function () {
      removeItem(parseInt(this.dataset.id));
    });
  });
}

// Function to update item quantity
function updateQuantity(itemId, change) {
  cart = cart.map((item) => {
    if (item.id === itemId) {
      item.quantity = Math.max(1, item.quantity + change);
    }
    return item;
  });
  displayCartItems();
  saveCart();
  updatePopover();
}

// Function to remove item from cart
function removeItem(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  displayCartItems();
  saveCart();
  updatePopover();
}

export const getCart = () => {
  return cart;
};

export const addProductToCart = (product) => {
  const inCartProduct = cart.find((i) => i.id === product.id);
  if (inCartProduct === undefined) {
    product.quantity = 1;
    cart.push(product);
  } else {
    inCartProduct.quantity += 1;
  }
  const toast = new bootstrap.Toast(toastLiveAddProduct);
  toast.show();
  saveCart();
  updatePopover();
};

initialize();
