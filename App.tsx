import React, { useState } from 'react';
import { generateOptimizedGames } from './services/geminiService';
import { GenerationResponse } from './types';
import { GameCard } from './components/GameCard';
import { StatsChart } from './components/StatsChart';
import { BrainCircuit, Loader2, Dna, AlertTriangle, Clover } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GenerationResponse | null>(null);
  const [gameCount, setGameCount] = useState<number>(3);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateOptimizedGames(gameCount);
      setData(result);
    } catch (err) {
      setError("Erro ao conectar com a inteligência artificial. Verifique sua chave API ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
               <Clover className="text-emerald-500" size={28} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                MegaSena AI Revolution
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">Sistema Preditivo & Verificador Histórico</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
             <BrainCircuit size={16} className="text-purple-400" />
             <span className="text-xs font-semibold text-slate-300">v3.0 Quantum Logic</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* Intro / Controls */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">Geração Inteligente de Apostas</h2>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
              Este sistema revolucionário analisa quadrantes, <span className="text-emerald-400 font-semibold">verifica histórico para não repetir a Sena</span> e projeta combinações futuras visando garantir matematicamente a Quadra.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative">
              <select 
                value={gameCount}
                onChange={(e) => setGameCount(Number(e.target.value))}
                className="appearance-none bg-slate-950 text-white pl-4 pr-10 py-3 rounded-xl border border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-semibold"
                disabled={loading}
              >
                <option value={1}>Gerar 1 Jogo Mestre</option>
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
                group relative px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300
                ${loading 
                  ? 'bg-slate-700 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/25 active:scale-95'
                }
              `}
            >
              <div className="flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <Dna />}
                <span>{loading ? 'Analisando Futuro...' : 'Gerar Jogos Revolucionários'}</span>
              </div>
            </button>
          </div>
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
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
               <h3 className="text-xl font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                 <BrainCircuit className="text-purple-400" /> 
                 Análise Preditiva da IA
               </h3>
               <p className="text-slate-300 leading-relaxed">
                 {data.generalAnalysis}
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.games.map((game, idx) => (
                <GameCard key={idx} game={game} index={idx} />
              ))}
            </div>

            {/* Charts Area */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
               <StatsChart games={data.games} />
            </div>
          </div>
        )}

        {/* Footer Disclaimer */}
        <footer className="mt-16 border-t border-slate-800 pt-8 text-center">
          <p className="text-xs text-slate-500 max-w-2xl mx-auto">
            Aviso Legal: Este aplicativo utiliza inteligência artificial avançada para maximizar probabilidades. 
            Embora projetado para garantir a Quadra através de lógica matemática rigorosa, sorteios são eventos estocásticos. 
            <span className="font-bold text-slate-400">Jogue com responsabilidade.</span>
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