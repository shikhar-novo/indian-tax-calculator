import { TaxInputs, TaxCalculationResult } from '../types';

// Constants for tax calculation
const STANDARD_DEDUCTION = 50000;
const MAX_SECTION_80C = 150000;
const PROFESSIONAL_TAX_PER_MONTH = 200;
const LABOUR_WELFARE_FUND = 31;

// Tax slab rates for FY 2023-24
const TAX_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.20 },
  { min: 1000000, max: Infinity, rate: 0.30 }
];

// Surcharge rates for FY 2023-24
const SURCHARGE_RATES = [
  { min: 0, max: 5000000, rate: 0 },
  { min: 5000000, max: 10000000, rate: 0.10 },
  { min: 10000000, max: 20000000, rate: 0.15 },
  { min: 20000000, max: 50000000, rate: 0.25 },
  { min: 50000000, max: Infinity, rate: 0.37 }
];

export const calculateHRAExemption = (
  basicSalary: number,
  hraReceived: number,
  rentPaid: number = 0,
  isMetroCity: boolean = true
) => {
  const actualHRA = hraReceived;
  const rentPaidMinusBasic = Math.max(0, (rentPaid * 12) - (basicSalary * 0.1));
  const metroCityAllowance = isMetroCity ? basicSalary * 0.5 : basicSalary * 0.4;

  return {
    actualHRA,
    rentPaidMinusBasic,
    metroCityAllowance,
    finalExemption: Math.min(actualHRA, rentPaidMinusBasic, metroCityAllowance)
  };
};

export const calculateTax = (inputs: TaxInputs): TaxCalculationResult => {
  const {
    grossSalary,
    pfContribution,
    gratuity,
    totalInvestments,
    rentPaid = 0,
    basicSalary = 0,
    hraPercentage = 40,
    otherAllowances = 0,
    employerPf = 0
  } = inputs;

  // Step 1: Calculate adjusted taxable CTC
  const adjustedTaxableCTC = grossSalary - pfContribution - gratuity;

  // Step 2: Calculate HRA
  const hraReceived = basicSalary * (hraPercentage / 100);
  const hraCalculation = calculateHRAExemption(basicSalary, hraReceived, rentPaid);

  // Step 3: Calculate taxable salary
  const taxableSalary = adjustedTaxableCTC

  // Step 4: Calculate deductions
  const deductions = {
    standardDeduction: STANDARD_DEDUCTION,
    hraExemption: hraCalculation.finalExemption,
    section80C: 0,
    section80D: 0,
    nps: 0,
    otherDeductions: totalInvestments,
    professionalTax: PROFESSIONAL_TAX_PER_MONTH * 12
  };

  // Step 5: Calculate final taxable income
  const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
  const taxableIncome = taxableSalary - totalDeductions;

  // Step 6: Calculate tax based on slabs
  let taxSlabs = {
    slab1: 0,  // 2.5L - 5L (5%)
    slab2: 0,  // 5L - 10L (20%)
    slab3: 0   // Above 10L (30%)
  };

  let remainingIncome = taxableIncome;
  let yearlyTax = 0;

  for (const slab of TAX_SLABS) {
    if (remainingIncome <= 0) break;

    const taxableInThisSlab = Math.min(
      remainingIncome,
      slab.max - slab.min
    );

    const taxInThisSlab = taxableInThisSlab * slab.rate;
    yearlyTax += taxInThisSlab;

    if (slab.min === 250000) taxSlabs.slab1 = taxInThisSlab;
    else if (slab.min === 500000) taxSlabs.slab2 = taxInThisSlab;
    else if (slab.min === 1000000) taxSlabs.slab3 = taxInThisSlab;

    remainingIncome -= taxableInThisSlab;
  }

  // Step 7: Calculate surcharge
  let surcharge = 0;
  for (const rate of SURCHARGE_RATES) {
    if (taxableIncome > rate.min && taxableIncome <= rate.max) {
      surcharge = yearlyTax * rate.rate;
      break;
    }
  }

  // Step 8: Calculate cess
  const cess = (yearlyTax + surcharge) * 0.04;

  // Step 9: Calculate monthly deductions
  const monthlyDeductions = {
    pf: pfContribution / 12,
    tax: (yearlyTax + surcharge + cess) / 12,
    professionalTax: PROFESSIONAL_TAX_PER_MONTH,
    labourWelfareFund: LABOUR_WELFARE_FUND
  };

  // Step 10: Calculate in-hand salary
  const inHandSalary = (adjustedTaxableCTC / 12) - 
    monthlyDeductions.pf - 
    monthlyDeductions.tax - 
    monthlyDeductions.professionalTax - 
    monthlyDeductions.labourWelfareFund;

  return {
    inputs,
    breakdown: {
      yearlyTax: yearlyTax + surcharge + cess,
      monthlyTax: (yearlyTax + surcharge + cess) / 12,
      inHandSalary,
      taxableIncome,
      deductions,
      taxSlabs,
      surcharge,
      cess,
      professionalTax: PROFESSIONAL_TAX_PER_MONTH * 12,
      labourWelfareFund: LABOUR_WELFARE_FUND * 12
    },
    monthlyDeductions,
    hraCalculation
  };
}; 