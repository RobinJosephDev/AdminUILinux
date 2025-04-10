import { FC, useState } from 'react';
import { Vendor } from '../../../types/VendorTypes';
import { z } from 'zod';
import DOMPurify from 'dompurify';

interface VendorCargoInsuranceProps {
  vendor: Vendor;
  setVendor: React.Dispatch<React.SetStateAction<Vendor>>;
}
const sanitizeInput = (input: string) => DOMPurify.sanitize(input);

const parseDate = (dateStr: string) => new Date(dateStr); 

const formatDateForInput = (dateStr?: string) => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '';
  return dateStr;
};
const vendorCargoSchema = z
  .object({
    cargo_company: z
      .string()
      .max(150, 'Cargo company must be at most 150 characters')
      .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
      .optional(),
    cargo_policy_start: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Start date must be in YYYY-MM-DD format' })
      .optional(),
    cargo_policy_end: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'End date must be in YYYY-MM-DD format' })
      .optional(),
    cargo_ins_amt: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Coverage amount must be a valid number')
      .optional(),
  })
  .refine((data) => !data.cargo_policy_start || !data.cargo_policy_end || parseDate(data.cargo_policy_start) <= parseDate(data.cargo_policy_end), {
    message: 'End date must be after or equal to start date',
    path: ['cargo_policy_end'],
  });

const VendorCargoInsurance: FC<VendorCargoInsuranceProps> = ({ vendor, setVendor }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (key: keyof Vendor, value: string | number | undefined) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;

    let transformedValue = sanitizedValue;

    if (
      (key === 'cargo_policy_start' || key === 'cargo_policy_end') &&
      typeof sanitizedValue === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(sanitizedValue)
    ) {
      transformedValue = sanitizedValue;
    }

    const newVendor = { ...vendor, [key]: transformedValue };
    const result = vendorCargoSchema.safeParse(newVendor);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }

    setVendor(newVendor);
  };

  const fields: { label: string; key: keyof Vendor; type?: string; placeholder?: string }[] = [
    { label: 'Cargo Insurance Provider', key: 'cargo_company', placeholder: 'Enter provider name' },
    { label: 'Start Date', key: 'cargo_policy_start', type: 'date' },
    { label: 'End Date', key: 'cargo_policy_end', type: 'date' },
    { label: 'Coverage Amount', key: 'cargo_ins_amt', type: 'text', placeholder: 'Enter coverage amount' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Cargo Insurance Details</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key, type, placeholder }) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              id={key}
              type={type || 'text'}
              value={
                type === 'date' ? formatDateForInput(vendor[key as keyof Vendor] as string) : (vendor[key as keyof Vendor] as string | number) || ''
              }
              onChange={(e) => handleChange(key as keyof Vendor, type === 'number' ? Number(e.target.value) : e.target.value)}
              placeholder={placeholder}
            />
            {errors[key] && (
              <span className="error" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default VendorCargoInsurance;
