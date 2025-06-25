import { useState, useEffect } from 'react';
import { Company } from '../../../types/CompanyTypes';
import * as z from 'zod';
import DOMPurify from 'dompurify';
import { useGoogleAutocomplete } from '../../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}

interface EditAddressProps {
  formCompany: Company;
  setFormCompany: React.Dispatch<React.SetStateAction<Company>>;
}

const addressSchema = z.object({
  address: z
    .string()
    .max(255, 'Address is too long')
    .regex(/^[a-zA-Z0-9\s,.'-]*$/, 'Invalid street format')
    .optional(),
  city: z
    .string()
    .max(200, 'City name is too long')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid city format')
    .optional(),
  state: z
    .string()
    .max(200, 'Invalid state')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid state format')
    .optional(),
  country: z
    .string()
    .max(100, 'Invalid country')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid country format')
    .optional(),
  postal: z
    .string()
    .max(20, 'Postal code cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-\s ]*$/, 'Invalid postal code')
    .optional(),
  phone: z
    .string()
    .max(30, 'Phone cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  cell: z
    .string()
    .max(30, 'Cell number cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  fax: z
    .string()
    .max(20, 'Fax exceed 20 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid fax format')
    .optional(),
  invoice_prefix: z
    .string()
    .max(10, 'Invoice Prefix cannot exceed 10 characters')
    .regex(/^[a-zA-Z0-9-_]*$/, 'Only letters, numbers, hyphens, and underscores allowed')
    .optional(),
  SCAC: z
    .string()
    .max(10, 'SCAC cannot exceed 10 characters')
    .regex(/^[A-Z0-9-]*$/, 'Only uppercase letters, numbers, and dashes allowed')
    .optional(),
  docket_no: z
    .string()
    .max(20, 'Docket number cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  carrier_code: z
    .string()
    .max(30, 'Carrier Code cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  gst_hst_no: z
    .string()
    .max(30, 'GST/HST Number cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  qst_no: z
    .string()
    .max(30, 'QST Number cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  ca_bond_no: z
    .string()
    .max(30, 'CA Bond Number cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  website: z.string().url('Invalid website URL').max(100, 'Website URL is too long').optional(),
  obsolete: z.boolean().optional(),
});

function EditAddress({ formCompany, setFormCompany }: EditAddressProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAddressFields = (place: google.maps.places.PlaceResult) => {
    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';
    setFormCompany((prev) => ({
      ...prev,
      address: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
      city: getComponent('locality'),
      state: getComponent('administrative_area_level_1'),
      country: getComponent('country'),
      postal: getComponent('postal_code'),
    }));
  };
  const addressRef = useGoogleAutocomplete(updateAddressFields);

  const validateAndSetField = (field: keyof Company, value: string | boolean) => {
    let sanitizedValue: string | boolean = typeof value === 'boolean' ? value : DOMPurify.sanitize(value);
    let error = '';

    const tempCompany = { ...formCompany, [field]: sanitizedValue };

    if (field in addressSchema.shape) {
      const result = addressSchema.safeParse(tempCompany);

      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === field);
        error = fieldError ? fieldError.message : '';
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormCompany(tempCompany);
  };

  const fields = [
    { label: 'Street', key: 'address', placeholder: 'Enter Address', required: true },
    { label: 'City', key: 'city', placeholder: 'Enter City' },
    { label: 'State', key: 'state', placeholder: 'Enter State' },
    { label: 'Country', key: 'country', placeholder: 'Enter Country' },
    { label: 'Postal Code', key: 'postal', placeholder: 'Enter postal code' },
    { label: 'Phone', key: 'phone', placeholder: 'Enter phone number' },
    { label: 'Cell', key: 'cell', placeholder: 'Enter Cell' },
    { label: 'Fax', key: 'fax', placeholder: 'Enter Fax' },
    { label: 'Invoice Prefix', key: 'invoice_prefix', placeholder: 'Enter Invoice Prefix' },
    { label: 'SCAC', key: 'SCAC', placeholder: 'Enter SCAC' },
    { label: 'Docket#', key: 'docket_no', placeholder: 'Enter Docket Number' },
    { label: 'Carrier Code', key: 'carrier_code', placeholder: 'Enter Carrier Code' },
    { label: 'GST/HST#', key: 'gst_hst_no', placeholder: 'Enter GST/HST Number' },
    { label: 'QST#', key: 'qst_no', placeholder: 'Enter QST Number' },
    { label: 'CA Bond#', key: 'ca_bond_no', placeholder: 'Enter CA Bond Number' },
    { label: 'Website', key: 'website', placeholder: 'Enter Website' },
    { key: 'obsolete', label: 'Obsolete', type: 'boolean' },
  ];

  return (
    <fieldset>
      <legend>Address</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {/* Dynamic Input Fields */}
        {fields.map(({ key, label, placeholder, type, required }) => (
          <div key={key}>
            <div className="form-group" style={{ flex: '1 1 45%' }} key={key}>
              {type === 'boolean' ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id={key}
                    checked={!!formCompany[key as keyof Company]}
                    onChange={(e) => validateAndSetField(key as keyof Company, e.target.checked)}
                    style={{ transform: 'scale(1.1)', cursor: 'pointer', margin: 0 }}
                  />
                  <label htmlFor={key} style={{ margin: 0, whiteSpace: 'nowrap' }}>
                    {label}
                  </label>
                </div>
              ) : (
                <div className="form-group" style={{ flex: '1 1 45%' }}>
                  <label htmlFor={key}>
                    {label} {required && <span style={{ color: 'red' }}>*</span>}
                  </label>{' '}
                  <input
                    type="text"
                    id={key}
                    placeholder={placeholder}
                    value={String(formCompany[key as keyof Company] || '')}
                    onChange={(e) => validateAndSetField(key as keyof Company, e.target.value)}
                  />
                </div>
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
}

export default EditAddress;
