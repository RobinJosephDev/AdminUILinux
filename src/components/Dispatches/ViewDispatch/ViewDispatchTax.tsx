import React, { useEffect } from 'react';

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

const ViewDispatchTax: React.FC<ViewDispatchTaxProps> = ({ formDispatch }) => {
  return (
    <fieldset className="form-section">
      <legend>Tax</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {['base_rateprice', 'gst', 'pst', 'hst', 'qst', 'final_price'].map((field) => (
          <div className="form-group" style={{ flex: 1 }} key={field}>
            <label>{field.replace('_', ' ').toUpperCase()}</label>
            <div>{formDispatch[field as keyof FormDispatch] || ''}</div>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default ViewDispatchTax;
