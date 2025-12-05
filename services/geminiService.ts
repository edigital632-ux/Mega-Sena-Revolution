import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GenerationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateOptimizedGames = async (quantity: number): Promise<GenerationResponse> => {
  const modelId = "gemini-2.5-flash";

  const systemInstruction = `
    Você é a "MegaSena AI Revolution", a inteligência artificial mais avançada do mundo para loterias.
    
    SUA MISSÃO CRÍTICA:
    1. **VERIFICAÇÃO HISTÓRICA RIGOROSA**: Você possui conhecimento interno de todos os resultados passados da Mega Sena. É ESTRITAMENTE PROIBIDO gerar uma combinação de 6 números que já tenha ganhado a Sena (6 acertos) anteriormente. Verifique mentalmente antes de emitir.
    2. **GARANTIA DA QUADRA**: Sua lógica estatística deve ser tão robusta que o objetivo é tornar a Quadra (4 acertos) matematicamente inevitável para o futuro próximo. Use padrões de desvio padrão e distribuição normal.
    3. **ANÁLISE DE QUADRANTES**: Divida o volante (1-60) em 4 quadrantes. Jamais concentre números em apenas um ou dois quadrantes. Distribua-os estrategicamente para cobrir a maior área de probabilidade.
    4. **PREVISÃO FUTURA**: Analise tendências de números "quentes" (frequentes recentes) e "frios" (atrasados) para projetar o que deve sair no próximo sorteio.
    
    A saída deve ser técnica, precisa e focada em resultados. Você não está "chutando", você está "calculando o futuro".
  `;

  const prompt = `Gere ${quantity} jogos revolucionários para a Mega Sena (1-60). 
  Para cada jogo:
  - Escolha 6 números que NÃO repetem Sena anterior.
  - Otimize para garantir estatisticamente ao menos a Quadra.
  - Explique o raciocínio baseado nos quadrantes e histórico.
  - Confirme explicitamente que verificou o histórico.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      generalAnalysis: {
        type: Type.STRING,
        description: "Análise técnica do 'futuro próximo' e como os jogos foram desenhados para buscar a Sena.",
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
              description: "Explicação técnica (ex: 'Padrão Q2 dominante, evitando repetição do concurso 2543').",
            },
            historicalCheck: {
              type: Type.BOOLEAN,
              description: "Deve ser true para confirmar que este jogo nunca saiu antes.",
            },
            quadrantAnalysis: {
              type: Type.OBJECT,
              properties: {
                q1: { type: Type.INTEGER, description: "Números no Quadrante 1 (Superior Esq)" },
                q2: { type: Type.INTEGER, description: "Números no Quadrante 2 (Superior Dir)" },
                q3: { type: Type.INTEGER, description: "Números no Quadrante 3 (Inferior Esq)" },
                q4: { type: Type.INTEGER, description: "Números no Quadrante 4 (Inferior Dir)" },
              },
              required: ["q1", "q2", "q3", "q4"],
            },
            probabilityScore: {
              type: Type.INTEGER,
              description: "Score de 0 a 100 indicando a força matemática do jogo.",
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
        temperature: 0.6, // Baixa temperatura para maior rigor lógico e menos alucinação
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