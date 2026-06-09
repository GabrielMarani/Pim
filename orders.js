// ==========================================
// SCRIPT DA PÁGINA DE PEDIDOS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    initNavbar();
    initThemeToggle();
    
    // Carregar pedidos
    loadOrdersPage();
    
    // Atualizar contador do carrinho
    cart.updateCartCount();
    
    // Simular atualização de status (para demonstração)
    simulateOrderUpdates();
});

// ==========================================
// CARREGAR PÁGINA DE PEDIDOS
// ==========================================

function loadOrdersPage() {
    const emptyOrders = document.getElementById('emptyOrders');
    const ordersList = document.getElementById('ordersList');
    
    const orders = orderManager.getOrders();
    
    if (orders.length === 0) {
        emptyOrders.style.display = 'flex';
        ordersList.style.display = 'none';
    } else {
        emptyOrders.style.display = 'none';
        ordersList.style.display = 'flex';
        
        // Renderizar pedidos
        ordersList.innerHTML = '';
        orders.forEach((order, index) => {
            const orderCard = createOrderCard(order, index);
            ordersList.appendChild(orderCard);
        });
    }
}

// ==========================================
// CRIAR CARD DE PEDIDO
// ==========================================

function createOrderCard(order, index) {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.dataset.orderId = order.id;

    const statusBadge = getStatusBadge(order.status);

    // Criar lista de itens
    const itemsHTML = order.items.map(item => `
        <div class="order-item">
            <div>
                <span class="order-item-name">${item.nome}</span>
                <span class="order-item-qty">x${item.quantidade}</span>
            </div>
            <span class="order-item-price">${formatPrice(item.preco * item.quantidade)}</span>
        </div>
    `).join('');

    card.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-number">${order.numero}</div>
                <div class="order-date">${formatDate(order.data)}</div>
            </div>
            <span class="order-status ${statusBadge.class}">${statusBadge.text}</span>
        </div>
        <div class="order-items">
            ${itemsHTML}
        </div>
        <div class="order-footer">
            <span class="order-total">${formatPrice(order.total)}</span>
        </div>
    `;

    return card;
}

// ==========================================
// SIMULAR ATUALIZAÇÕES DE STATUS
// ==========================================

function simulateOrderUpdates() {
    // Esta função simula a atualização de status dos pedidos
    // Em uma aplicação real, isso viria do backend
    
    const orders = orderManager.getOrders();
    
    orders.forEach((order, index) => {
        // Simular progresso dos pedidos mais recentes
        if (index === 0 && order.status === 'pendente') {
            setTimeout(() => {
                updateOrderStatus(order.id, 'preparando');
            }, 5000);
        }
        
        if (index === 0 && order.status === 'preparando') {
            setTimeout(() => {
                updateOrderStatus(order.id, 'entregue');
            }, 10000);
        }
    });
}

// ==========================================
// ATUALIZAR STATUS DO PEDIDO
// ==========================================

function updateOrderStatus(orderId, newStatus) {
    orderManager.updateOrderStatus(orderId, newStatus);
    
    // Atualizar UI
    const orderCard = document.querySelector(`.order-card[data-order-id="${orderId}"]`);
    if (orderCard) {
        const statusBadge = getStatusBadge(newStatus);
        const statusElement = orderCard.querySelector('.order-status');
        
        statusElement.className = `order-status ${statusBadge.class}`;
        statusElement.textContent = statusBadge.text;
        
        // Animação
        statusElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            statusElement.style.transform = 'scale(1)';
        }, 200);
        
        // Notificação
        const statusMessages = {
            pendente: 'Pedido confirmado',
            preparando: 'Seu pedido está sendo preparado',
            entregue: 'Pedido entregue!'
        };
        
        toast.info(statusMessages[newStatus]);
    }
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// Obter cor do status
function getStatusColor(status) {
    const colors = {
        pendente: '#856404',
        preparando: '#004085',
        entregue: '#155724'
    };
    return colors[status] || colors.pendente;
}

// Obter ícone do status
function getStatusIcon(status) {
    const icons = {
        pendente: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                     <circle cx="12" cy="12" r="10"/>
                     <polyline points="12 6 12 12 16 14"/>
                   </svg>`,
        preparando: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                       <polyline points="14 2 14 8 20 8"/>
                       <line x1="16" y1="13" x2="8" y2="13"/>
                       <line x1="16" y1="17" x2="8" y2="17"/>
                       <polyline points="10 9 9 9 8 9"/>
                     </svg>`,
        entregue: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                     <polyline points="22 4 12 14.01 9 11.01"/>
                   </svg>`
    };
    return icons[status] || icons.pendente;
}