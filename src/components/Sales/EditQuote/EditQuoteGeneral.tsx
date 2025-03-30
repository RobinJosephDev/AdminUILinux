import Select from 'react-select';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface QuoteForm {
  quote_type: string;
  quote_customer?: string;
  quote_cust_ref_no?: string;
  quote_booked_by?: string;
  quote_temperature?: string;
  quote_hot?: boolean;
  quote_team?: boolean;
  quote_air_ride?: boolean;
  quote_tarp?: boolean;
  quote_hazmat?: boolean;
}

interface Customer {
  value: string;
  label: string;
  refNo: string;
}

interface EditQuoteGeneralProps {
  formQuote: QuoteForm;
  setFormQuote: (quote: QuoteForm) => void;
}

function EditQuoteGeneral({ formQuote, setFormQuote }: EditQuoteGeneralProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerRefNos, setCustomerRefNos] = useState<{ value: string; label: string }[]>([]);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get<Customer[]>(`${API_URL}/customer`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedCustomers = data.map((quote_customer) => ({
          value: quote_customer.cust_name,
          label: quote_customer.cust_name,
          refNo: quote_customer.cust_ref_no,
        }));

        setCustomers(formattedCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (formQuote.quote_customer) {
      const selectedCustomer = customers.find((c) => c.value === formQuote.quote_customer);
      setCustomerRefNos(selectedCustomer ? [{ value: selectedCustomer.refNo, label: selectedCustomer.refNo }] : []);
    } else {
      setCustomerRefNos([]);
    }
  }, [formQuote.quote_customer, customers]);

  const quoteTypeOptions = ['FTL', 'LTL'];

  return (
    <fieldset className="form-section">
      <legend>General</legend>
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="quoteType">Quote Type*</label>
          <select id="quoteType" value={formQuote.quote_type} onChange={(e) => setFormQuote({ ...formQuote, quote_type: e.target.value })} required>
            {quoteTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="quote_customer">Customer</label>
          <select
            id="quote_customer"
            value={formQuote.quote_customer || ''}
            onChange={(e) => setFormQuote({ ...formQuote, quote_customer: e.target.value })}
            required
          >
            <option value="" disabled>
              Select a customer
            </option>
            {customers.map((customer) => (
              <option key={customer.value} value={customer.value}>
                {customer.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="customerRefNo">Customer Ref. No</label>
          <select
            id="customerRefNo"
            value={formQuote.quote_cust_ref_no || ''}
            onChange={(e) => setFormQuote({ ...formQuote, quote_cust_ref_no: e.target.value })}
            required
          >
            <option value="" disabled>
              Select a reference number
            </option>
            {customerRefNos.map((refNo) => (
              <option key={refNo.value} value={refNo.value}>
                {refNo.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="accNo">Booked By</label>
          <input
            type="text"
            value={formQuote.quote_booked_by || ''}
            onChange={(e) => setFormQuote({ ...formQuote, quote_booked_by: e.target.value })}
            id="accNo"
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="branch">Temperature</label>
          <input
            type="text"
            value={formQuote.quote_temperature || ''}
            onChange={(e) => setFormQuote({ ...formQuote, quote_temperature: e.target.value })}
            id="branch"
          />
        </div>
        {['quote_hot', 'quote_team', 'quote_air_ride', 'quote_tarp', 'quote_hazmat'].map((field) => (
          <div key={field} className="form-group" style={{ flex: 1 }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', width: '100%' }}>
              {field.replace('quote_', '').toUpperCase()}
              <input
                type="checkbox"
                checked={formQuote[field as keyof QuoteForm] || false}
                onChange={(e) => setFormQuote({ ...formQuote, [field]: e.target.checked })}
              />
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export default EditQuoteGeneral;
