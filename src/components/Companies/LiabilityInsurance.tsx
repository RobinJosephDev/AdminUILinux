import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FC, useCallback, useState } from 'react';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { Liability } from '../../types/CompanyTypes';

interface LiabilityInsuranceProps {
  liablility_insurance: Liability[];
  index: number;
  onAddLiability: () => void;
  handleLiabilityChange: (index: number, updatedLiability: Liability) => void;
  handleRemoveLiability: (index: number) => void;
}

const liabilitySchema = z.object({
  company: z
    .string()
    .max(200, 'Name must be at most 200 characters')
    .regex(/^[a-zA-Z\s.,'-]+$/, 'Only letters, spaces, apostrophes, periods,commas and hyphens allowed')
    .optional(),
  policy_start: z
    .string()
    .max(30, 'Phone cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  policy_end: z
    .string()
    .max(255, 'Address is too long')
    .regex(/^[a-zA-Z0-9\s,.'-]*$/, 'Invalid street format')
    .optional(),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount (e.g., 5.00)')
    .optional(),
});

const LiabilityInsurance: FC<LiabilityInsuranceProps> = ({
  liablility_insurance,
  index,
  handleLiabilityChange,
  handleRemoveLiability,
  onAddLiability,
}) => {
  const liablility_ins = liablility_insurance[index] ?? {};
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetLiability = useCallback(
    (field: keyof Liability, value: string) => {
      const sanitizedValue = DOMPurify.sanitize(value);
      let error = '';

      const updatedLiability = { ...liablility_ins, [field]: sanitizedValue };
      const result = liabilitySchema.safeParse(updatedLiability);

      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === field);
        error = fieldError ? fieldError.message : '';
      }

      setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
      handleLiabilityChange(index, updatedLiability);
    },
    [liablility_ins, handleLiabilityChange, index]
  );

  const fields = [
    { label: 'Company', key: 'company', type: 'text', placeholder: 'Enter Company Name' },
    { label: 'Policy Start', key: 'policy_start', type: 'date' },
    { label: 'Policy End', key: 'policy_end', type: 'date' },
    { label: 'Amount', key: 'amount', type: 'text', placeholder: 'Enter Amount' },
  ];

  return (
    <fieldset className="form-section" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div className="form-grid" style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(5, 1fr)', flex: 1 }}>
        {fields.map(({ label, key, type, placeholder }) => (
          <div className="form-group" key={key} style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor={`${key}-${index}`}>{label}</label>
            <input
              id={`${key}-${index}`}
              type={type}
              name={key}
              value={(liablility_ins[key as keyof Liability] as string) || ''}
              onChange={(e) => validateAndSetLiability(key as keyof Liability, e.target.value)}
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
        <button type="button" onClick={onAddLiability} className="add-button">
          <PlusOutlined />
        </button>
        <button type="button" onClick={() => handleRemoveLiability(index)} className="delete-button">
          <DeleteOutlined />
        </button>
      </div>
    </fieldset>
  );
};

export default LiabilityInsurance;
