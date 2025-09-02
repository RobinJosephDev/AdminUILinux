import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Followup, Contact, Product } from '../../types/FollowupTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const useAddFollowup = (onClose: () => void, onSuccess: () => void) => {
  const initialFollowupState: Followup = {
    id: 0,
    lead_no: '',
    lead_date: '',
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    unit_no: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    lead_type: '',
    contact_person: '',
    notes: '',
    lead_status: '',
    next_follow_up_date: '',
    followup_type: '',
    equipment: '',
    remarks: '',
    contacts: [],
    products: [],
    created_at: '',
    updated_at: '',
  };
  const [followup, setFollowup] = useState<Followup>(initialFollowupState);

  const validateFollowup = (): boolean => {
    return !!followup.lead_no && !!followup.lead_date && !!followup.lead_type && !!followup.lead_status;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFollowup()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'No token found', 'error');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = followup.id
        ? await axios.put(`${API_URL}/lead-followup/${followup.id}`, followup, { headers })
        : await axios.post(`${API_URL}/lead-followup`, followup, { headers });

      Swal.fire('Success', 'Follow-up data has been saved successfully.', 'success');
      clearFollowupForm();
      onSuccess();
    } catch (error) {
      console.error('Error saving/updating followup:', error);
      Swal.fire('Error', 'An error occurred while saving/updating the followup.', 'error');
    }
  };

  const clearFollowupForm = (): void => {
    setFollowup({
      id: 0,
      lead_no: '',
      lead_date: '',
      customer_name: '',
      phone: '',
      email: '',
      address: '',
      unit_no: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      lead_type: '',
      contact_person: '',
      notes: '',
      lead_status: '',
      next_follow_up_date: '',
      followup_type: '',
      equipment: '',
      remarks: '',
      contacts: [],
      products: [],
      created_at: '',
      updated_at: '',
    });
  };

  const handleAddContact = () => {
    setFollowup((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', phone: '', email: '' }],
    }));
  };

  const handleRemoveContact = (index: number) => {
    setFollowup((prevFollowup) => ({
      ...prevFollowup,
      contacts: prevFollowup.contacts.filter((_, i) => i !== index),
    }));
  };

  const handleContactChange = (index: number, updatedContact: Contact) => {
    const updatedContacts = followup.contacts.map((contact, i) => (i === index ? updatedContact : contact));
    setFollowup((prevFollowup) => ({
      ...prevFollowup,
      contacts: updatedContacts,
    }));
  };

  const handleAddProduct = () => {
    setFollowup((prev) => ({
      ...prev,
      products: [...prev.products, { name: '', quantity: '' }],
    }));
  };

  const handleRemoveProduct = (index: number) => {
    setFollowup((prevFollowup) => ({
      ...prevFollowup,
      products: prevFollowup.products.filter((_, i) => i !== index),
    }));
  };

  const handleProductChange = (index: number, updatedProduct: Product) => {
    const updatedProducts = followup.products.map((product, i) => (i === index ? updatedProduct : product));
    setFollowup((prevFollowup) => ({
      ...prevFollowup,
      products: updatedProducts,
    }));
  };

  return {
    followup,
    setFollowup,
    handleAddContact,
    handleRemoveContact,
    handleContactChange,
    handleAddProduct,
    handleRemoveProduct,
    handleProductChange,
    handleSubmit,
    clearFollowupForm,
  };
};
