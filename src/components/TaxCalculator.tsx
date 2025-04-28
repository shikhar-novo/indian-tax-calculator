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
    basicSalary: 0,
    hra: 0,
    specialAllowance: 0,
    rentPaid: 0,
    section80C: 0,
    section80D: 0,
    nps: 0,
    otherIncome: 0
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
            <label className="block text-sm font-medium mb-2">Basic Salary (Yearly)</label>
            <input
              type="number"
              name="basicSalary"
              value={inputs.basicSalary}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">HRA (Yearly)</label>
            <input
              type="number"
              name="hra"
              value={inputs.hra}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Special Allowance (Yearly)</label>
            <input
              type="number"
              name="specialAllowance"
              value={inputs.specialAllowance}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rent Paid (Yearly)</label>
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

          <div>
            <label className="block text-sm font-medium mb-2">Section 80C Investments</label>
            <input
              type="number"
              name="section80C"
              value={inputs.section80C}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Section 80D (Health Insurance)</label>
            <input
              type="number"
              name="section80D"
              value={inputs.section80D}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">NPS Contribution</label>
            <input
              type="number"
              name="nps"
              value={inputs.nps}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Other Income</label>
            <input
              type="number"
              name="otherIncome"
              value={inputs.otherIncome}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Calculate Tax
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Tax Calculation Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Total Salary:</p>
              <p>{formatCurrency(result.totalSalary)}</p>
            </div>
            <div>
              <p className="font-medium">HRA Exemption:</p>
              <p>{formatCurrency(result.hraExemption)}</p>
            </div>
            <div>
              <p className="font-medium">Taxable Salary (after HRA):</p>
              <p>{formatCurrency(result.taxableSalaryAfterHRA)}</p>
            </div>
            <div>
              <p className="font-medium">Total Deductions:</p>
              <p>{formatCurrency(result.totalDeductions)}</p>
            </div>
            <div>
              <p className="font-medium">Taxable Income:</p>
              <p>{formatCurrency(result.taxableIncome)}</p>
            </div>
            <div>
              <p className="font-medium">Total Tax:</p>
              <p>{formatCurrency(result.tax)}</p>
            </div>
            <div>
              <p className="font-medium">Health & Education Cess:</p>
              <p>{formatCurrency(result.healthAndEducationCess)}</p>
            </div>
            <div>
              <p className="font-medium">Professional Tax:</p>
              <p>{formatCurrency(result.professionalTax)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 