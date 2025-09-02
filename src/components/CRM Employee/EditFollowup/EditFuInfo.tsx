import { useState, useEffect } from 'react';
import axios from 'axios';
import { Followup, Customer } from '../../../types/FollowupTypes';

interface EditFuInfoProps {
  followupEdit: Followup;
  setFollowupEdit: (edit: Followup) => void;
}

const sanitizeInput = (value: string | undefined | null): string => {
  if (typeof value !== 'string') {
    return ''; // Return an empty string if value is undefined or not a string
  }
  return value.trim().replace(/<[^>]*>?/gm, ''); // Removes any potential HTML/script tags
};

const EditFuInfo: React.FC<EditFuInfoProps> = ({ followupEdit, setFollowupEdit }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No authentication token found.');
          return;
        }

        const response = await axios.get(`${API_URL}/lead`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Fetched leads:', response.data); // Debugging

        // Ensure we access the correct array
        const leads = Array.isArray(response.data) ? response.data : response.data.data;

        if (!Array.isArray(leads)) {
          console.error('Unexpected API response format:', response.data);
          return;
        }

        const formattedCustomers = leads.map((customer) => ({
          value: sanitizeInput(customer?.value), // Safe access with optional chaining
          label: sanitizeInput(customer?.label), // Prevents undefined error
        }));

        setCustomers(formattedCustomers);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleInputChange = (field: keyof Followup, value: string) => {
    setFollowupEdit({ ...followupEdit, [field]: sanitizeInput(value) });
  };

  return (
    <fieldset className="form-section">
      <legend>Follow-up Information</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {/* Lead No */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadNo">Lead No*</label>
          <input type="number" id="leadNo" value={followupEdit.lead_no} onChange={(e) => handleInputChange('lead_no', e.target.value)} required />
        </div>

        {/* Lead Date */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadDate">Lead Date*</label>
          <input type="date" id="leadDate" value={followupEdit.lead_date} onChange={(e) => handleInputChange('lead_date', e.target.value)} required />
        </div>

        {/* Lead Selection */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="quote_customer">Lead</label>
          <select
            id="quote_customer"
            value={followupEdit.customer_name}
            onChange={(e) => handleInputChange('customer_name', e.target.value)}
            required
          >
            <option value="" disabled>
              Select a lead
            </option>
            {customers.map((customer, index) => (
              <option key={customer.value || index} value={customer.value}>
                {customer.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {/* Phone */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" value={followupEdit.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
        </div>

        {/* Email */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={followupEdit.email} onChange={(e) => handleInputChange('email', e.target.value)} />
        </div>
      </div>
    </fieldset>
  );
};

export default EditFuInfo;
