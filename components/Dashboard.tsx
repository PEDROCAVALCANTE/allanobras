import React from 'react';
import { Project, ProjectFinancials } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Activity, Briefcase } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  financials: Record<string, ProjectFinancials>;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, financials }) => {
  
  const totalBudget = projects.reduce((acc, p) => acc + p.totalBudget, 0);
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
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    Orçamento: p.totalBudget,
    Gasto: financials[p.id]?.totalCost || 0
  }));

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Visão Geral</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 shadow-sm mt-2 md:mt-0">
          <Briefcase className="w-4 h-4 text-slate-400" />
          <span>{projects.length} Obras Ativas</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Orçamento Total</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-between group hover:border-slate-300 transition-colors">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Gasto Atual</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalSpend)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-slate-100 transition-colors">
            <Activity className="w-6 h-6 text-slate-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-colors">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Lucro Estimado</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(overallProfit)}</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl group-hover:bg-emerald-100 transition-colors">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-between group hover:border-slate-300 transition-colors">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Status Geral</p>
            <p className="text-xl font-bold text-slate-800">
              {isOverallRisk ? 'Atenção' : 'Saudável'}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${isOverallRisk ? 'bg-red-50' : 'bg-emerald-50'}`}>
            {isOverallRisk ? (
              <AlertTriangle className="w-6 h-6 text-red-600" />
            ) : (
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Orçamento vs Realizado</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="Orçamento" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Gasto" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Composição de Custos</h3>
          <div className="h-72 w-full flex items-center justify-center">
            {totalSpend > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300">
                <PieChart width={200} height={200}>
                   <Pie data={[{value: 1}]} innerRadius={70} outerRadius={90} fill="#f1f5f9" strokeWidth={0} dataKey="value" />
                </PieChart>
                <span className="mt-4 text-sm font-medium">Sem dados de custos</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};