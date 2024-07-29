import { products as allProducts } from "./products.js";

const itemsPerPage = 9;
let currentPage = 1;

function getPaginatedProducts(page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = allProducts.slice(start, end);
  return paginatedProducts;
}

function renderProducts(products) {
  const productList = document.getElementById("product-list");

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

const products = getPaginatedProducts(currentPage);
renderProducts(products);