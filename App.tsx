import React, { useState, useMemo } from 'react';
import { Project, Stage, Material, Labor, ProjectFinancials, StageStatus } from './types';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ProjectList } from './components/ProjectList';
import { ProjectDetail } from './components/ProjectDetail';
import { LayoutDashboard, Briefcase, LogOut } from 'lucide-react';
import { Logo } from './components/Logo';

// --- MOCK DATA INITIALIZATION ---
const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Residencial Villa Verde', address: 'Av. Paulista, 1000', responsible: 'Eng. Carlos', startDate: '2023-10-01', expectedEndDate: '2024-05-01', totalBudget: 250000, profitMargin: 20, status: 'Em Andamento' as any },
  { id: '2', name: 'Reforma Apto 402', address: 'Rua Augusta, 500', responsible: 'Arq. Ana', startDate: '2024-01-15', expectedEndDate: '2024-03-01', totalBudget: 45000, profitMargin: 15, status: 'Planejamento' as any }
];

const MOCK_STAGES: Stage[] = [
  { id: 's1', projectId: '1', name: 'Fundação', estimatedCost: 50000, status: StageStatus.COMPLETED, responsible: 'Carlos', deadline: '2023-11-01' },
  { id: 's2', projectId: '1', name: 'Alvenaria', estimatedCost: 80000, status: StageStatus.IN_PROGRESS, responsible: 'Carlos', deadline: '2024-01-01' },
  { id: 's3', projectId: '2', name: 'Demolição', estimatedCost: 5000, status: StageStatus.PENDING, responsible: 'Ana', deadline: '2024-01-20' },
];

const MOCK_MATERIALS: Material[] = [
  { id: 'm1', stageId: 's1', name: 'Concreto Usinado', unit: 'm3', quantity: 50, unitPrice: 450, supplier: 'Polimix', purchaseDate: '2023-10-10' }, // 22500
  { id: 'm2', stageId: 's1', name: 'Aço CA-50', unit: 'kg', quantity: 1000, unitPrice: 8, supplier: 'Gerdau', purchaseDate: '2023-10-12' }, // 8000
  { id: 'm3', stageId: 's2', name: 'Tijolo Cerâmico', unit: 'milheiro', quantity: 10, unitPrice: 900, supplier: 'Olaria', purchaseDate: '2023-12-05' }, // 9000
];

const MOCK_LABOR: Labor[] = [
  { id: 'l1', stageId: 's1', role: 'Pedreiro', workerName: 'João', hourlyRate: 30, hoursWorked: 160, date: '2023-10-30' }, // 4800
  { id: 'l2', stageId: 's1', role: 'Servente', workerName: 'Pedro', hourlyRate: 15, hoursWorked: 160, date: '2023-10-30' }, // 2400
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'dashboard' | 'projects'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // App State (In-Memory Database)
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [stages, setStages] = useState<Stage[]>(MOCK_STAGES);
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
  const [labor, setLabor] = useState<Labor[]>(MOCK_LABOR);

  // --- LOGIC ---

  const calculateFinancials = (projectId: string): ProjectFinancials => {
    const projectStages = stages.filter(s => s.projectId === projectId);
    const stageIds = projectStages.map(s => s.id);
    
    const projectMaterials = materials.filter(m => stageIds.includes(m.stageId));
    const projectLabor = labor.filter(l => stageIds.includes(l.stageId));

    const totalMaterials = projectMaterials.reduce((acc, m) => acc + (m.quantity * m.unitPrice), 0);
    const totalLabor = projectLabor.reduce((acc, l) => acc + (l.hourlyRate * l.hoursWorked), 0);
    const totalCost = totalMaterials + totalLabor;

    const project = projects.find(p => p.id === projectId);
    const budget = project ? project.totalBudget : 0;
    
    return {
      totalMaterials,
      totalLabor,
      totalCost,
      projectedProfit: budget - totalCost,
      realMargin: budget > 0 ? ((budget - totalCost) / budget) * 100 : 0,
      budgetUtilization: budget > 0 ? (totalCost / budget) * 100 : 0,
      isOverBudget: totalCost > budget,
      isRisk: totalCost > (budget * 0.8)
    };
  };

  const allFinancials = useMemo(() => {
    const acc: Record<string, ProjectFinancials> = {};
    projects.forEach(p => {
      acc[p.id] = calculateFinancials(p.id);
    });
    return acc;
  }, [projects, stages, materials, labor]);

  // --- HANDLERS ---

  const handleAddProject = (p: Project) => setProjects([...projects, p]);
  const handleAddStage = (s: Stage) => setStages([...stages, s]);
  const handleAddMaterial = (m: Material) => setMaterials([...materials, m]);
  const handleAddLabor = (l: Labor) => setLabor([...labor, l]);
  const handleUpdateStageStatus = (id: string, status: StageStatus) => {
    setStages(stages.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('dashboard');
    setSelectedProjectId(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // --- RENDER ---

  const activeProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300">
        <div className="p-6 flex items-center gap-3 text-white">
          <div className="bg-white/10 p-2 rounded-lg">
            <Logo className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Alan Obras</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <button 
            onClick={() => { setView('dashboard'); setSelectedProjectId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'dashboard' && !selectedProjectId ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => { setView('projects'); setSelectedProjectId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${(view === 'projects' || selectedProjectId) ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Briefcase className="w-5 h-5" /> Minhas Obras
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full px-4 py-2">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-20 shadow-sm sticky top-0">
          <div className="flex items-center gap-2">
             <div className="bg-slate-900 p-1.5 rounded-lg">
                <Logo className="w-5 h-5" />
              </div>
            <span className="font-bold text-slate-800">Alan Obras</span>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-24 md:pb-8">
          {selectedProjectId && activeProject ? (
            <ProjectDetail 
              project={activeProject}
              stages={stages.filter(s => s.projectId === activeProject.id)}
              materials={materials.filter(m => stages.some(s => s.id === m.stageId && s.projectId === activeProject.id))}
              labor={labor.filter(l => stages.some(s => s.id === l.stageId && s.projectId === activeProject.id))}
              financials={allFinancials[activeProject.id]}
              onBack={() => setSelectedProjectId(null)}
              onAddStage={handleAddStage}
              onAddMaterial={handleAddMaterial}
              onAddLabor={handleAddLabor}
              onUpdateStageStatus={handleUpdateStageStatus}
            />
          ) : (
            <>
              {view === 'dashboard' && <Dashboard projects={projects} financials={allFinancials} />}
              {view === 'projects' && (
                <ProjectList 
                  projects={projects} 
                  onSelectProject={setSelectedProjectId} 
                  onAddProject={handleAddProject} 
                />
              )}
            </>
          )}
        </main>

        {/* Bottom Navigation Bar (Mobile Only) */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center p-2 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => { setView('dashboard'); setSelectedProjectId(null); }}
              className={`flex flex-col items-center justify-center p-2 rounded-xl w-20 transition-all active:scale-95 ${view === 'dashboard' && !selectedProjectId ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutDashboard className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">Início</span>
            </button>
            
            <button 
              onClick={() => { setView('projects'); setSelectedProjectId(null); }}
               className={`flex flex-col items-center justify-center p-2 rounded-xl w-20 transition-all active:scale-95 ${(view === 'projects' || selectedProjectId) ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Briefcase className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">Obras</span>
            </button>

            <button 
              onClick={handleLogout}
               className="flex flex-col items-center justify-center p-2 rounded-xl w-20 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
            >
              <LogOut className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">Sair</span>
            </button>
        </div>
      </div>
    </div>
  );
}

export default App;