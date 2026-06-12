document.addEventListener('DOMContentLoaded', () => {
    // --- Loading Screen ---
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => { loadingScreen.classList.add('hidden'); }, 1500);

    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    // --- Book Data ---
    const books = [
        { id: 1, title: 'The Future of AI', author: 'Dr. Sarah Chen', price: 29.99, originalPrice: 49.99, rating: 4.9, image: 'book_cover.png', featured: true, trending: true, category: 'Technology' },
        { id: 2, title: 'Quantum Design', author: 'Alex Mercer', price: 34.99, originalPrice: 59.99, rating: 4.8, image: 'book_cover_2.png', featured: true, trending: false, category: 'Design' },
        { id: 3, title: 'Neural Networks', author: 'James Webb', price: 24.99, originalPrice: 39.99, rating: 4.7, image: 'book_cover.png', featured: false, trending: true, category: 'Science' },
        { id: 4, title: 'Beyond Coding', author: 'Elena Rostova', price: 19.99, originalPrice: 29.99, rating: 4.6, image: 'book_cover_2.png', featured: true, trending: true, category: 'Technology' }
            ,
        { id: 5, title: 'AI Revolution', author: 'Mona Kapoor', price: 31.99, originalPrice: 49.99, rating: 4.9, image: 'book_cover.png', featured: true, trending: true, category: 'Technology' },
        { id: 6, title: 'Design Patterns', author: 'John Doe', price: 28.99, originalPrice: 44.99, rating: 4.8, image: 'book_cover_2.png', featured: true, trending: false, category: 'Design' },
        { id: 7, title: 'Space Exploration', author: 'Dr. Ahmed Zaman', price: 22.99, originalPrice: 39.99, rating: 4.7, image: 'book_cover.png', featured: false, trending: true, category: 'Science' },
        { id: 8, title: 'Creative Coding', author: 'Lisa Ray', price: 24.99, originalPrice: 39.99, rating: 4.6, image: 'book_cover_2.png', featured: true, trending: true, category: 'Technology' }
];

    // --- Flash Sale Books Data ---
    const flashBooks = [
        { id: 101, title: 'The Future of AI',    author: 'Dr. Sarah Chen',   flashPrice: 14.99, originalPrice: 49.99, image: 'book_cover.png',   discount: 70, sold: 78, total: 100 },
        { id: 102, title: 'Quantum Design',      author: 'Alex Mercer',       flashPrice: 17.99, originalPrice: 59.99, image: 'book_cover_2.png', discount: 70, sold: 55, total: 80  },
        { id: 103, title: 'Neural Networks',     author: 'James Webb',        flashPrice: 9.99,  originalPrice: 39.99, image: 'book_cover.png',   discount: 75, sold: 90, total: 100 },
        { id: 104, title: 'Beyond Coding',       author: 'Elena Rostova',     flashPrice: 7.99,  originalPrice: 29.99, image: 'book_cover_2.png', discount: 73, sold: 40, total: 60  },
        { id: 105, title: 'Deep Space Science',  author: 'Dr. Liam Patel',    flashPrice: 11.99, originalPrice: 44.99, image: 'book_cover.png',   discount: 73, sold: 60, total: 90  },
        { id: 106, title: 'Digital Minds',       author: 'Sophia Lane',       flashPrice: 13.99, originalPrice: 54.99, image: 'book_cover_2.png', discount: 75, sold: 30, total: 70  },
        { id: 107, title: 'Business in 2050',    author: 'Marcus T. Reid',    flashPrice: 8.99,  originalPrice: 34.99, image: 'book_cover.png',   discount: 74, sold: 85, total: 100 },
        { id: 108, title: 'The Code Manifesto',  author: 'Nina Kwan',         flashPrice: 6.99,  originalPrice: 24.99, image: 'book_cover_2.png', discount: 72, sold: 20, total: 50  }
    ];

    // --- Render Flash Sale Books ---
    function renderFlashBooks() {
        const container = document.getElementById('flashBooksContainer');
        if (!container) return;
        container.innerHTML = '';

        flashBooks.forEach(book => {
            const remaining = book.total - book.sold;
            const progressPercent = (book.sold / book.total) * 100;

            container.innerHTML += `
                <div class="flash-book-card">
                    <div class="flash-label">⚡ Flash Deal</div>
                    <img src="${book.image}" alt="${book.title}" onclick="openBookDetails(${book.id - 100})">
                    <h3>${book.title}</h3>
                    <div class="flash-author">${book.author}</div>
                    <div class="flash-price-row">
                        <span class="flash-old-price">$${book.originalPrice.toFixed(2)}</span>
                        <span class="flash-new-price">$${book.flashPrice.toFixed(2)}</span>
                    </div>
                    <div class="flash-discount-tag">🔥 ${book.discount}% OFF — Today Only!</div>
                    <div class="flash-progress">
                        <div class="flash-progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="flash-stock-text">Only ${remaining} left in stock!</div>
                    <button class="flash-add-btn" onclick="addToCartFlash(${book.id})">
                        <i data-lucide="zap"></i> Grab Flash Deal
                    </button>
                </div>
            `;
        });
        lucide.createIcons();
    }

    // --- Add Flash Book to Cart ---
    window.addToCartFlash = (flashId) => {
        const flashBook = flashBooks.find(b => b.id === flashId);
        const existingItem = cart.find(item => item.id === flashId);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({
                id: flashId,
                title: flashBook.title + ' ⚡',
                author: flashBook.author,
                price: flashBook.flashPrice,
                image: flashBook.image,
                qty: 1
            });
        }
        updateCartUI();
        showToast('⚡ Flash Deal!', `${flashBook.title} added at flash price $${flashBook.flashPrice}!`);
        openSidebar('cartSidebar', 'cartOverlay');
    };

    // --- State Management ---
    let cart = [];
    let wishlist = [];

    // --- Render Books ---
    function renderBooks() {
        const featuredContainer = document.getElementById('featuredBooksContainer');
        const trendingContainer = document.getElementById('trendingBooksContainer');
        
        if(featuredContainer) featuredContainer.innerHTML = '';
        if(trendingContainer) trendingContainer.innerHTML = '';

        books.forEach(book => {
            const cardHTML = `
                <div class="book-card" data-id="${book.id}">
                    <div class="discount-badge">-20%</div>
                    <div class="wishlist-btn-card" onclick="toggleWishlist(${book.id}, event)">
                        <i data-lucide="heart" class="${wishlist.includes(book.id) ? 'active' : ''}"></i>
                    </div>
                    <img src="${book.image}" alt="${book.title}" onclick="openBookDetails(${book.id})">
                    <h3 onclick="openBookDetails(${book.id})">${book.title}</h3>
                    <div class="author">${book.author}</div>
                    <div class="ratings">⭐⭐⭐⭐⭐ ${book.rating}</div>
                    <div class="price">$${book.price.toFixed(2)}</div>
                    <div class="card-actions">
                        <button class="add-cart-btn full-width" onclick="addToCart(${book.id})">
                            <i data-lucide="shopping-bag"></i> Add to Cart
                        </button>
                        <button class="wa-order-btn full-width" onclick="orderViaWA(${book.id})">
                            <i data-lucide="message-circle"></i> WhatsApp Order
                        </button>
                    </div>
                </div>
            `;
            if (book.featured && featuredContainer) featuredContainer.innerHTML += cardHTML;
            if (book.trending && trendingContainer) trendingContainer.innerHTML += cardHTML;
        });
        lucide.createIcons();
    }

    // --- Cart System ---
    window.addToCart = (bookId) => {
        const book = books.find(b => b.id === bookId);
        const existingItem = cart.find(item => item.id === bookId);
        
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ ...book, qty: 1 });
        }
        
        updateCartUI();
        showToast('🛒 Added to Cart', `${book.title} was added to your cart.`);
        openSidebar('cartSidebar', 'cartOverlay');
    };

    window.updateQty = (bookId, delta) => {
        const item = cart.find(i => i.id === bookId);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id !== bookId);
            }
            updateCartUI();
        }
    };

    function updateCartUI() {
        const container = document.getElementById('cartItemsContainer');
        const badge = document.getElementById('cartBadge');
        
        // Update Badge
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        badge.textContent = totalQty;
        
        // Update Items
        if (cart.length === 0) {
            container.innerHTML = '<div class="empty-state">Your cart is empty.</div>';
            document.getElementById('cartSubtotal').textContent = '$0.00';
            document.getElementById('cartTax').textContent = '$0.00';
            document.getElementById('cartTotal').textContent = '$0.00';
            return;
        }

        container.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.qty;
            container.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-actions">
                            <div class="qty-controls">
                                <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                                <span>${item.qty}</span>
                                <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                            </div>
                            <button class="remove-btn" onclick="updateQty(${item.id}, -${item.qty})"><i data-lucide="trash-2" size="16"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });

        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cartTax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
        lucide.createIcons();
    }

    // --- Wishlist System ---
    window.toggleWishlist = (bookId, event) => {
        if(event) event.stopPropagation();
        const book = books.find(b => b.id === bookId);
        
        if (wishlist.includes(bookId)) {
            wishlist = wishlist.filter(id => id !== bookId);
            showToast('💔 Removed', `${book.title} removed from wishlist.`);
        } else {
            wishlist.push(bookId);
            showToast('❤️ Saved', `${book.title} saved to wishlist.`);
        }
        
        document.getElementById('wishlistBadge').textContent = wishlist.length;
        renderBooks(); // Re-render to update heart icons
        updateWishlistUI();
    };

    function updateWishlistUI() {
        const container = document.getElementById('wishlistItemsContainer');
        if (wishlist.length === 0) {
            container.innerHTML = '<div class="empty-state">Your wishlist is empty.</div>';
            return;
        }
        container.innerHTML = '';
        wishlist.forEach(id => {
            const item = books.find(b => b.id === id);
            container.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-actions" style="justify-content: flex-start; gap: 10px;">
                            <button class="btn-primary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="addToCart(${item.id})">Add to Cart</button>
                            <button class="remove-btn" onclick="toggleWishlist(${item.id})"><i data-lucide="trash-2" size="16"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });
        lucide.createIcons();
    }

    // --- WhatsApp System ---
    window.orderViaWA = (bookId) => {
        const book = books.find(b => b.id === bookId);
        const msg = `Hello, I want to order:\n*Book Name:* ${book.title}\n*Price:* $${book.price}\n*Quantity:* 1`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // --- Sidebar Toggles ---
    function openSidebar(sidebarId, overlayId) {
        document.getElementById(overlayId).classList.add('active');
        document.getElementById(sidebarId).classList.add('active');
        document.body.classList.add('modal-open');
    }
    function closeSidebar(sidebarId, overlayId) {
        document.getElementById(overlayId).classList.remove('active');
        document.getElementById(sidebarId).classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    document.getElementById('navCartBtn').addEventListener('click', () => openSidebar('cartSidebar', 'cartOverlay'));
    document.getElementById('navWishlistBtn').addEventListener('click', () => { updateWishlistUI(); openSidebar('wishlistSidebar', 'wishlistOverlay'); });
    
    document.getElementById('closeCartBtn').addEventListener('click', () => closeSidebar('cartSidebar', 'cartOverlay'));
    document.getElementById('cartOverlay').addEventListener('click', () => closeSidebar('cartSidebar', 'cartOverlay'));
    
    document.getElementById('closeWishlistBtn').addEventListener('click', () => closeSidebar('wishlistSidebar', 'wishlistOverlay'));
    document.getElementById('wishlistOverlay').addEventListener('click', () => closeSidebar('wishlistSidebar', 'wishlistOverlay'));


    // --- Checkout System ---
    const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');

    proceedCheckoutBtn.addEventListener('click', () => {
        if(cart.length === 0) {
            showToast('⚠️ Empty Cart', 'Add items to cart before checkout.');
            return;
        }
        closeSidebar('cartSidebar', 'cartOverlay');
        checkoutModal.classList.add('active');
        document.body.classList.add('modal-open');
    });

    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    });

    // Step 1: Shipping Form Submit
    document.getElementById('shippingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('checkoutStep1').classList.remove('active');
        document.querySelector('.step[data-step="1"]').classList.remove('active');
        document.getElementById('checkoutStep2').classList.add('active');
        document.querySelector('.step[data-step="2"]').classList.add('active');
    });

    // Payment Method Selection
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Update UI styling
            document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('active'));
            e.target.closest('.payment-method-card').classList.add('active');

            // Show/Hide Card Form
            if(e.target.value === 'card') {
                document.getElementById('creditCardFormUI').style.display = 'flex';
                document.getElementById('payNowBtn').textContent = 'Pay Securely';
            } else {
                document.getElementById('creditCardFormUI').style.display = 'none';
                document.getElementById('payNowBtn').textContent = `Proceed with ${e.target.value.toUpperCase()}`;
            }
        });
    });

    // Card Form Live Preview
    const inputNum = document.getElementById('inputCardNum');
    const inputHolder = document.getElementById('inputCardHolder');
    const inputExp = document.getElementById('inputCardExp');
    
    inputNum.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        e.target.value = formatted;
        document.getElementById('displayCardNum').textContent = formatted || '#### #### #### ####';
    });
    inputHolder.addEventListener('input', (e) => document.getElementById('displayCardHolder').textContent = e.target.value.toUpperCase() || 'CARD HOLDER');
    inputExp.addEventListener('input', (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if(val.length > 2) val = val.substring(0,2) + '/' + val.substring(2,4);
        e.target.value = val;
        document.getElementById('displayCardExp').textContent = val || 'MM/YY';
    });

    // Step 2: Payment Submit (Simulate Success)
    document.getElementById('paymentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('payNowBtn');
        btn.innerHTML = '<div class="book-loader" style="width: 20px; height: 20px; border-width: 2px;"></div> Processing...';
        
        setTimeout(() => {
            document.getElementById('checkoutStep2').classList.remove('active');
            document.querySelector('.step[data-step="2"]').classList.remove('active');
            
            document.getElementById('checkoutStep3').classList.add('active');
            document.querySelector('.step[data-step="3"]').classList.add('active');
            
            document.getElementById('orderNumSpan').textContent = Math.floor(100000 + Math.random() * 900000);
            
            // Clear Cart
            cart = [];
            updateCartUI();
        }, 2000);
    });

    // --- Book Details Modal ---
    window.openBookDetails = (bookId) => {
        const book = books.find(b => b.id === bookId);
        const modalContent = document.getElementById('bookDetailsContent');
        
        modalContent.innerHTML = `
            <div class="modal-left">
                <img src="${book.image}" class="modal-cover" alt="Cover">
            </div>
            <div class="modal-right">
                <span style="color:var(--accent-purple); font-weight:bold; font-size: 0.8rem; text-transform:uppercase;">${book.category}</span>
                <h1 style="font-size: 2.5rem; margin: 10px 0;">${book.title}</h1>
                <p style="color: var(--text-secondary);">By ${book.author}</p>
                <div style="color: #ffaa00; margin: 15px 0;">⭐⭐⭐⭐⭐ ${book.rating}</div>
                <div style="font-size: 2rem; font-weight: bold; color: var(--accent-orange); margin-bottom: 20px;">$${book.price.toFixed(2)} <span style="font-size:1rem; color:var(--text-secondary); text-decoration:line-through;">$${book.originalPrice.toFixed(2)}</span></div>
                <p style="line-height: 1.6; color: var(--text-secondary); margin-bottom: 30px;">
                    Dive deep into the evolutionary leap of knowledge with this premium masterpiece. Explore cutting-edge concepts in ${book.category} beautifully crafted to enhance your understanding.
                </p>
                <div style="display:flex; gap: 15px;">
                    <button class="btn-primary" style="flex:2;" onclick="addToCart(${book.id})">Add to Cart</button>
                    <button class="btn-secondary" style="flex:1;" onclick="toggleWishlist(${book.id}, event)">Wishlist</button>
                </div>
            </div>
        `;
        
        document.getElementById('bookDetailsModal').classList.add('active');
        document.body.classList.add('modal-open');
    };

    document.getElementById('closeBookDetailsBtn').addEventListener('click', () => {
        document.getElementById('bookDetailsModal').classList.remove('active');
        document.body.classList.remove('modal-open');
    });

    // --- Toast Notifications ---
    window.showToast = (title, message) => {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div>
                <strong style="display:block; margin-bottom: 5px;">${title}</strong>
                <span style="font-size: 0.9rem; color: var(--text-secondary);">${message}</span>
            </div>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // --- Stats Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const floatCounters = document.querySelectorAll('.counter-float');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;
                
                if(count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            updateCount();
        });
        
        floatCounters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;
                
                if(count < target) {
                    counter.innerText = (count + inc).toFixed(1);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target.toFixed(1);
                }
            };
            updateCount();
        });
    };
    
    const statsSection = document.getElementById('statsContainer');
    if (statsSection) {
        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // --- Flash Sale Countdown Timer ---
    const targetDate = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (15 * 60 * 60 * 1000) + (30 * 60 * 1000) + (12 * 1000);
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) return;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    };
    
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Initial Render
    renderBooks();
    renderFlashBooks();
});
