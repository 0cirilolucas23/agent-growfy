// app/page.tsx
'use client'; // Essencial para componentes que usam hooks (useState) e interatividade do cliente

import { useState } from 'react'; // Importamos useState e useEffect
import Image from "next/image"; // Para usar o componente Image do Next.js
import styles from "./page.module.css"; // Importamos seus estilos CSS Modules

// Vamos carregar o Showdown.js dinamicamente, pois ele é uma biblioteca de terceiros.
// Ou, se você preferir, pode instalar 'showdown' via npm e importar.
// Para este exemplo, vamos carregar dinamicamente.
// npm install showdown
import showdown from 'showdown'; // Se você instalar via npm

export default function Home() {
  // Estados para gerenciar a entrada do usuário, resposta da IA, carregamento e erros
  const [game, setGame] = useState(''); // Estado para o jogo selecionado
  const [question, setQuestion] = useState(''); // Estado para a pergunta
  const [response, setResponse] = useState(''); // Estado para a resposta da IA
  const [loading, setLoading] = useState(false); // Estado para o indicador de carregamento
  const [error, setError] = useState(''); // Estado para mensagens de erro

  // Função para converter Markdown para HTML
  const markdownToHTML = (text: string) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(text);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o envio padrão do formulário e o recarregamento da página

    // A chave da API não é mais necessária no frontend, então removemos apiKeyInput.value
    // const apiKey = apiKeyInput.value; // REMOVER ESTA LINHA

    if (game === '' || question.trim() === '') {
      setError('Por favor, selecione um jogo e digite sua pergunta.');
      return;
    }

    setLoading(true); // Ativa o estado de carregamento
    setError('');      // Limpa qualquer erro anterior
    setResponse('');   // Limpa a resposta anterior

    try {
      // Chamada para sua API Route no backend (que você criou em app/api/generate-response/route.js)
      const apiResponse = await fetch('/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envia o jogo e a pergunta no corpo da requisição JSON
        body: JSON.stringify({ game, prompt: question }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.message || 'Erro desconhecido ao se comunicar com o servidor.');
      }

      const data = await apiResponse.json();
      // Converte a resposta da IA de Markdown para HTML antes de exibir
      setResponse(markdownToHTML(data.response));

   } catch (err: unknown) {
  console.error('Erro ao obter resposta da IA:', err); // Converte para string se não for um Error para exibir
  const errorMessage = err instanceof Error ? err.message : String(err);
  setError(errorMessage || 'Desculpe, não consegui gerar uma resposta no momento. Tente novamente mais tarde.');
} finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <div className={styles.page}>
      <header> {/* Seu header original */}
        <Image src="/assets/logo.png" alt="Logo growfy" className={styles.headerLogo} width={159} height={267} priority />
      </header>

      <main className={styles.main}>
        <section className={styles.sectionContainer}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Assistente de meta</h2>
            <p className={styles.sectionParagraph}>Pergunte sobre estratégias, build e dicas para seus jogos!</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* REMOVEMOS O CAMPO API KEY! Ele agora está no backend */}
              {/* <input id="apiKey" type="password" placeholder="API Key do Gemini..." required> */}

              <select
                name="game"
                id="gameSelect"
                className={styles.selectField} // Aplica o estilo CSS
                value={game} // Controlado pelo estado `game`
                onChange={(e) => setGame(e.target.value)} // Atualiza o estado quando muda
                required
              >
                <option value="">Selecione um jogo</option>
                <option value="league-of-legends">League of Legends</option>
                <option value="need-for-speed-u2">Need For Speed U2</option> {/* Corrigi o valor */}
                <option value="valorant">Valorant</option>
                <option value="csgo">CS:GO</option>
                <option value="dota-2">Dota 2</option>
                {/* Aqui você pode adicionar as opções para Negócios */}
                <option value="atendimento-negocios">Atendimento (Negócios)</option>
                <option value="estrategia-negocios">Estratégia (Negócios)</option>
                <option value="trafego-pago-negocios">Tráfego Pago (Negócios)</option>
                <option value="analise-dados-negocios">Análise de Dados (Negócios)</option>
              </select>

              <input
                id="questionInput"
                type="text"
                className={styles.inputField} // Aplica o estilo CSS
                value={question} // Controlado pelo estado `question`
                onChange={(e) => setQuestion(e.target.value)} // Atualiza o estado quando muda
                placeholder="Ex: Melhor equips para Attack..."
                required
              />

              <button
                type="submit"
                id="askButton"
                className={`${styles.askButton} ${loading ? styles.loading : ''}`} // Aplica os estilos e a classe 'loading'
                disabled={loading} // Desabilita se estiver carregando
              >
                {loading ? 'Perguntando...' : 'Perguntar'}
              </button>
            </form>

            {error && <p className={styles.errorMessage}>{error}</p>} {/* Exibe erro se houver */}

            <div id="aiResponse" className={`${styles.aiResponse} ${response ? '' : styles.hidden}`}>
                {/* Usamos dangerouslySetInnerHTML para renderizar o HTML gerado pelo showdown */}
                <div className="response-content" dangerouslySetInnerHTML={{ __html: response }}></div>
            </div>

          </div>
        </section>
      </main>
      {/* O footer original do seu HTML */}
      <footer className={styles.footer}>
         {/* Você pode colocar seu conteúdo de footer aqui */}
      </footer>
    </div>
  );
}