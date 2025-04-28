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

const STANDARD_DEDUCTION = 50000;
const PROFESSIONAL_TAX_PER_MONTH = 200;

export const calculateHRAExemption = (basicSalary: number, hra: number, rentPaid: number = 0) => {
  const actualHRA = hra;
  const actualRentPaid = rentPaid;
  const basicSalaryComponent = basicSalary * 0.4;
  const exemption = Math.min(actualHRA, actualRentPaid, basicSalaryComponent);
  return exemption;
};

export const calculateTax = (inputs: TaxInputs) => {
  const {
    basicSalary,
    hra,
    specialAllowance,
    rentPaid = 0,
    section80C,
    section80D,
    nps,
    otherIncome
  } = inputs;

  // Calculate HRA exemption
  const hraExemption = calculateHRAExemption(basicSalary, hra, rentPaid);

  // Calculate total salary
  const totalSalary = basicSalary + hra + specialAllowance;

  // Calculate taxable salary after HRA exemption
  const taxableSalaryAfterHRA = totalSalary - hraExemption;

  // Calculate total deductions
  const totalDeductions = STANDARD_DEDUCTION + section80C + section80D + nps;

  // Calculate taxable income
  const taxableIncome = taxableSalaryAfterHRA - totalDeductions + otherIncome;

  // Calculate tax based on new regime
  let tax = 0;
  if (taxableIncome <= 300000) {
    tax = 0;
  } else if (taxableIncome <= 600000) {
    tax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 900000) {
    tax = 15000 + (taxableIncome - 600000) * 0.10;
  } else if (taxableIncome <= 1200000) {
    tax = 45000 + (taxableIncome - 900000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    tax = 90000 + (taxableIncome - 1200000) * 0.20;
  } else {
    tax = 150000 + (taxableIncome - 1500000) * 0.30;
  }

  // Add 4% health and education cess
  const healthAndEducationCess = tax * 0.04;
  tax += healthAndEducationCess;

  // Add professional tax
  const professionalTax = PROFESSIONAL_TAX_PER_MONTH * 12;
  tax += professionalTax;

  return {
    totalSalary,
    hraExemption,
    taxableSalaryAfterHRA,
    totalDeductions,
    taxableIncome,
    tax,
    healthAndEducationCess,
    professionalTax
  };
}; 