// gerenciamento de autenticação JWT

const AUTH_KEY  = 'cafe_auth';

const auth = {
    // salva dados após login ou cadastro
    salvar(data) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({
            token: data.token,
            id:    data.id,
            nome:  data.nome,
            tipo:  data.tipo
        }));
    },

    // retorna dados do usuário logado
    obter() {
        try {
            const raw = localStorage.getItem(AUTH_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    // encerra a sessão e redireciona para o login
    sair() {
        localStorage.removeItem(AUTH_KEY);
        window.location.href = 'login.html';
    },

    // verifica se o usuário está logado e se o token não expirou
    estaLogado() {
        const dados = this.obter();
        if (!dados?.token) return false;

        try {
            const payload = JSON.parse(atob(dados.token.split('.')[1]));
            if (payload.exp && Date.now() / 1000 > payload.exp) {
                this.sair();
                return false;
            }
        } catch {
            return false;
        }

        return true;
    },

    // verifica se o usuário é admin
    eAdmin() {
        return this.obter()?.tipo === 'admin';
    },

    // redireciona para login se o usuário não estiver autenticado
    exigirLogin() {
        if (!this.estaLogado()) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
            return false;
        }
        return true;
    },

    // redireciona para login se não for admin
    exigirAdmin() {
        if (!this.estaLogado()) {
            window.location.href = 'login.html';
            return false;
        }
        if (!this.eAdmin()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    // retorna o header Authorization para requisições autenticadas
    header() {
        const dados = this.obter();
        return dados?.token ? { 'Authorization': `Bearer ${dados.token}` } : {};
    },

    // atualiza a navbar com o estado de autenticação atual
    atualizarNavbar() {
        const dados = this.obter();
        const container = document.getElementById('authNav');
        if (!container) return;

        if (dados && this.estaLogado()) {
            // esconde o link do carrinho para admins
            if (dados.tipo === 'admin') {
                const cartLink = document.querySelector('.nav-link.cart-link');
                if (cartLink) cartLink.style.display = 'none';
            }

            container.innerHTML = `
                <div class="auth-user">
                    <span class="auth-user-name">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        ${dados.nome.split(' ')[0]}
                    </span>
                    ${dados.tipo === 'admin'
                        ? `<a href="admin.html" class="nav-link auth-admin-link">Painel Admin</a>`
                        : ''}
                    <button class="btn-logout" onclick="auth.sair()" title="Sair">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sair
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <a href="login.html" class="nav-link btn-login-nav">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                        <polyline points="10 17 15 12 10 7"/>
                        <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Entrar
                </a>
            `;
        }
    }
};
