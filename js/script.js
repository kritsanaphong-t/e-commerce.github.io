import { products as allProducts, topSellingProducts } from "./products.js";
import { addProductToCart } from "./cart.js";

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

const topSellingCarousel = document.getElementById("top-selling");

if (searchInput)
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    updateProducts();
  });

if (categoryFilter)
  categoryFilter.addEventListener("change", () => {
    currentPage = 1;
    updateProducts();
  });

const itemsPerPage = 9;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("product-list")) updateProducts();

  if (topSellingCarousel) {
    createCarousel();
  }
});

function filterProducts(products) {
  const searchQuery = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  console.log(selectedCategory);
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
            <p class="card-text"><strong>$${product.price}</strong></p>
            <a href="#" class="btn btn-primary add-to-cart-btn">Add to Cart</a>
          </div>
        </div>
      `;
    productList.appendChild(productCard);

    const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
    addToCartBtn.addEventListener("click", function (event) {
      event.preventDefault();
      addProductToCart(product);
    });
  });
}

function renderPaginationNav(lastPage) {
  const paginationNav = document.getElementById("pagination-nav");
  paginationNav.innerHTML = "";
  if (lastPage === 0) {
    paginationNav.innerHTML =
      "There are no products of this type in the system.";
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

function createCarousel() {
  const carousel = document.createElement("div");
  carousel.id = "myCarousel";
  carousel.className = "carousel slide mb-6";
  carousel.setAttribute("data-bs-ride", "carousel");

  const indicators = document.createElement("div");
  indicators.className = "carousel-indicators";

  const inner = document.createElement("div");
  inner.className = "carousel-inner";

  topSellingProducts.forEach((product, index) => {
    // Indicators
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("data-bs-target", "#myCarousel");
    button.setAttribute("data-bs-slide-to", index.toString());
    button.setAttribute("aria-label", `Slide ${index + 1}`);
    if (index === 0) {
      button.className = "active";
      button.setAttribute("aria-current", "true");
    }
    indicators.appendChild(button);

    // Carousel items
    const carouselItem = document.createElement("div");
    carouselItem.className = "carousel-item";
    if (index === 0) {
      carouselItem.classList.add("active");
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("bd-placeholder-img");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.setAttribute("focusable", "false");
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "var(--bs-secondary-color)");
    svg.appendChild(rect);

    const container = document.createElement("div");
    container.className = "container";

    const caption = document.createElement("div");
    caption.className = "carousel-caption text-start";
    const h1 = document.createElement("h1");
    h1.textContent = product.name;
    const pDesc = document.createElement("p");
    pDesc.textContent = product.description;
    pDesc.className = "opacity-75";
    const pPrice = document.createElement("p");
    pPrice.textContent = `$${product.price.toFixed(2)}`;
    pPrice.className = "opacity-75";
    const pButton = document.createElement("p");
    const addToCartButton = document.createElement("a");
    addToCartButton.className = "btn btn-lg btn-primary";
    addToCartButton.href = "#";
    addToCartButton.textContent = "Add to Cart";
    addToCartButton.addEventListener("click", function (event) {
      event.preventDefault();
      addProductToCart(product);
    });
    pButton.appendChild(addToCartButton);

    caption.appendChild(h1);
    caption.appendChild(pDesc);
    caption.appendChild(pPrice);
    caption.appendChild(pButton);
    container.appendChild(caption);
    carouselItem.appendChild(svg);
    carouselItem.appendChild(container);
    inner.appendChild(carouselItem);
  });

  carousel.appendChild(indicators);
  carousel.appendChild(inner);

  const prevButton = document.createElement("button");
  prevButton.className = "carousel-control-prev";
  prevButton.type = "button";
  prevButton.setAttribute("data-bs-target", "#myCarousel");
  prevButton.setAttribute("data-bs-slide", "prev");
  const prevIcon = document.createElement("span");
  prevIcon.className = "carousel-control-prev-icon";
  prevIcon.setAttribute("aria-hidden", "true");
  const prevText = document.createElement("span");
  prevText.className = "visually-hidden";
  prevText.textContent = "Previous";
  prevButton.appendChild(prevIcon);
  prevButton.appendChild(prevText);

  const nextButton = document.createElement("button");
  nextButton.className = "carousel-control-next";
  nextButton.type = "button";
  nextButton.setAttribute("data-bs-target", "#myCarousel");
  nextButton.setAttribute("data-bs-slide", "next");
  const nextIcon = document.createElement("span");
  nextIcon.className = "carousel-control-next-icon";
  nextIcon.setAttribute("aria-hidden", "true");
  const nextText = document.createElement("span");
  nextText.className = "visually-hidden";
  nextText.textContent = "Next";
  nextButton.appendChild(nextIcon);
  nextButton.appendChild(nextText);

  carousel.appendChild(prevButton);
  carousel.appendChild(nextButton);

  topSellingCarousel.appendChild(carousel);
}
