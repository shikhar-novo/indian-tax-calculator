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
  const [taxRegime, setTaxRegime] = useState<'old' | 'new'>('new');

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
    const calculationResult = calculateTax(inputs, taxRegime);
    setResult(calculationResult);
  };

  const handleRegimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxRegime(e.target.checked ? 'new' : 'old');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto">
        <div className="px-8 py-12">
          <h1 className="text-5xl font-bold mb-12 text-center text-gray-800">Indian Tax Calculator</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-10 mb-12">
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                <button
                  type="button"
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    taxRegime === 'old' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setTaxRegime('old')}
                >
                  Old Regime
                </button>
                <button
                  type="button"
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    taxRegime === 'new' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setTaxRegime('new')}
                >
                  New Regime
                </button>
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    {taxRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    {taxRegime === 'new' 
                      ? 'Under the new tax regime, you cannot claim most deductions and exemptions.'
                      : 'Under the old tax regime, you can claim various deductions and exemptions.'}
                  </div>
                </div>
              </div>
            </div>

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
                    disabled={taxRegime === 'new'}
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
                    disabled={taxRegime === 'new'}
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
                    disabled={taxRegime === 'new'}
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
                        <span className="text-gray-600">slab 1:</span>
                        <span className="font-medium">{formatCurrency(result.breakdown.taxSlabs.slab1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">slab 2:</span>
                        <span className="font-medium">{formatCurrency(result.breakdown.taxSlabs.slab2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">slab 3:</span>
                        <span className="font-medium">{formatCurrency(result.breakdown.taxSlabs.slab3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">slab 4:</span>
                        <span className="font-medium">{formatCurrency(result.breakdown.taxSlabs.slab4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">slab 5:</span>
                        <span className="font-medium">{formatCurrency(result.breakdown.taxSlabs.slab5)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">slab 6:</span>
                        <span className="font-medium">{formatCurrency(result.breakdown.taxSlabs.slab6)}</span>
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
                      <span className="font-medium">{formatCurrency(result.breakdown.grossSalaryAfterBasicDeductions)}</span>
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