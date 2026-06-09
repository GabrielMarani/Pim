// ==========================================
// SCRIPT PRINCIPAL - INDEX
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    initNavbar();
    initThemeToggle();
    initLoadingScreen();
    loadFeaturedProducts();
    
    // Atualizar contador do carrinho
    cart.updateCartCount();
});

// ==========================================
// NAVBAR
// ==========================================

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Fechar menu ao clicar em um link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Tornar função global
window.initNavbar = initNavbar;

// ==========================================
// DARK MODE
// ==========================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Aplicar tema salvo
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Toggle theme
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }
}

// Tornar função global
window.initThemeToggle = initThemeToggle;

// ==========================================
// LOADING SCREEN
// ==========================================

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen) {
        // Simular carregamento
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1500);
    }
}

// ==========================================
// PRODUTOS EM DESTAQUE
// ==========================================

function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featuredProducts');
    
    if (!featuredProductsContainer) return;

    // Simular loading
    setTimeout(() => {
        const featuredProducts = produtos.filter(p => p.destaque).slice(0, 3);
        featuredProductsContainer.innerHTML = '';

        featuredProducts.forEach((produto, index) => {
            const card = createProductCard(produto, index);
            featuredProductsContainer.appendChild(card);
        });
    }, 800);
}

// ==========================================
// CRIAR CARD DE PRODUTO
// ==========================================

function createProductCard(produto, index = 0) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
        <div class="product-image">
            <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
            ${produto.destaque ? '<span class="product-badge">Destaque</span>' : ''}
        </div>
        <div class="product-info">
            <span class="product-category">${getCategoryName(produto.categoria)}</span>
            <h3 class="product-name">${produto.nome}</h3>
            <p class="product-description">${produto.descricao}</p>
            <div class="product-footer">
                <span class="product-price">${formatPrice(produto.preco)}</span>
                <button class="btn-add-cart" onclick="addToCart(${produto.id})" aria-label="Adicionar ao carrinho">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Adicionar
                </button>
            </div>
        </div>
    `;

    return card;
}

// ==========================================
// ADICIONAR AO CARRINHO
// ==========================================

function addToCart(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    
    if (produto) {
        cart.addItem(produto);
        toast.success(`${produto.nome} adicionado ao carrinho!`);
        
        // Animação no botão
        const buttons = document.querySelectorAll('.btn-add-cart');
        buttons.forEach(btn => {
            if (btn.onclick && btn.onclick.toString().includes(produtoId)) {
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 100);
            }
        });
    }
}

// Tornar função global
window.addToCart = addToCart;

// ==========================================
// SMOOTH SCROLL
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            smoothScroll(href);
        }
    });
});