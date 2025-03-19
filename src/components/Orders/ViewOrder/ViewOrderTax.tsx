import React, { useEffect } from 'react';

interface FormOrder {
  base_price?: string;
  gst?: string;
  pst?: string;
  hst?: string;
  qst?: string;
  final_price?: string;
  notes?: string;
}

interface ViewOrderTaxProps {
  formOrder: FormOrder;
  setFormOrder: (order: FormOrder) => void;
}

const ViewOrderTax: React.FC<ViewOrderTaxProps> = ({ formOrder, setFormOrder }) => {
  useEffect(() => {
    const gst = parseFloat(formOrder.gst || '0');
    const pst = parseFloat(formOrder.pst || '0');
    const hst = parseFloat(formOrder.hst || '0');
    const qst = parseFloat(formOrder.qst || '0');
    const basePrice = parseFloat(formOrder.base_price || '0');

    const total = basePrice + gst + pst + hst + qst;
    setFormOrder({ ...formOrder, final_price: total.toFixed(2) });
  }, [formOrder.gst, formOrder.pst, formOrder.hst, formOrder.qst, formOrder.base_price]);

  return (
    <fieldset className="form-section">
      <legend>Tax</legend>
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {['base_price', 'gst', 'pst', 'hst', 'qst', 'final_price'].map((field) => (
          <div className="form-group" style={{ flex: 1 }} key={field}>
            <label>{field.replace('_', ' ').toUpperCase()}</label>
            <div>{formOrder[field as keyof FormOrder] || ''}</div>
          </div>
        ))}
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Notes</label>
          <div>{formOrder.notes || ''}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewOrderTax;
