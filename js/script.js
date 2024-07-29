import { products as allProducts } from "./products.js";

const itemsPerPage = 9;
let currentPage = 1;
const lastPage = Math.ceil(allProducts.length / itemsPerPage);

function getPaginatedProducts(page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = allProducts.slice(start, end);
  return paginatedProducts;
}

function renderProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product) => {
    const productCard = `
                <div class="col-md-4">
                    <div class="card product-card">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text"><strong>${product.price}</strong></p>
                            <a href="#" class="btn btn-primary">Add to Cart</a>
                        </div>
                    </div>
                </div>
            `;
    productList.innerHTML += productCard;
  });
}

function renderPaginationNav() {
  const paginationNav = document.getElementById("pagination-nav");
  paginationNav.innerHTML = "";

  const previousBtn = document.createElement("li");
  const nextBtn = document.createElement("li");

  previousBtn.classList.add("page-item");
  nextBtn.classList.add("page-item");

  previousBtn.innerHTML = `<a class="page-link" href="#">Previous</a>`;
  nextBtn.innerHTML = `<a class="page-link" href="#">Next</a>`;

  if (currentPage === 1) previousBtn.classList.add("disabled");
  if (currentPage === lastPage) nextBtn.classList.add("disabled");

  previousBtn.addEventListener("click", (e) => {
    e.preventDefault()
    if (currentPage !== 1) currentPage -= 1;
    updateProducts();
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage !== lastPage) currentPage += 1;
    updateProducts();
  });

  paginationNav.appendChild(previousBtn);
  
  for(let i = 1; i <= lastPage; i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");
    if (i === currentPage) li.classList.add("active");
    const link = document.createElement((i === currentPage) ? "span" : "a");
    link.classList.add("page-link");
    link.innerHTML = i;
    link.href = "#";
    link.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        updateProducts();
    })
    li.appendChild(link);
    paginationNav.appendChild(li);
  }

  paginationNav.appendChild(nextBtn);
}

function updateProducts() {
  const products = getPaginatedProducts(currentPage);
  renderProducts(products);
  renderPaginationNav();
}

updateProducts();
