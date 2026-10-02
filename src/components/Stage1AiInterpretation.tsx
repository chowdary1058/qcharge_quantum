import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit3,
  Code2,
  Table as TableIcon,
  Send,
  Zap,
} from 'lucide-react';
import { EvInputPayload, ValidationReport, Vehicle } from '../types/qcharge';

interface Stage1AiInterpretationProps {
  naturalPrompt: string;
  onPromptChange: (text: string) => void;
  onParseWithAi: () => void;
  isParsing: boolean;
  evData: EvInputPayload;
  onUpdateEvData: (data: EvInputPayload) => void;
  validationReport: ValidationReport | null;
  onProceedToQuantum: () => void;
}

export const Stage1AiInterpretation: React.FC<Stage1AiInterpretationProps> = ({
  naturalPrompt,
  onPromptChange,
  onParseWithAi,
  isParsing,
  evData,
  onUpdateEvData,
  validationReport,
  onProceedToQuantum,
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'table'>('table');
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(evData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddVehicle = () => {
    const nextIdx = evData.vehicles.length + 1;
    const newVehicle: Vehicle = {
      vehicle: `EV${nextIdx}`,
      battery_level: 25,
      charging_time: 2,
      priority: 3,
    };
    onUpdateEvData({
      ...evData,
      vehicles: [...evData.vehicles, newVehicle],
    });
  };

  const handleRemoveVehicle = (index: number) => {
    const updated = evData.vehicles.filter((_, i) => i !== index);
    onUpdateEvData({
      ...evData,
      vehicles: updated,
    });
  };

  const handleVehicleFieldChange = (
    index: number,
    field: keyof Vehicle,
    value: string | number
  ) => {
    const updated = [...evData.vehicles];
    const target = { ...updated[index] };

    if (field === 'vehicle') {
      target.vehicle = String(value);
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        if (field === 'battery_level') target.battery_level = Math.min(100, Math.max(0, num));
        if (field === 'charging_time') target.charging_time = Math.max(0.1, num);
        if (field === 'priority') target.priority = Math.min(5, Math.max(1, Math.round(num)));
      }
    }

    updated[index] = target;
    onUpdateEvData({
      ...evData,
      vehicles: updated,
    });
  };

  // Sample quick test buttons for users to see AI handling edge cases
  const sampleTestPrompts = [
    {
      label: 'Standard Queue (4 EVs)',
      text: 'Arrival queue: EV1 has 25% battery, needs 2 hours, priority 3. EV2 has 15% battery, needs 3 hours, priority 5. EV3 has 70% battery, needs 1 hour, priority 2. EV4 has 40% battery, needs 2 hours, priority 4. Available charging bays: 2.',
    },
    {
      label: 'Validation Test (Missing values)',
      text: 'Queue: Delivery Van (needs 90 mins, battery level is only 14%, very high priority 5). Green Taxi has 85% battery, needs 45 minutes, priority 1. Station has 2 plugs.',
    },
    {
      label: 'Edge Case (Extreme Out-of-bounds)',
      text: 'Car A has -10% battery (sensor error), needs 2 hours charging, priority 6. Car B has 120% battery, needs 0 hours, priority 0. Capacity is 1.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stage Explainer Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Stage 1: AI Interpretation Layer
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300">
                  Separated from Quantum Optimization
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Natural Language to Structured JSON & EV Validation
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gemini extracts Vehicle ID, Battery %, Charging Duration, Priority (1-5), and Station Bay Capacity without running quantum logic.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onProceedToQuantum}
              disabled={isParsing || evData.vehicles.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-900/30 disabled:opacity-50 cursor-pointer"
            >
              <span>Send Structured JSON to Quantum Backend</span>
              <Zap className="w-4 h-4 text-cyan-200" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Natural Language Input & Controls (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  Natural-Language Driver / Fleet Input
                </label>
                <span className="text-[11px] text-slate-400">
                  Enter EV status in plain English
                </span>
              </div>

              {/* Textarea */}
              <textarea
                rows={5}
                value={naturalPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="e.g., We have 4 vehicles: EV1 with 25% battery needing 2 hours (priority 3), EV2 with 15% battery needing 3 hours (priority 5)..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none font-sans"
              />

              {/* Quick Preset Prompts */}
              <div className="mt-3">
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                  Try Test Scenarios:
                </div>
                <div className="flex flex-wrap gap-2">
                  {sampleTestPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onPromptChange(p.text);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Action Button */}
            <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Gemini 3.8 Flash Schema Engine
              </span>
              <button
                type="button"
                onClick={onParseWithAi}
                disabled={isParsing || !naturalPrompt.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-md shadow-amber-950/40 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isParsing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Gemini Interpreting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Interpret Input via Gemini</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Output, Validation Report & Interactive Editor (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            {/* Tab switch & Actions */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'table'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white bg-slate-800/50'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>EV Queue Table ({evData.vehicles.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('json')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'json'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white bg-slate-800/50'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Structured JSON</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeTab === 'table' && (
                  <button
                    type="button"
                    onClick={handleAddVehicle}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Add EV</span>
                  </button>
                )}
                {activeTab === 'json' && (
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Validation Feedback Banner */}
            {validationReport && (
              <div
                className={`mb-4 p-3 rounded-xl border text-xs ${
                  validationReport.isValid
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {validationReport.isValid ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Input Schema Validated</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Validation Errors Detected</span>
                    </>
                  )}
                </div>

                {validationReport.errors.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-rose-300">
                    {validationReport.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}

                {validationReport.warnings.length > 0 && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-amber-300 space-y-0.5">
                    <div className="font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      <span>Sanitization Notes:</span>
                    </div>
                    {validationReport.warnings.map((w, i) => (
                      <div key={i} className="pl-4 text-[11px] text-amber-200/90">
                        • {w}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 1: Interactive Table View */}
            {activeTab === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Vehicle ID</th>
                      <th className="py-2.5 px-3">Battery %</th>
                      <th className="py-2.5 px-3">Charge Time (h)</th>
                      <th className="py-2.5 px-3">Priority (1-5)</th>
                      <th className="py-2.5 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {evData.vehicles.map((ev, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={ev.vehicle}
                            onChange={(e) => handleVehicleFieldChange(idx, 'vehicle', e.target.value)}
                            className="w-24 bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-slate-200 font-bold focus:outline-none focus:border-amber-400"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={ev.battery_level}
                              onChange={(e) => handleVehicleFieldChange(idx, 'battery_level', e.target.value)}
                              className="w-16 bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-amber-400"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              step="0.5"
                              min={0.1}
                              max={24}
                              value={ev.charging_time}
                              onChange={(e) => handleVehicleFieldChange(idx, 'charging_time', e.target.value)}
                              className="w-16 bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-amber-400"
                            />
                            <span className="text-slate-400">h</span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={ev.priority}
                            onChange={(e) => handleVehicleFieldChange(idx, 'priority', e.target.value)}
                            className="bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-slate-200 font-semibold focus:outline-none focus:border-amber-400"
                          >
                            <option value={1}>1 - Low / Leisure</option>
                            <option value={2}>2 - Standard Commuter</option>
                            <option value={3}>3 - Normal Queue</option>
                            <option value={4}>4 - High Commercial</option>
                            <option value={5}>5 - Urgent / Critical</option>
                          </select>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveVehicle(idx)}
                            disabled={evData.vehicles.length <= 1}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 disabled:opacity-20 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 2: Raw Structured JSON Output */}
            {activeTab === 'json' && (
              <div className="relative">
                <pre className="bg-slate-950 p-4 rounded-xl text-xs text-amber-300 font-mono overflow-x-auto max-h-72 border border-slate-800">
                  {JSON.stringify(evData, null, 2)}
                </pre>
              </div>
            )}

            {/* Capacity footer */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Payload ready for Python Backend: <strong className="text-slate-200">{evData.vehicles.length} EVs</strong>
              </span>
              <span>
                Target Capacity: <strong className="text-emerald-400">{evData.charging_capacity} bays</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
