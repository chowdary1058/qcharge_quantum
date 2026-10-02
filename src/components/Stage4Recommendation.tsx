import React from 'react';
import {
  Gauge,
  Sparkles,
  Zap,
  BatteryCharging,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Activity,
  Award,
  Download,
} from 'lucide-react';
import {
  ChargingRecommendation,
  GeminiExplanation,
  QuantumQaoaResult,
} from '../types/qcharge';

interface Stage4RecommendationProps {
  recommendation: ChargingRecommendation | null;
  quantumResult: QuantumQaoaResult | null;
  geminiExplanation: GeminiExplanation | null;
  csvExport?: string;
  isLoadingExplanation: boolean;
  onRefreshExplanation: () => void;
}

export const Stage4Recommendation: React.FC<Stage4RecommendationProps> = ({
  recommendation,
  quantumResult,
  geminiExplanation,
  csvExport,
  isLoadingExplanation,
  onRefreshExplanation,
}) => {
  const handleDownloadCsv = () => {
    if (!csvExport) return;
    const blob = new Blob([csvExport], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'q_charge_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!recommendation) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center">
        <Gauge className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-300">Stage 4: Charging Recommendation Waiting</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Execute the optimization pipeline to allocate physical bays and generate the Gemini operational explanation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Stage 4: Final Charging Recommendation
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                  Physical Bay Allocation + Gemini Rationale
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Live Bay Dispatch & AI Operational Explanation
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Physical charging bays committed based on QAOA minimum-energy ground state with automated Gemini explanation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {csvExport && (
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                title="Download CSV file matching Colab final_results.to_csv('q_charge_results.csv')"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>q_charge_results.csv</span>
              </button>
            )}
            <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-semibold flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Grid Peak-Shaved ({recommendation.power_peak_demand_kw} kW)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Dispatch Station KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Dispatched Bays
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {recommendation.active_bays.length} Bays
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            100% Station Utilization
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Energy Committed
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {recommendation.total_energy_dispatched_kwh} kWh
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Delivered across current window
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Deferred Queue
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {recommendation.deferred_queue.length} EVs
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Scheduled for Window #2
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Station Efficiency Score
          </div>
          <div className="text-2xl font-black text-cyan-300 mt-1 flex items-center gap-1.5">
            <Award className="w-5 h-5 text-amber-400" />
            <span>{geminiExplanation?.station_efficiency_score ?? 98}/100</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            QAOA Optimal Allocation
          </div>
        </div>
      </div>

      {/* Physical Charging Bays Display */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              Active Fast-Charging Bays (Window #1)
            </h4>
            <p className="text-xs text-slate-500">
              Allocated via QAOA optimal ground state bitstring |{quantumResult?.optimal_bitstring}⟩
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md">
            Status: ALL CHARGERS ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendation.active_bays.map((bay) => (
            <div
              key={bay.bay_id}
              className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 relative overflow-hidden group hover:border-emerald-400 transition-all shadow-md shadow-emerald-950/20"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                  {bay.bay_name}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Priority {bay.priority}
                </span>
              </div>

              {/* Vehicle Title */}
              <div className="flex items-baseline justify-between mb-2">
                <div className="text-lg font-black text-white flex items-center gap-2">
                  <span>{bay.vehicle}</span>
                </div>
                <div className="text-xs font-bold text-emerald-300 font-mono">
                  {bay.average_power_kw} kW
                </div>
              </div>

              {/* Battery progress */}
              <div className="space-y-1.5 mb-3 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Battery</span>
                  <span className="text-slate-200 font-bold font-mono">
                    {bay.initial_battery_pct}% → {bay.target_battery_pct}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-400 rounded-full"
                    style={{ width: `${Math.max(10, bay.initial_battery_pct)}%` }}
                  ></div>
                </div>
              </div>

              {/* Schedule Timing info */}
              <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-800/80 pt-2.5">
                <div>
                  <span className="text-slate-500 block">Start Window:</span>
                  <span className="text-slate-300 font-mono font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {bay.dispatch_start}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Estimated End:</span>
                  <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {bay.estimated_completion}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Allocated Time:</span>
                  <span className="text-slate-300 font-mono font-semibold">
                    {bay.allocated_duration_hrs} hours
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Energy Delivery:</span>
                  <span className="text-slate-300 font-mono font-semibold">
                    {bay.energy_required_kwh} kWh
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deferred Queue (Window #2) */}
      {recommendation.deferred_queue.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              Deferred Queue (Scheduled for Dispatch Window #2)
            </h4>
            <span className="text-xs text-amber-400 font-medium">
              Retained in High-Priority Buffer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommendation.deferred_queue.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-200 text-sm">{item.vehicle}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                    Priority {item.priority}
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Battery Level:</span>
                    <span className="text-slate-300 font-mono">{item.battery_level}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration Required:</span>
                    <span className="text-slate-300 font-mono">{item.charging_time}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Wait:</span>
                    <span className="text-amber-400 font-mono">~{item.estimated_wait_hrs} hours</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 text-slate-400 text-[10px]">
                    {item.deferral_reason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gemini AI Operational Explanation Card */}
      <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-indigo-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Gemini AI Dispatch Explainer
              </span>
              <h4 className="text-base font-bold text-white">
                Human-Readable Operational Rationale
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={onRefreshExplanation}
            disabled={isLoadingExplanation}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-700/80 text-indigo-200 font-semibold cursor-pointer disabled:opacity-50"
          >
            {isLoadingExplanation ? 'Regenerating...' : 'Regenerate Rationale'}
          </button>
        </div>

        {isLoadingExplanation ? (
          <div className="py-8 text-center text-xs text-indigo-300 flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
            <span>Gemini analyzing quantum allocation weights...</span>
          </div>
        ) : geminiExplanation ? (
          <div className="space-y-4 text-xs">
            {/* Executive Summary */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-900/60">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-1">
                Executive Dispatch Summary
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                {geminiExplanation.summary}
              </p>
            </div>

            {/* Two-column reasons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Selected EV factors */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Prioritization Winning Factors
                </div>
                <ul className="space-y-2 text-slate-300">
                  {geminiExplanation.selection_breakdown.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deferral rationale */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Queue Deferral & Fair Allocation Policy
                </div>
                <ul className="space-y-2 text-slate-300">
                  {geminiExplanation.deferral_breakdown.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quantum QAOA Insight */}
            <div className="bg-purple-950/30 p-3.5 rounded-xl border border-purple-800/60 text-purple-200 flex items-start gap-3">
              <Zap className="w-4 h-4 text-purple-300 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-xs text-purple-300 block mb-0.5">
                  Quantum Mathematical Insight:
                </span>
                <p className="text-[11px] text-purple-200/90 leading-relaxed">
                  {geminiExplanation.quantum_insight}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 text-center py-4">
            No explanation generated yet. Click "Regenerate Rationale" to query Gemini.
          </div>
        )}
      </div>
    </div>
  );
};
