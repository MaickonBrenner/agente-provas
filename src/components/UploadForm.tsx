import { useState } from 'react';
import { useSession } from 'next-auth/react';

type Questao = {
  pergunta: string;
  alternativas: string[];
  respostaCorreta: number;
};

type Props = {
  onQuestoesGeradas: (questoes: Questao[]) => void;
};

export default function UploadForm({ onQuestoesGeradas }: Props) {
  const [carregando, setCarregando] = useState(false);
  const [prompt, setPrompt] = useState('');
  const { data: session } = useSession();

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('prompt', prompt);
    setCarregando(true);

    try {
      const resposta = await fetch('/api/gerar', {
        method: 'POST',
        body: formData,
        credentials: 'include', // garante que a sessão seja enviada
      });

      if (!resposta.ok) {
        const texto = await resposta.text(); // 👈 evita tentar parsear HTML como JSON
        throw new Error(`Erro ${resposta.status}: ${texto}`);
      }

      const dados = await resposta.json();
      onQuestoesGeradas(dados.questoes);
    } catch (erro) {
      console.error('Erro ao enviar arquivo:', erro);
      alert('Erro ao gerar questões: ' + erro);
    } finally {
      setCarregando(false);
    }
  };

  if (!session) {
    return <p>🔒 Você precisa estar logado para enviar um arquivo.</p>;
  }

  return (
    <form onSubmit={handleUpload}>
      <input type="file" name="arquivo" accept=".json" required />
      <br /><br />
      <textarea
        name="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
        placeholder="Ex: Gere 5 questões sobre concorrência e paralelismo..."
        required
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '1rem',
        }}
      />
      <br /><br />
      <button type="submit" disabled={carregando}>
        {carregando ? 'Gerando questões...' : 'Gerar Questões'}
      </button>
    </form>
  );
}
