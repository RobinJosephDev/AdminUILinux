import { DeleteOutlined } from '@ant-design/icons';
import { Equipment } from '../../../types/CustomerTypes';

interface CustomerEquipmentProps {
  equipment: Equipment;
  index: number;
  onChange: (index: number, updatedEquipment: Equipment) => void;
  onRemove: (index: number) => void;
}

const CustomerEquipment: React.FC<CustomerEquipmentProps> = ({ equipment, index, onChange, onRemove }) => {
  const equipmentType = ['Van', 'Reefer', 'Flatbed', 'Triaxle', 'Maxi', 'Btrain', 'Roll tite'];

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (equipment && onChange) {
      onChange(index, { ...equipment, [name]: value });
    }
  };

  return (
    <fieldset className="form-section">
      <div className="contact-form">
        <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1, width: '23.3rem' }}>
            <label htmlFor={`customerType-${index}`}>Equipment Type</label>
            <select
              id={`customerType-${index}`}
              name="equipment"
              value={equipment?.equipment || ''}
              onChange={handleEquipmentChange}
            >
              {equipmentType.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="button" onClick={() => onRemove(index)} className="remove">
          <DeleteOutlined />
        </button>
      </div>
    </fieldset>
  );
};

export default CustomerEquipment;
