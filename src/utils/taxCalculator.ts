import { TaxInputs, TaxBreakdown, TaxCalculationResult } from '../types';

const STANDARD_DEDUCTION = 50000;
const MAX_SECTION_80C = 150000;
const MAX_SECTION_80D = 75000;
const MAX_NPS = 50000;
const PROFESSIONAL_TAX_PER_MONTH = 200;
const LABOUR_WELFARE_FUND = 31;

export const calculateTax = (inputs: TaxInputs): TaxCalculationResult => {
  const {
    grossSalary,
    pfContribution,
    gratuity,
    totalInvestments,
    rentPaid = 0,
    basicSalary = grossSalary * 0.4, // Default to 40% of gross salary if not provided
    hraPercentage = 40,
    otherAllowances = 0,
    employerPf = 0
  } = inputs;

  // Step 1: Calculate adjusted taxable CTC
  const adjustedTaxableCTC = grossSalary - pfContribution - gratuity;

  // Step 2: Calculate HRA exemption
  const hraCalculation = calculateHRAExemption(basicSalary, hraPercentage, rentPaid);

  // Step 3: Calculate taxable salary
  const taxableSalary = adjustedTaxableCTC;

  // Step 4: Calculate deductions
  const deductions = {
    standardDeduction: STANDARD_DEDUCTION,
    hraExemption: hraCalculation.finalExemption,
    section80C: 0,
    section80D: 0,
    nps: 0,
    otherDeductions: totalInvestments, // Use total investments as other deductions
    professionalTax: PROFESSIONAL_TAX_PER_MONTH * 12 // Add professional tax to deductions
  };

  // Step 5: Calculate final taxable income
  const taxableIncome = taxableSalary - Object.values(deductions).reduce((a, b) => a + b, 0);

  // Step 6: Calculate tax based on slabs
  const taxSlabs = calculateTaxSlabs(taxableIncome);

  // Step 7: Calculate surcharge and cess
  const surcharge = calculateSurcharge(taxableIncome, taxSlabs);
  const cess = calculateCess(taxSlabs, surcharge);

  // Step 8: Calculate final tax amounts
  const yearlyTax = taxSlabs.slab1 + taxSlabs.slab2 + taxSlabs.slab3 + surcharge + cess;
  const monthlyTax = yearlyTax / 12;

  // Step 9: Calculate monthly in-hand salary
  const monthlyDeductions = {
    pf: pfContribution / 12,
    tax: monthlyTax,
    professionalTax: PROFESSIONAL_TAX_PER_MONTH,
    labourWelfareFund: LABOUR_WELFARE_FUND / 12
  };

  const monthlyGross = adjustedTaxableCTC / 12;
  const inHandSalary = monthlyGross - 
    monthlyDeductions.pf - 
    monthlyDeductions.tax - 
    monthlyDeductions.professionalTax - 
    monthlyDeductions.labourWelfareFund;

  const breakdown: TaxBreakdown = {
    yearlyTax,
    monthlyTax,
    inHandSalary,
    taxableIncome,
    deductions,
    taxSlabs,
    surcharge,
    cess,
    professionalTax: PROFESSIONAL_TAX_PER_MONTH * 12,
    labourWelfareFund: LABOUR_WELFARE_FUND
  };

  return {
    inputs,
    breakdown,
    monthlyDeductions,
    hraCalculation
  };
}

function calculateHRAExemption(
  basicSalary: number,
  hraPercentage: number,
  rentPaid: number,
  metroCity: boolean = true
): { 
  actualHRA: number;
  rentPaidMinusBasic: number;
  metroCityAllowance: number;
  finalExemption: number;
} {
  const yearlyHRA = (basicSalary * hraPercentage) / 100;
  const yearlyRentPaid = rentPaid * 12;
  const tenPercentBasic = basicSalary * 0.1;
  const rentPaidMinusBasic = yearlyRentPaid - tenPercentBasic;
  const metroCityAllowance = basicSalary * 0.5;
  
  const finalExemption = Math.min(
    yearlyHRA,
    rentPaidMinusBasic,
    metroCityAllowance
  );

  return {
    actualHRA: yearlyHRA,
    rentPaidMinusBasic,
    metroCityAllowance,
    finalExemption: Math.max(0, finalExemption)
  };
}

function calculateTaxableSalary(
  adjustedTaxableCTC: number,
  hraExemption: number,
  inputs: TaxInputs
): number {
  return adjustedTaxableCTC - hraExemption - STANDARD_DEDUCTION - inputs.gratuity;
}

function calculateTaxSlabs(taxableIncome: number) {
  const slabs = {
    slab1: 0,
    slab2: 0,
    slab3: 0,
    slab4: 0
  };

  if (taxableIncome <= 250000) {
    return slabs;
  }

  // Slab 1: 2.5L - 5L (5%)
  slabs.slab1 = Math.min(taxableIncome - 250000, 250000) * 0.05;

  if (taxableIncome <= 500000) {
    return slabs;
  }

  // Slab 2: 5L - 10L (20%)
  slabs.slab2 = Math.min(taxableIncome - 500000, 500000) * 0.20;

  if (taxableIncome <= 1000000) {
    return slabs;
  }

  // Slab 3: Above 10L (30%)
  slabs.slab3 = (taxableIncome - 1000000) * 0.30;

  return slabs;
}

function calculateSurcharge(taxableIncome: number, taxSlabs: TaxBreakdown['taxSlabs']): number {
  const totalTaxBeforeSurcharge = taxSlabs.slab1 + taxSlabs.slab2 + taxSlabs.slab3;

  if (taxableIncome <= 5000000) {
    return 0;
  } else if (taxableIncome <= 10000000) {
    return totalTaxBeforeSurcharge * 0.10;
  } else if (taxableIncome <= 20000000) {
    return totalTaxBeforeSurcharge * 0.15;
  } else if (taxableIncome <= 50000000) {
    return totalTaxBeforeSurcharge * 0.25;
  } else {
    return totalTaxBeforeSurcharge * 0.37;
  }
}

function calculateCess(taxSlabs: TaxBreakdown['taxSlabs'], surcharge: number): number {
  const totalTaxBeforeCess = taxSlabs.slab1 + taxSlabs.slab2 + taxSlabs.slab3 + surcharge;
  return totalTaxBeforeCess * 0.04; // 4% cess
} 