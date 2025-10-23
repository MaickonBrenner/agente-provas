import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import OpenAI from 'openai';
import formidable, { Fields, Files } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async function (
    err: Error | null,
    fields: Fields,
    files: Files
  ): Promise<void> {
    if (err || !files.arquivo) {
      return res.status(400).json({ erro: 'Arquivo não recebido.' });
    }

    const arquivo = Array.isArray(files.arquivo) ? files.arquivo[0] : files.arquivo;
    const promptUsuario = fields.prompt?.toString().trim();

    if (!promptUsuario) {
      return res.status(400).json({ erro: 'Prompt não fornecido.' });
    }

    if (arquivo.mimetype !== 'application/json') {
      return res.status(400).json({ erro: 'Apenas arquivos JSON são aceitos.' });
    }

    try {
      const buffer = fs.readFileSync(arquivo.filepath);
      const json = JSON.parse(buffer.toString('utf-8'));

      if (!json.topicos || !Array.isArray(json.topicos)) {
        return res.status(400).json({ erro: 'Formato inválido. Esperado: { topicos: [...] }' });
      }

      const texto = json.topicos
        .map((t: { titulo: string; conteudo: string }) => `${t.titulo}: ${t.conteudo}`)
        .join('\n\n');

      const promptFinal = `
Base de conhecimento:
${texto}

Instrução do usuário:
${promptUsuario}
`;

      const resposta = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: promptFinal }],
      });

      const conteudo = resposta.choices[0]?.message?.content || '';

      try {
        const questoes = JSON.parse(conteudo);
        res.status(200).json({ questoes });
      } catch (erro) {
        console.error('Resposta da IA não é JSON válido:', conteudo);
        res.status(500).json({ erro: 'A IA retornou um conteúdo inválido. Verifique o prompt.' });
      }

    } catch (erro) {
      console.error('Erro ao processar JSON:', erro);
      res.status(500).json({ erro: 'Erro ao gerar questões.' });
    }
  });
}
