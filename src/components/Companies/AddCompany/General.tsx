import { useState } from 'react';
import { Company } from '../../../types/CompanyTypes';
import DOMPurify from 'dompurify';
import { z } from 'zod';

interface GeneralProps {
  company: Company;
  setCompany: React.Dispatch<React.SetStateAction<Company>>;
}

const companySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
  invoice_terms: z
    .string()
    .max(100, 'Invoice Terms cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  rate_conf_terms: z
    .string()
    .max(100, 'Rate Conf terms cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  quote_terms: z
    .string()
    .max(100, 'Quote Terms cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  invoice_reminder: z
    .string()
    .max(100, 'Inovice Reminder cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
});

const fields = [
  { key: 'name', label: 'Name', placeholder: 'Enter Name', type: 'text', required: true },
  { key: 'invoice_terms', label: 'Invoice Terms', placeholder: 'Enter Invoice Terms', type: 'textarea', required: true },
  { key: 'rate_conf_terms', label: 'Rate Conf terms', placeholder: 'Enter Rate Conf terms', type: 'textarea' },
  { key: 'quote_terms', label: 'Quote Terms', placeholder: 'Enter Quote Terms', type: 'textarea' },
  { key: 'invoice_reminder', label: 'Inovice Reminder', placeholder: 'Enter Inovice Reminder', type: 'textarea' },
];

const General: React.FC<GeneralProps> = ({ company, setCompany }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetCompany = (field: keyof Company, value: string) => {
    let sanitizedValue = DOMPurify.sanitize(value);

    let error = '';
    const tempCompany = { ...company, [field]: sanitizedValue };
    const result = companySchema.safeParse(tempCompany);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setCompany(tempCompany);
  };

  return (
    <fieldset className="form-section">
      <legend>General</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {/* Dynamic Input Fields */}
        {fields.map(({ key, label, placeholder, type, required }) => (
          <div key={key}>
            <div className="form-group" style={{ flex: '1 1 45%' }} key={key}>
              <label htmlFor={key}>
                {label} {required && <span style={{ color: 'red' }}>*</span>}
              </label>
              {type === 'textarea' ? (
                <textarea
                  id={key}
                  placeholder={placeholder}
                  value={String(company[key as keyof Company] || '')}
                  onChange={(e) => validateAndSetCompany(key as keyof Company, e.target.value)}
                  rows={4}
                  style={{ width: '100%' }}
                />
              ) : (
                <input
                  type="text"
                  id={key}
                  placeholder={placeholder}
                  value={String(company[key as keyof Company] || '')}
                  onChange={(e) => validateAndSetCompany(key as keyof Company, e.target.value)}
                />
              )}
              {errors[key] && (
                <span className="error" style={{ color: 'red' }}>
                  {errors[key]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default General;
