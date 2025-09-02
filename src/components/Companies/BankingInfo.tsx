import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FC, useCallback, useState } from 'react';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { Bank } from '../../types/CompanyTypes';

interface BankingInfoProps {
  bank_info: Bank[];
  index: number;
  onAddBank: () => void;
  handleBankChange: (index: number, updatedBank: Bank) => void;
  handleRemoveBank: (index: number) => void;
}

const bankSchema = z.object({
  name: z
    .string()
    .max(200, 'Name must be at most 200 characters')
    .regex(/^[a-zA-Z\s.,'-]+$/, 'Only letters, spaces, apostrophes, periods,commas and hyphens allowed')
    .optional(),
  phone: z
    .string()
    .max(30, 'Phone cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  email: z.string().max(255, 'Email must be at most 255 characters').email('Invalid email format').optional(),
  address: z
    .string()
    .max(255, 'Address is too long')
    .regex(/^[a-zA-Z0-9\s,.'-]*$/, 'Invalid street format')
    .optional(),
  us_account_no: z
    .string()
    .max(100, 'US Account# must be at most 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Only letters, numbers, spaces, apostrophes, periods,commas and hyphens allowed')
    .optional(),
  cdn_account_no: z
    .string()
    .max(100, 'CAN Account# must be at most 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Only letters, numbers, spaces, apostrophes, periods,commas and hyphens allowed')
    .optional(),
});

const BankingInfo: FC<BankingInfoProps> = ({ bank_info, index, handleBankChange, handleRemoveBank, onAddBank }) => {
  const banking_info = bank_info[index] ?? {};
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetBank = useCallback(
    (field: keyof Bank, value: string) => {
      const sanitizedValue = DOMPurify.sanitize(value);
      let error = '';

      const updatedBank = { ...banking_info, [field]: sanitizedValue };
      const result = bankSchema.safeParse(updatedBank);

      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === field);
        error = fieldError ? fieldError.message : '';
      }

      setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
      handleBankChange(index, updatedBank);
    },
    [banking_info, handleBankChange, index]
  );

  const fields = [
    { label: 'Name', key: 'name', type: 'text', placeholder: 'Enter Name' },
    { label: 'Phone', key: 'phone', type: 'tel', placeholder: 'Enter Phone' },
    { label: 'Email', key: 'email', type: 'email', placeholder: 'Enter Email' },
    { label: 'Address', key: 'address', type: 'text', placeholder: 'Enter Address' },
    { label: 'US Account#', key: 'us_account_no', type: 'text', placeholder: 'Enter US Account#' },
    { label: 'CAN Account#', key: 'cdn_account_no', type: 'text', placeholder: 'Enter CAN Account#' },
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
              value={(banking_info[key as keyof Bank] as string) || ''}
              onChange={(e) => validateAndSetBank(key as keyof Bank, e.target.value)}
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
        <button type="button" onClick={onAddBank} className="add-button">
          <PlusOutlined />
        </button>
        <button type="button" onClick={() => handleRemoveBank(index)} className="delete-button">
          <DeleteOutlined />
        </button>
      </div>
    </fieldset>
  );
};

export default BankingInfo;
