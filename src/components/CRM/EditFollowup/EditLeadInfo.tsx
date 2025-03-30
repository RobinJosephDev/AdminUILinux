import { Followup } from '../../../types/FollowupTypes';

interface EditLeadInfoProps {
  followupEdit: Followup;
  setFollowupEdit: (edit: Followup) => void;
}

const sanitizeInput = (value: string): string => {
  return value.trim().replace(/<[^>]*>?/gm, ''); // Removes HTML/script tags
};

const EditLeadInfo: React.FC<EditLeadInfoProps> = ({ followupEdit, setFollowupEdit }) => {
  const handleInputChange = (field: keyof Followup, value: string) => {
    setFollowupEdit({ ...followupEdit, [field]: sanitizeInput(value) });
  };

  return (
    <fieldset className="form-section">
      <legend>Lead Information</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {/* Lead No */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadNo">Lead No*</label>
          <input type="text" id="leadNo" value={followupEdit.lead_no || ''} onChange={(e) => handleInputChange('lead_no', e.target.value)} required />
        </div>

        {/* Lead Date */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadDate">Lead Date</label>
          <input type="date" id="leadDate" value={followupEdit.lead_date || ''} onChange={(e) => handleInputChange('lead_date', e.target.value)} />
        </div>
      </div>

      {/* Customer Name */}
      <div className="form-row">
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="customerName">Customer Name</label>
          <input
            type="text"
            id="customerName"
            value={followupEdit.customer_name || ''}
            onChange={(e) => handleInputChange('customer_name', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {/* Phone */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" value={followupEdit.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} />
        </div>

        {/* Email */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={followupEdit.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} />
        </div>
      </div>
    </fieldset>
  );
};

export default EditLeadInfo;
