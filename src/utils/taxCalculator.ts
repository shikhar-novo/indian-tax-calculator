import { TaxInputs, TaxCalculationResult } from '../types';

// Constants for tax calculation
const STANDARD_DEDUCTION = 50000;
const MAX_SECTION_80C = 150000;
const PROFESSIONAL_TAX_PER_MONTH = 200;
const LABOUR_WELFARE_FUND = 31;

// Tax slabs for FY 2023-24
const OLD_TAX_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.2 },
  { min: 1000000, max: Infinity, rate: 0.3 }
];

const NEW_TAX_SLABS = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 0.05 },
  { min: 800000, max: 1200000, rate: 0.1 },
  { min: 1200000, max: 1600000, rate: 0.15 },
  { min: 1600000, max: 2000000, rate: 0.2 },
  { min: 2000000, max: 2400000, rate: 0.25 },
  { min: 2400000, max: Infinity, rate: 0.3 }
];

// Surcharge rates for FY 2023-24
const SURCHARGE_RATES = [
  { min: 0, max: 5000000, rate: 0 },
  { min: 5000000, max: 10000000, rate: 0.10 },
  { min: 10000000, max: 20000000, rate: 0.15 },
  { min: 20000000, max: 50000000, rate: 0.25 },
  { min: 50000000, max: Infinity, rate: 0.37 }
];

const NEW_SURCHARGE_RATES = [
  { min: 0, max: 5000000, rate: 0 },
  { min: 5000000, max: 10000000, rate: 0.10 },
  { min: 10000000, max: 20000000, rate: 0.15 },
  { min: 20000000, max: 50000000, rate: 0.25 },
  { min: 50000000, max: Infinity, rate: 0.25 }
];

// Deduction limits
const SECTION_80C_LIMIT = 150000;
const SECTION_80D_LIMIT = 25000;
const NPS_LIMIT = 50000;
const PROFESSIONAL_TAX = 2400; // Yearly professional tax

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

export function calculateTax(inputs: TaxInputs, regime: 'old' | 'new' = 'old'): TaxCalculationResult {
  const {
    grossSalary,
    pfContribution,
    gratuity,
    totalInvestments,
    rentPaid = 0,
    basicSalary = grossSalary * 0.4, // Default 40% of gross
    hraPercentage = 0.4, // Default 40% of basic
    otherAllowances = 0,
    employerPf = 0
  } = inputs;

  // Calculate HRA
  const actualHRA = basicSalary * hraPercentage;
  const rentPaidMinusBasic = Math.max(0, rentPaid * 12 - (basicSalary * 0.1));
  const metroCityAllowance = basicSalary * 0.5;
  const hraExemption = Math.min(actualHRA, rentPaidMinusBasic, metroCityAllowance);

  const grossSalaryAfterBasicDeductions =  grossSalary - pfContribution - gratuity;

  // Calculate deductions based on regime
  const deductions = {
    standardDeduction: regime === 'old' ? STANDARD_DEDUCTION : 75000,
    hraExemption: regime === 'old' ? hraExemption : 0,
    section80C: 0,
    section80D: 0,
    nps: 0,
    otherDeductions: regime === 'old' ? totalInvestments : 0,
    professionalTax: PROFESSIONAL_TAX
  };

  // Calculate total deductions
  const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);

  // Calculate taxable income
  const taxableIncome = grossSalaryAfterBasicDeductions - totalDeductions;

  // Calculate tax based on regime
  const taxSlabs = regime === 'old' ? OLD_TAX_SLABS : NEW_TAX_SLABS;
  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const slab of taxSlabs) {
    if (remainingIncome <= 0) break;
    const slabAmount = Math.min(remainingIncome, slab.max - slab.min);
    tax += slabAmount * slab.rate;
    remainingIncome -= slabAmount;
  }

  // Calculate surcharge based on regime
  let surcharge = 0;
  const surchargeRates = regime === 'old' ? SURCHARGE_RATES : NEW_SURCHARGE_RATES;

  //surcharge calculation
  for (const rate of surchargeRates) {
    if (taxableIncome > rate.min && taxableIncome <= rate.max) {
      surcharge = tax * rate.rate;
      break;
    }
  }

  // Calculate cess
  const cess = (tax + surcharge) * 0.04;

  // Calculate final tax
  const yearlyTax = tax + surcharge + cess;

  // Calculate in-hand salary
  const inHandSalary = grossSalaryAfterBasicDeductions/12 - yearlyTax/12 - pfContribution/12 - PROFESSIONAL_TAX/12;

  return {
    inputs,
    breakdown: {
      taxableIncome,
      deductions,
      taxSlabs: {
        slab1: taxSlabs[1].rate * Math.min(taxableIncome - taxSlabs[1].min, taxSlabs[1].max - taxSlabs[1].min),
        slab2: taxSlabs[2].rate * Math.min(taxableIncome - taxSlabs[2].min, taxSlabs[2].max - taxSlabs[2].min),
        slab3: taxSlabs[3].rate * Math.min(taxableIncome - taxSlabs[3].min, taxSlabs[3].max - taxSlabs[3].min),
        slab4: regime === 'new' ? taxSlabs[4].rate * Math.min(taxableIncome - taxSlabs[4].min, taxSlabs[4].max - taxSlabs[4].min) : 0,
        slab5: regime === 'new' ? taxSlabs[5].rate * Math.min(taxableIncome - taxSlabs[5].min, taxSlabs[5].max - taxSlabs[5].min) : 0,
        slab6: regime === 'new' ? taxSlabs[6].rate * Math.min(taxableIncome - taxSlabs[6].min, taxSlabs[6].max - taxSlabs[6].min) : 0
      },
      surcharge,
      cess,
      yearlyTax,
      inHandSalary,
      grossSalaryAfterBasicDeductions: grossSalaryAfterBasicDeductions/12
    },
    monthlyDeductions: {
      pf: pfContribution / 12,
      tax: yearlyTax / 12,
      professionalTax: PROFESSIONAL_TAX / 12,
      labourWelfareFund: 0 // Not applicable in most cases
    },
    hraCalculation: {
      actualHRA,
      rentPaidMinusBasic,
      metroCityAllowance,
      finalExemption: hraExemption
    }
  };
} 