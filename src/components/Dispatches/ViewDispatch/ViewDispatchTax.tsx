import React from 'react';

interface FormDispatch {
  rate?: string;
  gst?: string;
  pst?: string;
  hst?: string;
  qst?: string;
  final_price?: string;
}

interface ViewDispatchTaxProps {
  formDispatch: FormDispatch;
}

// Utility to convert snake_case to Pascal Case
const toPascalCase = (text: string): string => {
  return text
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ViewDispatchTax: React.FC<ViewDispatchTaxProps> = ({ formDispatch }) => {
  return (
    <fieldset className="form-section">
      <legend>Tax</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {['rate', 'gst', 'pst', 'hst', 'qst', 'final_price'].map((field) => (
          <div className="form-group" style={{ flex: 1 }} key={field}>
            <label>{toPascalCase(field)}</label>
            <div>{formDispatch[field as keyof FormDispatch] || ''}</div>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default ViewDispatchTax;
