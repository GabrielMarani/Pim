# Café Artesanal

Sistema de pedidos para cafeteria — frontend em HTML/CSS/JS e backend em C# ASP.NET Core 8 com MariaDB.

## Como rodar

**Pré-requisitos:** .NET 8 SDK e XAMPP (MySQL/MariaDB)

**1. Banco de dados**
- Suba o MySQL pelo XAMPP
- Crie o banco `bd_cafeteria` no phpMyAdmin
- Importe o arquivo `bd_cafeteria.sql`

**2. String de conexão**

Abra `backend/appsettings.json` e ajuste conforme seu MySQL:
```json
"DefaultConnection": "server=127.0.0.1;port=3306;database=bd_cafeteria;user=root;password=;charset=utf8mb4;"
```

**3. Subir o backend**
```bash
cd backend
dotnet run
```
Acesso em `http://localhost:5000` — Swagger em `http://localhost:5000/swagger`

## Admin padrão

CPF: `000.000.000-00` / Senha: `admin123`

## Endpoints principais

```
GET    /api/produtos          lista produtos (aceita ?categoria= ?busca= ?destaque=)
GET    /api/produtos/{id}     produto específico
POST   /api/produtos          cria produto (admin)
PUT    /api/produtos/{id}     atualiza produto (admin)
DELETE /api/produtos/{id}     remove produto (admin)

GET    /api/pedidos           lista pedidos (admin vê todos, cliente vê os próprios)
POST   /api/pedidos           cria pedido
PUT    /api/pedidos/{id}/status   atualiza status
DELETE /api/pedidos/{id}     cancela pedido pendente

POST   /api/auth/login        login
POST   /api/auth/cadastro     cadastro
```

## Problemas comuns

- **"Não foi possível conectar ao servidor"** → backend não está rodando (`dotnet run`)
- **Erro de banco** → MySQL/XAMPP desligado ou credenciais erradas em `appsettings.json`
- **Porta 5000 ocupada** → mude em `backend/Properties/launchSettings.json`
