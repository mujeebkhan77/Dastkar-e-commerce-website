// =========================
// DEFAULT 9 PRODUCTS (ALWAYS PRESENT)
// =========================
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Classic Handmade Rug",
        price: 120,
        image: "images/rug1.jpg",
        desc: "A beautifully crafted traditional handmade rug with rich patterns and warm tones.",
        category: "Rugs"
    },
    {
        id: 2,
        name: "Tribal Wool Rug",
        price: 150,
        image: "images/rug2.jpg",
        desc: "Inspired by tribal art, this wool rug brings character and warmth to any room.",
        category: "Rugs"
    },
    {
        id: 3,
        name: "Vintage Boho Rug",
        price: 135,
        image: "images/rug3.jpg",
        desc: "A vintage-style bohemian rug with earthy colors and intricate woven design.",
        category: "Rugs"
    },
    {
        id: 4,
        name: "Cotton Woven Mat",
        price: 55,
        image: "images/rug4.jpg",
        desc: "Soft and durable cotton mat, perfect for entryways, kitchens, or bathrooms.",
        category: "Mats"
    },
    {
        id: 5,
        name: "Jute Door Mat",
        price: 40,
        image: "images/rug5.jpg",
        desc: "Eco-friendly jute door mat with a natural look and strong grip base.",
        category: "Mats"
    },
    {
        id: 6,
        name: "Printed Yoga Mat",
        price: 65,
        image: "images/rug6.jpg",
        desc: "Handprinted yoga mat with traditional geometric patterns, non-slip surface.",
        category: "Mats"
    },
    {
        id: 7,
        name: "Royal Persian Carpet",
        price: 220,
        image: "images/rug7.jpg",
        desc: "A luxurious Persian-style carpet with detailed floral motifs and deep colors.",
        category: "Carpets"
    },
    {
        id: 8,
        name: "Modern Area Carpet",
        price: 180,
        image: "images/rug8.jpg",
        desc: "Contemporary area carpet with clean lines and neutral tones for modern interiors.",
        category: "Carpets"
    },
    {
        id: 9,
        name: "Silk Blend Carpet",
        price: 260,
        image: "images/rug9.jpg",
        desc: "Premium silk blend carpet with a lustrous finish and exquisite craftsmanship.",
        category: "Carpets"
    }
];

// =========================
// LOAD PRODUCTS
// Always keep 9 defaults + any admin-added products
// =========================
function loadProducts() {
    let saved = JSON.parse(localStorage.getItem("products")) || [];

    // Remove any old default products (id 1-9) from saved list
    let adminAdded = saved.filter(p => p.id > 9);

    // Always combine: 9 defaults + admin added
    let allProducts = [...DEFAULT_PRODUCTS, ...adminAdded];

    localStorage.setItem("products", JSON.stringify(allProducts));
    return allProducts;
}

// =========================
// PRODUCTS & CART INIT
// =========================
let products = loadProducts();
let cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCartCount();

// =========================
// RENDER PRODUCTS
// =========================
let container = document.querySelector(".products-container");

function renderProducts(items) {
    if (!container) return;

    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px; grid-column:1/-1;">
                <h3 style="color:#3E2723;">No products found in this category.</h3>
            </div>
        `;
        return;
    }

    items.forEach(product => {
        container.innerHTML += `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            <div class="product-bottom">
                <p>$${product.price}</p>
            </div>
            <div style="display:flex; gap:10px; margin-top:10px;">
                <button onclick="viewDetails(${product.id})" class="buy-btn">View Details</button>
                <button onclick="addToCart(${product.id})" class="buy-btn">Add to Cart</button>
            </div>
        </div>
        `;
    });
}

// Render all products on page load
renderProducts(products);

// =========================
// SEARCH FUNCTIONALITY
// =========================
let searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", function () {
        let text = this.value.toLowerCase();
        let filtered = products.filter(p => p.name.toLowerCase().includes(text));
        renderProducts(filtered);
    });
}

// =========================
// CATEGORY FILTER
// =========================
function filterCategory(category) {
    if (category === "All") {
        renderProducts(products);
        return;
    }
    let filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
}

// =========================
// VIEW DETAILS
// =========================
function viewDetails(id) {
    localStorage.setItem("selectedProduct", id);
    window.location.href = "product.html";
}

// =========================
// ADD TO CART (with double-click protection)
// =========================
let lastAddedId = null;
let lastTime = 0;

function addToCart(id) {
    let now = Date.now();
    if (lastAddedId === id && now - lastTime < 500) return;
    lastAddedId = id;
    lastTime = now;

    let product = products.find(p => p.id == id);
    if (!product) return;

    let existing = cart.find(item => item.id == id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showToast("Added to cart ✔");
}

// =========================
// PRODUCT DETAIL PAGE
// =========================
if (window.location.pathname.includes("product.html")) {
    let id = parseInt(localStorage.getItem("selectedProduct"));
    let product = products.find(p => p.id == id);

    if (product) {
        document.getElementById("productImage").src = product.image;
        document.getElementById("productName").innerText = product.name;
        document.getElementById("productPrice").innerText = "$" + product.price;
        document.getElementById("productDesc").innerText = product.desc;
    }

    // Clean single event listener for Add to Cart
    let btn = document.getElementById("addToCartBtn");
    if (btn && product) {
        let newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener("click", function () {
            addToCart(product.id);
        });
    }
}

// =========================
// DISPLAY CART
// =========================
let cartContainer = document.getElementById("cartContainer");

function displayCart() {
    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <h2>Your cart is empty 🛒</h2>
                <p>Add some products to continue shopping</p>
                <a href="shop.html" class="buy-btn">Go to Shop</a>
            </div>
        `;
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartContainer.innerHTML += `
        <div class="cart-item">
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
                <p>${item.name} — $${item.price} × ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="changeQty(${index}, 1)">+</button>
                <button onclick="changeQty(${index}, -1)">-</button>
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        </div>
        `;
    });

    cartContainer.innerHTML += `
        <div class="cart-total">Total: $${total.toFixed(2)}</div>
    `;
}

displayCart();

// =========================
// CHANGE QUANTITY
// =========================
function changeQty(index, value) {
    cart[index].quantity += value;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// =========================
// REMOVE ITEM
// =========================
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// =========================
// UPDATE CART COUNT
// =========================
function updateCartCount() {
    let cartCount = document.getElementById("cartCount");
    if (!cartCount) return;
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = count;
}

// =========================
// TOAST
// =========================
function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerText = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
    }, 2000);
}

// =========================
// CHECKOUT SUMMARY
// =========================
function displayCheckoutSummary() {
    let summaryContainer = document.getElementById("checkoutItems");
    let totalElement = document.getElementById("checkoutTotal");

    if (!summaryContainer && !totalElement) return;

    let total = 0;

    if (cart.length === 0) {
        if (summaryContainer) summaryContainer.innerHTML = "<p>Your cart is empty.</p>";
        if (totalElement) totalElement.innerText = "Total: $0";
        return;
    }

    let summaryHTML = "";
    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        summaryHTML += `
            <div class="cart-item">
                <p>${item.name} × ${item.quantity} = $${itemTotal.toFixed(2)}</p>
            </div>
        `;
    });

    if (summaryContainer) summaryContainer.innerHTML = summaryHTML;
    if (totalElement) totalElement.innerText = `Total: $${total.toFixed(2)}`;
}

displayCheckoutSummary();

// =========================
// CHECKOUT FORM VALIDATION
// =========================
let inputs = document.querySelectorAll("input");
let placeOrderBtn = document.getElementById("placeOrderBtn");
let namePattern = /^[A-Za-z\s]+$/;
let phonePattern = /^[0-9]+$/;

if (inputs.length >= 3) {
    inputs[0].addEventListener("input", function () {
        this.style.border = namePattern.test(this.value.trim()) ? "2px solid green" : "2px solid red";
        checkForm();
    });
    inputs[1].addEventListener("input", function () {
        this.style.border = phonePattern.test(this.value.trim()) ? "2px solid green" : "2px solid red";
        checkForm();
    });
    inputs[2].addEventListener("input", function () {
        this.style.border = this.value.trim() !== "" ? "2px solid green" : "2px solid red";
        checkForm();
    });
}

function checkForm() {
    if (!placeOrderBtn || inputs.length < 3) return;
    let valid =
        namePattern.test(inputs[0].value.trim()) &&
        phonePattern.test(inputs[1].value.trim()) &&
        inputs[2].value.trim() !== "";
    placeOrderBtn.disabled = !valid;
}

checkForm();

// =========================
// PLACE ORDER
// =========================
function placeOrder() {
    let message = document.getElementById("formMessage");
    if (cart.length === 0) {
        message.innerText = "⚠ Your cart is empty! Add items before placing an order.";
        message.style.color = "red";
        return;
    }

    let name = inputs[0].value.trim();
    let phone = inputs[1].value.trim();
    let address = inputs[2].value.trim();
    let countryCode = document.getElementById("countryCode")?.value || "";

    if (!namePattern.test(name)) {
        message.innerText = "⚠ Name should contain only letters";
        message.style.color = "red";
        return;
    }

    let numericPhone = phone.replace(/[^0-9]/g, "");
    let minLen = 10, maxLen = 15;
    if (["+92", "+91", "+1"].includes(countryCode)) { minLen = 10; maxLen = 10; }
    else if (countryCode === "+44") { minLen = 10; maxLen = 11; }

    if (numericPhone.length < minLen || numericPhone.length > maxLen) {
        message.innerText = "⚠ Invalid phone length for selected country";
        message.style.color = "red";
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message.innerText = `✔ Order Placed! Total: $${total.toFixed(2)}`;
    message.style.color = "green";

    setTimeout(() => {
        localStorage.setItem("lastOrder", JSON.stringify(cart));
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        window.location.href = "order-success.html";
    }, 1500);
}

// =========================
// ORDER SUCCESS PAGE
// =========================
function loadOrderSuccess() {
    let summary = document.getElementById("orderSummary");
    let totalBox = document.getElementById("orderTotal");
    if (!summary || !totalBox) return;

    let order = JSON.parse(localStorage.getItem("lastOrder")) || [];
    let total = 0;

    if (order.length === 0) {
        summary.innerHTML = "<p>No order data found.</p>";
        return;
    }

    summary.innerHTML = "";
    order.forEach(item => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        summary.innerHTML += `
            <div class="order-card">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity} — $${itemTotal.toFixed(2)}</p>
            </div>
        `;
    });

    totalBox.innerHTML = `
        <div class="order-card">
            <h4>Total Paid: $${total.toFixed(2)}</h4>
        </div>
    `;
}

loadOrderSuccess();
