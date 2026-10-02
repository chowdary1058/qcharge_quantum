import React, { useState } from 'react';
import {
  Atom,
  Cpu,
  Layers,
  BarChart3,
  Code2,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import {
  QuboFormulation,
  QuantumQaoaResult,
  Vehicle,
} from '../types/qcharge';

interface Stage3QuantumQAOAProps {
  quboData: QuboFormulation | null;
  quantumResult: QuantumQaoaResult | null;
  vehicles: Vehicle[];
  capacity: number;
  onProceedToRecommendation: () => void;
}

export const Stage3QuantumQAOA: React.FC<Stage3QuantumQAOAProps> = ({
  quboData,
  quantumResult,
  vehicles,
  capacity,
  onProceedToRecommendation,
}) => {
  const [activeTab, setActiveTab] = useState<'distribution' | 'qubo' | 'circuit' | 'qiskit'>('distribution');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!quantumResult || !quboData) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center">
        <Atom className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-spin" />
        <h3 className="text-lg font-bold text-slate-300">Stage 3: Quantum QAOA Solver Waiting</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Send the structured JSON from Stage 1 to the Python backend to formulate the QUBO and execute QAOA.
        </p>
      </div>
    );
  }

  const handleCopyQiskitCode = () => {
    navigator.clipboard.writeText(quantumResult.qiskit_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const maxProb = Math.max(...quantumResult.top_states.map((s) => s.probability), 0.01);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Stage 3: Quantum QAOA Optimization Layer
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300">
                  Python Backend + Qiskit Simulator
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                QUBO Formulation & Variational Quantum Circuit
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Maps EV constraints into Ising spin Hamiltonian H_C, evolves statevector under p={quantumResult.qaoa_depth_p} QAOA alternating layers, and samples minimum energy eigenstate.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onProceedToRecommendation}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-900/30 cursor-pointer"
          >
            <span>View Final Charging Schedule</span>
            <ArrowRight className="w-4 h-4 text-emerald-200" />
          </button>
        </div>
      </div>

      {/* Quantum Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            QAOA Selected EVs
          </div>
          <div className="text-xl font-black text-purple-400 mt-1">
            {quantumResult.selected_evs.join(', ')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Bitstring: <code className="text-cyan-300 font-bold">|{quantumResult.optimal_bitstring}⟩</code>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Optimization Status
          </div>
          <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{quantumResult.status}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            QUBO Energy: {quantumResult.qubo_energy}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Statevector Fidelity
          </div>
          <div className="text-xl font-black text-white mt-1">
            {(quantumResult.quantum_fidelity * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-purple-400 mt-0.5">
            Ground state overlap prob
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Circuit Depth & Qubits
          </div>
          <div className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <span>p = {quantumResult.qaoa_depth_p}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {quantumResult.qubit_count} Qubits
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {quantumResult.two_qubit_entangling_gates} Entangling CNOT/RZZ Gates
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('distribution')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'distribution'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Quantum State Probabilities</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qubo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'qubo'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-800/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>QUBO Matrix (Q_ij)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('circuit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'circuit'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>QAOA Circuit Diagram</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qiskit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'qiskit'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-800/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Qiskit 1.x Python Code</span>
            </button>
          </div>

          {activeTab === 'qiskit' && (
            <button
              type="button"
              onClick={handleCopyQiskitCode}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Qiskit Code'}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Quantum Measurement State Histogram */}
        {activeTab === 'distribution' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Top Measurement Basis States <code className="text-purple-300">|x_{vehicles.length-1}...x_0⟩</code> sampled across 1024 shots
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Target Bay Capacity: {capacity} EVs
              </span>
            </div>

            <div className="space-y-2">
              {quantumResult.top_states.map((state, idx) => {
                const isOptimal = state.bitstring === quantumResult.optimal_bitstring;
                const barWidth = Math.max(5, (state.probability / maxProb) * 100);

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isOptimal
                        ? 'bg-purple-950/40 border-purple-500/60 shadow-md shadow-purple-950'
                        : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2 font-mono">
                        <span
                          className={`font-black text-sm px-2 py-0.5 rounded ${
                            isOptimal
                              ? 'bg-purple-600 text-white font-extrabold ring-1 ring-purple-400'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          |{state.bitstring}⟩
                        </span>
                        {isOptimal && (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                            ★ OPTIMAL GROUND STATE
                          </span>
                        )}
                        <span className="text-slate-400">
                          ({state.selected_count} EVs active: {
                            vehicles
                              .filter((_, i) => state.bitstring[i] === '1')
                              .map((v) => v.vehicle)
                              .join(', ') || 'None'
                          })
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-slate-400">QUBO E: {state.energy}</span>
                        <span className="font-bold text-purple-300">
                          {(state.probability * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    {/* Bar graphic */}
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOptimal
                            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: QUBO Matrix Q_ij Heatmap */}
        {activeTab === 'qubo' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <div className="font-mono text-cyan-300 font-bold mb-1">
                {quboData.hamiltonian_description}
              </div>
              <p className="text-slate-400">
                Diagonal values <code className="text-amber-300">Q_ii</code> reward high utility (priority & battery urgency) and penalize violation of capacity C={capacity}. Off-diagonal values <code className="text-purple-300">Q_ij = 2P</code> encode mutual exclusion constraints with penalty multiplier P = {quboData.penalty_multiplier}.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-2 text-slate-500"></th>
                    {quboData.variable_mapping.map((v, i) => (
                      <th key={i} className="p-2 text-cyan-400 font-bold bg-slate-950/60 border border-slate-800">
                        {v}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quboData.matrix_Q.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 text-cyan-400 font-bold bg-slate-950/60 border border-slate-800">
                        {quboData.variable_mapping[i]}
                      </td>
                      {row.map((val, j) => {
                        const isDiag = i === j;
                        return (
                          <td
                            key={j}
                            className={`p-2.5 border border-slate-800 font-bold ${
                              isDiag
                                ? 'bg-amber-950/30 text-amber-300'
                                : 'bg-purple-950/20 text-purple-300'
                            }`}
                          >
                            {val.toFixed(1)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: ASCII Circuit Diagram */}
        {activeTab === 'circuit' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>
                Variational Circuit with Hadamards [H], Problem Unitaries [e^(-iγ H_C)], and Mixer Rotations [R_x(2β)]
              </span>
              <span className="font-mono text-purple-300">
                γ* = [{quantumResult.optimal_gamma.join(', ')}], β* = [{quantumResult.optimal_beta.join(', ')}]
              </span>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl text-xs text-cyan-300 font-mono overflow-x-auto border border-slate-800 leading-relaxed">
              {quantumResult.circuit_ascii}
            </pre>
          </div>
        )}

        {/* Tab 4: Qiskit 1.x Code */}
        {activeTab === 'qiskit' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400">
              Executable code compatible with IBM Quantum Qiskit 1.x and Qiskit Optimization MinimumEigenOptimizer:
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl text-xs text-emerald-300 font-mono overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
              {quantumResult.qiskit_code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
