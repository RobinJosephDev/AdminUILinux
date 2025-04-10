import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { Equipment } from '../../types/CarrierTypes';

interface CarrierEquipmentProps {
  equipments: Equipment[];
  index: number;
  onAddEquipment: () => void;
  handleEquipmentChange: (index: number, updatedEquipment: Equipment) => void;
  handleRemoveEquipment: (index: number) => void;
}

// Updated: use objects with id and name
const equipmentTypeOptions = [
  { id: 1, name: "Dry Van 53'" },
  { id: 2, name: "Reefer 53'" },
  { id: 3, name: "Flatbed 53'" },
];

// Updated: accept numeric ID
const equipmentTypeSchema = z.object({
  equipment: z
    .number({
      required_error: 'Equipment type is required',
      invalid_type_error: '',
    })
    .min(1, 'Please select a valid equipment type'),
});

const CarrierEquipment: React.FC<CarrierEquipmentProps> = ({ equipments, index, handleEquipmentChange, handleRemoveEquipment, onAddEquipment }) => {
  const equipment = equipments[index] ?? {};
  const [errors, setErrors] = useState<{ equipment?: string }>({});

  const validateAndSetEquipment = useCallback(
    (field: keyof Equipment, value: string) => {
      const sanitizedValue = DOMPurify.sanitize(value);
      const numericValue = Number(sanitizedValue);

      const updatedEquipment: Equipment = {
        ...equipment,
        [field]: sanitizedValue || undefined,
      };

      const result = equipmentTypeSchema.safeParse(updatedEquipment);

      let error = '';
      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === field);
        error = fieldError ? fieldError.message : '';
      }

      setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
      handleEquipmentChange(index, updatedEquipment);
    },
    [equipment, handleEquipmentChange, index]
  );

  return (
    <fieldset
      className="form-section"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor={`equipment-${index}`}>Equipment Type</label>
        <select
          id={`equipment-${index}`}
          name="equipment"
          value={equipment.equipment ?? ''}
          onChange={(e) => validateAndSetEquipment('equipment', e.target.value)}
          style={{ width: '180px', padding: '8px' }}
        >
          <option value="">Select Equipment</option>
          {equipmentTypeOptions.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
        {errors.equipment && (
          <span className="error" style={{ color: 'red' }}>
            {errors.equipment}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
        <button type="button" onClick={onAddEquipment} className="add-button">
          <PlusOutlined />
        </button>
        <button type="button" onClick={() => handleRemoveEquipment(index)} className="delete-button">
          <DeleteOutlined />
        </button>
      </div>
    </fieldset>
  );
};

export default CarrierEquipment;
