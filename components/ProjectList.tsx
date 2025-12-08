import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { Plus, ArrowRight, Calendar, MapPin, DollarSign, Trash2, AlertCircle } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
  onAddProject: (p: Project) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject, onAddProject, onDeleteProject }) => {
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [responsible, setResponsible] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');

  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string) => {
    let newError = '';
    
    switch (field) {
      case 'budget':
        if (parseFloat(value) <= 0) newError = 'O orçamento deve ser maior que zero.';
        break;
      case 'name':
        if (value.trim().length < 3) newError = 'Nome muito curto.';
        break;
      // Add more specific validations if needed
    }

    setErrors(prev => ({ ...prev, [field]: newError }));
  };

  const handleBlur = (field: string, value: string) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [field]: 'Este campo é obrigatório.' }));
    } else {
      validateField(field, value);
    }
  };

  const handleChange = (field: string, value: string) => {
    // Clear required error immediately when typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (field === 'name') setName(value);
    if (field === 'address') setAddress(value);
    if (field === 'responsible') setResponsible(value);
    if (field === 'budget') {
      setBudget(value);
      validateField('budget', value);
    }
    if (field === 'startDate') setStartDate(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final Validation check before submit
    const finalErrors: { [key: string]: string } = {};
    if (!name.trim()) finalErrors.name = 'Nome é obrigatório';
    if (!address.trim()) finalErrors.address = 'Endereço é obrigatório';
    if (!responsible.trim()) finalErrors.responsible = 'Responsável é obrigatório';
    if (!budget || parseFloat(budget) <= 0) finalErrors.budget = 'Orçamento inválido';
    if (!startDate) finalErrors.startDate = 'Data é obrigatória';

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      address,
      responsible,
      startDate,
      expectedEndDate: '', // Optional in MVP
      totalBudget: parseFloat(budget),
      profitMargin: 20, // Default 20%
      status: ProjectStatus.PLANNING
    };
    onAddProject(newProject);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setName(''); setAddress(''); setResponsible(''); setBudget(''); setStartDate('');
    setErrors({});
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getInputClass = (field: string) => 
    `w-full border rounded-md p-2 focus:ring-2 outline-none transition-all ${
      errors[field] 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
        : 'border-slate-300 focus:ring-blue-500'
    }`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Minhas Obras</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova Obra
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 mb-6 animate-fade-in">
          <h3 className="font-semibold text-lg mb-4 text-slate-800">Cadastrar Nova Obra</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Obra</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => handleChange('name', e.target.value)} 
                onBlur={e => handleBlur('name', e.target.value)}
                className={getInputClass('name')}
                placeholder="Ex: Reforma Residencial Silva" 
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.name}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
              <input 
                type="text" 
                value={address} 
                onChange={e => handleChange('address', e.target.value)} 
                onBlur={e => handleBlur('address', e.target.value)}
                className={getInputClass('address')}
                placeholder="Rua das Flores, 123" 
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Responsável</label>
              <input 
                type="text" 
                value={responsible} 
                onChange={e => handleChange('responsible', e.target.value)} 
                onBlur={e => handleBlur('responsible', e.target.value)}
                className={getInputClass('responsible')}
              />
              {errors.responsible && <p className="text-red-500 text-xs mt-1">{errors.responsible}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Orçamento Total (R$)</label>
              <input 
                type="number" 
                value={budget} 
                onChange={e => handleChange('budget', e.target.value)} 
                className={getInputClass('budget')}
                placeholder="0.00" 
              />
              {errors.budget && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.budget}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Início</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => handleChange('startDate', e.target.value)} 
                onBlur={e => handleBlur('startDate', e.target.value)}
                className={getInputClass('startDate')}
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar Obra</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div 
            key={project.id} 
            onClick={() => onSelectProject(project.id)}
            className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-full"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>
            
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-700 transition-colors">{project.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium 
                  ${project.status === ProjectStatus.IN_PROGRESS ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {project.status}
                </span>
              </div>
              
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{project.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{formatCurrency(project.totalBudget)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(project.id);
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-2 px-2 py-1 hover:bg-red-50 rounded transition-colors"
                title="Excluir Obra"
              >
                 <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Excluir</span>
              </button>
              <button className="text-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Gerenciar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && !showForm && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="mb-2">Nenhuma obra cadastrada.</p>
            <p className="text-sm">Clique em "Nova Obra" para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
};