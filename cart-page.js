// ==========================================
// SCRIPT DA PÁGINA DO CARRINHO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    initNavbar();
    initThemeToggle();
    
    // Carregar carrinho
    loadCartPage();
    
    // Configurar eventos
    setupCartEvents();
    
    // Atualizar contador do carrinho
    cart.updateCartCount();
});

// ==========================================
// CARREGAR PÁGINA DO CARRINHO
// ==========================================

function loadCartPage() {
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartList = document.getElementById('cartList');
    
    const items = cart.getItems();
    
    if (items.length === 0) {
        emptyCart.style.display = 'flex';
        cartContent.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartContent.style.display = 'grid';
        
        // Renderizar itens
        cartList.innerHTML = '';
        items.forEach(item => {
            const cartItem = createCartItem(item);
            cartList.appendChild(cartItem);
        });
        
        // Atualizar resumo
        updateCartSummary();
    }
}

// ==========================================
// CRIAR ITEM DO CARRINHO
// ==========================================

function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.id = item.id;

    const subtotal = item.preco * item.quantidade;

    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.imagem}" alt="${item.nome}">
        </div>
        <div class="cart-item-info">
            <h3>${item.nome}</h3>
            <p class="cart-item-price">${formatPrice(item.preco)}</p>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantidade - 1})" aria-label="Diminuir quantidade">
                    -
                </button>
                <span class="quantity-value">${item.quantidade}</span>
                <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantidade + 1})" aria-label="Aumentar quantidade">
                    +
                </button>
            </div>
        </div>
        <div class="cart-item-actions">
            <span class="item-subtotal">${formatPrice(subtotal)}</span>
            <button class="btn-remove" onclick="removeCartItem(${item.id})" aria-label="Remover item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
            </button>
        </div>
    `;

    return cartItem;
}

// ==========================================
// ATUALIZAR QUANTIDADE
// ==========================================

function updateItemQuantity(produtoId, newQuantity) {
    if (newQuantity < 1) {
        removeCartItem(produtoId);
        return;
    }

    cart.updateQuantity(produtoId, newQuantity);
    
    // Atualizar UI
    const cartItem = document.querySelector(`.cart-item[data-id="${produtoId}"]`);
    if (cartItem) {
        const item = cart.getItem(produtoId);
        const quantityValue = cartItem.querySelector('.quantity-value');
        const subtotalElement = cartItem.querySelector('.item-subtotal');
        
        quantityValue.textContent = newQuantity;
        subtotalElement.textContent = formatPrice(item.preco * newQuantity);
        
        // Animação
        quantityValue.style.transform = 'scale(1.2)';
        setTimeout(() => {
            quantityValue.style.transform = 'scale(1)';
        }, 200);
    }
    
    updateCartSummary();
}

// Tornar função global
window.updateItemQuantity = updateItemQuantity;

// ==========================================
// REMOVER ITEM
// ==========================================

function removeCartItem(produtoId) {
    const item = cart.getItem(produtoId);
    
    if (!item) return;
    
    if (confirm(`Deseja remover "${item.nome}" do carrinho?`)) {
        const cartItem = document.querySelector(`.cart-item[data-id="${produtoId}"]`);
        
        if (cartItem) {
            cartItem.style.opacity = '0';
            cartItem.style.transform = 'translateX(-100%)';
            
            setTimeout(() => {
                cart.removeItem(produtoId);
                loadCartPage();
                toast.info(`${item.nome} removido do carrinho`);
            }, 300);
        }
    }
}

// Tornar função global
window.removeCartItem = removeCartItem;

// ==========================================
// ATUALIZAR RESUMO
// ==========================================

function updateCartSummary() {
    const subtotal = cart.getSubtotal();
    const delivery = cart.deliveryFee;
    const total = cart.getTotal();
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('delivery').textContent = formatPrice(delivery);
    document.getElementById('total').textContent = formatPrice(total);
}

// ==========================================
// CONFIGURAR EVENTOS
// ==========================================

function setupCartEvents() {
    // Limpar carrinho
    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Deseja limpar todo o carrinho?')) {
                cart.clear();
                loadCartPage();
                toast.info('Carrinho limpo');
            }
        });
    }
    
    // Finalizar pedido
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            finalizarPedido();
        });
    }
}

// ==========================================
// FINALIZAR PEDIDO
// ==========================================

function finalizarPedido() {
    const items = cart.getItems();
    
    if (items.length === 0) {
        toast.error('Carrinho vazio!');
        return;
    }
    
    // Criar pedido
    const total = cart.getTotal();
    const order = orderManager.createOrder([...items], total);
    
    // Limpar carrinho
    cart.clear();
    
    // Mostrar sucesso
    toast.success('Pedido realizado com sucesso!');
    
    // Redirecionar para página de pedidos após 1 segundo
    setTimeout(() => {
        window.location.href = 'pedidos.html';
    }, 1000);
}