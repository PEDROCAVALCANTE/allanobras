export enum ProjectStatus {
    PLANNING = 'Planejamento',
    IN_PROGRESS = 'Em Andamento',
    COMPLETED = 'Concluído',
    PAUSED = 'Pausado'
  }
  
  export enum StageStatus {
    PENDING = 'Pendente',
    IN_PROGRESS = 'Em Andamento',
    COMPLETED = 'Concluída'
  }
  
  export interface Material {
    id: string;
    stageId: string;
    name: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    supplier: string;
    purchaseDate: string;
  }
  
  export interface Labor {
    id: string;
    stageId: string;
    role: string; // Cargo
    workerName: string;
    hourlyRate: number;
    hoursWorked: number;
    date: string;
  }

  export interface Expense {
    id: string;
    projectId: string;
    description: string;
    category: string; // e.g., 'Aluguel', 'Taxas', 'Transporte'
    amount: number;
    date: string;
  }
  
  export interface Stage {
    id: string;
    projectId: string;
    name: string;
    estimatedCost: number;
    status: StageStatus;
    responsible: string;
    deadline: string;
  }
  
  export interface Project {
    id: string;
    name: string;
    address: string;
    responsible: string;
    startDate: string;
    expectedEndDate: string;
    totalBudget: number;
    profitMargin: number; // Percentage
    status: ProjectStatus;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    plan: 'FREE' | 'STARTER' | 'PRO';
  }

  // Helper types for calculations
  export interface ProjectFinancials {
    totalMaterials: number;
    totalLabor: number;
    totalExpenses: number;
    totalCost: number;
    projectedProfit: number;
    realMargin: number;
    budgetUtilization: number;
    isOverBudget: boolean;
    isRisk: boolean; // > 80%
  }