// npm run dev
import Head from 'next/head';
import { useState } from 'react';
import { getSession } from 'next-auth/react';
import UploadForm from '../components/UploadForm';
import QuestaoCard from '../components/QuestaoCard';
import { GetServerSidePropsContext } from 'next';


type Questao = {
  pergunta: string;
  alternativas: string[];
  respostaCorreta: number;
};

export default function Home() {
  const [questoes, setQuestoes] = useState<Questao[] | null>(null);

  return (
    <>
      <Head>
        <title>Agente de Provas</title>
        <meta name="description" content="Gere provas automaticamente com IA" />
      </Head>

      <main>
        <h1>🧠 Agente de Provas</h1>
        <p>Envie um arquivo JSON com conteúdo didático e gere questões automaticamente com Inteligência Artificial.</p>

        <UploadForm onQuestoesGeradas={setQuestoes} />

        {questoes && (
          <div style={{ marginTop: '2rem' }}>
            <h2>📋 Questões Geradas:</h2>
            {questoes.map((q, idx) => (
              <QuestaoCard
                key={idx}
                pergunta={q.pergunta}
                alternativas={q.alternativas}
                respostaCorreta={q.respostaCorreta}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

// 🔐 Protege a página principal
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: {} };
}
