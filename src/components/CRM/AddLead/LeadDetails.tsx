import React from 'react';
import { Lead } from '../../../types/LeadTypes';

type LeadDetailsProps = {
  lead: Lead;
  setLead: (lead: Lead) => void;
};

const LeadDetails: React.FC<LeadDetailsProps> = ({ lead, setLead }) => {
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

  const sanitizeInput = (value: string) => value.trim();

  const validateLeadNo = (value: string) => /^[0-9]+$/.test(value);
  const validatePhone = (value: string) => /^[+0-9\-()\s]+$/.test(value);
  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validateURL = (value: string) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(value);

  return (
    <fieldset className="form-section">
      <legend>Lead Details</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadNo">Lead No*</label>
          <input
            type="text"
            value={lead.lead_no}
            onChange={(e) => {
              const value = sanitizeInput(e.target.value);
              if (validateLeadNo(value)) {
                setLead({ ...lead, lead_no: value });
              }
            }}
            id="leadNo"
            placeholder="Lead No"
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadDate">Lead Date*</label>
          <input
            type="date"
            value={lead.lead_date}
            onChange={(e) => setLead({ ...lead, lead_date: e.target.value })}
            id="leadDate"
            placeholder="Lead Date"
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="customerName">Customer Name</label>
          <input
            type="text"
            value={lead.customer_name || ''}
            onChange={(e) => setLead({ ...lead, customer_name: sanitizeInput(e.target.value) })}
            placeholder="Customer Name"
            id="customerName"
          />
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            value={lead.phone || ''}
            onChange={(e) => {
              const value = sanitizeInput(e.target.value);
              if (validatePhone(value)) {
                setLead({ ...lead, phone: value });
              }
            }}
            id="phone"
            placeholder="Phone"
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={lead.email || ''}
            onChange={(e) => {
              const value = sanitizeInput(e.target.value);
              if (validateEmail(value)) {
                setLead({ ...lead, email: value });
              }
            }}
            id="email"
            placeholder="Email"
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="website">Website</label>
          <input
            type="text"
            value={lead.website || ''}
            onChange={(e) => {
              const value = sanitizeInput(e.target.value);
              if (validateURL(value)) {
                setLead({ ...lead, website: value });
              }
            }}
            id="website"
            placeholder="Website"
          />
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadType">Lead Type*</label>
          <select id="leadType" value={lead.lead_type} onChange={(e) => setLead({ ...lead, lead_type: e.target.value })} required>
            <option value="">Select Lead Type</option>
            {leadTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadStatus">Lead Status*</label>
          <select id="leadStatus" value={lead.lead_status} onChange={(e) => setLead({ ...lead, lead_status: e.target.value })} required>
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

export default LeadDetails;
