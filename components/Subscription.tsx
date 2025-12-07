import React from 'react';
import { Check, Star, Zap } from 'lucide-react';

export const Subscription: React.FC = () => {
  return (
    <div className="py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800">Planos e Preços</h2>
        <p className="text-slate-500 mt-2">Escolha o plano ideal para o tamanho da sua construtora</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Starter */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800">Iniciante</h3>
          <div className="my-4">
            <span className="text-4xl font-bold text-slate-900">R$ 49</span>
            <span className="text-slate-500">/mês</span>
          </div>
          <p className="text-sm text-slate-500 mb-6">Para profissionais autônomos começando agora.</p>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-green-500" /> 1 Obra Ativa
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-green-500" /> Gestão de Materiais
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-green-500" /> Relatórios Básicos
            </li>
          </ul>
          <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
            Começar Grátis
          </button>
        </div>

        {/* Pro */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 p-8 flex flex-col relative transform scale-105 z-10">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            Profissional <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          </h3>
          <div className="my-4">
            <span className="text-4xl font-bold text-slate-900">R$ 99</span>
            <span className="text-slate-500">/mês</span>
          </div>
          <p className="text-sm text-slate-500 mb-6">Para pequenas construtoras em crescimento.</p>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-green-500" /> Até 3 Obras Ativas
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-green-500" /> Análise com IA (Gemini)
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-green-500" /> Relatórios PDF Avançados
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-green-500" /> Dashboard Financeiro Completo
            </li>
          </ul>
          <button className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            Assinar Agora
          </button>
        </div>

        {/* Unlimited */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
             Construtora <Zap className="w-4 h-4 text-purple-500 fill-purple-500" />
          </h3>
          <div className="my-4">
            <span className="text-4xl font-bold text-slate-900">R$ 199</span>
            <span className="text-slate-500">/mês</span>
          </div>
          <p className="text-sm text-slate-500 mb-6">Gestão ilimitada para sua empresa.</p>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-green-500" /> Obras Ilimitadas
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-green-500" /> Múltiplos Usuários
            </li>
             <li className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-green-500" /> Consultoria IA Ilimitada
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-green-500" /> Suporte Prioritário
            </li>
          </ul>
          <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
            Falar com Vendas
          </button>
        </div>
      </div>
    </div>
  );
};