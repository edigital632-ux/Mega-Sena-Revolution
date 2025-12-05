import React, { useState, useEffect } from 'react';
import { generateOptimizedGames } from './services/geminiService';
import { authService } from './services/authService';
import { GenerationResponse, User } from './types';
import { GameCard } from './components/GameCard';
import { StatsChart } from './components/StatsChart';
import { Auth } from './components/Auth';
import { BrainCircuit, Loader2, Dna, AlertTriangle, Clover, Database, ScanSearch, LogOut, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [data, setData] = useState<GenerationResponse | null>(null);
  const [gameCount, setGameCount] = useState<number>(3);
  const [error, setError] = useState<string | null>(null);

  // Check login on load
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Cycling loading messages
  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      const steps = [
        "Conectando à Rede Neural...",
        "Acessando Banco de Dados Histórico (1996-2025)...",
        "Verificando Combinações Repetidas...",
        "Calculando Distribuição de Quadrantes...",
        "Otimizando Probabilidade de Quadra...",
        "Finalizando Jogos..."
      ];
      let step = 0;
      interval = setInterval(() => {
        step++;
        if (step < steps.length) {
          setLoadingStep(step);
        }
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const loadingMessages = [
    "Conectando à Rede Neural...",
    "Acessando Banco de Dados Histórico...",
    "Verificando Combinações Repetidas...",
    "Calculando Distribuição de Quadrantes...",
    "Otimizando Probabilidade de Quadra...",
    "Finalizando Jogos..."
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateOptimizedGames(gameCount);
      setData(result);
    } catch (err) {
      setError("Erro ao conectar com a inteligência artificial. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setData(null);
  };

  // If not logged in, show Auth Screen
  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
               <Clover className="text-emerald-500" size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                Mega Sena Inteligente
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">
                Sistema Premium
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                <UserIcon size={14} className="text-emerald-400"/>
                <span className="truncate max-w-[100px] sm:max-w-none">{user.name}</span>
             </div>
             
             <button 
               onClick={handleLogout}
               className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-slate-800"
               title="Sair"
             >
                <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 relative">
        
        {/* Intro / Controls */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
           
          <div className="text-center mb-8 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Geração de Apostas <span className="text-emerald-400">Verificadas</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
              Olá, <span className="text-white font-semibold">{user.name}</span>. Nosso sistema utiliza IA para analisar quadrantes, 
              <span className="text-emerald-400 font-semibold mx-1 inline-flex items-center gap-1"><Database size={12}/> cruzar dados históricos</span> 
              e projetar a Quadra/Sena matematicamente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <div className="relative w-full sm:w-auto">
              <select 
                value={gameCount}
                onChange={(e) => setGameCount(Number(e.target.value))}
                className="w-full sm:w-64 appearance-none bg-slate-950 text-white pl-4 pr-10 py-3.5 rounded-xl border border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-semibold shadow-inner cursor-pointer hover:bg-slate-900"
                disabled={loading}
              >
                <option value={1}>Gerar 1 Jogo Mestre (Sena)</option>
                <option value={3}>Gerar 3 Jogos Estratégicos</option>
                <option value={6}>Gerar 6 Jogos (Fechamento)</option>
                <option value={10}>Gerar 10 Jogos (Máximo)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`
                w-full sm:w-auto group relative px-8 py-3.5 rounded-xl font-bold text-white shadow-xl transition-all duration-300 overflow-hidden
                ${loading 
                  ? 'bg-slate-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/25 active:scale-95 border border-emerald-500/20'
                }
              `}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Dna size={20} />}
                <span>{loading ? 'Processando...' : 'Gerar Jogos Inteligentes'}</span>
              </div>
              {!loading && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>}
            </button>
          </div>
          
          {loading && (
            <div className="mt-6 text-center animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-emerald-500/30">
                    <ScanSearch size={14} className="text-emerald-400 animate-pulse" />
                    <span className="text-xs sm:text-sm font-mono text-emerald-300">
                        {loadingMessages[Math.min(loadingStep, loadingMessages.length - 1)]}
                    </span>
                </div>
            </div>
          )}
        </section>

        {/* Error State */}
        {error && (
          <div className="mt-6 bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
            <AlertTriangle className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="mt-12 space-y-8 animate-slide-up">
            
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-6 border border-slate-700 shadow-lg">
               <div className="flex items-center justify-between mb-3">
                 <h3 className="text-xl font-semibold text-emerald-400 flex items-center gap-2">
                   <BrainCircuit className="text-purple-400" /> 
                   Análise Preditiva
                 </h3>
                 <span className="text-xs text-slate-500 border border-slate-700 px-2 py-1 rounded bg-slate-900">IA Gem 2.5 Flash</span>
               </div>
               <p className="text-slate-300 leading-relaxed text-sm sm:text-base border-l-2 border-emerald-500/50 pl-4">
                 {data.generalAnalysis}
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.games.map((game, idx) => (
                <GameCard key={idx} game={game} index={idx} />
              ))}
            </div>

            {/* Charts Area */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl">
               <div className="flex items-center justify-between mb-4">
                 <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Balanceamento de Quadrantes</h4>
                 <div className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-500 border border-slate-700">Analytics</div>
               </div>
               <StatsChart games={data.games} />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-800 pt-8 text-center mb-8">
          <p className="text-xs text-slate-500 max-w-2xl mx-auto">
            Mega Sena Inteligente &copy; {new Date().getFullYear()}. Sistema de uso restrito a membros cadastrados.
            <span className="block mt-2 font-bold text-slate-400">Jogue com responsabilidade.</span>
          </p>
        </footer>

      </main>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;