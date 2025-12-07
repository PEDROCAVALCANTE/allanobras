import React, { useState } from 'react';
import { HardHat, AlertCircle, ArrowRight, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Authentication check
    if (username === 'admin' && password === '123456') {
      onLogin();
    } else {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop" 
          alt="Construction Site" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-slate-900/90" />
        
        <div className="relative z-10 p-12 max-w-lg text-white">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-900/50">
            <HardHat className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">Gestão inteligente para construtoras modernas.</h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Controle custos, acompanhe etapas e garanta a lucratividade de suas obras em um único lugar.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-blue-200">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-slate-900"></div>
              <div className="w-8 h-8 rounded-full bg-blue-300 border-2 border-slate-900"></div>
              <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-slate-900"></div>
            </div>
            <span>Junte-se a mais de 2.000 engenheiros.</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-4">
               <div className="bg-blue-600 p-3 rounded-xl shadow-md">
                 <HardHat className="w-8 h-8 text-white" />
               </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Bem-vindo de volta</h1>
            <p className="mt-2 text-slate-500">Acesse sua conta para gerenciar seus projetos.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Erro no acesso</span>
                  {error}
                </div>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Usuário</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                    placeholder="Digite seu usuário"
                    autoFocus
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5"
            >
              Entrar no Sistema <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-6 text-center border-t border-slate-100">
             <div className="inline-block px-4 py-2 bg-slate-100 rounded-lg">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Credenciais de Demo</p>
                <p className="text-sm font-mono text-slate-700">user: <span className="font-bold">admin</span> &nbsp;|&nbsp; senha: <span className="font-bold">123456</span></p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};