// ============================================================
// PRODUCTS.JS — Página de produtos (produtos.html)
// Produtos carregados da API com filtros e busca
// ============================================================

let todosOsProdutos = [];   // cache local para filtros rápidos sem re-requests
let currentFilters = {
    category: 'all',
    sort: 'name',
    search: ''
};

document.addEventListener('DOMContentLoaded', async () => {
    initNavbar();
    initThemeToggle();
    auth.atualizarNavbar();
    cart.updateCartCount();

    await loadProducts();
    setupFilters();
});

// ============================================================
// CARREGAR PRODUTOS DA API
// ============================================================

async function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const noResults    = document.getElementById('noResults');

    if (!productsGrid) return;

    productsGrid.innerHTML = `
        <div class="product-skeleton"><div class="skeleton-image"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div></div>
        <div class="product-skeleton"><div class="skeleton-image"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div></div>
        <div class="product-skeleton"><div class="skeleton-image"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div></div>
    `;
    productsGrid.style.display = 'grid';
    noResults.style.display = 'none';

    try {
        const produtos = await api.getProdutos();
        todosOsProdutos = produtos || [];
        renderProducts();

    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        productsGrid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:3rem;">
                <p style="font-size:1.1rem;margin-bottom:.5rem;">⚠️ Erro ao carregar produtos</p>
                <p style="color:#888;font-size:.9rem;">${err.message}</p>
                <button onclick="loadProducts()" class="btn btn-secondary" style="margin-top:1.5rem;">
                    Tentar novamente
                </button>
            </div>
        `;
    }
}

// ============================================================
// RENDERIZAR PRODUTOS (aplica filtros no cache local)
// ============================================================

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const noResults    = document.getElementById('noResults');

    let filtered = [...todosOsProdutos];

    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(p => p.categoria === currentFilters.category);
    }

    if (currentFilters.search) {
        const termo = currentFilters.search.toLowerCase();
        filtered = filtered.filter(p =>
            p.nome.toLowerCase().includes(termo) ||
            (p.descricao && p.descricao.toLowerCase().includes(termo)) ||
            (p.nomeCategoria && p.nomeCategoria.toLowerCase().includes(termo))
        );
    }

    switch (currentFilters.sort) {
        case 'price-asc':  filtered.sort((a, b) => a.preco - b.preco); break;
        case 'price-desc': filtered.sort((a, b) => b.preco - a.preco); break;
        default:           filtered.sort((a, b) => a.nome.localeCompare(b.nome)); break;
    }

    productsGrid.innerHTML = '';

    if (filtered.length === 0) {
        productsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    productsGrid.style.display = 'grid';
    noResults.style.display = 'none';

    filtered.forEach((produto, index) => {
        productsGrid.appendChild(createProductCard(produto, index));
    });
}

// ============================================================
// CRIAR CARD DE PRODUTO
// ============================================================

function createProductCard(produto, index = 0) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
        <div class="product-image">
            <img src="${produto.imagem || ''}" alt="${produto.nome}" loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop'">
            ${produto.destaque ? '<span class="product-badge">Destaque</span>' : ''}
        </div>
        <div class="product-info">
            <span class="product-category">${produto.nomeCategoria || getCategoryName(produto.categoria)}</span>
            <h3 class="product-name">${produto.nome}</h3>
            <p class="product-description">${produto.descricao || ''}</p>
            <div class="product-footer">
                <span class="product-price">${formatPrice(produto.preco)}</span>
                ${!auth.eAdmin() ? `
                <button class="btn-add-cart" data-produto-id="${produto.id}" onclick="addToCart(${produto.id})" aria-label="Adicionar ao carrinho">
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
// ADICIONAR AO CARRINHO — usa o cache local de produtos
// ============================================================

function addToCart(produtoId) {
    const produto = todosOsProdutos.find(p => p.id === produtoId);
    if (!produto) return;

    cart.addItem({
        id:       produto.id,
        nome:     produto.nome,
        preco:    produto.preco,
        imagem:   produto.imagem,
        categoria:produto.categoria
    });

    toast.success(`${produto.nome} adicionado ao carrinho!`);

    const btn = document.querySelector(`[data-produto-id="${produtoId}"]`);
    if (btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => { btn.style.transform = 'scale(1)'; }, 150);
    }
}

window.addToCart = addToCart;

// ============================================================
// FILTROS
// ============================================================

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            currentFilters.search = e.target.value;
            renderProducts();
        }, 300));
    }

    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentFilters.category = e.target.value;
            updatePillsState(e.target.value);
            renderProducts();
        });
    }

    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            currentFilters.sort = e.target.value;
            renderProducts();
        });
    }

    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const category = pill.dataset.category;
            currentFilters.category = category;
            if (categoryFilter) categoryFilter.value = category;
            updatePillsState(category);
            renderProducts();
        });
    });
}

function updatePillsState(activeCategory) {
    document.querySelectorAll('.pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.category === activeCategory);
    });
}
