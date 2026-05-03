/***********************
  MOBILE MENU
************************/
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenu = document.getElementById("closeMenu");

  if (!hamburger || !mobileMenu || !closeMenu) {
    console.error("Hamburger elements missing");
    return;
  }

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.add("active");
  });

  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });

  // Close menu when clicking any link
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
    });
  });
});

/***********************
  REVIEWS SLIDER
************************/
const reviews = [
  {
    name: "Olivia Smith",
    img: "https://i.pravatar.cc/100?img=32",
    text: "Delicious dishes, cozy ambiance, and exceptional service. A must-visit for food lovers seeking bold flavors and unforgettable dining experiences.",
    stars: "★★★★★",
  },
  {
    name: "James Miller",
    img: "https://i.pravatar.cc/100?img=12",
    text: "Amazing food quality and very fast delivery. The flavors are rich and everything arrived hot and fresh!",
    stars: "★★★★★",
  },
  {
    name: "Sophia Brown",
    img: "https://i.pravatar.cc/100?img=47",
    text: "User-friendly app, great menu options, and excellent customer support. Highly recommended!",
    stars: "★★★★☆",
  },
];

let currentReview = 0;

const reviewText = document.getElementById("review");
const userImg = document.querySelector(".user img");
const userName = document.querySelector(".user-info h4");
const stars = document.querySelector(".stars");

function showReview(index) {
  reviewText.textContent = reviews[index].text;
  userImg.src = reviews[index].img;
  userName.textContent = reviews[index].name;
  stars.textContent = reviews[index].stars;
}

function nextReview() {
  currentReview = (currentReview + 1) % reviews.length;
  showReview(currentReview);
}

function prevReview() {
  currentReview = (currentReview - 1 + reviews.length) % reviews.length;
  showReview(currentReview);
}

showReview(currentReview);

/***********************
  CART SYSTEM (FIXED)
************************/

const cartIcon = document.querySelector(".cart-icon");
const cartOverlay = document.getElementById("cartOverlay");
const cartPanel = document.getElementById("cartPanel");
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotalEl = document.querySelector(".cart-total strong");
const cartCountEl = document.querySelector(".cart-value");
const toast = document.getElementById("cartToast");
const checkoutBtn = document.querySelector(".cart-actions .btn:last-child");

let cart = [];

document.addEventListener("click", function (e) {
  const btn = e.target.closest(".add-to-cart");
  if (!btn) return;

  e.preventDefault();

  const name = btn.dataset.name;
  const price = Number(btn.dataset.price);
  const img = btn.dataset.img;

  const existing = cart.find((item) => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, img, qty: 1 });

    btn.textContent = "Added ✓";
    btn.classList.add("added");
  }

  updateCart(); // 🔥 THIS IS KEY
});
/* OPEN / CLOSE CART */
function openCart() {
  cartOverlay.classList.add("active");
  cartPanel.classList.add("active");
}

function closeCart() {
  cartOverlay.classList.remove("active");
  cartPanel.classList.remove("active");
}

cartIcon.addEventListener("click", openCart);
cartOverlay.addEventListener("click", closeCart);

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = count;
}

function updateCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <p class="empty-cart">🛒 Your cart is empty</p>
      <p class="empty-note">Add items to continue checkout</p>
    `;

    cartTotalEl.textContent = "₹0";
    updateCartCount();

    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = "0.5";
      checkoutBtn.style.cursor = "not-allowed";
    }

    return;
  }

  // ✅ ENABLE BUTTON
  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
    checkoutBtn.style.cursor = "pointer";
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.img}">
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>₹${item.price * item.qty}</p>
      </div>
      <div class="cart-qty">
        <button onclick="changeQty(${index}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>
    `;

    cartItemsContainer.appendChild(div);
  });

  cartTotalEl.textContent = "₹" + total;
  updateCartCount();
  saveCart();
}

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Load cart
function loadCart() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCart();
}

// Call this once
loadCart();

function handleOrderNow(event) {
  event.preventDefault();

  document.getElementById("menu").scrollIntoView({
    behavior: "smooth",
  });

  setTimeout(() => {
    openCart();
  }, 500);
}

/* CHANGE QTY + SLIDE REMOVE */
function changeQty(index, change) {
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    const removedItemName = cart[index].name;
    const itemEl = document.querySelectorAll(".cart-item")[index];

    // move item completely to the right
    itemEl.classList.add("move-right");

    // remove AFTER animation completes
    setTimeout(() => {
      cart.splice(index, 1);
      updateCart();
      resetSingleAddToCartButton(removedItemName);
    }, 500); // must match CSS animation time

    return;
  }

  updateCart();
}

function resetSingleAddToCartButton(itemName) {
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    if (btn.dataset.name === itemName) {
      btn.textContent = "Add to cart";
      btn.classList.remove("added");
      btn.style.pointerEvents = "auto";
    }
  });
}

function restoreButtons() {
  cart.forEach((item) => {
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      if (btn.dataset.name === item.name) {
        btn.textContent = "Added ✓";
        btn.classList.add("added");
        btn.style.pointerEvents = "none";
      }
    });
  });
}

restoreButtons();

function openCheckout() {
  if (cart.length === 0) {
    return;
  }
  document.getElementById("checkoutOverlay").style.display = "block";
  document.getElementById("checkoutModal").style.display = "block";

  const itemsDiv = document.getElementById("checkoutItems");
  const totalSpan = document.getElementById("checkoutTotal");

  itemsDiv.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    itemsDiv.innerHTML += `
  <div class="checkout-item">
    <img src="${item.img}" alt="${item.name}">
    
    <div class="checkout-info">
      <p>${item.name} x${item.qty}</p>
    </div>

    <span class="checkout-price">₹${item.price * item.qty}</span>
  </div>
`;
    total += item.price * item.qty;
  });

  totalSpan.innerText = "₹" + total;
}

function closeCheckout() {
  document.getElementById("checkoutOverlay").style.display = "none";
  document.getElementById("checkoutModal").style.display = "none";
}

document
  .getElementById("checkoutForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Close cart & checkout
    document.getElementById("checkoutOverlay").style.display = "none";
    document.getElementById("checkoutModal").style.display = "none";
    document.getElementById("cartOverlay").classList.remove("active");
    document.getElementById("cartPanel").classList.remove("active");

    // 🔥 SAVE ORDER FIRST
    localStorage.setItem("lastOrder", JSON.stringify(cart));
    localStorage.setItem("orderStartTime", Date.now()); // ✅ IMPORTANT

    // Clear cart
    cart = [];
    updateCart();

    // ✅ RESET BUTTONS
    resetAddToCartButtons();
    showSuccess();
  });

function resetAddToCartButtons() {
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.textContent = "Add to cart";
    btn.classList.remove("added");
    btn.style.pointerEvents = "auto";
  });
}

/* SUCCESS CLOSE (GLOBAL) */
function closeSuccess() {
  document.getElementById("successOverlay").style.display = "none";
  document.getElementById("successModal").style.display = "none";
}

const sections = document.querySelectorAll("section[id]");
const footer = document.querySelector("footer#contact");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  // ✅ SPECIAL CHECK FOR CONTACT (FOOTER)
  if (
    footer &&
    window.scrollY + window.innerHeight >= document.body.scrollHeight - 50
  ) {
    currentSection = "contact";
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

const signInBtn = document.getElementById("signInBtn");
const mobileSignInBtn = document.querySelector(".signInMobile");

const loginOverlay = document.getElementById("loginOverlay");
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const successOverlay = document.getElementById("successOverlay");
const successModal = document.getElementById("successModal");

/* OPEN LOGIN */
function openLogin() {
  loginOverlay.style.display = "block";
  loginModal.style.display = "block";
  document.body.style.overflow = "hidden";
}

signInBtn.addEventListener("click", openLogin);
if (mobileSignInBtn) {
  mobileSignInBtn.addEventListener("click", openLogin);
}

/* CLOSE LOGIN */
function closeLogin() {
  loginOverlay.style.display = "none";
  loginModal.style.display = "none";
  document.body.style.overflow = "";
}

/* HANDLE LOGIN */
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("loginName").value;

  // Save user
  localStorage.setItem("foodieUser", name);

  // Update button text
  updateUserUI();

  closeLogin();
});

/* UPDATE HEADER UI */
function updateUserUI() {
  const user = localStorage.getItem("foodieUser");

  if (!user) return;

  // Desktop
  signInBtn.innerHTML = `Hi, ${user}`;
  signInBtn.classList.add("logged-in");
  signInBtn.disabled = true;

  // Mobile
  if (mobileSignInBtn) {
    mobileSignInBtn.innerHTML = `Hi, ${user}`;
    mobileSignInBtn.classList.add("logged-in");
    mobileSignInBtn.disabled = true;
  }
}

function showSuccess() {
  document.getElementById("successOverlay").style.display = "block";
  document.getElementById("successModal").style.display = "block";

  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 2000);
  }
}

const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");

searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase().trim();

  const cards = document.querySelectorAll(".order-card");
  let visibleCount = 0;

  cards.forEach((card) => {
    const name = card.querySelector("h4").textContent.toLowerCase();

    if (name.includes(value)) {
      card.classList.remove("hide");
      card.style.display = "flex";
      visibleCount++;
    } else {
      card.classList.add("hide");

      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });

  // 🔥 Show / Hide "No results"
  if (visibleCount === 0) {
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
  }
});

/* LOAD USER ON REFRESH */
updateUserUI();

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("INSTALL READY ✅");
  e.preventDefault();
  deferredPrompt = e;
});

document.getElementById("installBtn").addEventListener("click", async () => {
  if (!deferredPrompt) {
    alert("Install not available. Use browser menu → Add to Home Screen.");
    return;
  }

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

const steps = document.querySelectorAll(".timeline .step");

let currentStep = 0;


document.addEventListener("DOMContentLoaded", () => {
  // reset tracker
  currentStep = 0;
  steps.forEach((step) => {
    step.classList.remove("active");
    step.querySelector(".time").textContent = "--";
  });
});

document.getElementById("receivedBtn").addEventListener("click", () => {

  clearInterval(trackerInterval); // 🛑 STOP TRACKER

  const main = document.getElementById("main-content");
  const track = document.getElementById("track-order");

  track.style.display = "none";
  track.classList.add("hidden");

  main.style.display = "block";

  document.getElementById("home").scrollIntoView({
    behavior: "smooth"
  });
});

function loadOrderDetails() {
  const order = JSON.parse(localStorage.getItem("lastOrder")) || [];
  const container = document.querySelector(".track-summary");

  if (order.length === 0) {
    container.innerHTML = "<p>No order found</p>";
    return;
  }

  let total = 0;
  let html = "<h3>Your Order</h3>";

  order.forEach((item) => {
    total += item.price * item.qty;

 html += `
  <div class="order-item">
    <img src="${item.img}" alt="">
    <div class="order-info">
      <p class="name">${item.name} x${item.qty}</p>
      <p class="price">₹${item.price * item.qty}</p>
    </div>
  </div>
`;
  });

  html += `<p class="total">Total: ₹${total}</p>`;

  container.innerHTML = html;
}

function viewOrder() {
  closeSuccess();

  document.getElementById("main-content").style.display = "none";

  const track = document.getElementById("track-order");
  track.classList.remove("hidden");
  track.style.display = "block";

  loadOrderDetails();

  startTracker(); // ✅ ONLY THIS

  window.scrollTo({ top: 0, behavior: "smooth" });
}

let trackerInterval;

function startTracker() {
  const startTime = Number(localStorage.getItem("orderStartTime"));
  const etaText = document.getElementById("eta");
  const steps = document.querySelectorAll(".timeline .step");

  clearInterval(trackerInterval);

  trackerInterval = setInterval(() => {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);

    const totalTime = 30 * 60;
    const remaining = totalTime - elapsed;

    const minsPassed = Math.floor(elapsed / 60);

    // ⏱️ countdown
    if (remaining <= 0) {
      etaText.innerHTML = "Order Delivered ✅";
    } else {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;

      etaText.innerHTML = `Arriving in ${mins}:${secs
        .toString()
        .padStart(2, "0")} mins ⏱️`;
    }

    // 🔥 reset all
    steps.forEach((step) => {
      step.classList.remove("active");
      step.querySelector(".time").textContent = "--";
    });

    const format = (t) =>
      new Date(t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    // ✅ Ordered + Confirmed (same time)
    steps[0].classList.add("active");
    steps[1].classList.add("active");

    steps[0].querySelector(".time").textContent = format(startTime);
    steps[1].querySelector(".time").textContent = format(startTime);

    // ✅ Cooking after 10 min
    if (minsPassed >= 10) {
      steps[2].classList.add("active");
      steps[2].querySelector(".time").textContent =
        format(startTime + 10 * 60000);
    }

    // ✅ Delivery after 20 min
    if (minsPassed >= 20) {
      steps[3].classList.add("active");
      steps[3].querySelector(".time").textContent =
        format(startTime + 20 * 60000);
    }

    // ✅ Delivered after 30 min
    if (minsPassed >= 30) {
      steps[4].classList.add("active");
      steps[4].querySelector(".time").textContent =
        format(startTime + 30 * 60000);
    }

  }, 1000);

  console.log("Start:", startTime);
console.log("Now:", Date.now());
console.log("Minutes Passed:", Math.floor((Date.now() - startTime)/60000));
}