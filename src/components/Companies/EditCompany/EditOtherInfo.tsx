import { useState } from 'react';
import { Company } from '../../../types/CompanyTypes';
import { z } from 'zod';
import DOMPurify from 'dompurify';

interface EditOtherInfoProps {
  formCompany: Company;
  setFormCompany: React.Dispatch<React.SetStateAction<Company>>;
}

const companySchema = z.object({
  us_tax_id: z
    .string()
    .max(20, 'US Tax id cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  payroll_no: z
    .string()
    .max(20, 'Payroll Number cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  wcb_no: z.string().max(50, 'WCB# must be at most 50 characters').regex(/^\d*$/, 'WCB# must be numeric').optional(),
  dispatch_email: z.string().max(255, 'Email cannot exceed 255 characters').email('Invalid email format').optional(),
  ap_email: z.string().max(255, 'Email cannot exceed 255 characters').email('Invalid email format').optional(),
  ar_email: z.string().max(255, 'Email cannot exceed 255 characters').email('Invalid email format').optional(),
  cust_comm_email: z.string().max(255, 'Email cannot exceed 255 characters').email('Invalid email format').optional(),
  quot_email: z.string().max(255, 'Email cannot exceed 255 characters').email('Invalid email format').optional(),
});

function EditOtherInfo({ formCompany, setFormCompany }: EditOtherInfoProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetCompany = (field: keyof Company, value: string | boolean) => {
    let sanitizedValue: string | boolean = typeof value === 'boolean' ? value : DOMPurify.sanitize(value);

    let error = '';
    const tempCompany = { ...formCompany, [field]: sanitizedValue };
    const result = companySchema.safeParse(tempCompany);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormCompany(tempCompany);
  };

  const fields = [
    { key: 'us_tax_id', label: 'US Tax id', placeholder: 'Enter US Tax id', type: 'text' },
    { key: 'payroll_no', label: 'Payroll#', placeholder: 'Enter Payroll Number', type: 'text' },
    { key: 'wcb_no', label: 'WCB#', placeholder: 'Enter WCB Number', type: 'text' },
    { key: 'dispatch_email', label: 'Dispatch Email', placeholder: 'Enter Dispatch Email', type: 'text' },
    { key: 'ap_email', label: 'Account Payable Email', placeholder: 'Enter Payable Email', type: 'text' },
    { key: 'ar_email', label: 'Account Receivable email', placeholder: 'Enter Receivable Email', type: 'text' },
    { key: 'cust_comm_email', label: 'Customer Communication Email', placeholder: 'Enter Customer Communication Email', type: 'text' },
    { key: 'quot_email', label: 'Quotation Email', placeholder: 'Enter Quotation Email', type: 'text' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Other Info</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {/* Dynamic Input Fields */}
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <div className="form-group" style={{ flex: '1 1 45%' }} key={key}>
              <label htmlFor={key}>{label}</label>

              <input
                type="text"
                id={key}
                placeholder={placeholder}
                value={String(formCompany[key as keyof Company] || '')}
                onChange={(e) => validateAndSetCompany(key as keyof Company, e.target.value)}
              />

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
}

export default EditOtherInfo;
