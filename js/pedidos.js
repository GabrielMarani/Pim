// página de pedidos (pedidos.html)

document.addEventListener('DOMContentLoaded', async () => {
    // exige login para ver os pedidos
    if (!auth.exigirLogin()) return;

    initNavbar();
    initThemeToggle();
    cart.updateCartCount();
    auth.atualizarNavbar();

    // título dinâmico: admin vê "Pedidos", cliente vê "Meus Pedidos"
    const titleEl = document.querySelector('.page-title');
    const descEl  = document.querySelector('.page-description');
    if (auth.eAdmin()) {
        if (titleEl) titleEl.textContent = 'Pedidos';
        if (descEl)  descEl.textContent  = 'Todos os pedidos realizados pelos clientes';
    }

    await loadOrdersPage();
});

// carrega os pedidos da API

async function loadOrdersPage() {
    const emptyOrders = document.getElementById('emptyOrders');
    const ordersList  = document.getElementById('ordersList');

    emptyOrders.style.display = 'none';
    ordersList.style.display  = 'flex';
    ordersList.innerHTML = `
        <div style="text-align:center;padding:3rem;width:100%;">
            <div class="coffee-cup" style="margin:0 auto 1rem;">
                <div class="coffee"></div>
            </div>
            <p>Carregando seus pedidos...</p>
        </div>
    `;

    try {
        const pedidos = await api.getPedidos();

        if (!pedidos || pedidos.length === 0) {
            emptyOrders.style.display = 'flex';
            ordersList.style.display  = 'none';
            return;
        }

        ordersList.innerHTML = '';
        pedidos.forEach((pedido, index) => {
            ordersList.appendChild(createOrderCard(pedido, index));
        });

    } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
        // se 401 (não autorizado), redireciona para login
        if (err.message.includes('401') || err.message.toLowerCase().includes('autoriza')) {
            auth.sair();
            return;
        }
        ordersList.innerHTML = `
            <div style="text-align:center;padding:3rem;width:100%;">
                <p style="font-size:1.1rem;margin-bottom:.5rem;">⚠️ Erro ao carregar pedidos</p>
                <p style="color:#888;font-size:.9rem;">${err.message}</p>
                <button onclick="loadOrdersPage()" class="btn btn-secondary" style="margin-top:1.5rem;">
                    Tentar novamente
                </button>
            </div>
        `;
    }
}

// cria o card de um pedido

function createOrderCard(pedido, index) {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.style.animationDelay = `${index * 0.08}s`;
    card.dataset.orderId = pedido.id;

    const statusBadge = getStatusBadge(pedido.status);
    const isAdmin = auth.eAdmin();

    const itensHTML = (pedido.itens || []).map(item => `
        <div class="order-item">
            <div>
                <span class="order-item-name">${item.nomeProduto}</span>
                <span class="order-item-qty">x${item.quantidade}</span>
            </div>
            <span class="order-item-price">${formatPrice(item.valorUnitario * item.quantidade)}</span>
        </div>
    `).join('');

    // calcula taxa de entrega (total − subtotal dos itens)
    const subtotalItens = (pedido.itens || []).reduce((s, i) => s + i.valorUnitario * i.quantidade, 0);
    const taxaEntrega   = pedido.total - subtotalItens;
    const taxaHTML = taxaEntrega > 0
        ? `<div class="order-delivery-fee">
               <span>Taxa de entrega</span>
               <span>${formatPrice(taxaEntrega)}</span>
           </div>`
        : '';

    // botões de ação baseados no papel do usuário
    let acoes = '';

    if (pedido.status === 'pendente') {
        acoes += `<button class="btn-cancelar" onclick="cancelarPedido(${pedido.id})">
            ✕ Cancelar
        </button>`;
    }

    // cliente pode confirmar entrega para pedidos não finalizados
    if (!isAdmin && !['entregue', 'cancelado'].includes(pedido.status)) {
        acoes += `<button class="btn-confirmar" onclick="confirmarEntrega(${pedido.id})">
            ✓ Confirmar Entrega
        </button>`;
    }

    // admin: exibe nome do cliente
    const clienteInfo = isAdmin && pedido.nomeCliente
        ? `<div class="order-date" style="margin-top:0.2rem;color:var(--coffee-medium);font-weight:500;">👤 ${pedido.nomeCliente}</div>`
        : '';

    card.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-number">${pedido.numero}</div>
                <div class="order-date">${formatDate(pedido.data)}</div>
                ${clienteInfo}
            </div>
            <span class="order-status ${statusBadge.class}">${statusBadge.text}</span>
        </div>
        <div class="order-items">
            ${itensHTML || '<p style="color:#888;font-size:.85rem;">Sem itens</p>'}
        </div>
        ${taxaHTML}
        <div class="order-footer">
            <span class="order-total">${formatPrice(pedido.total)}</span>
            <div style="display:flex;gap:.5rem;align-items:center;">
                ${acoes}
            </div>
        </div>
    `;

    return card;
}

// confirma o recebimento de um pedido (cliente)

async function confirmarEntrega(pedidoId) {
    if (!confirm(`Confirmar recebimento do pedido #${String(pedidoId).padStart(5, '0')}?`)) return;

    try {
        await api.atualizarStatus(pedidoId, 'entregue');
        toast.show('Entrega confirmada!', 'success');
        await loadOrdersPage();
    } catch (err) {
        toast.show(`Erro: ${err.message}`, 'error');
    }
}

// cancela um pedido

async function cancelarPedido(pedidoId) {
    if (!confirm(`Deseja cancelar o pedido #${String(pedidoId).padStart(5, '0')}?`)) return;

    try {
        await api.cancelarPedido(pedidoId);
        toast.show('Pedido cancelado.', 'info');
        await loadOrdersPage();
    } catch (err) {
        toast.show(`Não foi possível cancelar: ${err.message}`, 'error');
    }
}

window.cancelarPedido   = cancelarPedido;
window.confirmarEntrega = confirmarEntrega;
