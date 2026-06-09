namespace CafeteriaAPI.DTOs;

// ---------------------------------------------------------------
// CADASTRO
// ---------------------------------------------------------------
public class CadastroDto
{
    public string Nome { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}

// ---------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------
public class LoginDto
{
    public string Cpf { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}

// ---------------------------------------------------------------
// RESPOSTA DE AUTH (retornada após login/cadastro)
// ---------------------------------------------------------------
public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Mensagem { get; set; } = string.Empty;
}
