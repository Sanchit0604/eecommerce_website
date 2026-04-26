// ============================================================
// Project Title : ShopZone — E-Commerce Website
// Name          : [Your Name]
// Date          : April 2026
// Description   : JavaScript for product listing, shopping
//                 cart management, price calculation, and
//                 checkout simulation.
// ============================================================

// -------------------------------------------------------
// Product Data — Array of product objects
// -------------------------------------------------------
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 2499,
        description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
        emoji: "🎧"
    },
    {
        id: 2,
        name: "Running Shoes",
        category: "Footwear",
        price: 1899,
        description: "Lightweight and breathable running shoes with memory foam insoles for all-day comfort.",
        emoji: "👟"
    },
    {
        id: 3,
        name: "Smart Water Bottle",
        category: "Lifestyle",
        price: 599,
        description: "Insulated stainless steel bottle that tracks hydration and keeps drinks cold for 24 hours.",
        emoji: "💧"
    },
    {
        id: 4,
        name: "Mechanical Keyboard",
        category: "Electronics",
        price: 3299,
        description: "Compact TKL keyboard with tactile blue switches and per-key RGB backlighting.",
        emoji: "⌨️"
    },
    {
        id: 5,
        name: "Yoga Mat",
        category: "Fitness",
        price: 799,
        description: "Non-slip eco-friendly yoga mat with alignment lines and carry strap included.",
        emoji: "🧘"
    },
    {
        id: 6,
        name: "Desk Lamp",
        category: "Home",
        price: 1199,
        description: "LED desk lamp with 5 colour modes, touch dimmer, and USB charging port built in.",
        emoji: "💡"
    }
];

// -------------------------------------------------------
// Cart State — Array of { product, quantity } objects
// -------------------------------------------------------
let cart = [];

// -------------------------------------------------------
// Render Products to the DOM
// -------------------------------------------------------
function renderProducts() {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = ""; // Clear previous content

    products.forEach(product => {
        // Check if this product is already in the cart
        const inCart = cart.some(item => item.product.id === product.id);

        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-img">${product.emoji}</div>
            <div class="product-body">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">₹${product.price.toLocaleString()}</span>
                    <button
                        class="btn-add ${inCart ? 'added' : ''}"
                        id="add-btn-${product.id}"
                        onclick="addToCart(${product.id})"
                    >
                        ${inCart ? '✓ Added' : '+ Add to Cart'}
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// -------------------------------------------------------
// Add a Product to the Cart
// -------------------------------------------------------
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if the product already exists in the cart
    const existing = cart.find(item => item.product.id === productId);

    if (existing) {
        // Increment quantity if already in cart
        existing.quantity += 1;
    } else {
        // Add new item with quantity 1
        cart.push({ product, quantity: 1 });
    }

    // Update button appearance to show item is in cart
    const btn = document.getElementById(`add-btn-${productId}`);
    if (btn) {
        btn.textContent = "✓ Added";
        btn.classList.add("added");
    }

    updateCartUI(); // Refresh cart display
}

// -------------------------------------------------------
// Remove a Product from the Cart
// -------------------------------------------------------
function removeFromCart(productId) {
    // Filter out the item with matching product ID
    cart = cart.filter(item => item.product.id !== productId);

    // Reset "Add to Cart" button for this product
    const btn = document.getElementById(`add-btn-${productId}`);
    if (btn) {
        btn.textContent = "+ Add to Cart";
        btn.classList.remove("added");
    }

    updateCartUI();
}

// -------------------------------------------------------
// Update Quantity of a Cart Item
// -------------------------------------------------------
function updateQuantity(productId, delta) {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    item.quantity += delta;

    // If quantity drops to 0 or below, remove the item
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    updateCartUI();
}

// -------------------------------------------------------
// Update all Cart UI elements
// -------------------------------------------------------
function updateCartUI() {
    const cartEmpty   = document.getElementById("cart-empty");
    const cartContent = document.getElementById("cart-content");
    const cartBody    = document.getElementById("cart-body");
    const cartCount   = document.getElementById("cart-count");

    // Update cart count badge in navbar
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        // Show empty state, hide table
        cartEmpty.style.display = "block";
        cartContent.style.display = "none";
        return;
    }

    // Hide empty state, show table
    cartEmpty.style.display = "none";
    cartContent.style.display = "block";

    // Build table rows
    cartBody.innerHTML = "";
    cart.forEach(item => {
        const subtotal = item.product.price * item.quantity;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <span class="item-emoji">${item.product.emoji}</span>
                <span class="item-name">${item.product.name}</span>
            </td>
            <td>₹${item.product.price.toLocaleString()}</td>
            <td>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.product.id}, -1)">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.product.id}, +1)">+</button>
                </div>
            </td>
            <td><strong>₹${subtotal.toLocaleString()}</strong></td>
            <td>
                <button class="btn-remove" onclick="removeFromCart(${item.product.id})">&#128465; Remove</button>
            </td>
        `;
        cartBody.appendChild(row);
    });

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping  = subtotal > 0 ? (subtotal >= 2000 ? 0 : 99) : 0; // Free shipping above ₹2000
    const grandTotal = subtotal + shipping;

    document.getElementById("subtotal").textContent    = `₹${subtotal.toLocaleString()}`;
    document.getElementById("shipping").textContent    = shipping === 0 ? "FREE" : `₹${shipping}`;
    document.getElementById("grand-total").textContent = `₹${grandTotal.toLocaleString()}`;
}

// -------------------------------------------------------
// Scroll to Cart Section
// -------------------------------------------------------
function scrollToCart() {
    document.getElementById("cart-section").scrollIntoView({ behavior: "smooth" });
}

// -------------------------------------------------------
// Open Checkout Modal
// -------------------------------------------------------
function openCheckout() {
    if (cart.length === 0) return;

    // Calculate grand total for summary
    const subtotal   = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const shipping   = subtotal >= 2000 ? 0 : 99;
    const grandTotal = subtotal + shipping;

    // Build mini order summary inside the modal
    const summaryItems = cart
        .map(i => `<div>${i.product.emoji} ${i.product.name} x${i.quantity} = ₹${(i.product.price * i.quantity).toLocaleString()}</div>`)
        .join("");

    document.getElementById("order-summary-mini").innerHTML = `
        ${summaryItems}
        <div style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid #f3c4ab;">
            <strong>Total: ₹${grandTotal.toLocaleString()}</strong>
            ${shipping === 0 ? ' &nbsp;🎉 Free Shipping!' : ` + ₹${shipping} shipping`}
        </div>
    `;

    // Show form, hide confirmation
    document.getElementById("checkout-form-section").style.display = "block";
    document.getElementById("order-confirmation").style.display = "none";
    document.getElementById("checkout-error").textContent = "";

    // Show the modal overlay
    document.getElementById("checkout-modal").style.display = "flex";
}

// -------------------------------------------------------
// Close Checkout Modal
// -------------------------------------------------------
function closeCheckout() {
    document.getElementById("checkout-modal").style.display = "none";
}

// -------------------------------------------------------
// Place Order — Validate and Show Confirmation
// -------------------------------------------------------
function placeOrder() {
    const name    = document.getElementById("buyer-name").value.trim();
    const email   = document.getElementById("buyer-email").value.trim();
    const address = document.getElementById("buyer-address").value.trim();
    const errorEl = document.getElementById("checkout-error");

    // Validation: all fields required
    if (!name) {
        errorEl.textContent = "⚠ Please enter your full name.";
        return;
    }
    if (!email || !email.includes("@")) {
        errorEl.textContent = "⚠ Please enter a valid email address.";
        return;
    }
    if (!address) {
        errorEl.textContent = "⚠ Please enter your delivery address.";
        return;
    }

    errorEl.textContent = ""; // Clear errors

    // Generate a random order ID
    const orderId = "SZ-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Show confirmation section
    document.getElementById("confirm-name").textContent = name;
    document.getElementById("order-id").textContent     = orderId;
    document.getElementById("checkout-form-section").style.display = "none";
    document.getElementById("order-confirmation").style.display    = "block";
}

// -------------------------------------------------------
// Continue Shopping — Clear cart and close modal
// -------------------------------------------------------
function continueShopping() {
    // Empty the cart
    cart = [];
    updateCartUI();

    // Reset all "Add to Cart" buttons
    products.forEach(p => {
        const btn = document.getElementById(`add-btn-${p.id}`);
        if (btn) {
            btn.textContent = "+ Add to Cart";
            btn.classList.remove("added");
        }
    });

    // Close modal and scroll to products
    closeCheckout();
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

// Close modal when clicking the overlay background
document.getElementById("checkout-modal").addEventListener("click", function(e) {
    if (e.target === this) closeCheckout();
});

// -------------------------------------------------------
// Initialize the page
// -------------------------------------------------------
renderProducts(); // Render product cards on page load
updateCartUI();   // Initialize cart display
