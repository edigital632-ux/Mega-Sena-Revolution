import React from 'react';
import { LotteryGame } from '../types';
import { Ball } from './Ball';
import { TrendingUp, Activity, Grid, ShieldCheck } from 'lucide-react';

interface GameCardProps {
  game: LotteryGame;
  index: number;
}

export const GameCard: React.FC<GameCardProps> = ({ game, index }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl hover:border-emerald-500/50 transition-colors duration-300 relative overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-emerald-400 font-bold text-lg tracking-wider">JOGO #{index + 1}</h3>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
            <Activity size={14} className="text-blue-400" />
            <span className="text-xs font-mono text-slate-300">Score: {game.probabilityScore}%</span>
          </div>
          {game.historicalCheck && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-900/30 border border-emerald-500/30">
              <ShieldCheck size={10} className="text-emerald-400" />
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wide">Histórico OK</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-6 relative z-10">
        {game.numbers.map((num, i) => (
          <Ball key={i} number={num} delay={i * 100} />
        ))}
      </div>

      <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg border border-slate-800 relative z-10">
        <div className="flex items-start gap-2">
          <TrendingUp size={18} className="text-emerald-500 mt-1 shrink-0" />
          <p className="text-sm text-slate-300 italic">"{game.reasoning}"</p>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Grid size={16} className="text-purple-400 shrink-0" />
          <div className="text-xs text-slate-400 flex gap-4 w-full">
             <span title="Quadrante 1">Q1: <b className="text-white">{game.quadrantAnalysis.q1}</b></span>
             <span title="Quadrante 2">Q2: <b className="text-white">{game.quadrantAnalysis.q2}</b></span>
             <span title="Quadrante 3">Q3: <b className="text-white">{game.quadrantAnalysis.q3}</b></span>
             <span title="Quadrante 4">Q4: <b className="text-white">{game.quadrantAnalysis.q4}</b></span>
          </div>
        </div>
      </div>
    </div>
  );
};