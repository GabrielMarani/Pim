// ============================================================
// CLIENTE DA API — Café Artesanal
// Centraliza todas as chamadas ao backend C#
// ============================================================

const API_BASE = "https://pim.up.railway.app/api";

const api = {
  // --------------------------------------------------------
  // AUTH
  // --------------------------------------------------------

  /** Registra um novo cliente. */
  async cadastrar(dados) {
    return await fetchJson(`${API_BASE}/auth/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  },

  /** Realiza login, retorna token + dados do usuário. */
  async login(dados) {
    return await fetchJson(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  },

  // --------------------------------------------------------
  // PRODUTOS — leitura pública
  // --------------------------------------------------------

  /** Retorna todos os produtos. Aceita filtros opcionais. */
  async getProdutos({ categoria, busca, destaque } = {}) {
    const params = new URLSearchParams();
    if (categoria && categoria !== "all") params.set("categoria", categoria);
    if (busca) params.set("busca", busca);
    if (destaque !== undefined) params.set("destaque", destaque);

    const url = `${API_BASE}/produtos${params.toString() ? "?" + params : ""}`;
    return await fetchJson(url);
  },

  /** Retorna um produto pelo ID. */
  async getProduto(id) {
    return await fetchJson(`${API_BASE}/produtos/${id}`);
  },

  // --------------------------------------------------------
  // PRODUTOS — escrita (somente admin)
  // --------------------------------------------------------

  /** Cria um novo produto. */
  async criarProduto(dados) {
    return await fetchJson(`${API_BASE}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...auth.header() },
      body: JSON.stringify(dados),
    });
  },

  /** Atualiza um produto existente. */
  async atualizarProduto(id, dados) {
    return await fetchJson(`${API_BASE}/produtos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...auth.header() },
      body: JSON.stringify(dados),
    });
  },

  /** Remove um produto. */
  async deletarProduto(id) {
    const resp = await fetch(`${API_BASE}/produtos/${id}`, {
      method: "DELETE",
      headers: auth.header(),
    });
    if (!resp.ok && resp.status !== 204) {
      const err = await resp
        .json()
        .catch(() => ({ mensagem: "Erro ao deletar produto." }));
      throw new Error(err.mensagem || `HTTP ${resp.status}`);
    }
    return true;
  },

  // --------------------------------------------------------
  // PEDIDOS
  // --------------------------------------------------------

  /** Retorna pedidos. Admin vê todos; cliente vê os próprios. */
  async getPedidos() {
    return await fetchJson(`${API_BASE}/pedidos`, {
      headers: auth.header(),
    });
  },

  /** Retorna um pedido pelo ID. */
  async getPedido(id) {
    return await fetchJson(`${API_BASE}/pedidos/${id}`, {
      headers: auth.header(),
    });
  },

  /**
   * Cria um novo pedido.
   * @param {{ itens: {produtoId, quantidade, valorUnitario}[], total: number }} data
   */
  async criarPedido(data) {
    return await fetchJson(`${API_BASE}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...auth.header() },
      body: JSON.stringify(data),
    });
  },

  /**
   * Atualiza o status de um pedido.
   * @param {number} id  - ID do pedido
   * @param {string} status - 'pendente' | 'preparando' | 'entregue' | 'cancelado'
   */
  async atualizarStatus(id, status) {
    return await fetchJson(`${API_BASE}/pedidos/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...auth.header() },
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Cancela (deleta) um pedido pendente.
   * @param {number} id
   */
  async cancelarPedido(id) {
    const resp = await fetch(`${API_BASE}/pedidos/${id}`, {
      method: "DELETE",
      headers: auth.header(),
    });
    if (!resp.ok && resp.status !== 204) {
      const err = await resp
        .json()
        .catch(() => ({ mensagem: "Erro ao cancelar pedido." }));
      throw new Error(err.mensagem || `HTTP ${resp.status}`);
    }
    return true;
  },

  // --------------------------------------------------------
  // CATEGORIAS
  // --------------------------------------------------------

  /** Retorna todas as categorias. */
  async getCategorias() {
    return await fetchJson(`${API_BASE}/categorias`);
  },
};

// ============================================================
// HELPER INTERNO — fetch com tratamento de erros
// ============================================================
async function fetchJson(url, options = {}) {
  // Timeout de 5 segundos — evita fetch pendurado quando o servidor é lento
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // Resposta sem conteúdo (204 No Content)
    if (response.status === 204) return null;

    const data = await response.json();

    if (!response.ok) {
      // O backend retorna { mensagem: '...' } em erros
      throw new Error(data.mensagem || `Erro HTTP ${response.status}`);
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error(
        "Tempo limite excedido. O servidor está demorando para responder — tente novamente.",
      );
    }
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error(
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando.",
      );
    }
    throw err;
  }
}
