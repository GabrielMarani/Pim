// gerenciamento do carrinho (localStorage)
// o carrinho é mantido localmente até o checkout, quando os itens são enviados à API

class Cart {
    constructor() {
        this.items = this.loadCart();
        this.deliveryFee = 5.00;
    }

    loadCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(produto) {
        const existing = this.items.find(i => i.id === produto.id);
        if (existing) {
            existing.quantidade += 1;
        } else {
            this.items.push({ ...produto, quantidade: 1 });
        }
        this.saveCart();
        return true;
    }

    removeItem(produtoId) {
        this.items = this.items.filter(i => i.id !== produtoId);
        this.saveCart();
    }

    updateQuantity(produtoId, quantidade) {
        const item = this.items.find(i => i.id === produtoId);
        if (item) {
            if (quantidade <= 0) {
                this.removeItem(produtoId);
            } else {
                item.quantidade = quantidade;
                this.saveCart();
            }
        }
    }

    getItem(produtoId) {
        return this.items.find(i => i.id === produtoId);
    }

    getItems() {
        return this.items;
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantidade, 0);
    }

    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    getTotal() {
        const subtotal = this.getSubtotal();
        return subtotal > 0 ? subtotal + this.deliveryFee : 0;
    }

    clear() {
        this.items = [];
        this.saveCart();
    }

    updateCartCount() {
        const count = this.getTotalItems();
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
            el.style.transform = 'scale(1.3)';
            setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
        });
    }
}

const cart = new Cart();
