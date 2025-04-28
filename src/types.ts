export interface TaxInputs {
  grossSalary: number;
  pfContribution: number;
  gratuity: number;
  totalInvestments: number;
  rentPaid?: number;
  basicSalary?: number;
  hraPercentage?: number;
  otherAllowances?: number;
  employerPf?: number;
}

export interface TaxBreakdown {
  yearlyTax: number;
  monthlyTax: number;
  inHandSalary: number;
  taxableIncome: number;
  deductions: {
    standardDeduction: number;
    hraExemption: number;
    section80C: number;
    section80D: number;
    nps: number;
    otherDeductions: number;
    professionalTax: number;
  };
  taxSlabs: {
    slab1: number;
    slab2: number;
    slab3: number;
    slab4: number;
  };
  surcharge: number;
  cess: number;
  professionalTax: number;
  labourWelfareFund: number;
}

export interface TaxCalculationResult {
  inputs: TaxInputs;
  breakdown: TaxBreakdown;
  monthlyDeductions: {
    pf: number;
    tax: number;
    professionalTax: number;
    labourWelfareFund: number;
  };
  hraCalculation: {
    actualHRA: number;
    rentPaidMinusBasic: number;
    metroCityAllowance: number;
    finalExemption: number;
  };
} 