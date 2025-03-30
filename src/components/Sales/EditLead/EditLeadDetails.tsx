import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

interface Customer {
  value: string;
  label: string;
  refNo?: string;
}

interface FormLead {
  lead_no: string;
  lead_date: string;
  customer_name: string;
  phone: string;
  email: string;
  website: string;
}

interface EditLeadDetailsProps {
  formLead: FormLead;
  setFormLead: React.Dispatch<React.SetStateAction<FormLead>>;
}

const EditLeadDetails: React.FC<EditLeadDetailsProps> = ({ formLead, setFormLead }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerRefNos, setCustomerRefNos] = useState<Customer[]>([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in.');

        const { data } = await axios.get<{ customer_name: string; refNo?: string }[]>(`${API_URL}/lead`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formattedCustomers = data.map((customer) => ({
          value: customer.customer_name,
          label: customer.customer_name,
          refNo: customer.refNo,
        }));

        setCustomers(formattedCustomers);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (formLead.customer_name) {
      const selectedCustomer = customers.find((c) => c.value === formLead.customer_name);
      setCustomerRefNos(selectedCustomer ? [{ value: selectedCustomer.refNo || '', label: selectedCustomer.refNo || '' }] : []);
    } else {
      setCustomerRefNos([]);
    }
  }, [formLead.customer_name, customers]);

  return (
    <fieldset className="form-section">
      <legend>Lead Details</legend>
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadNo">Lead No*</label>
          <input type="text" value={formLead.lead_no} onChange={(e) => setFormLead({ ...formLead, lead_no: e.target.value })} id="leadNo" required />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadDate">Lead Date*</label>
          <input
            type="date"
            value={formLead.lead_date}
            onChange={(e) => setFormLead({ ...formLead, lead_date: e.target.value })}
            id="leadDate"
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="quote_customer">Customer</label>
          <Select
            id="quote_customer"
            options={customers}
            value={customers.find((c) => c.value === formLead.customer_name) || null}
            onChange={(selected) => setFormLead({ ...formLead, customer_name: selected ? selected.value : '' })}
            placeholder="Select a customer"
            isClearable
          />
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="phone">Phone</label>
          <input type="tel" value={formLead.phone} onChange={(e) => setFormLead({ ...formLead, phone: e.target.value })} id="phone" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="email">Email</label>
          <input type="email" value={formLead.email} onChange={(e) => setFormLead({ ...formLead, email: e.target.value })} id="email" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="website">Website</label>
          <input type="text" value={formLead.website} onChange={(e) => setFormLead({ ...formLead, website: e.target.value })} id="website" />
        </div>
      </div>
    </fieldset>
  );
};

export default EditLeadDetails;
