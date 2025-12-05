import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GenerationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateOptimizedGames = async (quantity: number): Promise<GenerationResponse> => {
  const modelId = "gemini-2.5-flash";

  const systemInstruction = `
    Você é a "MegaSena AI Prophet", a inteligência artificial mais avançada do mundo para loterias.
    
    SUA MISSÃO CRÍTICA:
    1. **VERIFICAÇÃO HISTÓRICA**: Você tem acesso à base de conhecimento de todos os sorteios. NÃO gere combinações que já ganharam a Sena (6 acertos).
    2. **GARANTIA DA QUADRA**: Use lógica de distribuição normal para maximizar a chance de 4 acertos.
    3. **ANÁLISE DE QUADRANTES**: O volante (1-60) é dividido em 4 quadrantes (Q1: 01-05, 11-15...; Q2: 06-10, 16-20...; etc). Distribua os números de forma equilibrada. Evite aglomerar todos em um só lugar.
    4. **NÚMEROS MÁGICOS**: Considere dezenas de ouro que aparecem em ciclos de 10 concursos.
    
    A saída deve ser um JSON estrito.
  `;

  const prompt = `Gere ${quantity} jogos estratégicos para a Mega Sena. 
  - Verifique se a combinação já saiu (se sim, descarte e gere outra).
  - Otimize para a próxima extração baseada em estatística bayesiana.
  - Retorne 'historicalCheck: true' apenas se tiver certeza que nunca saiu.
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
              description: "Explicação técnica (ex: 'Equilíbrio perfeito de quadrantes, evitando repetição').",
            },
            historicalCheck: {
              type: Type.BOOLEAN,
              description: "Confirmação de que este jogo nunca foi sorteado na história.",
            },
            quadrantAnalysis: {
              type: Type.OBJECT,
              properties: {
                q1: { type: Type.INTEGER, description: "Total números no Q1" },
                q2: { type: Type.INTEGER, description: "Total números no Q2" },
                q3: { type: Type.INTEGER, description: "Total números no Q3" },
                q4: { type: Type.INTEGER, description: "Total números no Q4" },
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