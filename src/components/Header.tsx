import React from 'react';
import { Zap, Cpu, Sparkles, Sliders, BatteryCharging, RefreshCw, FileCode } from 'lucide-react';
import { PresetScenario } from '../types/qcharge';

interface HeaderProps {
  scenarios: PresetScenario[];
  activeScenarioId: string;
  onSelectScenario: (scenario: PresetScenario) => void;
  chargingCapacity: number;
  onCapacityChange: (capacity: number) => void;
  isRunningPipeline: boolean;
  onRunFullPipeline: () => void;
  onViewPythonScript?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  chargingCapacity,
  onCapacityChange,
  isRunningPipeline,
  onRunFullPipeline,
  onViewPythonScript,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 backdrop-blur-md bg-slate-900/90 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <Zap className="w-6 h-6 text-white animate-pulse" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  Q-Charge
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                  Quantum QAOA + Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Quantum-Powered EV Charging Station Optimization & Smart Dispatch
              </p>
            </div>
          </div>

          {/* Controls: Preset Scenario & Capacity & Run Action */}
          <div className="flex items-center gap-3">
            {/* Scenario Picker */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400 font-medium mr-1">Scenario:</span>
              <select
                aria-label="Preset Scenarios"
                value={activeScenarioId}
                onChange={(e) => {
                  const s = scenarios.find((item) => item.id === e.target.value);
                  if (s) onSelectScenario(s);
                }}
                className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                {scenarios.map((sc) => (
                  <option key={sc.id} value={sc.id} className="bg-slate-800 text-slate-200">
                    {sc.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Station Capacity Control */}
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Station Bays
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{chargingCapacity} Plugs</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onCapacityChange(Math.max(1, chargingCapacity - 1))}
                      disabled={chargingCapacity <= 1}
                      className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white text-xs flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => onCapacityChange(Math.min(6, chargingCapacity + 1))}
                      disabled={chargingCapacity >= 6}
                      className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white text-xs flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* View Python Script (.py) */}
            <button
              type="button"
              onClick={onViewPythonScript}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 transition-colors cursor-pointer"
              title="View Python source code (qcharge_notebook.py)"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Colab .py</span>
            </button>

            {/* Run Full Pipeline Action */}
            <button
              type="button"
              onClick={onRunFullPipeline}
              disabled={isRunningPipeline}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 shadow-md shadow-cyan-500/25 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isRunningPipeline ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Solving QAOA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Run Dispatch Engine</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Engine Sub-bar Status */}
        <div className="flex items-center justify-between py-1.5 border-t border-slate-800/80 text-[11px] text-slate-400 overflow-x-auto">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">Layer 1:</span> Gemini 3.8 Flash (Structured Output)
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span className="text-slate-300 font-medium">Layer 2 & 3:</span> Python 3 Qiskit QAOA / QUBO Solver
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
              Hamiltonian: <code className="text-cyan-300">H = H_C(γ) + H_B(β)</code>
            </span>
            <span className="text-emerald-400 font-medium">● Station Grid Peak Shaving Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
