import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Lock, User, CheckCircle, HardHat } from 'lucide-react';
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
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Side - Visual (Engineering/Construction Theme) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-950 items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity transform hover:scale-105 transition-transform duration-[20s]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2531&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-blue-900/90 to-blue-800/80" />
        
        {/* Content */}
        <div className="relative z-10 p-16 max-w-xl text-white">
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 px-5 py-2.5 rounded-full mb-8 backdrop-blur-md shadow-lg">
             <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
             <span className="text-sm font-semibold text-white tracking-wide">Sistema de Gestão v2.0</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight drop-shadow-sm">
            Construa com <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-200">precisão</span>
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-blue-600/30 -skew-x-12"></div>
            </span>.
          </h2>
          
          <p className="text-blue-100 text-lg mb-10 leading-relaxed font-light opacity-90 max-w-md">
            A plataforma definitiva para engenheiros, construtoras e empreiteiros que buscam controle total sobre custos e prazos.
          </p>
          
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            {[
              "Controle Financeiro",
              "Cronograma Físico",
              "Relatórios PDF",
              "Consultoria IA"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium text-blue-50 group">
                <div className="bg-blue-500/30 p-1.5 rounded-lg group-hover:bg-blue-400/50 transition-colors border border-blue-400/20">
                  <CheckCircle className="w-4 h-4 text-sky-300" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-blue-50 via-white to-slate-100">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden">
          
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600"></div>

          <div className="text-center mb-10">
            <div className="inline-flex justify-center items-center p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-900/10 mb-6 transform hover:scale-105 transition-transform duration-300">
              <Logo className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Bem-vindo</h1>
            <p className="mt-3 text-slate-500 text-sm">Acesse o painel administrativo para gerenciar suas obras.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm flex items-center gap-3 animate-fade-in shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            <div className="space-y-5">
              {/* User Input */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Usuário</label>
                <div className="relative flex items-center transition-all duration-300 transform group-focus-within:scale-[1.01] group-focus-within:shadow-md rounded-xl bg-slate-50 border border-slate-200 group-focus-within:border-blue-500 group-focus-within:bg-white overflow-hidden">
                  <div className="h-full pl-4 pr-3 py-4 bg-slate-100 border-r border-slate-200 group-focus-within:bg-blue-50 group-focus-within:border-blue-100 transition-colors">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full px-4 py-4 text-slate-700 bg-transparent placeholder-slate-400 focus:outline-none"
                    placeholder="Digite seu usuário"
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Senha</label>
                <div className="relative flex items-center transition-all duration-300 transform group-focus-within:scale-[1.01] group-focus-within:shadow-md rounded-xl bg-slate-50 border border-slate-200 group-focus-within:border-blue-500 group-focus-within:bg-white overflow-hidden">
                   <div className="h-full pl-4 pr-3 py-4 bg-slate-100 border-r border-slate-200 group-focus-within:bg-blue-50 group-focus-within:border-blue-100 transition-colors">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-4 text-slate-700 bg-transparent placeholder-slate-400 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 transform hover:-translate-y-1 hover:shadow-xl ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <div className="bg-white/20 p-1 rounded-full">
                     <ArrowRight className="w-4 h-4" />
                  </div>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">© 2024 Alan Obras. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
