import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Lock, User, CheckCircle, TrendingUp } from 'lucide-react';
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
      if ((username === 'admin' || username === 'allan') && password === '123456') {
        onLogin();
      } else {
        setError('Credenciais inválidas.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Side - Visual (Authority Theme) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-950 flex-col items-center justify-between overflow-hidden pt-12">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 z-0" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        {/* Top Content */}
        <div className="relative z-10 px-12 w-full max-w-xl">
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
             <span className="text-[10px] uppercase font-bold tracking-widest text-slate-200">Gestão 2.0</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 leading-tight tracking-tight text-white">
            Gestão de obras <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">sem complicações</span>.
          </h2>
          
          <div className="space-y-3 mb-8">
            {[
              "Controle Financeiro em Tempo Real",
              "Relatórios Automatizados",
              "Gestão de Materiais e Mão de Obra"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium text-blue-100/80">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Image & Trigger Card */}
        <div className="relative z-10 w-full max-w-md mt-auto flex flex-col items-center justify-end">
          
          {/* Mental Trigger Card - Floating */}
          <div className="absolute top-10 -right-4 md:-right-8 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-start gap-3 shadow-2xl max-w-[280px] hover:scale-105 transition-transform duration-300">
            <div className="bg-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-1">Pare de perder dinheiro.</p>
              <p className="text-blue-100 text-[11px] leading-relaxed">
                Obras sem gestão têm <span className="text-white font-semibold">20% de desperdício</span>. 
                Transforme isso em <span className="text-emerald-300 font-bold">lucro</span>.
              </p>
            </div>
          </div>

          {/* User Image Container */}
          <div className="relative w-full flex justify-center">
             {/* Glow effect behind head */}
             <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>
             
             {/* The Image - Hosted externally */}
             <img 
               src="https://iili.io/fR9CNII.jpg" 
               alt="Allan - Gestor" 
               className="relative z-10 w-auto h-[55vh] object-cover object-top mask-image-gradient"
               style={{ 
                 maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                 WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
               }}
               onError={(e) => {
                 // Fallback if image fails to load
                 e.currentTarget.style.display = 'none';
                 e.currentTarget.parentElement!.innerHTML += '<div class="text-white text-center pb-20 opacity-50">Erro ao carregar imagem</div>';
               }}
             />
             
             {/* Gradient Overlay to blend with bottom */}
             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-950 to-transparent z-20"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-white relative">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Logo className="w-64 h-64" />
         </div>

        <div className="w-full max-w-[360px] relative z-10">
          
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center p-3 rounded-2xl bg-blue-50 mb-6 shadow-sm">
              <Logo className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Seja Bem-vindo, Allan</h1>
            <p className="text-slate-500 text-sm">Acesse o painel de controle da sua construtora.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Usuário</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center pointer-events-none border-r border-slate-100">
                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-12 pr-3 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500 transition-all outline-none placeholder-slate-400"
                    placeholder="ex: allan"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Senha</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center pointer-events-none border-r border-slate-100">
                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-3 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500 transition-all outline-none placeholder-••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 text-sm transform active:scale-[0.98] ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Acessar Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 font-medium">© 2024 Allan Obras. Gestão Inteligente.</p>
          </div>
        </div>
      </div>
    </div>
  );
};