import React from 'react';
import { Binary, Clock, CheckCircle2, TrendingUp, Cpu, ArrowRight } from 'lucide-react';
import { ClassicalResult, Vehicle } from '../types/qcharge';

interface Stage2ClassicalProps {
  classicalResult: ClassicalResult | null;
  vehicles: Vehicle[];
  capacity: number;
  onProceedToQuantum: () => void;
}

export const Stage2Classical: React.FC<Stage2ClassicalProps> = ({
  classicalResult,
  vehicles,
  capacity,
  onProceedToQuantum,
}) => {
  if (!classicalResult) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center">
        <Binary className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-300">Stage 2: Classical Optimization Waiting</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Execute the optimization pipeline to view the deterministic classical baseline solver results.
        </p>
      </div>
    );
  }

  const selectedSet = new Set(classicalResult.selected_evs);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Stage 2: Classical Benchmark
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300">
                  Exact Integer Search / Knapsack
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Deterministic Combinatorial State-Space Baseline
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Exhaustively evaluates 2^{vehicles.length} binary assignment states to find the classical global optimum.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onProceedToQuantum}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/30 cursor-pointer"
          >
            <span>Inspect Quantum QAOA Solver</span>
            <ArrowRight className="w-4 h-4 text-purple-200" />
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Selected Vehicles
          </div>
          <div className="text-xl font-black text-blue-400 mt-1">
            {classicalResult.selected_evs.join(', ')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {classicalResult.selected_evs.length} of {vehicles.length} queued
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Objective Utility
          </div>
          <div className="text-xl font-black text-white mt-1">
            {classicalResult.objective_value.toFixed(2)}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Maximized priority & urgency
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Optimal Bitstring
          </div>
          <div className="text-xl font-mono font-black text-cyan-300 mt-1">
            |{classicalResult.optimal_bitstring}⟩
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Binary allocation vector
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Classical Search Time
          </div>
          <div className="text-xl font-black text-white mt-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{classicalResult.execution_time_ms} ms</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {classicalResult.evaluations_count} states evaluated
          </div>
        </div>
      </div>

      {/* EV Allocation Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Classical Selection Outcome per Vehicle
          </h4>
          <span className="text-xs text-slate-400">
            Station Limit: {capacity} simultaneous chargers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Battery %</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Bit Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {vehicles.map((v, i) => {
                const isSelected = selectedSet.has(v.vehicle);
                return (
                  <tr
                    key={i}
                    className={`transition-colors ${
                      isSelected ? 'bg-blue-950/20 text-blue-200' : 'hover:bg-slate-800/30 text-slate-400'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-blue-400" />
                      <span>{v.vehicle}</span>
                    </td>
                    <td className="py-2.5 px-3">{v.battery_level}%</td>
                    <td className="py-2.5 px-3">{v.charging_time}h</td>
                    <td className="py-2.5 px-3">Level {v.priority}</td>
                    <td className="py-2.5 px-3">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/60 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-blue-400" />
                          SELECTED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
                          DEFERRED
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-sm">
                      {isSelected ? <span className="text-cyan-400">1</span> : <span className="text-slate-600">0</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Scaling note */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200 font-semibold">Combinatorial Complexity Insight:</strong> Classical brute-force or integer programming scales exponentially as <code className="text-blue-300">O(2^N)</code>. While fast for {vehicles.length} EVs ({1 << vehicles.length} states), a metropolitan grid with 100 queued EVs has <code className="text-blue-300">1.26 × 10^30</code> permutations — which takes classical supercomputers centuries, motivating quantum QAOA's polynomial parameter optimization.
        </div>
      </div>
    </div>
  );
};
