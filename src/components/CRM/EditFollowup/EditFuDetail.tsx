import React from 'react';
import { Followup } from '../../../types/FollowupTypes';

interface EditFuDetailProps {
  followupEdit: Followup;
  setFollowupEdit: (edit: Followup) => void;
}

const sanitizeInput = (value: string): string => {
  return value.trim().replace(/<[^>]*>?/gm, ''); // Remove HTML tags
};

const EditFuDetail: React.FC<EditFuDetailProps> = ({ followupEdit, setFollowupEdit }) => {
  const leadStatusOptions: string[] = ['Select Status', 'New', 'In Progress', 'Completed', 'On Hold', 'Lost'];

  const handleInputChange = (field: keyof Followup, value: string) => {
    setFollowupEdit({ ...followupEdit, [field]: sanitizeInput(value) });
  };

  return (
    <fieldset className="form-section">
      <legend>Follow Up Details</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {/* Next Follow-Up Date */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="nextFollowUpDate">Next Follow-Up Date</label>
          <input
            type="date"
            id="nextFollowUpDate"
            value={followupEdit.next_follow_up_date}
            onChange={(e) => handleInputChange('next_follow_up_date', e.target.value)}
          />
        </div>

        {/* Lead Status */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadStatus">Lead Status*</label>
          <select id="leadStatus" value={followupEdit.lead_status} onChange={(e) => handleInputChange('lead_status', e.target.value)} required>
            <option value="">Select Lead Status</option>
            {leadStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  );
};

export default EditFuDetail;
