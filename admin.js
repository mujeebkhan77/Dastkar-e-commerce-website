// =========================

function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// =========================
// ADD PRODUCT
// =========================
function addProduct() {
    let name     = document.getElementById("name").value.trim();
    let price    = document.getElementById("price").value.trim();
    let desc     = document.getElementById("desc").value.trim();
    let category = document.getElementById("category").value.trim();
    let fileInput = document.getElementById("imageFile");
    let file     = fileInput.files[0];

    // Validation
    if (!name || !price || !desc || !category || !file) {
        showAdminMsg("⚠ Please fill all fields and select an image.", "red");
        return;
    }

    if (isNaN(price) || Number(price) <= 0) {
        showAdminMsg("⚠ Price must be a valid positive number.", "red");
        return;
    }

    let reader = new FileReader();

    reader.onload = function () {
        let products = getProducts();

        // New product gets id > 9 always (so defaults are never overwritten)
        let adminProducts = products.filter(p => p.id > 9);
        let newId = adminProducts.length > 0
            ? Math.max(...adminProducts.map(p => p.id)) + 1
            : 10;

        let newProduct = {
            id: newId,
            name,
            price: Number(price),
            image: reader.result,
            desc,
            category
        };

        products.push(newProduct);
        saveProducts(products);
        renderAdminProducts();

        // Clear form
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("desc").value = "";
        document.getElementById("category").value = "";
        fileInput.value = "";

        showAdminMsg("✔ Product added successfully!", "green");
    };

    reader.readAsDataURL(file);
}

// =========================
// DELETE PRODUCT (only id > 9)
// =========================
function deleteProduct(id) {
    if (id <= 9) {
        showAdminMsg("⚠ Default products cannot be deleted.", "red");
        return;
    }

    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    renderAdminProducts();
    showAdminMsg("✔ Product deleted.", "green");
}

// =========================
// RENDER ADMIN PRODUCTS
// =========================
function renderAdminProducts() {
    let container = document.getElementById("adminProducts");
    container.innerHTML = "";

    let products = getProducts();
    let adminAdded = products.filter(p => p.id > 9);

    if (adminAdded.length === 0) {
        container.innerHTML = `
            <p style="text-align:center; color:#3E2723; padding:20px;">
                No extra products added yet. Add one above.
            </p>
        `;
        return;
    }

    adminAdded.forEach(p => {
        container.innerHTML += `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="admin-price">$${p.price}</p>
            <p class="admin-cat">${p.category}</p>
            <p class="admin-desc">${p.desc}</p>
            <button onclick="deleteProduct(${p.id})" class="buy-btn delete-btn">Delete</button>
        </div>
        `;
    });
}

// =========================
// ADMIN MESSAGE
// =========================
function showAdminMsg(msg, color) {
    let el = document.getElementById("adminMsg");
    if (!el) return;
    el.innerText = msg;
    el.style.color = color;
    setTimeout(() => { el.innerText = ""; }, 3000);
}

// Init
renderAdminProducts();
