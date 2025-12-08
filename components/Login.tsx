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
      {/* Left Side - Visual (Engineering/Construction Theme) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-950 items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-blue-900/95 to-slate-900/90" />
        
        {/* Content */}
        <div className="relative z-10 p-16 max-w-xl text-white">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
             <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Gestão 2.0</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
            Gestão de obras <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">sem complicações</span>.
          </h2>
          
          <p className="text-slate-300 text-sm mb-10 leading-relaxed max-w-md">
            Tenha controle total sobre custos, prazos e materiais em um único lugar. Simples, rápido e eficiente.
          </p>
          
          <div className="space-y-4 mb-12">
            {[
              "Controle Financeiro em Tempo Real",
              "Relatórios Automatizados",
              "Gestão de Materiais e Mão de Obra"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>

          {/* Gatilho Mental / Social Proof Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-start gap-4 hover:bg-white/15 transition-colors cursor-default transform hover:-translate-y-1 duration-300">
            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-lg mb-1">Pare de perder dinheiro.</p>
              <p className="text-slate-300 text-xs leading-relaxed max-w-xs">
                Obras sem gestão têm <span className="text-white font-semibold">20% de desperdício</span> médio de materiais.
                Transforme esse prejuízo em <span className="text-emerald-300 font-bold">lucro líquido</span> agora.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-[380px]">
          
          <div className="text-center mb-10">
            <div className="inline-flex justify-center items-center p-3 rounded-2xl bg-blue-50 mb-6">
              <Logo className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Seja Bem vindo Allan</h1>
            <p className="text-slate-500 text-sm">Entre com suas credenciais para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Usuário</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none placeholder-slate-400"
                    placeholder="Digite seu usuário"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Senha</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none placeholder-slate-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400">© 2024 Allan Obras. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};