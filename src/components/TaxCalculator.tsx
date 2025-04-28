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
    hraPercentage: 40,
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto">
        <div className="px-8 py-12">
          <h1 className="text-5xl font-bold mb-12 text-center text-gray-800">Indian Tax Calculator</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-10 mb-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Gross Salary (CTC)</label>
                  <input
                    type="number"
                    name="grossSalary"
                    value={inputs.grossSalary}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">PF Contribution (Yearly)</label>
                  <input
                    type="number"
                    name="pfContribution"
                    value={inputs.pfContribution}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Gratuity (Yearly)</label>
                  <input
                    type="number"
                    name="gratuity"
                    value={inputs.gratuity}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Total Investments (80C, 80D, etc.)</label>
                  <input
                    type="number"
                    name="totalInvestments"
                    value={inputs.totalInvestments}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Basic Salary (Yearly)</label>
                  <input
                    type="number"
                    name="basicSalary"
                    value={inputs.basicSalary}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">HRA Percentage of Basic</label>
                  <input
                    type="number"
                    name="hraPercentage"
                    value={inputs.hraPercentage}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Rent Paid (Monthly)</label>
                  <input
                    type="number"
                    name="rentPaid"
                    value={inputs.rentPaid}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Other Allowances (Yearly)</label>
                  <input
                    type="number"
                    name="otherAllowances"
                    value={inputs.otherAllowances}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-10 py-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-medium"
                >
                  Calculate Tax
                </button>
              </div>
            </form>
          </div>

          {result && (
            <div className="space-y-10">
              <h2 className="text-4xl font-bold text-center text-gray-800">Tax Calculation Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Salary Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Salary:</span>
                      <span className="font-medium">{formatCurrency(result.inputs.grossSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Basic Salary:</span>
                      <span className="font-medium">{formatCurrency(result.inputs.basicSalary || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PF Contribution:</span>
                      <span className="font-medium">{formatCurrency(result.inputs.pfContribution)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gratuity:</span>
                      <span className="font-medium">{formatCurrency(result.inputs.gratuity)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Allowances:</span>
                      <span className="font-medium">{formatCurrency(result.inputs.otherAllowances || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">HRA Calculation</h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">HRA exemption: Least of:</p>
                    <div className="pl-4 border-l-2 border-gray-300 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actual HRA received:</span>
                        <span className="font-medium">{formatCurrency(result.hraCalculation.actualHRA)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rent paid - 10% of basic:</span>
                        <span className="font-medium">{formatCurrency(result.hraCalculation.rentPaidMinusBasic)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">50% of basic (metro city):</span>
                        <span className="font-medium">{formatCurrency(result.hraCalculation.metroCityAllowance)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="font-semibold text-gray-800">Exempt HRA:</span>
                      <span className="font-bold text-blue-600">{formatCurrency(result.hraCalculation.finalExemption)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Deductions</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Standard Deduction:</span>
                      <span className="font-medium">{formatCurrency(result.breakdown.deductions.standardDeduction)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">HRA Exemption:</span>
                      <span className="font-medium">{formatCurrency(result.breakdown.deductions.hraExemption)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Deductions:</span>
                      <span className="font-medium">{formatCurrency(result.inputs.totalInvestments)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Professional Tax:</span>
                      <span className="font-medium">{formatCurrency(result.breakdown.deductions.professionalTax)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="font-semibold text-gray-800">Total Deductions:</span>
                      <span className="font-bold text-blue-600">{formatCurrency(
                        result.breakdown.deductions.standardDeduction +
                        result.breakdown.deductions.hraExemption +
                        result.inputs.totalInvestments +
                        result.breakdown.deductions.professionalTax
                      )}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Tax Calculation</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxable Income:</span>
                      <span className="font-medium">{formatCurrency(result.breakdown.taxableIncome)}</span>
                    </div>
                    <div className="pl-4 border-l-2 border-gray-300 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">2.5L - 5L (5%):</span>
                        <span className="font-medium">{formatCurrency(result.breakdown.taxSlabs.slab1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">5L - 10L (20%):</span>
                        <span className="font-medium">{formatCurrency(result.breakdown.taxSlabs.slab2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Above 10L (30%):</span>
                        <span className="font-medium">{formatCurrency(result.breakdown.taxSlabs.slab3)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Surcharge:</span>
                      <span className="font-medium">{formatCurrency(result.breakdown.surcharge)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health & Education Cess (4%):</span>
                      <span className="font-medium">{formatCurrency(result.breakdown.cess)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="font-semibold text-gray-800">Total Tax:</span>
                      <span className="font-bold text-red-600">{formatCurrency(result.breakdown.yearlyTax)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Monthly Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Gross:</span>
                      <span className="font-medium">{formatCurrency(result.inputs.grossSalary / 12)}</span>
                    </div>
                    <div className="pl-4 border-l-2 border-gray-300 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly PF:</span>
                        <span className="font-medium">{formatCurrency(result.monthlyDeductions.pf)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Tax:</span>
                        <span className="font-medium">{formatCurrency(result.monthlyDeductions.tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Professional Tax:</span>
                        <span className="font-medium">{formatCurrency(result.monthlyDeductions.professionalTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Labour Welfare Fund:</span>
                        <span className="font-medium">{formatCurrency(result.monthlyDeductions.labourWelfareFund)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="font-semibold text-gray-800">In-hand Salary:</span>
                      <span className="font-bold text-green-600">{formatCurrency(result.breakdown.inHandSalary)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 