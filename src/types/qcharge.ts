export interface Vehicle {
  vehicle: string;
  battery_level: number;
  charging_time: number;
  priority: number;
}

export interface EvInputPayload {
  vehicles: Vehicle[];
  charging_capacity: number;
}

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface QuboFormulation {
  matrix_Q: number[][];
  vehicle_utilities: number[];
  penalty_multiplier: number;
  constant_offset: number;
  variable_mapping: string[];
  hamiltonian_description: string;
}

export interface ClassicalResult {
  method: string;
  selected_evs: string[];
  selected_indices: number[];
  optimal_bitstring: string;
  objective_value: number;
  qubo_energy: number;
  execution_time_ms: number;
  evaluations_count: number;
  status: string;
}

export interface QuantumStateProbability {
  bitstring: string;
  probability: number;
  energy: number;
  feasible: boolean;
  selected_count: number;
}

export interface QuantumQaoaResult {
  status: string;
  selected_evs: string[];
  selected_indices: number[];
  optimal_bitstring: string;
  objective_value: number;
  qubo_energy: number;
  shots_simulated: number;
  execution_time_ms: number;
  qaoa_depth_p: number;
  optimal_gamma: number[];
  optimal_beta: number[];
  quantum_fidelity: number;
  qubit_count: number;
  two_qubit_entangling_gates: number;
  top_states: QuantumStateProbability[];
  circuit_ascii: string;
  qiskit_code: string;
}

export interface ActiveBaySchedule {
  bay_id: number;
  bay_name: string;
  vehicle: string;
  initial_battery_pct: number;
  target_battery_pct: number;
  energy_required_kwh: number;
  allocated_duration_hrs: number;
  dispatch_start: string;
  estimated_completion: string;
  average_power_kw: number;
  status: string;
  priority: number;
}

export interface DeferredQueueItem {
  vehicle: string;
  battery_level: number;
  charging_time: number;
  priority: number;
  status: string;
  estimated_wait_hrs: number;
  deferral_reason: string;
}

export interface ChargingRecommendation {
  active_bays: ActiveBaySchedule[];
  deferred_queue: DeferredQueueItem[];
  total_active_evs: number;
  total_energy_dispatched_kwh: number;
  station_utilization_pct: number;
  grid_load_status: string;
  power_peak_demand_kw: number;
}

export interface QuantumComparison {
  selected_evs_match: boolean;
  classical_time_ms: number;
  quantum_simulation_time_ms: number;
  quantum_fidelity: number;
  qubo_energy_match: boolean;
  complexity_scaling: {
    classical_state_space: string;
    quantum_qubits_required: number;
    qaoa_circuit_depth_p: number;
  };
}

export interface FullSolverResponse {
  input_summary: {
    vehicle_count: number;
    charging_capacity: number;
    vehicles: Vehicle[];
    optimization_mode?: string;
  };
  qubo_formulation: QuboFormulation;
  stage2_classical_optimization: ClassicalResult;
  stage3_quantum_qaoa_optimization: QuantumQaoaResult;
  stage4_charging_recommendation: ChargingRecommendation;
  csv_export?: string;
  quantum_vs_classical_comparison: QuantumComparison;
}

export interface GeminiExplanation {
  summary: string;
  selection_breakdown: string[];
  deferral_breakdown: string[];
  quantum_insight: string;
  station_efficiency_score: number;
}

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
  natural_prompt: string;
  data: EvInputPayload;
}
