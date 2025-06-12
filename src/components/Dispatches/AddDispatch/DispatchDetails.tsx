import { useState, useEffect } from 'react';
import { Dispatch } from '../../../types/DispatchTypes';
import { z } from 'zod';
import axios from 'axios';
import { Carrier } from '../../../types/CarrierTypes';

interface DispatchDetailsProps {
  dispatch: Dispatch;
  setDispatch: React.Dispatch<React.SetStateAction<Dispatch>>;
}

const dispatchSchema = z.object({
  carrier: z
    .string()
    .min(1, 'Carrier is required')
    .max(200, 'Carrier cannot exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
  contact: z
    .string()
    .max(30, 'Contact cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  equipment: z.enum(["DRY VAN 53'", "FLATBED 53'", "REEFER 53'"], {
    errorMap: () => ({ message: 'Invalid equipment type' }),
  }),
  driver_mobile: z
    .string()
    .max(30, 'Driver cell cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  truck_unit_no: z
    .string()
    .max(20, 'Truck unit no cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-_\/]*$/, 'Only letters, numbers, dashes, underscores, and slashes allowed')
    .optional(),
  trailer_unit_no: z
    .string()
    .max(20, 'Trailer unit no cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-_\/]*$/, 'Only letters, numbers, dashes, underscores, and slashes allowed')
    .optional(),
  paps_pars_no: z
    .string()
    .max(20, 'PAPS#/PARS# cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-_\/]*$/, 'Only letters, numbers, dashes, underscores, and slashes allowed')
    .optional(),
  tracking_code: z
    .string()
    .max(200, 'Tracking code cannot exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  border: z
    .string()
    .max(100, 'Border cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  currency: z.enum(['CAD', 'USD'], {
    errorMap: () => ({ message: 'Invalid currency' }),
  }),
});

const fields = [
  { key: 'contact', label: 'Contact', placeholder: 'Enter Contact', type: 'text' },
  { key: 'equipment', label: 'Equipment', placeholder: 'Enter Equipment', type: 'dropdown' },
  { key: 'driver_mobile', label: 'Driver Cell', placeholder: 'Enter Driver Cell', type: 'text' },
  { key: 'truck_unit_no', label: 'Truck Unit No', placeholder: 'Enter Truck Unit No', type: 'text' },
  { key: 'trailer_unit_no', label: 'Trailer Unit No', placeholder: 'Enter Trailer Unit No', type: 'text' },
  { key: 'paps_pars_no', label: 'PAPS#/PARS#', placeholder: 'Enter PAPS#/PARS#', type: 'text' },
  { key: 'tracking_code', label: 'Tracking Code', placeholder: 'Enter Tracking Code', type: 'text' },
  { key: 'border', label: 'Border', placeholder: 'Enter Border', type: 'text' },
  { key: 'currency', label: 'Currency', placeholder: 'Enter Currency', type: 'dropdown' },
];

const DispatchDetails: React.FC<DispatchDetailsProps> = ({ dispatch, setDispatch }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [carriers, setCarriers] = useState<{ value: string; label: string }[]>([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Carrier[]>(`${API_URL}/carrier`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response || !response.data) {
          console.error('API response is undefined or invalid:', response);
          return;
        }

        console.log('Fetched carriers:', response.data);

        const formattedCarriers = response.data.map((carrier) => ({
          value: carrier.dba,
          label: carrier.dba,
        }));

        setCarriers(formattedCarriers);
      } catch (error) {
        console.error('Error fetching carriers:', error);
      }
    };

    fetchCarriers();
  }, []);

  const validateAndSetDispatch = (field: keyof Dispatch, value: string | boolean) => {
    let sanitizedValue = value;

    let error = '';
    const tempDispatch = { ...dispatch, [field]: sanitizedValue };
    const result = dispatchSchema.safeParse(tempDispatch);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setDispatch(tempDispatch);
  };

  return (
    <fieldset className="form-section">
      <legend>Dispatch Details</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="carrier">
            Carrier <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="quote_carrier"
            value={dispatch.carrier || ''}
            onChange={(e) => validateAndSetDispatch('carrier', e.target.value)}
            onBlur={() => validateAndSetDispatch('carrier', dispatch.carrier || '')}
          >
            <option value="" disabled>
              Select a carrier
            </option>
            {carriers.length > 0 ? (
              carriers.map((carrier, index) => (
                <option key={`${carrier.value}-${index}`} value={carrier.value}>
                  {carrier.label}
                </option>
              ))
            ) : (
              <option disabled>No carriers found</option>
            )}
          </select>
          {errors.carrier && (
            <span className="error" style={{ color: 'red' }}>
              {errors.carrier}
            </span>
          )}
        </div>
        {fields.map(({ key, label, placeholder, type }) => (
          <div className="form-group" key={key} style={{ flex: '1 1 45%' }}>
            <label htmlFor={key}>{label}</label>
            {type === 'dropdown' ? (
              <select
                id={key}
                value={String(dispatch[key as keyof Dispatch] || '')}
                onChange={(e) => validateAndSetDispatch(key as keyof Dispatch, e.target.value)}
              >
                <option value="" disabled>
                  Select {label.toLowerCase()}
                </option>
                {key === 'equipment' &&
                  ["DRY VAN 53'", "FLATBED 53'", "REEFER 53'"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                {key === 'currency' &&
                  ['CAD', 'USD'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            ) : (
              <input
                type="text"
                id={key}
                placeholder={placeholder}
                value={String(dispatch[key as keyof Dispatch] || '')}
                onChange={(e) => validateAndSetDispatch(key as keyof Dispatch, e.target.value)}
              />
            )}
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

export default DispatchDetails;
