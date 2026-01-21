let allProducts = [];
let activeCategory = 'all';

fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((products) => {
    allProducts = products;
    applyFilters();
  })
  .catch((error) => console.error("Error fetching products:", error));

function displayProducts(products, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
            <img src="${product.image}" alt="Product Image">
            <h2>${product.title}</h2>
            <p><strong>Rating:</strong> ${product.rating.rate}/5</p>
            <p class="price">$${product.price}</p>
        `;
    container.appendChild(productDiv);
  });
}

// Combined filtering: category (from dropdown) + search query
function mapCategory(cat){
  if(!cat || cat === 'all' || cat === '') return null;
  if(cat === 'clothes' || cat === 'clothes') return ["men's clothing","women's clothing"];
  if(cat === 'accesories' || cat === 'accessories') return ['jewelery'];
  if(cat === 'more') return ['electronics'];
  if(cat === 'shoes') return 'shoes'; // no direct mapping — will return empty
  return null;
}

function applyFilters(){
  const query = (document.getElementById('search-box')?.value || '').toLowerCase().trim();
  const select = document.getElementById('shop');
  activeCategory = select ? select.value : 'all';

  let items = allProducts.slice();
  const mapped = mapCategory(activeCategory);
  if(mapped){
    if(Array.isArray(mapped)){
      items = items.filter(p => mapped.includes(p.category));
    }else if(mapped === 'shoes'){
      items = []; // FakeStore has no shoes category
    }
  }

  if(query.length){
    items = items.filter(p => (
      (p.title || '').toLowerCase().includes(query) ||
      (p.category || '').toLowerCase().includes(query) ||
      (p.description || '').toLowerCase().includes(query)
    ));
  }

  const firstGroup = items.slice(0,8);
  const secondGroup = items.slice(8,16);
  displayProducts(firstGroup, "products-container");
  displayProducts(secondGroup, "products-container1");

  // show a simple empty state if no items
  if(items.length === 0){
    const container = document.getElementById('products-container');
    if(container) container.innerHTML = '<p style="padding:20px;color:#666">No products found.</p>';
  }
}

// Wire dropdown and search
const shopSelect = document.getElementById('shop');
if(shopSelect) shopSelect.addEventListener('change', applyFilters);
const searchBox = document.getElementById('search-box');
if(searchBox) searchBox.addEventListener('input', applyFilters);
  
  
  function toggleMenu(event) {
    const menu = document.querySelector('.mobile-menu');
    menu.classList.toggle('visible');
    event.stopPropagation();
  }
  
  document.addEventListener('click', function(event) {
    const menu = document.querySelector('.mobile-menu');
    const burger = document.querySelector('.burger');
    
    if (!menu.contains(event.target) && !burger.contains(event.target)) {
      menu.classList.remove('visible');
    }
  });
  
  
  document.querySelector('.update-buttons .update-button:last-child').addEventListener('click', function () {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
  
    if (validateEmail(email)) {
      alert('Thank you for subscribing to our newsletter!');
      emailInput.value = ''; 
    } else {
      alert('Please enter a valid email address.');
    }
  });
  
  function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  
  const products = [
    { id: 1, title: 'Casual Shirt', price: '$29.99' },
    { id: 2, title: 'Running Shoes', price: '$49.99' },
    { id: 3, title: 'Leather Jacket', price: '$99.99' },
    { id: 4, title: 'Formal Dress', price: '$79.99' }
  ];
  
  function renderProducts(containerId, productData) {
    const container = document.getElementById(containerId);
    container.innerHTML = productData.map(product => `
      <div class="product">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">${product.price}</p>
      </div>
    `).join('');
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    renderProducts('products-container', products);
    renderProducts('products-container1', products);
  });
  
  document.getElementById("search-box").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      const searchQuery = event.target.value.toLowerCase().trim(); 
      console.log("Search Query:", searchQuery); 
  
      const products = document.querySelectorAll(".product");
      console.log("Found products:", products.length); 
  
      let found = false;
  
      products.forEach((product) => {
        const productTitle = product.querySelector(".product-title").textContent.toLowerCase();
        console.log("Checking product:", productTitle);
  
        if (productTitle.includes(searchQuery)) {
          console.log("Found match:", productTitle);
  
          product.scrollIntoView({ behavior: "smooth", block: "center" });
          product.style.border = "3px solid orange"; 
          found = true;
        } else {
          product.style.border = "none"; 
        }
      });
  
      if (!found) {
        alert(`No products found for "${searchQuery}". Try another keyword.`);
      }
    }
  });
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  
  window.addEventListener("scroll", () => {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });
  
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
  
  if (!localStorage.getItem('cookiesAccepted')) {
    document.getElementById('cookie-notification').style.display = 'block';
  }
  
  document.getElementById('accept-cookies').addEventListener('click', function() {
    localStorage.setItem('cookiesAccepted', 'true'); 
    document.getElementById('cookie-notification').style.display = 'none'; 
  });
  
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
  
  function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  
  if (!getCookie('cookiesAccepted')) {
    document.getElementById('cookie-notification').style.display = 'block';
  }
  
  document.getElementById('accept-cookies').addEventListener('click', function() {
    setCookie('cookiesAccepted', 'true', 365); // 365 დღე
    document.getElementById('cookie-notification').style.display = 'none'; // notification-ი დამალულია
  });

  