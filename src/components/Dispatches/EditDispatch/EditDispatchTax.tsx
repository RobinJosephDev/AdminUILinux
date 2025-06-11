import { useState, useEffect } from 'react';
import { Dispatch } from '../../../types/DispatchTypes';
import { z } from 'zod';

interface DispatchTaxProps {
  formDispatch: Dispatch;
  setFormDispatch: React.Dispatch<React.SetStateAction<Dispatch>>;
}

const formDispatchSchema = z.object({
  rate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid rate (e.g., 100.50)')
    .optional(),
  gst: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid GST amount (e.g., 5.00)')
    .optional(),
  pst: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid PST amount (e.g., 7.50)')
    .optional(),
  hst: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid HST amount (e.g., 13.00)')
    .optional(),
  qst: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid QST amount (e.g., 9.97)')
    .optional(),
  final_price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price (e.g., 150.75)')
    .optional(),
});

const fields = [
  { key: 'rate', label: 'Rate' },
  { key: 'gst', label: 'GST' },
  { key: 'pst', label: 'PST' },
  { key: 'hst', label: 'HST' },
  { key: 'qst', label: 'QST' },
];

const DispatchTax: React.FC<DispatchTaxProps> = ({ formDispatch, setFormDispatch }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetDispatch = (field: keyof Dispatch, value: string) => {
    const sanitizedValue = value.trim();
    let error = '';

    const tempDispatch = { ...formDispatch, [field]: sanitizedValue };
    const result = formDispatchSchema.safeParse(tempDispatch);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormDispatch(tempDispatch);
  };

  useEffect(() => {
    const rate = Number(formDispatch.rate) || 0;
    const gst = Number(formDispatch.gst) || 0;
    const pst = Number(formDispatch.pst) || 0;
    const hst = Number(formDispatch.hst) || 0;
    const qst = Number(formDispatch.qst) || 0;

    const finalPrice = (rate + gst + pst + hst + qst).toFixed(2);

    setFormDispatch((prevDispatch) => ({
      ...prevDispatch,
      final_price: finalPrice,
    }));
  }, [formDispatch.rate, formDispatch.gst, formDispatch.pst, formDispatch.hst, formDispatch.qst, setFormDispatch]);

  return (
    <fieldset className="form-section">
      <legend>Tax</legend>
      <hr />
      <div
        className="form-grid"
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {fields.map(({ label, key }) => (
          <div className="form-group" key={key} style={{ flex: '1 1 150px' }}>
            <label htmlFor={key}>{label}</label>
            <input
              type="text"
              id={key}
              placeholder={`Enter ${label}`}
              value={(formDispatch[key as keyof Dispatch] as string) || ''}
              onChange={(e) => validateAndSetDispatch(key as keyof Dispatch, e.target.value)}
            />
            {errors[key] && (
              <span className="error" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}
        <div className="form-group" style={{ flex: '1 1 150px' }}>
          <label htmlFor="final_price">Final Price</label>
          <input
            type="text"
            id="final_price"
            value={formDispatch.final_price || '0.00'}
            readOnly
            style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default DispatchTax;
