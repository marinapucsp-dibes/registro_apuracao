// Senha de acesso ao site (Vercel Routing Middleware).
// Roda no servidor da Vercel antes de entregar qualquer página: sem a senha
// certa, o navegador não recebe nem o index.html (nem o endereço da API).
// A senha fica na variável de ambiente SENHA, em Settings → Environment Variables.

export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const senha = process.env.SENHA;
  if (!senha) return; // sem SENHA configurada, o site fica aberto

  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Basic ')) {
    try {
      const credenciais = atob(auth.slice(6));
      const digitada = credenciais.slice(credenciais.indexOf(':') + 1);
      if (digitada === senha) return; // senha certa: segue normalmente
    } catch (e) {
      // cabeçalho malformado: cai no pedido de senha abaixo
    }
  }

  return new Response('Acesso restrito. Informe a senha da equipe.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Registro de Apuracao", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
