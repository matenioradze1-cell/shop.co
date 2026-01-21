const state = { products: [], filtered: [], category: 'all', query: '' };

// Resolve DOM elements with fallbacks for legacy markup
const productsGridEl = document.getElementById('products-grid') || document.getElementById('products-container');
const loadingEl = document.getElementById('loading');
const noResultsEl = document.getElementById('no-results');
const shopSelectEl = document.getElementById('shop-select') || document.getElementById('shop');
const searchBoxEl = document.getElementById('search-box');
const activeCategoryEl = document.getElementById('active-category');
const cookieNoticeEl = document.getElementById('cookie-notice');
const acceptCookiesBtnEl = document.getElementById('accept-cookies');
const burgerEl = document.getElementById('burger');
const mobileMenuEl = document.getElementById('mobile-menu');
const mobileOverlayEl = document.getElementById('mobile-overlay');
const mobileCloseEl = document.getElementById('mobile-close');
const scrollToTopEl = document.getElementById('scrollToTop') || document.getElementById('scrollToTopBtn');
const signupFormEl = document.getElementById('signup-form');

const elements = { productsGrid: productsGridEl, loading: loadingEl, noResults: noResultsEl, shopSelect: shopSelectEl, searchBox: searchBoxEl, activeCategory: activeCategoryEl, cookieNotice: cookieNoticeEl, acceptCookiesBtn: acceptCookiesBtnEl, burger: burgerEl, mobileMenu: mobileMenuEl, mobileOverlay: mobileOverlayEl, mobileClose: mobileCloseEl, scrollToTop: scrollToTopEl, signupForm: signupFormEl };

async function fetchProducts(){
  showLoading(true);
  try{
    const res = await fetch('https://fakestoreapi.com/products');
    if(!res.ok) throw new Error('Network error');
    const data = await res.json();
    state.products = data;
    state.filtered = data.slice();
    applyFilters();
  }catch(err){
    if(elements.loading) elements.loading.textContent = 'Failed to load products. Try again later.';
    console.error(err);
  }finally{ showLoading(false) }
}

function showLoading(show){ if(elements.loading) elements.loading.style.display = show ? 'block' : 'none' }

function renderProducts(items){
  const container = elements.productsGrid || document.getElementById('products-container');
  if(!container) return;
  container.innerHTML = '';
  if(!items || items.length === 0){ if(elements.noResults) elements.noResults.hidden = false; return }
  if(elements.noResults) elements.noResults.hidden = true;
  items.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${escapeHtml(p.title)} image" />
      <h3 class="product-title">${escapeHtml(p.title)}</h3>
      <div class="product-price">$${p.price.toFixed(2)}</div>
      <div class="rating">${escapeHtml(p.category)} • ⭐ ${p.rating?.rate ?? 'n/a'}</div>
    `;
    container.appendChild(card);
  })
}

function escapeHtml(str){ return (''+str).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }

function applyFilters(){
  const { products, category, query } = state;
  let result = products.slice();
  // Category mapping
  if(category && category !== 'all'){
    if(category === 'clothes'){
      result = result.filter(p => ["men's clothing","women's clothing"].includes(p.category));
    }else if(category === 'accessories'){
      result = result.filter(p => p.category === 'jewelery');
    }else if(category === 'more'){
      result = result.filter(p => p.category === 'electronics');
    }else if(category === 'shoes'){
      // No shoes category in API: show empty set
      result = [];
    }
  }
  // Query filter
  const q = query.trim().toLowerCase();
  if(q.length){
    result = result.filter(p => (
      p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
    ));
  }
  state.filtered = result;
  elements.activeCategory.textContent = category === 'all' ? 'All' : capitalize(category);
  if(result.length === 0){ elements.noResults.hidden = false } else { elements.noResults.hidden = true }
  renderProducts(result);
}

function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1) }

// Event wiring (guarded)
if(elements.shopSelect) elements.shopSelect.addEventListener('change', e => { state.category = e.target.value; applyFilters(); });
if(elements.searchBox) elements.searchBox.addEventListener('input', e => { state.query = e.target.value; applyFilters(); });
const searchFormEl = document.getElementById('search-form'); if(searchFormEl) searchFormEl.addEventListener('submit', e => e.preventDefault());

// Cookie banner
if(elements.acceptCookiesBtn){ elements.acceptCookiesBtn.addEventListener('click', () => { localStorage.setItem('cookieAccepted','true'); if(elements.cookieNotice) elements.cookieNotice.style.display = 'none'; }); }
if(localStorage.getItem('cookieAccepted') === 'true'){ if(elements.cookieNotice) elements.cookieNotice.style.display = 'none' }

// Burger menu
if(elements.burger) elements.burger.addEventListener('click', openMobileMenu);
if(elements.mobileClose) elements.mobileClose.addEventListener('click', closeMobileMenu);
if(elements.mobileOverlay) elements.mobileOverlay.addEventListener('click', closeMobileMenu);
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMobileMenu(); });
function openMobileMenu(){ if(elements.mobileMenu) { elements.mobileMenu.classList.add('open'); elements.mobileMenu.setAttribute('aria-hidden','false'); } if(elements.mobileOverlay) elements.mobileOverlay.classList.add('show') }
function closeMobileMenu(){ if(elements.mobileMenu) { elements.mobileMenu.classList.remove('open'); elements.mobileMenu.setAttribute('aria-hidden','true'); } if(elements.mobileOverlay) elements.mobileOverlay.classList.remove('show') }

// Header change on scroll + scroll-to-top
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if(!header) return;
  if(window.scrollY > 40){ header.classList.add('scrolled'); if(elements.scrollToTop) elements.scrollToTop.style.display = 'block' } else { header.classList.remove('scrolled'); if(elements.scrollToTop) elements.scrollToTop.style.display = 'none' }
});
if(elements.scrollToTop) elements.scrollToTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

// Form validation
if(elements.signupForm){ elements.signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const fullname = document.getElementById('fullname');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirm');
  clearErrors();
  let valid = true;
  if(!fullname.value.trim()){ setError('fullname','Full name is required'); valid=false }
  if(!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email.value)){ setError('email','Enter a valid email'); valid=false }
  if(!/(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password.value)){ setError('password','Password must be min 8 chars, include upper, lower and a number'); valid=false }
  if(password.value !== confirm.value){ setError('confirm','Passwords do not match'); valid=false }
  if(valid){ const succ = document.getElementById('form-success'); if(succ) succ.hidden=false; elements.signupForm.reset(); setTimeout(()=>{ if(succ) succ.hidden=true },3000) }
}); }

function setError(name,msg){ const el = document.querySelector(`.error[data-for="${name}"]`); if(el){ el.textContent = msg } }
function clearErrors(){ document.querySelectorAll('.error').forEach(e=>e.textContent='') }

// Toggle password visibility
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () =>{
    const target = document.getElementById(btn.dataset.target);
    if(!target) return;
    if(target.type === 'password'){ target.type = 'text'; btn.textContent = 'Hide' } else { target.type = 'password'; btn.textContent = 'Show' }
  })
});

// helper: initialize
fetchProducts();
