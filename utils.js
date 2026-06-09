// ==========================================
// FUNÇÕES UTILITÁRIAS
// ==========================================

// Formatar preço em Real Brasileiro
function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Formatar data
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Gerar ID único
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Toast Notification System
class Toast {
    constructor() {
        this.container = document.getElementById('toastContainer');
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <div class="toast-icon">
                ${icon}
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Fechar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;

        this.container.appendChild(toast);

        // Fechar ao clicar no botão
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.hide(toast));

        // Fechar automaticamente
        setTimeout(() => {
            this.hide(toast);
        }, duration);
    }

    hide(toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }

    getIcon(type) {
        const icons = {
            success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>`,
            error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>`,
            info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                     <circle cx="12" cy="12" r="10"/>
                     <line x1="12" y1="16" x2="12" y2="12"/>
                     <line x1="12" y1="8" x2="12.01" y2="8"/>
                   </svg>`
        };
        return icons[type] || icons.info;
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }

    info(message) {
        this.show(message, 'info');
    }
}

// Instância global do Toast
const toast = new Toast();

// Debounce function para otimizar pesquisas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll suave
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Gerenciamento de pedidos
class OrderManager {
    constructor() {
        this.orders = this.loadOrders();
    }

    loadOrders() {
        const orders = localStorage.getItem('orders');
        return orders ? JSON.parse(orders) : [];
    }

    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    createOrder(cartItems, total) {
        const order = {
            id: generateId(),
            numero: `#${String(this.orders.length + 1).padStart(5, '0')}`,
            data: new Date().toISOString(),
            items: cartItems,
            total: total,
            status: 'pendente' // pendente, preparando, entregue
        };

        this.orders.unshift(order);
        this.saveOrders();
        return order;
    }

    getOrders() {
        return this.orders;
    }

    getOrder(id) {
        return this.orders.find(order => order.id === id);
    }

    updateOrderStatus(id, status) {
        const order = this.getOrder(id);
        if (order) {
            order.status = status;
            this.saveOrders();
        }
    }
}

// Instância global do OrderManager
const orderManager = new OrderManager();

// Obter nome da categoria
function getCategoryName(categoryId) {
    const category = categorias.find(cat => cat.id === categoryId);
    return category ? category.nome : categoryId;
}

// Obter badge de status
function getStatusBadge(status) {
    const badges = {
        pendente: { class: 'status-pendente', text: 'Pendente' },
        preparando: { class: 'status-preparando', text: 'Preparando' },
        entregue: { class: 'status-entregue', text: 'Entregue' }
    };
    return badges[status] || badges.pendente;
}