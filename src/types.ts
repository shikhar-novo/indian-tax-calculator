export interface TaxInputs {
  grossSalary: number;  // Total CTC
  pfContribution: number;  // Employee PF contribution
  gratuity: number;  // Yearly gratuity
  totalInvestments: number;  // Total sum of investments (80C, 80D, etc.)
  rentPaid?: number;  // Monthly rent paid (for HRA calculation)
  basicSalary?: number;  // Basic salary component
  hraPercentage?: number;  // HRA percentage of basic (default 40%)
  otherAllowances?: number;  // Other taxable allowances
  employerPf?: number;  // Employer PF contribution
}

export interface TaxBreakdown {
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
    slab1: number;  // 2.5L - 5L (5%)
    slab2: number;  // 5L - 10L (20%)
    slab3: number;  // Above 10L (30%)
    slab4: number;  
    slab5: number;  
    slab6: number;  
  };
  surcharge: number;
  cess: number;
  yearlyTax: number;
  inHandSalary: number;
  grossSalaryAfterBasicDeductions: number;
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