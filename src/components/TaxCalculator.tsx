import React, { useState } from 'react';
import { TaxInputs, TaxCalculationResult } from '../types';
import { calculateTax } from '../utils/taxCalculator';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const TaxCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<TaxInputs>({
    grossSalary: 0,
    pfContribution: 0,
    gratuity: 0,
    totalInvestments: 0,
    rentPaid: 0,
    basicSalary: 0,
    hraPercentage: 40, // Default HRA percentage
    otherAllowances: 0,
    employerPf: 0
  });

  const [result, setResult] = useState<TaxCalculationResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '0') {
      setInputs(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '') {
      setInputs(prev => ({
        ...prev,
        [name]: 0
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculationResult = calculateTax(inputs);
    setResult(calculationResult);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Indian Tax Calculator</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Gross Salary (Yearly)</label>
            <input
              type="number"
              name="grossSalary"
              value={inputs.grossSalary}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">PF Contribution (Yearly)</label>
            <input
              type="number"
              name="pfContribution"
              value={inputs.pfContribution}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gratuity (Yearly)</label>
            <input
              type="number"
              name="gratuity"
              value={inputs.gratuity}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total Deductions (NPS, 80C, 80D etc.)</label>
            <input
              type="number"
              name="totalInvestments"
              value={inputs.totalInvestments}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Basic Salary (Yearly)</label>
            <input
              type="number"
              name="basicSalary"
              value={inputs.basicSalary}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">HRA Percentage of Basic</label>
            <input
              type="number"
              name="hraPercentage"
              value={inputs.hraPercentage}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rent Paid (Monthly)</label>
            <input
              type="number"
              name="rentPaid"
              value={inputs.rentPaid}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Calculate Tax
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold">Tax Calculation Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">Salary Breakdown</h3>
              <div className="space-y-2">
                <p>Gross Salary: {formatCurrency(result.inputs.grossSalary)}</p>
                <p>Basic Salary: {formatCurrency(result.inputs.basicSalary || 0)}</p>
                <p>PF Contribution: {formatCurrency(result.inputs.pfContribution)}</p>
                <p>Gratuity: {formatCurrency(result.inputs.gratuity)}</p>
                <p>Other Allowances: {formatCurrency(result.inputs.otherAllowances || 0)}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">HRA Calculation</h3>
              <div className="space-y-2">
                <p>HRA exemption: Least of:</p>
                <div className="pl-4 border-l-2 border-gray-300">
                  <p>Actual HRA received: {formatCurrency(result.hraCalculation.actualHRA)}</p>
                  <p>Rent paid - 10% of basic: {formatCurrency((result.inputs.rentPaid || 0) * 12)} - {formatCurrency((result.inputs.basicSalary || 0) * 0.1)} = {formatCurrency(result.hraCalculation.rentPaidMinusBasic)}</p>
                  <p>50% of basic (metro city assumed): {formatCurrency(result.hraCalculation.metroCityAllowance)}</p>
                </div>
                <p className="font-semibold">Exempt HRA: {formatCurrency(result.hraCalculation.finalExemption)}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">Deductions</h3>
              <div className="space-y-2">
                <p>Standard Deduction: {formatCurrency(result.breakdown.deductions.standardDeduction)}</p>
                <p>HRA Exemption: {formatCurrency(result.breakdown.deductions.hraExemption)}</p>
                <p>Other Deductions (NPS, 80C, 80D etc.): {formatCurrency(result.inputs.totalInvestments)}</p>
                <p>Professional Tax: {formatCurrency(result.breakdown.deductions.professionalTax)}</p>
                <p className="font-semibold">Total Deductions: {formatCurrency(
                  result.breakdown.deductions.standardDeduction +
                  result.breakdown.deductions.hraExemption +
                  result.inputs.totalInvestments +
                  result.breakdown.deductions.professionalTax
                )}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">Tax Calculation</h3>
              <div className="space-y-2">
                <p>Taxable Income: {formatCurrency(result.breakdown.taxableIncome)}</p>
                <div className="pl-4 border-l-2 border-gray-300">
                  <p>2.5L - 5L (5%): {formatCurrency(result.breakdown.taxSlabs.slab1)}</p>
                  <p>5L - 10L (20%): {formatCurrency(result.breakdown.taxSlabs.slab2)}</p>
                  <p>Above 10L (30%): {formatCurrency(result.breakdown.taxSlabs.slab3)}</p>
                </div>
                <p>Surcharge: {formatCurrency(result.breakdown.surcharge)}</p>
                <p>Health & Education Cess (4%): {formatCurrency(result.breakdown.cess)}</p>
                <p className="font-semibold">Total Tax: {formatCurrency(result.breakdown.yearlyTax)}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">Monthly Breakdown</h3>
              <div className="space-y-2">
                <p>Monthly Gross: {formatCurrency(result.inputs.grossSalary / 12)}</p>
                <div className="pl-4 border-l-2 border-gray-300">
                  <p>Monthly PF: {formatCurrency(result.monthlyDeductions.pf)}</p>
                  <p>Monthly Tax: {formatCurrency(result.monthlyDeductions.tax)}</p>
                  <p>Professional Tax: {formatCurrency(result.monthlyDeductions.professionalTax)}</p>
                  <p>Labour Welfare Fund: {formatCurrency(result.monthlyDeductions.labourWelfareFund)}</p>
                </div>
                <p className="font-semibold">In-hand Salary: {formatCurrency(result.breakdown.inHandSalary)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 