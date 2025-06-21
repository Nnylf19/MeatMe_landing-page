// Product prices (₱ per kilo)
const productPrices = {
    porkKasim: 315,
    porkLiempo: 336,
    porkWithBones: 280,
    beefWithBones: 285,
    pureBeefMeat: 420,
    dressedChicken: 220,
    chickenBreastSkinless: 232,
    sausages: 880,
    beefRound: 268,
    porkHam: 350,
    porkBelly: 380,
    porkBellyLaguna: 430,
    chickenDrumstick: 210,
    groundPork: 290,
    groundBeef: 320
};

// Human-readable product names
const productNames = {
    porkKasim: "Pork Kasim",
    porkLiempo: "Pork Liempo",
    porkWithBones: "Pork with Bones",
    beefWithBones: "Beef with Bones",
    pureBeefMeat: "Pure Beef Meat",
    dressedChicken: "Dressed Chicken",
    chickenBreastSkinless: "Chicken Breast (Skinless)",
    sausages: "Sausages",
    beefRound: "Beef Round (Back Leg)",
    porkHam: "Pork Ham",
    porkBelly: "Pork Belly",
    porkBellyLaguna: "Pork Belly (Laguna)",
    chickenDrumstick: "Chicken Drumstick",
    groundPork: "Ground Pork",
    groundBeef: "Ground Beef"
};

// Reference objects and state management
let productInputs = {};
let amountDisplays = {};
let cartItems = JSON.parse(localStorage.getItem('cartItems') || '{}');
let totalAmountDisplay = null;
let cartItemsContainer = null;

// Initialize or reinitialize DOM references
function initializeDOMReferences() {
    productInputs = {};
    amountDisplays = {};
    totalAmountDisplay = document.getElementById("totalAmount");
    cartItemsContainer = document.getElementById("cartItems");

    // Get all input fields and amount elements based on IDs
    for (const product in productPrices) {
        productInputs[product] = document.getElementById(product);
        amountDisplays[product] = document.getElementById(`${product}Amount`);
    }
}

// Calculate product amount per quantity
function calculateAmounts() {
    let total = 0;

    for (let product in productPrices) {
        if (!productInputs[product]) continue; // Skip if element not found

        const quantity = parseFloat(productInputs[product].value || 0);
        const amount = quantity * productPrices[product];

        // Display amount if element exists
        if (amountDisplays[product]) {
            amountDisplays[product].textContent = `Amount: ₱${amount.toFixed(2)}`;
        }

        if (quantity > 0) {
            cartItems[product] = { quantity: quantity, amount: amount };
        } else {
            delete cartItems[product];
        }

        total += amount;
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    if (totalAmountDisplay) {
        totalAmountDisplay.textContent = total.toFixed(2);
    }
}

// Display items in cart
function updateCartDisplay() {
    if (!cartItemsContainer || !totalAmountDisplay) return;

    let cartHTML = '';
    let cartTotal = 0;

    for (let product in cartItems) {
        const { quantity, amount } = cartItems[product];
        cartHTML += `
            <div class="cart-item">
                <p><strong>${productNames[product]}</strong>: ${quantity} kg - ₱${amount.toFixed(2)}</p>
            </div>
        `;
        cartTotal += amount;
    }

    cartItemsContainer.innerHTML = cartHTML;
    totalAmountDisplay.textContent = cartTotal.toFixed(2);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Initialize product functionality
function initializeProductFunctionality() {
    // Initialize DOM references first
    initializeDOMReferences();

    // Restore quantities from cart
    for (const product in cartItems) {
        if (productInputs[product]) {
            productInputs[product].value = cartItems[product].quantity;
            if (amountDisplays[product]) {
                amountDisplays[product].textContent = `Amount: ₱${cartItems[product].amount.toFixed(2)}`;
            }
        }
    }

    // Initialize product inputs and amount displays
    for (const product in productPrices) {
        const input = productInputs[product];
        const amountDisplay = amountDisplays[product];

        if (input && amountDisplay) {
            // Remove existing event listeners
            input.replaceWith(input.cloneNode(true));
            const newInput = document.getElementById(product);
            
            // Add input event to auto-update amount when quantity is changed
            newInput.addEventListener("input", () => {
                const quantity = parseFloat(newInput.value || 0);
                const amount = quantity * productPrices[product];
                amountDisplay.textContent = `Amount: ₱${amount.toFixed(2)}`;
                
                // Update cart when quantity changes
                if (quantity > 0) {
                    cartItems[product] = { quantity: quantity, amount: amount };
                } else {
                    delete cartItems[product];
                }
                updateCartDisplay();
            });
        }
    }

    // Initialize "Add to Cart" buttons with proper event handling
    document.querySelectorAll(".add-to-cart").forEach(button => {
        // Remove existing event listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        // Add new event listener
        newButton.addEventListener("click", () => {
            const product = newButton.getAttribute("data-product");
            const input = productInputs[product];
            if (!input) return;

            const quantity = parseFloat(input.value || 0);
            if (quantity > 0) {
                const amount = quantity * productPrices[product];
                cartItems[product] = { quantity: quantity, amount: amount };
            } else {
                delete cartItems[product];
            }
            calculateAmounts();
            updateCartDisplay();
        });
    });

    // Initialize checkout button
    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (Object.keys(cartItems).length === 0) {
                alert('Your cart is empty. Please add some items before checking out.');
                return;
            }
            alert('Proceeding to checkout with total amount: ₱' + totalAmountDisplay.textContent);
            // Here you can add additional checkout logic or redirect to a checkout page
        });
    }

    // Initial cart display
    updateCartDisplay();
}

// Initialize Swiper
function initializeSwiper() {
    new Swiper('.mySwiper', {
        slidesPerView: 5,
        slidesPerGroup: 1, // Change to 1 for smoother infinite loop
        spaceBetween: 20,
        centeredSlides: false,
        loop: true,
        loopedSlides: 15, // Total number of slides
        loopFillGroupWithBlank: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: false,
            type: 'bullets'
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        speed: 600,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        breakpoints: {
            320: { 
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 10
            },
            640: { 
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 15
            },
            1024: { 
                slidesPerView: 5,
                slidesPerGroup: 1,
                spaceBetween: 20
            }
        },
        on: {
            init: function() {
                this.update();
            },
            resize: function() {
                this.update();
            }
        }
    });
}

// Initialize product functionality on load
window.addEventListener('load', () => {
    initializeProductFunctionality();
    initializeSwiper();
});
