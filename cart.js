// ==========================================
// GERENCIAMENTO DO CARRINHO
// ==========================================

class Cart {
    constructor() {
        this.items = this.loadCart();
        this.deliveryFee = 5.00;
    }

    // Carregar carrinho do localStorage
    loadCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    // Salvar carrinho no localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    // Adicionar produto ao carrinho
    addItem(produto) {
        const existingItem = this.items.find(item => item.id === produto.id);

        if (existingItem) {
            existingItem.quantidade += 1;
        } else {
            this.items.push({
                ...produto,
                quantidade: 1
            });
        }

        this.saveCart();
        return true;
    }

    // Remover produto do carrinho
    removeItem(produtoId) {
        this.items = this.items.filter(item => item.id !== produtoId);
        this.saveCart();
    }

    // Atualizar quantidade de um item
    updateQuantity(produtoId, quantidade) {
        const item = this.items.find(item => item.id === produtoId);
        
        if (item) {
            if (quantidade <= 0) {
                this.removeItem(produtoId);
            } else {
                item.quantidade = quantidade;
                this.saveCart();
            }
        }
    }

    // Obter item específico
    getItem(produtoId) {
        return this.items.find(item => item.id === produtoId);
    }

    // Obter todos os itens
    getItems() {
        return this.items;
    }

    // Obter quantidade total de itens
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantidade, 0);
    }

    // Calcular subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.preco * item.quantidade);
        }, 0);
    }

    // Calcular total (com taxa de entrega)
    getTotal() {
        const subtotal = this.getSubtotal();
        return subtotal > 0 ? subtotal + this.deliveryFee : 0;
    }

    // Limpar carrinho
    clear() {
        this.items = [];
        this.saveCart();
    }

    // Atualizar contador do carrinho no navbar
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getTotalItems();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            
            // Adicionar animação
            element.style.transform = 'scale(1.3)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

// Instância global do carrinho
const cart = new Cart();