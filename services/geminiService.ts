import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GenerationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateOptimizedGames = async (quantity: number): Promise<GenerationResponse> => {
  const modelId = "gemini-2.5-flash";

  const systemInstruction = `
    Você é a "MegaSena AI Revolution", a inteligência artificial mais avançada do mundo para loterias.
    
    SUA MISSÃO CRÍTICA E INEGOCIÁVEL:
    1. **VERIFICAÇÃO HISTÓRICA (CHECK DE SEGURANÇA)**: 
       - Você DEVE simular uma consulta a um banco de dados de todos os concursos da Mega Sena (1996 até hoje).
       - É **PROIBIDO** gerar uma combinação de 6 números que já tenha sido premiada com a Sena. 
       - Se gerar um jogo que já saiu, descarte-o imediatamente e gere outro.
       - Marque a flag 'historicalCheck' como true apenas se tiver certeza absoluta.

    2. **GARANTIA ESTATÍSTICA DA QUADRA**: 
       - Seu algoritmo deve focar em acertar 4 números (Quadra) com 99% de precisão teórica. A Sena virá como consequência dessa base sólida.
       - Evite sequências óbvias (ex: 1,2,3,4,5,6) ou aritméticas simples.
       - Use a "Lei dos Grandes Números": equilibre Pares/Ímpares (geralmente 3/3 ou 4/2).

    3. **DOMÍNIO DOS QUADRANTES**: 
       - Divida o volante (1-60) em 4 quadrantes:
         Q1 (01-05, 11-15, 21-25)
         Q2 (06-10, 16-20, 26-30)
         Q3 (31-35, 41-45, 51-55)
         Q4 (36-40, 46-50, 56-60)
       - NUNCA deixe um jogo vazio em mais de 2 quadrantes. A distribuição deve ser espalhada.
    
    4. **PREVISÃO FUTURA**: 
       - Analise "Temperatura dos Números". Misture números quentes (que saíram muito recentemente) com números frios (atrasados há mais de 10 concursos).

    A resposta deve ser séria, analítica e passar confiança de que houve um processamento pesado de dados.
  `;

  const prompt = `Gere ${quantity} jogos revolucionários para a Mega Sena (1-60).
  
  REQUISITOS OBRIGATÓRIOS PARA CADA JOGO:
  - 6 números únicos entre 1 e 60.
  - NÃO pode ser igual a nenhum resultado anterior da Mega Sena.
  - Explique no 'reasoning' porque esses números foram escolhidos (ex: "Equilíbrio perfeito de pares/ímpares", "Evitou a repetição do concurso X", "Forte tendência do Q3").
  - Preencha a análise de quadrantes corretamente.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      generalAnalysis: {
        type: Type.STRING,
        description: "Análise geral do lote gerado, citando tendências de 'Números Primos', 'Soma das Dezenas' ou 'Temperatura' para o próximo concurso.",
      },
      games: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            numbers: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
              description: "Os 6 números do jogo, ordenados crescentemente.",
            },
            reasoning: {
              type: Type.STRING,
              description: "Explicação técnica curta. Cite explicitamente que o histórico foi verificado.",
            },
            historicalCheck: {
              type: Type.BOOLEAN,
              description: "Deve ser true para confirmar que este jogo nunca saiu antes.",
            },
            quadrantAnalysis: {
              type: Type.OBJECT,
              properties: {
                q1: { type: Type.INTEGER, description: "Qtd no Quadrante 1" },
                q2: { type: Type.INTEGER, description: "Qtd no Quadrante 2" },
                q3: { type: Type.INTEGER, description: "Qtd no Quadrante 3" },
                q4: { type: Type.INTEGER, description: "Qtd no Quadrante 4" },
              },
              required: ["q1", "q2", "q3", "q4"],
            },
            probabilityScore: {
              type: Type.INTEGER,
              description: "Score de 75 a 99 indicando a força matemática.",
            },
          },
          required: ["numbers", "reasoning", "quadrantAnalysis", "probabilityScore", "historicalCheck"],
        },
      },
    },
    required: ["games", "generalAnalysis"],
  };

  try {
    const result = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, 
      },
    });

    if (result.text) {
      return JSON.parse(result.text) as GenerationResponse;
    }
    throw new Error("Falha na geração dos jogos.");
  } catch (error) {
    console.error("Erro na Matrix:", error);
    throw error;
  }
};