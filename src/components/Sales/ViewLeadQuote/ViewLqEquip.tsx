import { useEffect, useState } from 'react';
import ViewLeadDetails from './ViewLeadDetails';
import ViewAddressDetails from './ViewAddressDetails';
import ViewAdditionalInfo from './ViewAdditionalInfo';
import ViewLeadContactForm from './ViewLeadContactForm';
import ViewLqEquip from './ViewLqEquip';

type Contact = {
  name: string;
  phone: string;
  email: string;
};

type Lead = {
  id?: string;
  lead_no?: string;
  lead_date?: string;
  customer_name?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  unit_no?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  equipment_type?: string;
  lead_type?: string;
  lead_status?: string;
  follow_up_date?: string;
  assigned_to?: string;
  contacts: Contact[];
};

type ViewLeadQuotesFormProps = {
  lead: Lead;
  onClose: () => void;
};

const ViewLeadQuotesForm = ({ lead, onClose }: ViewLeadQuotesFormProps) => {
  const [formLead, setFormLead] = useState<Lead>({
    id: '',
    lead_no: '',
    lead_date: '',
    customer_name: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    unit_no: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    equipment_type: '',
    lead_type: '',
    lead_status: '',
    follow_up_date: '',
    assigned_to: '',
    contacts: [{ name: '', phone: '', email: '' }],
  });

  useEffect(() => {
    if (lead) {
      const parsedContacts = Array.isArray(lead.contacts) ? lead.contacts : JSON.parse((lead.contacts as unknown as string) || '[]');
      setFormLead({
        ...lead,
        contacts: parsedContacts.length > 0 ? parsedContacts : [],
      });
    }
  }, [lead]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewLeadDetails formLead={formLead} />
        <ViewAddressDetails formLead={formLead} />
        <ViewAdditionalInfo formLead={formLead} />
        <ViewLqEquip formLead={formLead} />
        <fieldset className="form-section">
          <legend>Contacts</legend>
          <div className="form-row">
            {formLead.contacts.map((contact, index) => (
              <ViewLeadContactForm key={index} contact={contact} />
            ))}
          </div>
        </fieldset>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewLeadQuotesForm;