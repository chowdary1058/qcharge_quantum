import React from 'react';
import { Sparkles, Binary, Atom, CheckCircle2, ChevronRight, Gauge } from 'lucide-react';

export type PipelineStage = 'stage1_ai' | 'stage2_classical' | 'stage3_quantum' | 'stage4_recommendation';

interface PipelineStepsProps {
  currentStage: PipelineStage;
  completedStages: Record<PipelineStage, boolean>;
  onSelectStage: (stage: PipelineStage) => void;
  isProcessing: boolean;
}

export const PipelineSteps: React.FC<PipelineStepsProps> = ({
  currentStage,
  completedStages,
  onSelectStage,
  isProcessing,
}) => {
  const steps: {
    id: PipelineStage;
    number: number;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    badge: string;
    accentColor: string;
  }[] = [
    {
      id: 'stage1_ai',
      number: 1,
      title: 'AI Interpretation',
      subtitle: 'Natural language → Structured JSON',
      icon: <Sparkles className="w-5 h-5" />,
      badge: 'Gemini 3.8 Flash',
      accentColor: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300',
    },
    {
      id: 'stage2_classical',
      number: 2,
      title: 'Classical Optimization',
      subtitle: 'Integer search & state-space baseline',
      icon: <Binary className="w-5 h-5" />,
      badge: 'Deterministic Exact',
      accentColor: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-300',
    },
    {
      id: 'stage3_quantum',
      number: 3,
      title: 'Quantum QAOA Optimization',
      subtitle: 'QUBO matrix → Ising Hamiltonian',
      icon: <Atom className="w-5 h-5" />,
      badge: 'Qiskit QAOA Simulator',
      accentColor: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-300',
    },
    {
      id: 'stage4_recommendation',
      number: 4,
      title: 'Charging Recommendation',
      subtitle: 'Bay allocation & Gemini operational rationale',
      icon: <Gauge className="w-5 h-5" />,
      badge: 'Smart Grid Dispatch',
      accentColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Optimization Execution Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Strict separation between AI perception, classical baseline, quantum QUBO ansatz, and physical bay dispatch.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isProcessing && (
            <span className="flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2.5 py-1 rounded-full animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              Executing Pipeline...
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const isCurrent = currentStage === step.id;
          const isDone = completedStages[step.id];

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStage(step.id)}
              className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group cursor-pointer ${
                isCurrent
                  ? `bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-950 ring-1 ring-cyan-500/50`
                  : isDone
                  ? `bg-slate-900/60 border-slate-700/80 hover:bg-slate-800/50 hover:border-slate-600`
                  : `bg-slate-900/30 border-slate-800/60 opacity-70 hover:opacity-100`
              }`}
            >
              {/* Header inside step card */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : isCurrent
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.number}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Stage {step.number}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {step.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                <span className={isCurrent ? 'text-cyan-400' : 'text-slate-400'}>
                  {step.icon}
                </span>
                <span className="truncate">{step.title}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {step.subtitle}
              </p>

              {/* Active indicator bar */}
              {isCurrent && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
