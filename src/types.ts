export interface TaxInputs {
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  rentPaid?: number;
  section80C: number;
  section80D: number;
  nps: number;
  otherIncome: number;
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
  totalSalary: number;
  hraExemption: number;
  taxableSalaryAfterHRA: number;
  totalDeductions: number;
  taxableIncome: number;
  tax: number;
  healthAndEducationCess: number;
  professionalTax: number;
} 