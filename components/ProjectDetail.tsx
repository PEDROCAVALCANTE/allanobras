import React, { useState } from 'react';
import { Project, Stage, Material, Labor, ProjectFinancials, StageStatus, Expense } from '../types';
import { ArrowLeft, Package, Users, Layers, TrendingDown, AlertCircle, Printer, BrainCircuit, Trash2, Receipt, Calendar } from 'lucide-react';
import { analyzeProjectRisks } from '../services/gemini';

interface ProjectDetailProps {
  project: Project;
  stages: Stage[];
  materials: Material[];
  labor: Labor[];
  expenses: Expense[];
  financials: ProjectFinancials;
  onBack: () => void;
  onAddStage: (s: Stage) => void;
  onAddMaterial: (m: Material) => void;
  onAddLabor: (l: Labor) => void;
  onAddExpense: (e: Expense) => void;
  onUpdateStageStatus: (id: string, status: StageStatus) => void;
  onDeleteMaterial: (id: string) => void;
  onDeleteLabor: (id: string) => void;
  onDeleteExpense: (id: string) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
  project, stages, materials, labor, expenses, financials, onBack, onAddStage, onAddMaterial, onAddLabor, onAddExpense, onUpdateStageStatus, onDeleteMaterial, onDeleteLabor, onDeleteExpense
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'labor' | 'expenses'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Forms state
  const [showStageForm, setShowStageForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showLaborForm, setShowLaborForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  
  // Generic input state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [selectedStageId, setSelectedStageId] = useState('');
  
  // Expense specific input state
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseCat, setNewExpenseCat] = useState('');
  const [newExpenseDate, setNewExpenseDate] = useState('');

  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateInput = (field: string, value: string) => {
    let error = '';
    if (field === 'cost' || field === 'qty') {
      if (value && parseFloat(value) <= 0) {
        error = 'O valor deve ser maior que zero.';
      }
    }
    if (field === 'name' && value.trim().length === 0) {
       // Optional: validate name length while typing
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleInputChange = (field: 'name' | 'cost' | 'qty' | 'unit' | 'stage', value: string) => {
    // Clear required error for this field
    if (errors[field]) {
       setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (field === 'name') setNewItemName(value);
    if (field === 'cost') {
      setNewItemCost(value);
      validateInput('cost', value);
    }
    if (field === 'qty') {
      setNewItemQty(value);
      validateInput('qty', value);
    }
    if (field === 'unit') setNewItemUnit(value);
    if (field === 'stage') setSelectedStageId(value);
  };

  const validateForm = (type: 'stage' | 'material' | 'labor' | 'expense') => {
    const newErrors: { [key: string]: string } = {};
    
    if (type !== 'expense') {
      if (!newItemName.trim()) newErrors.name = 'Campo obrigatório';
      if (!newItemCost || parseFloat(newItemCost) <= 0) newErrors.cost = 'Valor inválido';
    }

    if (type === 'material') {
      if (!selectedStageId) newErrors.stage = 'Selecione uma etapa';
      if (!newItemQty || parseFloat(newItemQty) <= 0) newErrors.qty = 'Quantidade inválida';
      if (!newItemUnit.trim()) newErrors.unit = 'Unidade obrigatória';
    }

    if (type === 'labor') {
      if (!selectedStageId) newErrors.stage = 'Selecione uma etapa';
      if (!newItemQty || parseFloat(newItemQty) <= 0) newErrors.qty = 'Horas inválidas';
    }

    if (type === 'expense') {
      if (!newExpenseDesc.trim()) newErrors.desc = 'Descrição obrigatória';
      if (!newExpenseCat) newErrors.cat = 'Categoria obrigatória';
      if (!newItemCost || parseFloat(newItemCost) <= 0) newErrors.cost = 'Valor inválido';
      if (!newExpenseDate) newErrors.date = 'Data obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    if (!validateForm('stage')) return;

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
    if (!validateForm('material')) return;

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
    if (!validateForm('labor')) return;

    onAddLabor({
      id: crypto.randomUUID(),
      stageId: selectedStageId,
      role: newItemName, 
      workerName: 'Trabalhador',
      hourlyRate: parseFloat(newItemCost),
      hoursWorked: parseFloat(newItemQty), 
      date: new Date().toISOString()
    });
    setShowLaborForm(false); resetInputs();
  };

  const submitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm('expense')) return;

    onAddExpense({
      id: crypto.randomUUID(),
      projectId: project.id,
      description: newExpenseDesc,
      category: newExpenseCat,
      amount: parseFloat(newItemCost),
      date: newExpenseDate
    });
    setShowExpenseForm(false); resetInputs();
  }

  const resetInputs = () => {
    setNewItemName(''); setNewItemCost(''); setNewItemQty(''); setNewItemUnit(''); setSelectedStageId('');
    setNewExpenseDesc(''); setNewExpenseCat(''); setNewExpenseDate('');
    setErrors({});
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getInputClass = (field: string) => 
    `p-2 border rounded w-full outline-none focus:ring-2 transition-all ${
      errors[field] 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
        : 'border-slate-300 focus:ring-blue-500'
    }`;

  const expenseCategories = ['Taxas e Impostos', 'Aluguel de Equipamentos', 'Transporte e Frete', 'Alimentação', 'Projetos e Licenças', 'Outros'];

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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
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
             <p className="text-xs font-semibold uppercase text-slate-400">Despesas</p>
             <p className="text-lg font-bold text-purple-600">{formatCurrency(financials.totalExpenses)}</p>
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
        <div className="border-b border-slate-200 mb-6 no-print overflow-x-auto">
          <nav className="flex gap-6 min-w-max">
            <button 
              onClick={() => { setActiveTab('overview'); resetInputs(); }}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <Layers className="w-4 h-4" /> Etapas
            </button>
            <button 
              onClick={() => { setActiveTab('materials'); resetInputs(); }}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'materials' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <Package className="w-4 h-4" /> Materiais
            </button>
            <button 
              onClick={() => { setActiveTab('labor'); resetInputs(); }}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'labor' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <Users className="w-4 h-4" /> Mão de Obra
            </button>
            <button 
              onClick={() => { setActiveTab('expenses'); resetInputs(); }}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'expenses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <Receipt className="w-4 h-4" /> Despesas
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
                <form onSubmit={submitStage} className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input 
                        placeholder="Nome da Etapa" 
                        value={newItemName} 
                        onChange={e => handleInputChange('name', e.target.value)} 
                        className={getInputClass('name')}
                      />
                      {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                    </div>
                    <div>
                      <input 
                        type="number" 
                        placeholder="Custo Previsto (R$)" 
                        value={newItemCost} 
                        onChange={e => handleInputChange('cost', e.target.value)} 
                        className={getInputClass('cost')}
                      />
                      {errors.cost && <span className="text-xs text-red-500">{errors.cost}</span>}
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 gap-2">
                    <button type="button" onClick={() => { setShowStageForm(false); resetInputs(); }} className="text-sm text-slate-500">Cancelar</button>
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
                <form onSubmit={submitMaterial} className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <select 
                        value={selectedStageId} 
                        onChange={e => handleInputChange('stage', e.target.value)} 
                        className={getInputClass('stage')}
                      >
                        <option value="">Selecione a Etapa...</option>
                        {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      {errors.stage && <span className="text-xs text-red-500">{errors.stage}</span>}
                    </div>
                    
                    <div>
                      <input 
                        placeholder="Material (ex: Cimento CP II)" 
                        value={newItemName} 
                        onChange={e => handleInputChange('name', e.target.value)} 
                        className={getInputClass('name')}
                      />
                      {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                    </div>
                    
                    <div>
                      <input 
                        placeholder="Unidade (ex: sc, m²)" 
                        value={newItemUnit} 
                        onChange={e => handleInputChange('unit', e.target.value)} 
                        className={getInputClass('unit')}
                      />
                      {errors.unit && <span className="text-xs text-red-500">{errors.unit}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                       <div>
                         <input 
                            type="number" 
                            placeholder="Qtd" 
                            value={newItemQty} 
                            onChange={e => handleInputChange('qty', e.target.value)} 
                            className={getInputClass('qty')}
                         />
                         {errors.qty && <span className="text-xs text-red-500">{errors.qty}</span>}
                       </div>
                       <div>
                         <input 
                            type="number" 
                            placeholder="Preço Unit." 
                            value={newItemCost} 
                            onChange={e => handleInputChange('cost', e.target.value)} 
                            className={getInputClass('cost')}
                         />
                         {errors.cost && <span className="text-xs text-red-500">{errors.cost}</span>}
                       </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 gap-2">
                    <button type="button" onClick={() => { setShowMaterialForm(false); resetInputs(); }} className="text-sm text-slate-500">Cancelar</button>
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
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map(m => (
                      <tr key={m.id} className="border-b border-slate-100 group">
                        <td className="px-4 py-3 font-medium text-slate-800">{m.name}</td>
                        <td className="px-4 py-3 text-slate-500">{stages.find(s => s.id === m.stageId)?.name || '-'}</td>
                        <td className="px-4 py-3">{m.quantity} {m.unit}</td>
                        <td className="px-4 py-3">{formatCurrency(m.unitPrice)}</td>
                        <td className="px-4 py-3 font-bold">{formatCurrency(m.quantity * m.unitPrice)}</td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => onDeleteMaterial(m.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Excluir Material"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {materials.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-slate-400">Nenhum material lançado.</td></tr>}
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
                <form onSubmit={submitLabor} className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <select 
                        value={selectedStageId} 
                        onChange={e => handleInputChange('stage', e.target.value)} 
                        className={getInputClass('stage')}
                      >
                        <option value="">Selecione a Etapa...</option>
                        {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      {errors.stage && <span className="text-xs text-red-500">{errors.stage}</span>}
                    </div>
                    
                    <div>
                      <input 
                        placeholder="Cargo/Função (ex: Pedreiro)" 
                        value={newItemName} 
                        onChange={e => handleInputChange('name', e.target.value)} 
                        className={getInputClass('name')}
                      />
                      {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                    </div>

                    <div>
                      <input 
                        type="number" 
                        placeholder="Horas Trabalhadas" 
                        value={newItemQty} 
                        onChange={e => handleInputChange('qty', e.target.value)} 
                        className={getInputClass('qty')}
                      />
                      {errors.qty && <span className="text-xs text-red-500">{errors.qty}</span>}
                    </div>

                    <div>
                      <input 
                        type="number" 
                        placeholder="Valor Hora" 
                        value={newItemCost} 
                        onChange={e => handleInputChange('cost', e.target.value)} 
                        className={getInputClass('cost')}
                      />
                      {errors.cost && <span className="text-xs text-red-500">{errors.cost}</span>}
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 gap-2">
                    <button type="button" onClick={() => { setShowLaborForm(false); resetInputs(); }} className="text-sm text-slate-500">Cancelar</button>
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
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labor.map(l => (
                      <tr key={l.id} className="border-b border-slate-100 group">
                        <td className="px-4 py-3 font-medium text-slate-800">{l.role}</td>
                        <td className="px-4 py-3 text-slate-500">{stages.find(s => s.id === l.stageId)?.name || '-'}</td>
                        <td className="px-4 py-3">{l.hoursWorked}h</td>
                        <td className="px-4 py-3">{formatCurrency(l.hourlyRate)}</td>
                        <td className="px-4 py-3 font-bold">{formatCurrency(l.hoursWorked * l.hourlyRate)}</td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => onDeleteLabor(l.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Excluir Lançamento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {labor.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-slate-400">Nenhum lançamento de mão de obra.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

           {/* EXPENSES TAB */}
           {activeTab === 'expenses' && (
            <div>
               <div className="flex justify-between items-center mb-4 no-print">
                <h3 className="font-semibold text-slate-700">Despesas Extras</h3>
                <button onClick={() => setShowExpenseForm(true)} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">+ Nova Despesa</button>
              </div>

              {showExpenseForm && (
                <form onSubmit={submitExpense} className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input 
                        placeholder="Descrição (ex: Taxa de Alvará)" 
                        value={newExpenseDesc} 
                        onChange={e => { setNewExpenseDesc(e.target.value); if(errors.desc) setErrors({...errors, desc: ''}); }} 
                        className={getInputClass('desc')}
                      />
                      {errors.desc && <span className="text-xs text-red-500">{errors.desc}</span>}
                    </div>

                    <div>
                      <select 
                        value={newExpenseCat} 
                        onChange={e => { setNewExpenseCat(e.target.value); if(errors.cat) setErrors({...errors, cat: ''}); }} 
                        className={getInputClass('cat')}
                      >
                        <option value="">Selecione a Categoria...</option>
                        {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.cat && <span className="text-xs text-red-500">{errors.cat}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                       <div>
                         <input 
                            type="number" 
                            placeholder="Valor (R$)" 
                            value={newItemCost} 
                            onChange={e => handleInputChange('cost', e.target.value)} 
                            className={getInputClass('cost')}
                         />
                         {errors.cost && <span className="text-xs text-red-500">{errors.cost}</span>}
                       </div>
                       <div>
                         <input 
                            type="date" 
                            value={newExpenseDate} 
                            onChange={e => { setNewExpenseDate(e.target.value); if(errors.date) setErrors({...errors, date: ''}); }} 
                            className={getInputClass('date')}
                         />
                         {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
                       </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 gap-2">
                    <button type="button" onClick={() => { setShowExpenseForm(false); resetInputs(); }} className="text-sm text-slate-500">Cancelar</button>
                    <button type="submit" className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Salvar</button>
                  </div>
                </form>
              )}

               <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Descrição</th>
                      <th className="px-4 py-3">Categoria</th>
                      <th className="px-4 py-3">Valor</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(e => (
                      <tr key={e.id} className="border-b border-slate-100 group">
                         <td className="px-4 py-3 text-slate-500">{new Date(e.date).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{e.description}</td>
                        <td className="px-4 py-3">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{e.category}</span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700">{formatCurrency(e.amount)}</td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => onDeleteExpense(e.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Excluir Despesa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {expenses.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-slate-400">Nenhuma despesa extra lançada.</td></tr>}
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