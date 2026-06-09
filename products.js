// ==========================================
// SCRIPT DA PÁGINA DE PRODUTOS
// ==========================================

let currentProducts = [...produtos];
let currentFilters = {
    category: 'all',
    sort: 'name',
    search: ''
};

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    initNavbar();
    initThemeToggle();
    
    // Carregar produtos
    loadProducts();
    
    // Configurar filtros
    setupFilters();
    
    // Atualizar contador do carrinho
    cart.updateCartCount();
});

// ==========================================
// CARREGAR PRODUTOS
// ==========================================

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    
    if (!productsGrid) return;

    // Aplicar filtros
    let filteredProducts = filterProducts();
    
    // Limpar grid
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    productsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    // Renderizar produtos
    filteredProducts.forEach((produto, index) => {
        const card = createProductCard(produto, index);
        productsGrid.appendChild(card);
    });
}

// ==========================================
// FILTRAR PRODUTOS
// ==========================================

function filterProducts() {
    let filtered = [...produtos];
    
    // Filtro por categoria
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(p => p.categoria === currentFilters.category);
    }
    
    // Filtro por busca
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filtered = filtered.filter(p => 
            p.nome.toLowerCase().includes(searchTerm) ||
            p.descricao.toLowerCase().includes(searchTerm) ||
            p.categoria.toLowerCase().includes(searchTerm)
        );
    }
    
    // Ordenação
    filtered = sortProducts(filtered, currentFilters.sort);
    
    return filtered;
}

// ==========================================
// ORDENAR PRODUTOS
// ==========================================

function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch(sortBy) {
        case 'name':
            sorted.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        case 'price-asc':
            sorted.sort((a, b) => a.preco - b.preco);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.preco - a.preco);
            break;
    }
    
    return sorted;
}

// ==========================================
// CONFIGURAR FILTROS
// ==========================================

function setupFilters() {
    // Busca
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            currentFilters.search = e.target.value;
            loadProducts();
        }, 300));
    }
    
    // Filtro de categoria (select)
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentFilters.category = e.target.value;
            updatePillsState(e.target.value);
            loadProducts();
        });
    }
    
    // Filtro de ordenação
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            currentFilters.sort = e.target.value;
            loadProducts();
        });
    }
    
    // Pills de categoria
    const categoryPills = document.querySelectorAll('.pill');
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const category = pill.dataset.category;
            currentFilters.category = category;
            
            // Atualizar select
            if (categoryFilter) {
                categoryFilter.value = category;
            }
            
            updatePillsState(category);
            loadProducts();
        });
    });
}

// ==========================================
// ATUALIZAR ESTADO DOS PILLS
// ==========================================

function updatePillsState(activeCategory) {
    const pills = document.querySelectorAll('.pill');
    pills.forEach(pill => {
        if (pill.dataset.category === activeCategory) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });
}

// ==========================================
// CRIAR CARD DE PRODUTO
// ==========================================

function createProductCard(produto, index = 0) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.05}s`;

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
        
        // Animação no botão - verificar se o event existe
        if (typeof event !== 'undefined' && event.target) {
            const button = event.target.closest('.btn-add-cart');
            if (button) {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 100);
            }
        }
    }
}

// Tornar função global
window.addToCart = addToCart;