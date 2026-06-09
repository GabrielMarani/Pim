# Café Artesanal — Sistema de Pedidos

Sistema completo de pedidos para cafeteria com **frontend** HTML/CSS/JS e **backend** C# ASP.NET Core 8 integrado ao **banco de dados** MariaDB/MySQL.

---

## Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [XAMPP](https://www.apachefriends.org/) (ou qualquer MySQL/MariaDB)

---

## Passo a Passo para Rodar

### 1. Configurar o Banco de Dados

1. Inicie o **XAMPP** e ligue o serviço **MySQL**
2. Acesse o **phpMyAdmin**: http://localhost/phpmyadmin
3. Crie um banco com o nome `bd_cafeteria`
4. Selecione o banco `bd_cafeteria`, clique em **Importar** e selecione o arquivo `bd_cafeteria.sql`

### 2. Configurar a String de Conexão

Abra `backend/appsettings.json` e verifique a string de conexão:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=127.0.0.1;port=3306;database=bd_cafeteria;user=root;password=;charset=utf8mb4;"
  }
}
```

> **Se o seu MySQL tiver senha**, adicione no campo `password=SUA_SENHA`.

### 3. Rodar o Backend

Abra o **Prompt de Comando** ou **PowerShell** e execute:

```bash
cd C:\Users\User.DESKTOP-GO75BEA\Downloads\Pim\backend
dotnet restore
dotnet run
```

## Tecnologias Utilizadas

### Backend

- **C# / ASP.NET Core 8** — Framework web
- **Entity Framework Core 8** — ORM (mapeamento objeto-relacional)
- **Pomelo.EntityFrameworkCore.MySql** — Driver MySQL/MariaDB
- **Swagger / Swashbuckle** — Documentação interativa da API

### Frontend

- **HTML5 / CSS3 / JavaScript (Vanilla)** — Interface
- **Fetch API** — Chamadas ao backend
- **localStorage** — Carrinho temporário

### Banco de Dados

- **MariaDB / MySQL** — SGBD relacional

---

## Solução de Problemas

**"Não foi possível conectar ao servidor"**
→ Verifique se o backend está rodando (`dotnet run`)

**"Erro ao conectar ao banco"**
→ Verifique se o MySQL/XAMPP está ligado e se as credenciais em `appsettings.json` estão corretas

**Porta 5000 ocupada**
→ Edite `backend/Properties/launchSettings.json` e mude a porta, ou execute `dotnet run --urls http://localhost:5001` e ajuste `API_BASE` em `wwwroot/js/api.js`
