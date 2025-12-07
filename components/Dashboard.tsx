import React from 'react';
import { Project, ProjectFinancials } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  financials: Record<string, ProjectFinancials>;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, financials }) => {
  
  // Aggregate data for all projects
  const totalBudget = projects.reduce((acc, p) => acc + p.totalBudget, 0);
  
  // Cast values to ensure correct typing if Object.values returns unknown/any
  const allFinancialsList = Object.values(financials) as ProjectFinancials[];
  
  const totalSpend = allFinancialsList.reduce((acc, f) => acc + f.totalCost, 0);
  const totalMaterials = allFinancialsList.reduce((acc, f) => acc + f.totalMaterials, 0);
  const totalLabor = allFinancialsList.reduce((acc, f) => acc + f.totalLabor, 0);
  
  const overallProfit = totalBudget - totalSpend;
  const isOverallRisk = totalSpend > (totalBudget * 0.8);

  const pieData = [
    { name: 'Materiais', value: totalMaterials },
    { name: 'Mão de Obra', value: totalLabor },
  ];
  
  const COLORS = ['#3b82f6', '#f59e0b']; // Blue, Amber

  const barData = projects.map(p => ({
    name: p.name.substring(0, 10) + '...',
    Orçamento: p.totalBudget,
    Gasto: financials[p.id]?.totalCost || 0
  }));

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
        <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 mt-2 md:mt-0">
          {projects.length} Obras Ativas
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Orçamento Total</p>
            <p className="text-xl font-bold text-slate-800">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Gasto Atual</p>
            <p className={`text-xl font-bold ${isOverallRisk ? 'text-orange-600' : 'text-slate-800'}`}>
              {formatCurrency(totalSpend)}
            </p>
          </div>
          <div className={`p-2 rounded-lg ${isOverallRisk ? 'bg-orange-100' : 'bg-slate-100'}`}>
            <Activity className={`w-5 h-5 ${isOverallRisk ? 'text-orange-600' : 'text-slate-600'}`} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Lucro Estimado</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(overallProfit)}</p>
          </div>
          <div className="bg-green-100 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Status Geral</p>
            <p className="text-xl font-bold text-slate-800">
              {isOverallRisk ? 'Atenção' : 'Saudável'}
            </p>
          </div>
          <div className={`p-2 rounded-lg ${isOverallRisk ? 'bg-red-100' : 'bg-emerald-100'}`}>
            {isOverallRisk ? (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Orçamento vs Realizado</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="Orçamento" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Gasto" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Composição de Custos</h3>
          <div className="h-64 w-full flex items-center justify-center">
            {totalSpend > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-sm">Sem dados de custos ainda</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};