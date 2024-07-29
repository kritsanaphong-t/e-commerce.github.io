import { products as allProducts } from "./products.js";
import { addProductToCart } from "./cart.js";

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

if(searchInput)
searchInput.addEventListener("input", () => {
    currentPage = 1;
    updateProducts();
});

if(categoryFilter)
categoryFilter.addEventListener("change", () => {
    currentPage = 1;
    updateProducts();
});

const itemsPerPage = 9;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", function () {
    if(document.getElementById("product-list"))
    updateProducts();
});

function filterProducts(products) {
  const searchQuery = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  console.log(selectedCategory)
  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    return matchesName && matchesCategory;
  });
  return filteredProducts;
}

function getPaginatedProducts(products) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = products.slice(start, end);
  return paginatedProducts;
}

function renderProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
  
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "col-md-4";
      productCard.innerHTML = `
        <div class="card product-card">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text"><strong>${product.price}</strong></p>
            <a href="#" class="btn btn-primary add-to-cart-btn">Add to Cart</a>
          </div>
        </div>
      `;
      productList.appendChild(productCard);
  
      const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
      addToCartBtn.addEventListener("click", function(event) {
        event.preventDefault();
        addProductToCart(product);
      });
    });
  }

function renderPaginationNav(lastPage) {
  const paginationNav = document.getElementById("pagination-nav");
  paginationNav.innerHTML = "";
  if (lastPage === 0)
  {
    paginationNav.innerHTML = "There are no products of this type in the system.";
    return;
  }
  const previousBtn = document.createElement("li");
  const nextBtn = document.createElement("li");

  previousBtn.classList.add("page-item");
  nextBtn.classList.add("page-item");

  previousBtn.innerHTML = `<a class="page-link" href="#">Previous</a>`;
  nextBtn.innerHTML = `<a class="page-link" href="#">Next</a>`;

  if (currentPage === 1) previousBtn.classList.add("disabled");
  if (currentPage === lastPage) nextBtn.classList.add("disabled");

  previousBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage !== 1) currentPage -= 1;
    updateProducts();
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage !== lastPage) currentPage += 1;
    updateProducts();
  });

  paginationNav.appendChild(previousBtn);

  for (let i = 1; i <= lastPage; i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");
    if (i === currentPage) li.classList.add("active");
    const link = document.createElement(i === currentPage ? "span" : "a");
    link.classList.add("page-link");
    link.innerHTML = i;
    link.href = "#";
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      updateProducts();
    });
    li.appendChild(link);
    paginationNav.appendChild(li);
  }

  paginationNav.appendChild(nextBtn);
}

function updateProducts() {
  const filteredProducts = filterProducts(allProducts);
  const paginatedProducts = getPaginatedProducts(filteredProducts);
  renderProducts(paginatedProducts);
  const lastPage = Math.ceil(filteredProducts.length / itemsPerPage);
  renderPaginationNav(lastPage);
}
