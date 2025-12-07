import React, { useState } from 'react';
import { Project, Stage, Material, Labor, ProjectFinancials, StageStatus } from '../types';
import { ArrowLeft, Package, Users, Layers, TrendingDown, AlertCircle, Printer, BrainCircuit } from 'lucide-react';
import { analyzeProjectRisks } from '../services/gemini';

interface ProjectDetailProps {
  project: Project;
  stages: Stage[];
  materials: Material[];
  labor: Labor[];
  financials: ProjectFinancials;
  onBack: () => void;
  onAddStage: (s: Stage) => void;
  onAddMaterial: (m: Material) => void;
  onAddLabor: (l: Labor) => void;
  onUpdateStageStatus: (id: string, status: StageStatus) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
  project, stages, materials, labor, financials, onBack, onAddStage, onAddMaterial, onAddLabor, onUpdateStageStatus 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'labor'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Forms state (simplified for demo)
  const [showStageForm, setShowStageForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showLaborForm, setShowLaborForm] = useState(false);
  
  // Generic input state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [selectedStageId, setSelectedStageId] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAiReport(null);
    try {
      const report = await analyzeProjectRisks(project, financials, stages);
      setAiReport(report);
    } catch (e) {
      setAiReport("Erro ao analisar.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const submitStage = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStage({
      id: crypto.randomUUID(),
      projectId: project.id,
      name: newItemName,
      estimatedCost: parseFloat(newItemCost),
      status: StageStatus.PENDING,
      responsible: 'Eu',
      deadline: new Date().toISOString()
    });
    setShowStageForm(false); resetInputs();
  };

  const submitMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMaterial({
      id: crypto.randomUUID(),
      stageId: selectedStageId,
      name: newItemName,
      unit: newItemUnit || 'un',
      quantity: parseFloat(newItemQty),
      unitPrice: parseFloat(newItemCost),
      supplier: 'Fornecedor Padrão',
      purchaseDate: new Date().toISOString()
    });
    setShowMaterialForm(false); resetInputs();
  };

  const submitLabor = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLabor({
      id: crypto.randomUUID(),
      stageId: selectedStageId,
      role: newItemName, // Using name field as role for simplicity
      workerName: 'Trabalhador',
      hourlyRate: parseFloat(newItemCost),
      hoursWorked: parseFloat(newItemQty), // Using qty as hours
      date: new Date().toISOString()
    });
    setShowLaborForm(false); resetInputs();
  };

  const resetInputs = () => {
    setNewItemName(''); setNewItemCost(''); setNewItemQty(''); setNewItemUnit(''); setSelectedStageId('');
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 no-print">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Voltar para lista
        </button>
        <div className="flex gap-2">
          <button onClick={handleAiAnalysis} disabled={isAnalyzing} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium disabled:opacity-50">
            <BrainCircuit className="w-4 h-4" /> {isAnalyzing ? 'Analisando...' : 'IA Consultor'}
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium">
            <Printer className="w-4 h-4" /> Relatório PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
            <p className="text-slate-500">{project.address}</p>
          </div>
          <div className="text-right">
             <p className="text-sm text-slate-500">Orçamento</p>
             <p className="text-xl font-bold text-slate-800">{formatCurrency(project.totalBudget)}</p>
          </div>
        </div>

        {/* Financial Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Gasto Total</p>
            <p className={`text-lg font-bold ${financials.isRisk ? 'text-red-600' : 'text-slate-800'}`}>
              {formatCurrency(financials.totalCost)}
            </p>
          </div>
          <div>
             <p className="text-xs font-semibold uppercase text-slate-400">Materiais</p>
             <p className="text-lg font-bold text-blue-600">{formatCurrency(financials.totalMaterials)}</p>
          </div>
          <div>
             <p className="text-xs font-semibold uppercase text-slate-400">Mão de Obra</p>
             <p className="text-lg font-bold text-amber-600">{formatCurrency(financials.totalLabor)}</p>
          </div>
          <div>
             <p className="text-xs font-semibold uppercase text-slate-400">Saldo Restante</p>
             <p className="text-lg font-bold text-emerald-600">{formatCurrency(project.totalBudget - financials.totalCost)}</p>
          </div>
        </div>

        {/* AI Report Section */}
        {aiReport && (
          <div className="mb-6 bg-purple-50 border border-purple-200 p-4 rounded-lg animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-purple-800">Análise Inteligente</h3>
            </div>
            <div className="prose prose-sm prose-purple text-purple-900 whitespace-pre-line">
              {aiReport}
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="border-b border-slate-200 mb-6 no-print">
          <nav className="flex gap-6">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <Layers className="w-4 h-4" /> Etapas
            </button>
            <button 
              onClick={() => setActiveTab('materials')}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'materials' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <Package className="w-4 h-4" /> Materiais
            </button>
            <button 
              onClick={() => setActiveTab('labor')}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'labor' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <Users className="w-4 h-4" /> Mão de Obra
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {/* STAGES TAB */}
          {activeTab === 'overview' && (
            <div>
              <div className="flex justify-between items-center mb-4 no-print">
                <h3 className="font-semibold text-slate-700">Cronograma de Etapas</h3>
                <button onClick={() => setShowStageForm(true)} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">+ Nova Etapa</button>
              </div>

              {showStageForm && (
                <form onSubmit={submitStage} className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="Nome da Etapa" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="p-2 border rounded" />
                    <input required type="number" placeholder="Custo Previsto" value={newItemCost} onChange={e => setNewItemCost(e.target.value)} className="p-2 border rounded" />
                  </div>
                  <div className="flex justify-end mt-3 gap-2">
                    <button type="button" onClick={() => setShowStageForm(false)} className="text-sm text-slate-500">Cancelar</button>
                    <button type="submit" className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Salvar</button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">Etapa</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Custo Previsto</th>
                      <th className="px-4 py-3">Realizado (Mat + MO)</th>
                      <th className="px-4 py-3">Desvio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stages.map(stage => {
                      const stageMaterialsCost = materials.filter(m => m.stageId === stage.id).reduce((acc, m) => acc + (m.quantity * m.unitPrice), 0);
                      const stageLaborCost = labor.filter(l => l.stageId === stage.id).reduce((acc, l) => acc + (l.hourlyRate * l.hoursWorked), 0);
                      const totalReal = stageMaterialsCost + stageLaborCost;
                      const variance = totalReal - stage.estimatedCost;
                      
                      return (
                        <tr key={stage.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-800">{stage.name}</td>
                          <td className="px-4 py-3">
                            <select 
                              value={stage.status} 
                              onChange={(e) => onUpdateStageStatus(stage.id, e.target.value as StageStatus)}
                              className="bg-transparent border-none text-xs font-semibold focus:ring-0 cursor-pointer"
                              style={{ 
                                color: stage.status === StageStatus.COMPLETED ? '#059669' : 
                                       stage.status === StageStatus.IN_PROGRESS ? '#2563eb' : '#64748b' 
                              }}
                            >
                              {Object.values(StageStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3">{formatCurrency(stage.estimatedCost)}</td>
                          <td className="px-4 py-3">{formatCurrency(totalReal)}</td>
                          <td className={`px-4 py-3 font-medium ${variance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {variance > 0 ? '+' : ''}{formatCurrency(variance)}
                          </td>
                        </tr>
                      );
                    })}
                    {stages.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-slate-400">Nenhuma etapa cadastrada.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MATERIALS TAB */}
          {activeTab === 'materials' && (
            <div>
              <div className="flex justify-between items-center mb-4 no-print">
                <h3 className="font-semibold text-slate-700">Controle de Materiais</h3>
                <button onClick={() => setShowMaterialForm(true)} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">+ Adicionar Material</button>
              </div>

              {showMaterialForm && (
                <form onSubmit={submitMaterial} className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select required value={selectedStageId} onChange={e => setSelectedStageId(e.target.value)} className="p-2 border rounded md:col-span-3">
                      <option value="">Selecione a Etapa...</option>
                      {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <input required placeholder="Material (ex: Cimento CP II)" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="p-2 border rounded" />
                    <input required placeholder="Unidade (ex: sc, m²)" value={newItemUnit} onChange={e => setNewItemUnit(e.target.value)} className="p-2 border rounded" />
                    <div className="grid grid-cols-2 gap-2">
                       <input required type="number" placeholder="Qtd" value={newItemQty} onChange={e => setNewItemQty(e.target.value)} className="p-2 border rounded" />
                       <input required type="number" placeholder="Preço Unit." value={newItemCost} onChange={e => setNewItemCost(e.target.value)} className="p-2 border rounded" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 gap-2">
                    <button type="button" onClick={() => setShowMaterialForm(false)} className="text-sm text-slate-500">Cancelar</button>
                    <button type="submit" className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Salvar</button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">Material</th>
                      <th className="px-4 py-3">Etapa</th>
                      <th className="px-4 py-3">Qtd</th>
                      <th className="px-4 py-3">Unit.</th>
                      <th className="px-4 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map(m => (
                      <tr key={m.id} className="border-b border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-800">{m.name}</td>
                        <td className="px-4 py-3 text-slate-500">{stages.find(s => s.id === m.stageId)?.name || '-'}</td>
                        <td className="px-4 py-3">{m.quantity} {m.unit}</td>
                        <td className="px-4 py-3">{formatCurrency(m.unitPrice)}</td>
                        <td className="px-4 py-3 font-bold">{formatCurrency(m.quantity * m.unitPrice)}</td>
                      </tr>
                    ))}
                    {materials.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-slate-400">Nenhum material lançado.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LABOR TAB */}
          {activeTab === 'labor' && (
            <div>
               <div className="flex justify-between items-center mb-4 no-print">
                <h3 className="font-semibold text-slate-700">Apontamento de Horas</h3>
                <button onClick={() => setShowLaborForm(true)} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">+ Lançar Mão de Obra</button>
              </div>

              {showLaborForm && (
                <form onSubmit={submitLabor} className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select required value={selectedStageId} onChange={e => setSelectedStageId(e.target.value)} className="p-2 border rounded md:col-span-3">
                      <option value="">Selecione a Etapa...</option>
                      {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <input required placeholder="Cargo/Função (ex: Pedreiro)" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="p-2 border rounded" />
                    <input required type="number" placeholder="Horas Trabalhadas" value={newItemQty} onChange={e => setNewItemQty(e.target.value)} className="p-2 border rounded" />
                    <input required type="number" placeholder="Valor Hora" value={newItemCost} onChange={e => setNewItemCost(e.target.value)} className="p-2 border rounded" />
                  </div>
                  <div className="flex justify-end mt-3 gap-2">
                    <button type="button" onClick={() => setShowLaborForm(false)} className="text-sm text-slate-500">Cancelar</button>
                    <button type="submit" className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Salvar</button>
                  </div>
                </form>
              )}

               <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">Cargo</th>
                      <th className="px-4 py-3">Etapa</th>
                      <th className="px-4 py-3">Horas</th>
                      <th className="px-4 py-3">Valor/h</th>
                      <th className="px-4 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labor.map(l => (
                      <tr key={l.id} className="border-b border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-800">{l.role}</td>
                        <td className="px-4 py-3 text-slate-500">{stages.find(s => s.id === l.stageId)?.name || '-'}</td>
                        <td className="px-4 py-3">{l.hoursWorked}h</td>
                        <td className="px-4 py-3">{formatCurrency(l.hourlyRate)}</td>
                        <td className="px-4 py-3 font-bold">{formatCurrency(l.hoursWorked * l.hourlyRate)}</td>
                      </tr>
                    ))}
                    {labor.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-slate-400">Nenhum lançamento de mão de obra.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};