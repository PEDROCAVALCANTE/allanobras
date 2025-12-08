import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Lock, User, CheckCircle } from 'lucide-react';
import { Logo } from './Logo';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        onLogin();
      } else {
        setError('Credenciais inválidas.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay transform hover:scale-105 transition-transform duration-[20s]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2670&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-slate-900/90" />
        
        <div className="relative z-10 p-16 max-w-xl text-white">
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
             <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
             <span className="text-sm font-medium text-slate-100 tracking-wide">Gestão de Obras Inteligentes</span>
          </div>
          
          <h2 className="text-6xl font-bold mb-6 leading-tight tracking-tight">
            Alan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Obras</span>
          </h2>
          
          <p className="text-slate-300 text-lg mb-10 leading-relaxed font-light opacity-90">
            Potencialize seus resultados com a plataforma definitiva para controle de custos, prazos e materiais.
          </p>
          
          <div className="grid grid-cols-2 gap-y-6 gap-x-8">
            {[
              "Controle Financeiro",
              "Cronograma Físico",
              "Relatórios PDF",
              "Consultoria IA"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-200 group">
                <div className="bg-blue-500/20 p-1.5 rounded-lg group-hover:bg-blue-500/40 transition-colors">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-white to-slate-100">
        <div className="w-full max-w-md bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white">
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-2xl bg-slate-900 shadow-lg shadow-slate-900/20 mb-6 transform hover:rotate-3 transition-transform">
              <Logo className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Bem-vindo</h1>
            <p className="mt-2 text-slate-500">Acesse o painel administrativo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Usuário</label>
                <div className="relative transition-all duration-300 transform focus-within:scale-[1.02]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-xl text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="Digite seu usuário"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Senha</label>
                <div className="relative transition-all duration-300 transform focus-within:scale-[1.02]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-xl text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-slate-900/20 transform hover:-translate-y-0.5 ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Entrar no Sistema <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};