import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Lead } from '../../types/LeadTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const useEditLead = (lead: Lead | null, onClose: () => void, onUpdate: (lead: Lead) => void) => {
  const [formLead, setFormLead] = useState<Lead>({
    id: 0,
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
    contact_person: '',
    notes: '',
    assigned_to: '',
    contacts: [],
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (lead) {
      const parsedContacts = Array.isArray(lead.contacts) ? lead.contacts : JSON.parse(lead.contacts || '[]');
      setFormLead({ ...lead, contacts: parsedContacts.length > 0 ? parsedContacts : [] });
    }
  }, [lead]);

  const updateLead = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You are not logged in. Please log in again.',
        });
        return;
      }

      const response = await axios.put(`${API_URL}/lead/${formLead.id}`, formLead, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Lead data has been updated successfully.',
      });

      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      console.error('Error updating lead:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response && error.response.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update lead.',
      });
    }
  };

  const handleAddContact = () => {
    setFormLead((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', phone: '', email: '' }],
    }));
  };
  const handleContactChange = (index: number, updatedContact: any) => {
    const updatedContacts = [...formLead.contacts];
    updatedContacts[index] = updatedContact;
    setFormLead({ ...formLead, contacts: updatedContacts });
  };

  const handleRemoveContact = (index: number) => {
    const updatedContacts = formLead.contacts.filter((_, i) => i !== index);
    setFormLead({ ...formLead, contacts: updatedContacts });
  };

  return {
    formLead,
    setFormLead,
    updateLead,
    handleAddContact,
    handleRemoveContact,
    handleContactChange,
  };
};

export default useEditLead;
