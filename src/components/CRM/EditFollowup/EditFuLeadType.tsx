import { Followup } from '../../../types/FollowupTypes';

interface EditFuLeadTypeProps {
  followupEdit: Followup;
  setFollowupEdit: (edit: Followup) => void;
}

const sanitizeInput = (value: string): string => {
  return value.trim().replace(/<[^>]*>?/gm, ''); // Removes potential HTML/script tags
};

const EditFuLeadType: React.FC<EditFuLeadTypeProps> = ({ followupEdit, setFollowupEdit }) => {
  const leadTypeOptions = ['AB', 'BC', 'BDS', 'CA', 'DPD MAGMA', 'MB', 'ON', 'Super Leads', 'TBAB', 'USA'];

  const handleInputChange = (field: keyof Followup, value: string) => {
    setFollowupEdit({ ...followupEdit, [field]: sanitizeInput(value) });
  };

  return (
    <fieldset className="form-section">
      <legend>Lead Type and Contact</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {/* Lead Type Dropdown */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadType">Lead Type</label>
          <select id="leadType" value={followupEdit.lead_type || ''} onChange={(e) => handleInputChange('lead_type', e.target.value)}>
            <option value="">Select Lead Type</option>
            {leadTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Contact Person */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="contactPerson">Contact Person</label>
          <input
            type="text"
            id="contactPerson"
            value={followupEdit.contact_person || ''}
            onChange={(e) => handleInputChange('contact_person', e.target.value)}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default EditFuLeadType;
