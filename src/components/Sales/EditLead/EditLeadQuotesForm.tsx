import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserContext } from '../../../UserProvider';
import LeadContactForm from '../LeadContactForm';
import EditLeadDetails from './EditLeadDetails';
import EditAddressDetails from './EditAddressDetails';
import EditAdditionalInfo from './EditAdditionalInfo';
import { PlusOutlined } from '@ant-design/icons';
import EditLqEquip from './EditLqEquip';

interface Contact {
  name: string;
  phone: string;
  email: string;
}

interface Lead {
  id: string;
  lead_no: string;
  lead_date: string;
  customer_name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  unit_no: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  equipment_type: string;
  lead_type: string;
  lead_status: string;
  follow_up_date: string;
  assigned_to: string;
  contacts: Contact[];
}

interface EditLeadQuotesFormProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
}

const EditLeadQuotesForm: React.FC<EditLeadQuotesFormProps> = ({ lead, onClose, onUpdate }) => {
  const users = useContext(UserContext);
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
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    if (lead) {
      setFormLead({
        ...lead,
        contacts: Array.isArray(lead.contacts) ? lead.contacts : [],
      });
    }
  }, [lead]);

  const updateLead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'You are not logged in. Please log in again.' });
        return;
      }
      const response = await axios.put<Lead>(`${API_URL}/lead/${formLead.id}`, formLead, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({ icon: 'success', title: 'Updated!', text: 'Lead data has been updated successfully.' });
      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      console.error('Error updating lead:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update lead.',
      });
    }
  };

  const handleAddContact = () => {
    setFormLead((prevLead) => ({
      ...prevLead,
      contacts: [...prevLead.contacts, { name: '', phone: '', email: '' }],
    }));
  };

  const handleRemoveContact = (index: number) => {
    setFormLead((prevLead) => ({
      ...prevLead,
      contacts: prevLead.contacts.filter((_, i) => i !== index),
    }));
  };

  const handleContactChange = (index: number, updatedContact: Contact) => {
    const updatedContacts = formLead.contacts.map((contact, i) => (i === index ? updatedContact : contact));
    setFormLead((prevLead) => ({
      ...prevLead,
      contacts: updatedContacts,
    }));
  };

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateLead();
        }}
        className="form-main"
      >
        <EditLeadDetails formLead={formLead} setFormLead={setFormLead} />
        <EditAddressDetails formLead={formLead} setFormLead={setFormLead} />
        <EditAdditionalInfo formLead={formLead} setFormLead={setFormLead} />
        <EditLqEquip formLead={formLead} setFormLead={setFormLead} />
        <fieldset className="form-section">
          <legend>Contacts</legend>
          <div className="form-row">
            {formLead.contacts.map((contact, index) => (
              <LeadContactForm key={index} contact={contact} index={index} onChange={handleContactChange} onRemove={handleRemoveContact} />
            ))}
            <button type="button" onClick={handleAddContact} className="add-button">
              <PlusOutlined />
            </button>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Save
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLeadQuotesForm;
