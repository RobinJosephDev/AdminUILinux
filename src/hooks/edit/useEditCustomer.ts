import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';
import { Customer, Contact, Equipment } from '../../types/CustomerTypes';

interface UseEditCustomerProps {
  customer: Customer | null;
  onUpdate: (updatedCustomer: Customer) => void;
  onClose: () => void;
}

const defaultCustomer: Customer = {
  id: 0,
  cust_type: '',
  cust_name: '',
  cust_ref_no: '',
  cust_website: '',
  cust_email: '',
  cust_contact_no: '',
  cust_contact_no_ext: '',
  cust_tax_id: '',
  cust_primary_address: '',
  cust_primary_city: '',
  cust_primary_state: '',
  cust_primary_country: '',
  cust_primary_postal: '',
  cust_primary_unit_no: '',
  cust_mailing_address: '',
  cust_mailing_city: '',
  cust_mailing_state: '',
  cust_mailing_country: '',
  cust_mailing_postal: '',
  cust_mailing_unit_no: '',
  sameAsPrimary: false,
  cust_ap_name: '',
  cust_ap_address: '',
  cust_ap_city: '',
  cust_ap_state: '',
  cust_ap_country: '',
  cust_ap_postal: '',
  cust_ap_unit_no: '',
  cust_ap_email: '',
  cust_ap_phone: '',
  cust_ap_phone_ext: '',
  cust_ap_fax: '',
  cust_broker_name: '',
  cust_bkp_notes: '',
  cust_bkspl_notes: '',
  cust_credit_status: '',
  cust_credit_mop: '',
  cust_credit_currency: '',
  cust_credit_appd: '',
  cust_credit_expd: '',
  cust_credit_terms: 0,
  cust_credit_limit: 0,
  cust_credit_application: false,
  cust_credit_agreement: '',
  cust_sbk_agreement: '',
  cust_credit_notes: '',
  cust_contact: [],
  cust_equipment: [],
  created_at: '',
  updated_at: '',
};

export function useEditCustomer({ customer, onUpdate, onClose }: UseEditCustomerProps) {
  const [formCustomer, setFormCustomer] = useState<Customer>(customer ?? defaultCustomer);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    if (customer) {
      setFormCustomer(customer);
    }
  }, [customer]);

  const updateCustomer = async () => {
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

      const response: AxiosResponse<Customer> = await axios.put(`${API_URL}/customer/${formCustomer.id}`, formCustomer, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Customer data has been updated successfully.',
      });

      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating customer:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update customer.',
      });
    }
  };

  const handleContactChange = (index: number, updatedContact: Contact) => {
    setFormCustomer((prev) => ({
      ...prev,
      cust_contact: prev.cust_contact.map((contact, i) => (i === index ? updatedContact : contact)),
    }));
  };

  const handleEquipmentChange = (index: number, updatedEquipment: Equipment) => {
    setFormCustomer((prev) => ({
      ...prev,
      cust_equipment: prev.cust_equipment.map((equipment, i) => (i === index ? updatedEquipment : equipment)),
    }));
  };

  const handleRemoveContact = (index: number) => {
    setFormCustomer((prev) => ({
      ...prev,
      cust_contact: prev.cust_contact.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveEquipment = (index: number) => {
    setFormCustomer((prev) => ({
      ...prev,
      cust_equipment: prev.cust_equipment.filter((_, i) => i !== index),
    }));
  };

  return {
    formCustomer,
    setFormCustomer,
    updateCustomer,
    handleContactChange,
    handleEquipmentChange,
    handleRemoveContact,
    handleRemoveEquipment,
  };
}

export default useEditCustomer;
