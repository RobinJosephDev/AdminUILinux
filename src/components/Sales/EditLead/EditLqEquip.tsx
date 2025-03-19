import React from 'react';

interface EditLqEquipProps {
  formLead: {
    equipment_type: string;
    lead_type: string;
    lead_status: string;
  };
  setFormLead: (formLead: any) => void;
}

const EditLqEquip: React.FC<EditLqEquipProps> = ({ formLead, setFormLead }) => {
  const equipmentTypeOptions = ['Van', 'Reefer', 'Flatbed', 'Triaxle', 'Maxi', 'Btrain', 'Roll tite'];
  const leadTypeOptions = ['AB', 'BC', 'BDS', 'CA', 'DPD MAGMA', 'MB', 'ON', 'Super Leads', 'TBAB', 'USA'];
  const leadStatusOptions = [
    'Prospect customer',
    'Lanes discussed',
    'Product/Equipment discussed',
    'E-mail sent to concerned person',
    'Carrier portal registration',
    'Quotations',
    'Fob/Have broker',
    'Voicemail/No answer',
    'Different Department',
    'No answer/Callback/Voicemail',
    'Not interested reason provided in notes',
    'Asset based only',
  ];

  return (
    <fieldset className="form-section">
      <legend>Equipment & Lead Type</legend>
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="equipmentType">Equipment Type</label>
          <select id="equipmentType" value={formLead.equipment_type} onChange={(e) => setFormLead({ ...formLead, equipment_type: e.target.value })}>
            <option value="">Select Equipment Type</option>
            {equipmentTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadType">Lead Type</label>
          <select id="leadType" value={formLead.lead_type} onChange={(e) => setFormLead({ ...formLead, lead_type: e.target.value })}>
            <option value="">Select Lead Type</option>
            {leadTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadStatus">Lead Status*</label>
          <select id="leadStatus" value={formLead.lead_status} onChange={(e) => setFormLead({ ...formLead, lead_status: e.target.value })} required>
            <option value="">Select Lead Status</option>
            {leadStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  );
};

export default EditLqEquip;
