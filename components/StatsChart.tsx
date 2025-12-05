import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LotteryGame, StatPoint } from '../types';

interface StatsChartProps {
  games: LotteryGame[];
}

export const StatsChart: React.FC<StatsChartProps> = ({ games }) => {
  // Aggregate quadrant data
  const data: StatPoint[] = [
    { name: 'Q1', value: 0 },
    { name: 'Q2', value: 0 },
    { name: 'Q3', value: 0 },
    { name: 'Q4', value: 0 },
  ];

  games.forEach(game => {
    data[0].value += game.quadrantAnalysis.q1;
    data[1].value += game.quadrantAnalysis.q2;
    data[2].value += game.quadrantAnalysis.q3;
    data[3].value += game.quadrantAnalysis.q4;
  });

  const colors = ['#34d399', '#60a5fa', '#a78bfa', '#f472b6'];

  return (
    <div className="w-full h-64 mt-6">
      <h4 className="text-center text-sm font-semibold text-slate-400 mb-2">Distribuição Global por Quadrante</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} />
          <YAxis stroke="#64748b" tick={{fill: '#94a3b8'}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            cursor={{fill: 'rgba(255,255,255,0.05)'}}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % 20]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
