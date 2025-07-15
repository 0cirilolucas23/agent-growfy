// app/api/generate-response/route.js (APENAS ESTA PARTE MUDA)

// ... (imports e outras partes da função POST)
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { prompt, game } = await request.json(); // <-- AGORA TAMBÉM PEGA 'game'

  if (!prompt || !game) { // <-- VERIFICA SE O JOGO TAMBÉM FOI ENVIADO
    return NextResponse.json({ message: 'A pergunta e o jogo são obrigatórios.' }, { status: 400 });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error("Erro: A chave GEMINI_API_KEY não está configurada.");
    return NextResponse.json({ message: 'Erro de configuração do servidor: Chave da API ausente.' }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // SEU PROMPT AJUSTADO PARA INCLUIR O JOGO
    const fullPrompt = ` 
      ## Especialidade
      Você é um especialista assistente de meta para o jogo ${game}.

      ## Tarefa
      Você deve responder a pergunta do usuário com base no seu conhecimento com base no jogo, estratégias, build e dicas.

      ## Regras
      - Se você não souber a resposta, responda com 'Não sei' ou 'Não tenho certeza'. E não tente inventar uma resposta.
      - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não é sobre o jogo ${game}'.
      - Considere a data atual ${new Date().toLocaleDateString('pt-BR')}.
      - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
      - Nunca responda itens que você não tem certeza de que existe no patch atual.

      ## Resposta
      - Economize na resposta, seja direto e responda no máximo 600 caracteres.
      - Responda em markdown.
      - Não precisa fazer nenhuma saudação ou despedida. Apenas responda o que o usuário está querendo.

      ## Exemplo de resposta
      - Pergunta do usuário: "Qual é a melhor build para o campeão X no patch atual?"
      - Resposta: "A melhor build atual para o campeão X no patch atual é: \n\n **Itens:**\n\n
      coloque os intens aqui. \n\n **Runas:**\n\nexemplo de runas\n\n

      ---
      Aqui está a pergunta do usuário: ${prompt}
    `;

    const contents = [{
      role: "user",
      parts: [{
        text: fullPrompt
      }]
    }];
   /* const tools = [{
      GoogleSearch: {}
    }];*/

    const result = await model.generateContent({ contents }); // Passa tools aqui
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text }, { status: 200 });

  } catch (error) {
    console.error('Erro ao chamar a API Gemini:', error);
    if (error.response && error.response.status) {
      return NextResponse.json({ message: `Gemini API Error (${error.response.status}): ${error.message}` }, { status: error.response.status });
    }
    return NextResponse.json({ message: 'Falha ao gerar resposta da IA.' }, { status: 500 });
  }
}