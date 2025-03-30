import React from 'react';
import { Followup } from '../../../types/FollowupTypes';

interface EditFuAddInfoProps {
  followupEdit: Followup;
  setFollowupEdit: (edit: Followup) => void;
}

const sanitizeInput = (value: string): string => {
  return value.trim().replace(/<[^>]*>?/gm, ''); // Removes HTML tags
};

const EditFuAddInfo: React.FC<EditFuAddInfoProps> = ({ followupEdit, setFollowupEdit }) => {
  const equipmentTypeOptions = ['Van', 'Reefer', 'Flatbed', 'Triaxle', 'Maxi', 'Btrain', 'Roll tite'];

  const handleInputChange = (field: keyof Followup, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFollowupEdit({ ...followupEdit, [field]: sanitizedValue });
  };

  return (
    <fieldset className="form-section">
      <legend>Additional Information</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {/* Equipment Dropdown */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="equipment">Equipment</label>
          <select id="equipment" value={followupEdit.equipment} onChange={(e) => handleInputChange('equipment', e.target.value)}>
            <option value="">Select Equipment Type</option>
            {equipmentTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Remarks Textarea */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="remarks">Remarks</label>
          <textarea
            id="remarks"
            value={followupEdit.remarks}
            onChange={(e) => handleInputChange('remarks', e.target.value)}
            maxLength={500} // Prevent excessive input
          />
        </div>

        {/* Notes Textarea */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={followupEdit.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            maxLength={500} // Prevent excessive input
          />
        </div>
      </div>
    </fieldset>
  );
};

export default EditFuAddInfo;
