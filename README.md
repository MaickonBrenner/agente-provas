# 🧠 Agente de Provas
Gere questões de múltipla escolha automaticamente com Inteligência Artificial a partir de arquivos JSON com conteúdo didático.

## 🚀 Funcionalidades
- Upload de arquivos .json com tópicos e conteúdos
- Campo de prompt personalizado para instruções específicas
- Geração de questões com IA (via OpenAI GPT-4)
- Autenticação via NextAuth
- Interface protegida para usuários logados
- Exibição das questões geradas com destaque para a resposta correta

## 📦 Tecnologias utilizadas
- Next.js
- React
- NextAuth
- OpenAI API
- TypeScript
- Formidable (upload de arquivos)

## 🧪 Iniciando Projeto 

Primeiramente, vá a raiz do projeto no VS Code e rode o seguinte comando no terminal:

```bash
npm run dev

```

No seu navegador, abra: [http://localhost:3000](http://localhost:3000) e depois entre com as credenciais na tela de login.

## 🔐 Login
O projeto usa autenticação via credenciais. Para testes locais, use:
- Usuário: admin
- Senha: 123456

## 📤 Upload + Prompt
Na página principal, o usuário pode:
- Enviar um arquivo .json com conteúdo didático
- Digitar um prompt personalizado (ex: “Gere 5 questões sobre paralelismo”)
- Receber questões geradas com IA
- **Obs.:** Na raiz do projeto, existe um arquivo **conteudos.json** para testes, caso deseje utilizar.

## 📁 Estrutura do JSON esperado
```
{
  "topicos": [
    {
      "titulo": "Concorrência",
      "conteudo": "Concorrência é a capacidade de executar múltiplas tarefas ao mesmo tempo..."
    },
    {
      "titulo": "Paralelismo",
      "conteudo": "Paralelismo envolve a execução simultânea de tarefas em múltiplos núcleos..."
    }
  ]
}
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
