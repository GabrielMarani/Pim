// ============================================================
// CART-PAGE.JS — Página do carrinho (carrinho.html)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Admin não tem acesso ao carrinho
    if (auth.eAdmin()) {
        window.location.href = 'admin.html';
        return;
    }

    initNavbar();
    initThemeToggle();
    loadCartPage();
    setupCartEvents();
    cart.updateCartCount();
    auth.atualizarNavbar();
});

// ============================================================
// CARREGAR PÁGINA DO CARRINHO
// ============================================================

function loadCartPage() {
    const emptyCart  = document.getElementById('emptyCart');
    const cartContent= document.getElementById('cartContent');
    const cartList   = document.getElementById('cartList');

    const items = cart.getItems();

    if (items.length === 0) {
        emptyCart.style.display  = 'flex';
        cartContent.style.display= 'none';
    } else {
        emptyCart.style.display  = 'none';
        cartContent.style.display= 'grid';

        cartList.innerHTML = '';
        items.forEach(item => cartList.appendChild(createCartItem(item)));

        updateCartSummary();
    }
}

// ============================================================
// CRIAR ITEM DO CARRINHO
// ============================================================

function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.id = item.id;

    const subtotal = item.preco * item.quantidade;

    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.imagem || ''}" alt="${item.nome}"
                 onerror="this.src='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop'">
        </div>
        <div class="cart-item-info">
            <h3>${item.nome}</h3>
            <p class="cart-item-price">${formatPrice(item.preco)}</p>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantidade - 1})" aria-label="Diminuir">-</button>
                <span class="quantity-value">${item.quantidade}</span>
                <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantidade + 1})" aria-label="Aumentar">+</button>
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

// ============================================================
// ATUALIZAR QUANTIDADE
// ============================================================

function updateItemQuantity(produtoId, newQuantity) {
    if (newQuantity < 1) {
        removeCartItem(produtoId);
        return;
    }

    cart.updateQuantity(produtoId, newQuantity);

    const cartItem = document.querySelector(`.cart-item[data-id="${produtoId}"]`);
    if (cartItem) {
        const item       = cart.getItem(produtoId);
        const qtyEl      = cartItem.querySelector('.quantity-value');
        const subtotalEl = cartItem.querySelector('.item-subtotal');
        const decBtn     = cartItem.querySelector('.quantity-btn');
        const incBtn     = cartItem.querySelectorAll('.quantity-btn')[1];

        qtyEl.textContent      = newQuantity;
        subtotalEl.textContent = formatPrice(item.preco * newQuantity);

        decBtn.setAttribute('onclick', `updateItemQuantity(${produtoId}, ${newQuantity - 1})`);
        incBtn.setAttribute('onclick', `updateItemQuantity(${produtoId}, ${newQuantity + 1})`);

        qtyEl.style.transform = 'scale(1.2)';
        setTimeout(() => { qtyEl.style.transform = 'scale(1)'; }, 200);
    }

    updateCartSummary();
}

window.updateItemQuantity = updateItemQuantity;

// ============================================================
// REMOVER ITEM
// ============================================================

function removeCartItem(produtoId) {
    const item = cart.getItem(produtoId);
    if (!item) return;

    if (confirm(`Deseja remover "${item.nome}" do carrinho?`)) {
        const cartItem = document.querySelector(`.cart-item[data-id="${produtoId}"]`);
        if (cartItem) {
            cartItem.style.opacity   = '0';
            cartItem.style.transform = 'translateX(-100%)';
            cartItem.style.transition= 'all .3s ease';

            setTimeout(() => {
                cart.removeItem(produtoId);
                loadCartPage();
                toast.info(`${item.nome} removido do carrinho`);
            }, 300);
        }
    }
}

window.removeCartItem = removeCartItem;

// ============================================================
// RESUMO DO CARRINHO
// ============================================================

function updateCartSummary() {
    document.getElementById('subtotal').textContent = formatPrice(cart.getSubtotal());
    document.getElementById('delivery').textContent = formatPrice(cart.deliveryFee);
    document.getElementById('total').textContent    = formatPrice(cart.getTotal());
}

// ============================================================
// EVENTOS
// ============================================================

function setupCartEvents() {
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

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', finalizarPedido);
    }
}

// ============================================================
// FINALIZAR PEDIDO — envia para a API
// ============================================================

async function finalizarPedido() {
    // Exige login para finalizar pedido
    if (!auth.estaLogado()) {
        toast.show('Faça login para finalizar o pedido.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
        }, 1000);
        return;
    }

    const items = cart.getItems();

    if (items.length === 0) {
        toast.show('Carrinho vazio!', 'error');
        return;
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled    = true;
        checkoutBtn.textContent = 'Enviando pedido...';
    }

    try {
        const payload = {
            itens: items.map(item => ({
                produtoId:     item.id,
                quantidade:    item.quantidade,
                valorUnitario: item.preco
            })),
            total: cart.getTotal()
        };

        const pedidoCriado = await api.criarPedido(payload);

        cart.clear();

        toast.show(`Pedido ${pedidoCriado.numero} realizado com sucesso!`, 'success');

        setTimeout(() => {
            window.location.href = 'pedidos.html';
        }, 1200);

    } catch (err) {
        console.error('Erro ao finalizar pedido:', err);
        toast.show(`Erro ao finalizar pedido: ${err.message}`, 'error');

        if (checkoutBtn) {
            checkoutBtn.disabled  = false;
            checkoutBtn.innerHTML = `Finalizar Pedido
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                </svg>`;
        }
    }
}
