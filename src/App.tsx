/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PipelineSteps, PipelineStage } from './components/PipelineSteps';
import { Stage1AiInterpretation } from './components/Stage1AiInterpretation';
import { Stage2Classical } from './components/Stage2Classical';
import { Stage3QuantumQAOA } from './components/Stage3QuantumQAOA';
import { Stage4Recommendation } from './components/Stage4Recommendation';
import {
  EvInputPayload,
  ValidationReport,
  FullSolverResponse,
  GeminiExplanation,
  PresetScenario,
} from './types/qcharge';
import {
  Sparkles,
  Zap,
  Cpu,
  BarChart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import { PythonScriptModal } from './components/PythonScriptModal';

const DEFAULT_SCENARIOS: PresetScenario[] = [
  {
    id: 'colab-benchmark',
    title: 'Qcharge Colab Notebook (EV1-EV4, 2 Bays)',
    description: 'The exact 4-EV problem from Qcharge.ipynb Colab notebook. Minimizes priority cost to select EV2 & EV3 with objective 3.0.',
    natural_prompt:
      'Q-Charge Colab baseline queue: EV1 has 25% battery, needs 2 hours charging, priority 3. EV2 has 40% battery, needs 1 hour, priority 2. EV3 has 60% battery, needs 1 hour, priority 1. EV4 has 20% battery, needs 3 hours, priority 3. Station charging capacity is 2 bays.',
    data: {
      vehicles: [
        { vehicle: 'EV1', battery_level: 25, charging_time: 2, priority: 3 },
        { vehicle: 'EV2', battery_level: 40, charging_time: 1, priority: 2 },
        { vehicle: 'EV3', battery_level: 60, charging_time: 1, priority: 1 },
        { vehicle: 'EV4', battery_level: 20, charging_time: 3, priority: 3 },
      ],
      charging_capacity: 2,
    },
  },
  {
    id: 'emergency-fleet',
    title: 'Emergency Medical & Commuter Mix (4 EVs, 2 Bays)',
    description: '4 incoming vehicles competing for 2 fast-charging stalls with urgent medical transport.',
    natural_prompt:
      'We have 4 vehicles arriving at Metro Hub: EV1 (Emergency Medical Courier) has 12% battery, needs 2 hours charging, priority 5. EV2 (Rideshare Taxi) is at 45% battery, needs 1 hour, priority 3. EV3 (Daily Commuter) has 75% battery, needs 2 hours, priority 2. EV4 (Airport Express Shuttle) is at 20% battery, needs 3 hours, priority 4. The station has 2 charging ports.',
    data: {
      vehicles: [
        { vehicle: 'EV1 (Medical Van)', battery_level: 12, charging_time: 2, priority: 5 },
        { vehicle: 'EV2 (Rideshare)', battery_level: 45, charging_time: 1, priority: 3 },
        { vehicle: 'EV3 (Commuter)', battery_level: 75, charging_time: 2, priority: 2 },
        { vehicle: 'EV4 (Airport Shuttle)', battery_level: 20, charging_time: 3, priority: 4 },
      ],
      charging_capacity: 2,
    },
  },
  {
    id: 'highway-corridor',
    title: 'Highway Superhub Peak Hour (5 EVs, 2 Bays)',
    description: '5 long-range EVs queued with varying state of charge and 2 ultra-fast bays available.',
    natural_prompt:
      'Highway Superhub: 5 cars in queue for 2 ultra-fast bays. Tesla Model 3 (EV1) has 18% battery left, needs 1.5 hours, priority 4. Ford Lightning (EV2) has 35% battery, needs 2.5 hours, priority 3. Chevy Bolt (EV3) is critically low at 8% battery, needs 2 hours, urgent priority 5. Hyundai Ioniq 5 (EV4) is at 60% battery, needs 1 hour, priority 2. Rivian R1T (EV5) is at 50% battery, needs 2 hours, priority 3.',
    data: {
      vehicles: [
        { vehicle: 'Tesla-M3', battery_level: 18, charging_time: 1.5, priority: 4 },
        { vehicle: 'Ford-Lightning', battery_level: 35, charging_time: 2.5, priority: 3 },
        { vehicle: 'Chevy-Bolt', battery_level: 8, charging_time: 2, priority: 5 },
        { vehicle: 'Ioniq-5', battery_level: 60, charging_time: 1, priority: 2 },
        { vehicle: 'Rivian-R1T', battery_level: 50, charging_time: 2, priority: 3 },
      ],
      charging_capacity: 2,
    },
  },
  {
    id: 'city-delivery',
    title: 'Last-Mile Logistics Depot (6 Vans, 3 Bays)',
    description: 'Commercial delivery fleet optimization with 3 charging bays.',
    natural_prompt:
      'Logistics Depot has 6 delivery vans and 3 charging docks. Van-101 has 15% battery, 3 hours needed, priority 5. Van-102 has 28% battery, 2 hours needed, priority 4. Van-103 has 80% battery, 1 hour needed, priority 1. Van-104 has 30% battery, 2.5 hours needed, priority 4. Van-105 has 55% battery, 1.5 hours needed, priority 3. Van-106 has 10% battery, 3.5 hours needed, priority 5.',
    data: {
      vehicles: [
        { vehicle: 'Van-101', battery_level: 15, charging_time: 3, priority: 5 },
        { vehicle: 'Van-102', battery_level: 28, charging_time: 2, priority: 4 },
        { vehicle: 'Van-103', battery_level: 80, charging_time: 1, priority: 1 },
        { vehicle: 'Van-104', battery_level: 30, charging_time: 2.5, priority: 4 },
        { vehicle: 'Van-105', battery_level: 55, charging_time: 1.5, priority: 3 },
        { vehicle: 'Van-106', battery_level: 10, charging_time: 3.5, priority: 5 },
      ],
      charging_capacity: 3,
    },
  },
];

export default function App() {
  const [scenarios] = useState<PresetScenario[]>(DEFAULT_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(DEFAULT_SCENARIOS[0].id);

  const [naturalPrompt, setNaturalPrompt] = useState<string>(DEFAULT_SCENARIOS[0].natural_prompt);
  const [evData, setEvData] = useState<EvInputPayload>(DEFAULT_SCENARIOS[0].data);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>({
    isValid: true,
    errors: [],
    warnings: [],
  });

  const [currentStage, setCurrentStage] = useState<PipelineStage>('stage1_ai');
  const [completedStages, setCompletedStages] = useState<Record<PipelineStage, boolean>>({
    stage1_ai: true,
    stage2_classical: false,
    stage3_quantum: false,
    stage4_recommendation: false,
  });

  const [isParsing, setIsParsing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [solverResult, setSolverResult] = useState<FullSolverResponse | null>(null);
  const [geminiExplanation, setGeminiExplanation] = useState<GeminiExplanation | null>(null);
  const [isPythonModalOpen, setIsPythonModalOpen] = useState(false);

  // Fetch scenarios from server on mount
  useEffect(() => {
    fetch('/api/sample-scenarios')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Keep current if already loaded
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_SCENARIOS
      });
  }, []);

  const handleSelectScenario = (scenario: PresetScenario) => {
    setActiveScenarioId(scenario.id);
    setNaturalPrompt(scenario.natural_prompt);
    setEvData(scenario.data);
    setValidationReport({
      isValid: true,
      errors: [],
      warnings: [],
    });
    setCompletedStages({
      stage1_ai: true,
      stage2_classical: false,
      stage3_quantum: false,
      stage4_recommendation: false,
    });
    setSolverResult(null);
    setGeminiExplanation(null);
    setCurrentStage('stage1_ai');
    setErrorMessage(null);
  };

  const handleCapacityChange = (cap: number) => {
    setEvData((prev) => ({
      ...prev,
      charging_capacity: cap,
    }));
  };

  // Stage 1: AI Natural Language Interpretation via Gemini
  const handleParseWithAi = async () => {
    setIsParsing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/parse-ev-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: naturalPrompt,
          fallbackCapacity: evData.charging_capacity,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to interpret natural language input');
      }

      setEvData(result.data);
      setValidationReport(result.validation);
      setCompletedStages((prev) => ({ ...prev, stage1_ai: true }));
    } catch (err: any) {
      console.error('Error parsing with AI:', err);
      setErrorMessage(err.message || 'AI parsing error');
    } finally {
      setIsParsing(false);
    }
  };

  // Stage 2 & 3: Run Python Quantum Solver (Qiskit QAOA & QUBO + Classical Baseline)
  const handleRunQuantumBackend = async (dataToRun?: EvInputPayload) => {
    setIsOptimizing(true);
    setErrorMessage(null);
    const targetPayload = dataToRun || evData;

    try {
      const response = await fetch('/api/quantum/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetPayload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.stderr || 'Quantum backend optimization failed');
      }

      const solverData: FullSolverResponse = result.data;
      setSolverResult(solverData);

      setCompletedStages((prev) => ({
        ...prev,
        stage1_ai: true,
        stage2_classical: true,
        stage3_quantum: true,
        stage4_recommendation: true,
      }));

      // Automatically generate Gemini Explanation for Stage 4
      handleGenerateExplanation(solverData);

      return solverData;
    } catch (err: any) {
      console.error('Error running quantum backend:', err);
      setErrorMessage(err.message || 'Quantum backend error');
      throw err;
    } finally {
      setIsOptimizing(false);
    }
  };

  // Stage 4: Gemini AI Operational Explanation
  const handleGenerateExplanation = async (solverData: FullSolverResponse) => {
    setIsLoadingExplanation(true);

    try {
      const response = await fetch('/api/ai/explain-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input_data: solverData.input_summary,
          qubo_formulation: solverData.qubo_formulation,
          stage2_classical_optimization: solverData.stage2_classical_optimization,
          stage3_quantum_qaoa_optimization: solverData.stage3_quantum_qaoa_optimization,
          stage4_charging_recommendation: solverData.stage4_charging_recommendation,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.explanation) {
        setGeminiExplanation(result.explanation);
      }
    } catch (err: any) {
      console.warn('Could not generate Gemini explanation:', err);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  // Full Automated Pipeline
  const handleRunFullPipeline = async () => {
    setIsRunningPipeline(true);
    setErrorMessage(null);

    try {
      // Step 1: AI Parse
      let currentEvData = evData;
      if (naturalPrompt.trim()) {
        const parseRes = await fetch('/api/ai/parse-ev-input', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: naturalPrompt,
            fallbackCapacity: evData.charging_capacity,
          }),
        });
        const parseJson = await parseRes.json();
        if (parseRes.ok && parseJson.success) {
          currentEvData = parseJson.data;
          setEvData(currentEvData);
          setValidationReport(parseJson.validation);
        }
      }

      // Step 2 & 3: Quantum & Classical backend
      const solverData = await handleRunQuantumBackend(currentEvData);

      // Navigate to Stage 4 Recommendation to view final schedule and explanation
      setCurrentStage('stage4_recommendation');
    } catch (err: any) {
      console.error('Full pipeline failed:', err);
      setErrorMessage(err.message || 'Pipeline execution failed');
    } finally {
      setIsRunningPipeline(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation & Status */}
      <Header
        scenarios={scenarios}
        activeScenarioId={activeScenarioId}
        onSelectScenario={handleSelectScenario}
        chargingCapacity={evData.charging_capacity}
        onCapacityChange={handleCapacityChange}
        isRunningPipeline={isRunningPipeline || isOptimizing}
        onRunFullPipeline={handleRunFullPipeline}
        onViewPythonScript={() => setIsPythonModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-600/80 p-4 rounded-xl text-rose-200 flex items-center justify-between text-xs sm:text-sm shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs px-2.5 py-1 rounded bg-rose-900 hover:bg-rose-800 text-white font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 4-Stage Pipeline Stepper Bar */}
        <PipelineSteps
          currentStage={currentStage}
          completedStages={completedStages}
          onSelectStage={(stage) => setCurrentStage(stage)}
          isProcessing={isRunningPipeline || isOptimizing || isParsing}
        />

        {/* Stage Content Switcher */}
        <div className="transition-all duration-300">
          {currentStage === 'stage1_ai' && (
            <Stage1AiInterpretation
              naturalPrompt={naturalPrompt}
              onPromptChange={setNaturalPrompt}
              onParseWithAi={handleParseWithAi}
              isParsing={isParsing}
              evData={evData}
              onUpdateEvData={setEvData}
              validationReport={validationReport}
              onProceedToQuantum={async () => {
                try {
                  await handleRunQuantumBackend();
                  setCurrentStage('stage3_quantum');
                } catch (e) {
                  // error handled in method
                }
              }}
            />
          )}

          {currentStage === 'stage2_classical' && (
            <Stage2Classical
              classicalResult={solverResult?.stage2_classical_optimization || null}
              vehicles={evData.vehicles}
              capacity={evData.charging_capacity}
              onProceedToQuantum={() => setCurrentStage('stage3_quantum')}
            />
          )}

          {currentStage === 'stage3_quantum' && (
            <Stage3QuantumQAOA
              quboData={solverResult?.qubo_formulation || null}
              quantumResult={solverResult?.stage3_quantum_qaoa_optimization || null}
              vehicles={evData.vehicles}
              capacity={evData.charging_capacity}
              onProceedToRecommendation={() => setCurrentStage('stage4_recommendation')}
            />
          )}

          {currentStage === 'stage4_recommendation' && (
            <Stage4Recommendation
              recommendation={solverResult?.stage4_charging_recommendation || null}
              quantumResult={solverResult?.stage3_quantum_qaoa_optimization || null}
              geminiExplanation={geminiExplanation}
              csvExport={solverResult?.csv_export}
              isLoadingExplanation={isLoadingExplanation}
              onRefreshExplanation={() => {
                if (solverResult) handleGenerateExplanation(solverResult);
              }}
            />
          )}
        </div>

        {/* Modal to view and download Colab python script */}
        <PythonScriptModal
          isOpen={isPythonModalOpen}
          onClose={() => setIsPythonModalOpen(false)}
        />

        {/* Comparison & Cross-Stage Audit Panel */}
        {solverResult && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Cross-Stage Convergence & Quantum vs. Classical Audit
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {solverResult.quantum_vs_classical_comparison.selected_evs_match
                  ? '✓ Exact Solution Convergence'
                  : 'Alternative Eigenstate Sampled'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] uppercase">
                  Stage 1: AI Input
                </span>
                <span className="font-bold text-slate-200 text-sm mt-1 block">
                  {solverResult.input_summary.vehicle_count} EVs parsed
                </span>
                <span className="text-[11px] text-amber-400">
                  Validated JSON structure
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] uppercase">
                  Stage 2: Classical Solve
                </span>
                <span className="font-bold text-blue-300 text-sm mt-1 block">
                  {solverResult.stage2_classical_optimization.selected_evs.join(', ')}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {solverResult.stage2_classical_optimization.execution_time_ms} ms ({solverResult.stage2_classical_optimization.evaluations_count} states)
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] uppercase">
                  Stage 3: Quantum QAOA
                </span>
                <span className="font-bold text-purple-300 text-sm mt-1 block">
                  {solverResult.stage3_quantum_qaoa_optimization.selected_evs.join(', ')}
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  Bitstring |{solverResult.stage3_quantum_qaoa_optimization.optimal_bitstring}⟩ (Fidelity: {(solverResult.stage3_quantum_qaoa_optimization.quantum_fidelity * 100).toFixed(1)}%)
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] uppercase">
                  Stage 4: Dispatch Bays
                </span>
                <span className="font-bold text-emerald-300 text-sm mt-1 block">
                  {solverResult.stage4_charging_recommendation.total_active_evs} Plugs Allocated
                </span>
                <span className="text-[11px] text-slate-400">
                  {solverResult.stage4_charging_recommendation.total_energy_dispatched_kwh} kWh committed
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Q-Charge Prototype</span>
            <span>—</span>
            <span>Quantum-Powered EV Charging Station Optimization</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Perception: Gemini 3.8 Flash</span>
            <span>•</span>
            <span>QUBO Solver: Python 3 / Qiskit</span>
            <span>•</span>
            <span>Dispatch: Smart Grid Allocation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
