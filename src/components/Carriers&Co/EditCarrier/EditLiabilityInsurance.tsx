import { useState } from 'react';
import { Carrier } from '../../../types/CarrierTypes';
import * as z from 'zod';
import DOMPurify from 'dompurify';

interface EditLiabilityInsuranceProps {
  formCarrier: Carrier;
  setFormCarrier: React.Dispatch<React.SetStateAction<Carrier>>;
}

const sanitizeInput = (input: string) => DOMPurify.sanitize(input);

const parseDate = (dateStr: string) => new Date(dateStr);

const formatDateForInput = (dateStr?: string) => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '';
  return dateStr;
};

const carrierSchema = z
  .object({
    li_provider: z
      .string()
      .max(150, 'Liability Insurance Provider must be at most 150 characters')
      .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
      .optional(),
    li_policy_no: z
      .string()
      .max(50, 'Policy Number must be at most 50 characters')
      .regex(/^[a-zA-Z0-9\s.-]*$/, 'Only letters, numbers, spaces, periods, and hyphens allowed')
      .optional(),
    li_coverage: z.number().optional(),
    li_start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Start date must be in YYYY-MM-DD format' })
      .optional(),
    li_end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'End date must be in YYYY-MM-DD format' })
      .optional(),
  })
  .refine((data) => !data.li_start_date || !data.li_end_date || parseDate(data.li_start_date) <= parseDate(data.li_end_date), {
    message: 'End date must be after or equal to start date',
    path: ['li_end_date'],
  });

const EditLiabilityInsurance: React.FC<EditLiabilityInsuranceProps> = ({ formCarrier, setFormCarrier }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: keyof Carrier, value: string | number | undefined) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    let transformedValue = sanitizedValue;

    if ((key === 'li_start_date' || key === 'li_end_date') && typeof sanitizedValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(sanitizedValue)) {
      transformedValue = sanitizedValue;
    }
    const newCarrier = { ...formCarrier, [key]: transformedValue };

    const result = carrierSchema.safeParse(newCarrier);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
    setFormCarrier(newCarrier);
  };

  const fields = [
    { label: 'Liability Insurance Provider', key: 'li_provider', type: 'text', placeholder: 'Provider' },
    { label: 'Policy Number', key: 'li_policy_no', type: 'text', placeholder: 'Policy Number' },
    { label: 'Coverage Amount', key: 'li_coverage', type: 'number', placeholder: 'Coverage Amount' },
    { label: 'Start Date', key: 'li_start_date', type: 'date' },
    { label: 'End Date', key: 'li_end_date', type: 'date' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Liability Insurance Details</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key, type, placeholder }) => (
          <div key={key} className="form-group" style={{ flex: 1 }}>
            <label htmlFor={key}>{label}</label>
            <input
              type={type}
              id={key}
              value={
                type === 'date'
                  ? formatDateForInput(formCarrier[key as keyof Carrier] as string)
                  : (formCarrier[key as keyof Carrier] as string | number | undefined) || ''
              }
              onChange={(e) =>
                handleChange(key as keyof Carrier, type === 'number' ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value)
              }
              placeholder={placeholder || ''}
            />
            {errors[key] && (
              <span className="error-text" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default EditLiabilityInsurance;
