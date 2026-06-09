// ============================================================
// MAIN.JS — Página inicial (index.html)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initThemeToggle();
    initLoadingScreen();
    loadFeaturedProducts();
    cart.updateCartCount();
    auth.atualizarNavbar();
});

// ============================================================
// NAVBAR
// ============================================================

function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.pageYOffset > 50);
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

window.initNavbar = initNavbar;

// ============================================================
// DARK MODE
// ============================================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
    }
}

window.initThemeToggle = initThemeToggle;

// ============================================================
// LOADING SCREEN
// ============================================================

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => loadingScreen.classList.add('hidden'), 1200);
    }
}

// ============================================================
// PRODUTOS EM DESTAQUE — carregados da API
// ============================================================

async function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    try {
        // Busca os produtos em destaque na API
        const produtos = await api.getProdutos({ destaque: true });

        container.innerHTML = '';

        if (!produtos || produtos.length === 0) {
            container.innerHTML = '<p class="text-center">Nenhum produto em destaque no momento.</p>';
            return;
        }

        // Exibe até 3 produtos em destaque
        produtos.slice(0, 3).forEach((produto, index) => {
            const card = createProductCard(produto, index);
            container.appendChild(card);
        });

    } catch (err) {
        console.error('Erro ao carregar produtos em destaque:', err);
        container.innerHTML = `
            <div class="error-state" style="grid-column:1/-1;text-align:center;padding:2rem;">
                <p>⚠️ Não foi possível carregar os produtos.</p>
                <p style="font-size:.85rem;color:#888;">${err.message}</p>
                <button onclick="loadFeaturedProducts()" class="btn btn-secondary" style="margin-top:1rem;">
                    Tentar novamente
                </button>
            </div>`;
    }
}

// ============================================================
// CRIAR CARD DE PRODUTO
// ============================================================

function createProductCard(produto, index = 0) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
        <div class="product-image">
            <img src="${produto.imagem || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop'}"
                 alt="${produto.nome}" loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop'">
            ${produto.destaque ? '<span class="product-badge">Destaque</span>' : ''}
        </div>
        <div class="product-info">
            <span class="product-category">${produto.nomeCategoria || getCategoryName(produto.categoria)}</span>
            <h3 class="product-name">${produto.nome}</h3>
            <p class="product-description">${produto.descricao || ''}</p>
            <div class="product-footer">
                <span class="product-price">${formatPrice(produto.preco)}</span>
                ${!auth.eAdmin() ? `<button class="btn-add-cart" onclick="addToCart(${produto.id})" aria-label="Adicionar ao carrinho">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Adicionar
                </button>` : ''}
            </div>
        </div>
    `;

    return card;
}

// ============================================================
// ADICIONAR AO CARRINHO
// ============================================================

function addToCart(produtoId) {
    const cards = document.querySelectorAll('.product-card');
    let produtoEncontrado = null;

    cards.forEach(card => {
        const btn = card.querySelector('.btn-add-cart');
        if (btn && btn.getAttribute('onclick').includes(`addToCart(${produtoId})`)) {
            const nome     = card.querySelector('.product-name')?.textContent || '';
            const precoStr = card.querySelector('.product-price')?.textContent || '0';
            const imagem   = card.querySelector('img')?.src || '';
            const categoria= card.querySelector('.product-category')?.textContent || '';

            const preco = parseFloat(
                precoStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
            );

            produtoEncontrado = { id: produtoId, nome, preco, imagem, categoria };
        }
    });

    if (produtoEncontrado) {
        cart.addItem(produtoEncontrado);
        toast.success(`${produtoEncontrado.nome} adicionado ao carrinho!`);

        const btn = document.querySelector(`.btn-add-cart[onclick="addToCart(${produtoId})"]`);
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => { btn.style.transform = 'scale(1)'; }, 150);
        }
    }
}

window.addToCart = addToCart;
window.createProductCard = createProductCard;

// ============================================================
// SMOOTH SCROLL
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            smoothScroll(href);
        }
    });
});
