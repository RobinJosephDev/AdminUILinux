import React from 'react';
import { Lead } from '../../../types/LeadTypes';

interface EditLeadDetailsProps {
  formLead: Lead;
  setFormLead: React.Dispatch<React.SetStateAction<Lead>>;
}

const leadTypeOptions = ['AB', 'BC', 'BDS', 'CA', 'DPD MAGMA', 'MB', 'ON', 'Super Leads', 'TBAB', 'USA'];
const leadStatusOptions = [
  'Prospect',
  'Lanes discussed',
  'Prod/Equip noted',
  'E-mail sent',
  'Portal registration',
  'Quotations',
  'Fob/Have broker',
  'VM/No answer',
  'Diff Dept.',
  'No reply',
  'Not Int.',
  'Asset based',
];

const EditLeadDetails: React.FC<EditLeadDetailsProps> = ({ formLead, setFormLead }) => {
  const sanitizeInput = (value: string): string => {
    return value.replace(/[^a-zA-Z0-9\s@.-]/g, '').trim();
  };

  return (
    <fieldset className="form-section">
      <legend>Lead Details</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadNo">Lead No*</label>
          <input
            type="text"
            value={formLead.lead_no}
            onChange={(e) => setFormLead({ ...formLead, lead_no: sanitizeInput(e.target.value) })}
            id="leadNo"
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadDate">Lead Date*</label>
          <input type="date" value={formLead.lead_date} onChange={(e) => setFormLead({ ...formLead, lead_date: e.target.value })} id="leadDate" />
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="phone">Phone</label>
          <input type="tel" value={formLead.phone} onChange={(e) => setFormLead({ ...formLead, phone: sanitizeInput(e.target.value) })} id="phone" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="email">Email</label>
          <input type="email" value={formLead.email} onChange={(e) => setFormLead({ ...formLead, email: e.target.value })} id="email" />
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadType">Lead Type*</label>
          <select id="leadType" value={formLead.lead_type} onChange={(e) => setFormLead({ ...formLead, lead_type: e.target.value })}>
            <option value="">Select Lead Type</option>
            {leadTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  );
};

export default EditLeadDetails;
