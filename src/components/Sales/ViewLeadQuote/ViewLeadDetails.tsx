import { useEffect, useState } from 'react';
import axios from 'axios';

type LeadDetailsProps = {
  formLead: {
    lead_no?: string;
    lead_date?: string;
    customer_name?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
};

function ViewLeadDetails({ formLead }: LeadDetailsProps) {
  const [customers, setCustomers] = useState<{ value: string; label: string }[]>([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/lead`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched leads:', data);

        const formattedCustomers = data.map((customer: { customer_name: string }) => ({
          value: customer.customer_name,
          label: customer.customer_name,
        }));

        setCustomers(formattedCustomers);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <fieldset className="form-section">
      <legend>Lead Details</legend>
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Lead No</label>
          <p>{formLead.lead_no || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Lead Date</label>
          <p>{formLead.lead_date || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Customer</label>
          <p>{formLead.customer_name || 'N/A'}</p>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Phone</label>
          <p>{formLead.phone || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Email</label>
          <p>{formLead.email || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Website</label>
          <p>{formLead.website || 'N/A'}</p>
        </div>
      </div>
    </fieldset>
  );
}

export default ViewLeadDetails;
