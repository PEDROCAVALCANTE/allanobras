import { GoogleGenAI } from "@google/genai";
import { Project, Stage, Material, Labor, ProjectFinancials } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeProjectRisks = async (
  project: Project,
  financials: ProjectFinancials,
  stages: Stage[]
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Erro: Chave de API não configurada.";

  const prompt = `
    Você é um engenheiro civil senior e especialista em gestão de custos de obras.
    Analise os dados do seguinte projeto e forneça um relatório curto (máximo 150 palavras) sobre a saúde financeira e riscos.
    Use formatação Markdown simples.

    Dados do Projeto:
    Nome: ${project.name}
    Orçamento Total: R$ ${project.totalBudget}
    Custo Atual: R$ ${financials.totalCost}
    Utilização do Orçamento: ${financials.budgetUtilization.toFixed(2)}%
    Margem de Lucro Esperada: ${project.profitMargin}%
    Margem Real Atual: ${financials.realMargin.toFixed(2)}%
    
    Progresso:
    Etapas Totais: ${stages.length}
    Etapas Concluídas: ${stages.filter(s => s.status === 'Concluída').length}

    Responda com:
    1. Status Geral (Seguro / Alerta / Crítico)
    2. Principal Risco identificado
    3. Uma recomendação prática para economizar ou manter o cronograma.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Não foi possível gerar a análise.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com a IA para análise.";
  }
};
