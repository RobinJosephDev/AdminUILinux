import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Carrier, Contact, Equipment, Lane } from '../../types/CarrierTypes';

// Helper function to format date strings
const formatDateForInput = (date: string | Date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const useEditCarrier = (carrier: Carrier | null, onClose: () => void, onUpdate: (carrier: Carrier) => void) => {
  const [formCarrier, setFormCarrier] = useState<Carrier>({
    id: 0,
    dba: '',
    legal_name: '',
    remit_name: '',
    acc_no: '',
    branch: '',
    website: '',
    fed_id_no: '',
    pref_curr: '',
    pay_terms: '',
    form_1099: false,
    advertise: false,
    advertise_email: '',
    carr_type: '',
    rating: '',
    brok_carr_aggmt: '',
    docket_no: '',
    dot_number: '',
    wcb_no: '',
    ca_bond_no: '',
    us_bond_no: '',
    scac: '',
    csa_approved: false,
    hazmat: false,
    smsc_code: '',
    approved: false,
    li_provider: '',
    li_policy_no: '',
    li_coverage: 0,
    li_start_date: '',
    li_end_date: '',
    ci_provider: '',
    ci_policy_no: '',
    ci_coverage: 0,
    ci_start_date: '',
    ci_end_date: '',
    coi_cert: '',
    primary_address: '',
    primary_city: '',
    primary_state: '',
    primary_country: '',
    primary_postal: '',
    primary_phone: '',
    sameAsPrimary: false,
    mailing_address: '',
    mailing_city: '',
    mailing_state: '',
    mailing_country: '',
    mailing_postal: '',
    mailing_phone: '',
    int_notes: '',
    contacts: [],
    equipments: [],
    lanes: [],
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (carrier) {
      const parsedContacts = Array.isArray(carrier.contacts) ? carrier.contacts : JSON.parse(carrier.contacts || '[]');
      const parsedLanes = Array.isArray(carrier.lanes) ? carrier.lanes : JSON.parse(carrier.lanes || '[]');

      const updatedCarrier = {
        ...carrier,
        contacts: parsedContacts.length > 0 ? parsedContacts : [],
        lanes: parsedLanes.length > 0 ? parsedLanes : [],
        li_start_date: formatDateForInput(carrier.li_start_date),
        li_end_date: formatDateForInput(carrier.li_end_date),
        ci_start_date: formatDateForInput(carrier.ci_start_date),
        ci_end_date: formatDateForInput(carrier.ci_end_date),
      };

      setFormCarrier(updatedCarrier);
    }
  }, [carrier]);

  const validateCarrier = (): boolean => {
    return !!formCarrier.dba && !!formCarrier.legal_name;
  };

  const updateCarrier = async () => {
    if (!validateCarrier()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }
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

      const headers = { Authorization: `Bearer ${token}` };
      const formData = new FormData();

      Object.keys(formCarrier).forEach((key) => {
        const value = formCarrier[key as keyof Carrier];

        if (key === 'form_1099' || key === 'advertise' || key === 'approved' || key === 'csa_approved' || key === 'hazmat') {
          formData.append(key, value ? '1' : '0');
        } else if (key !== 'brok_carr_aggmt' && key !== 'coi_cert') {
          formData.append(key, String(value || ''));
        }
      });

      if (formCarrier.brok_carr_aggmt && formCarrier.brok_carr_aggmt instanceof File) {
        formData.append('brok_carr_aggmt', formCarrier.brok_carr_aggmt);
      }

      if (formCarrier.coi_cert && formCarrier.coi_cert instanceof File) {
        formData.append('coi_cert', formCarrier.coi_cert);
      }

      const response = formCarrier.id
        ? await axios.put(`${API_URL}/carrier/${formCarrier.id}`, formCarrier, { headers })
        : await axios.post(`${API_URL}/carrier`, formCarrier, { headers });

      Swal.fire(formCarrier.id ? 'Success!' : 'Saved!', 'Carrier updated successfully.', 'success');
      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      console.error('Error saving/updating carrier:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while processing the carrier.', 'error');
    }
  };
  //Contacts
  const handleAddContact = () => {
    setFormCarrier((prevCarrier) =>
      prevCarrier
        ? { ...prevCarrier, contacts: [...prevCarrier.contacts, { name: '', phone: '', email: '', fax: '', designation: '' }] }
        : prevCarrier
    );
  };

  const handleRemoveContact = (index: number) => {
    setFormCarrier((prevCarrier) => (prevCarrier ? { ...prevCarrier, contacts: prevCarrier.contacts.filter((_, i) => i !== index) } : prevCarrier));
  };

  const handleContactChange = (index: number, updatedContact: Contact) => {
    setFormCarrier((prevCarrier) =>
      prevCarrier ? { ...prevCarrier, contacts: prevCarrier.contacts.map((contact, i) => (i === index ? updatedContact : contact)) } : prevCarrier
    );
  };

  //Equipments
  const handleAddEquipment = () => {
    setFormCarrier((prev) => ({ ...prev, equipments: [...prev.equipments, { equipment: '' }] }));
  };

  const handleRemoveEquipment = (index: number) => {
    setFormCarrier((prev) => ({
      ...prev,
      equipments: prev.equipments.filter((_, i) => i !== index),
    }));
  };

  const handleEquipmentChange = (index: number, updatedEquipment: Equipment) => {
    const updatedEquipments = formCarrier.equipments.map((equipment, i) => (i === index ? updatedEquipment : equipment));
    setFormCarrier((prevCarrier) => ({
      ...prevCarrier,
      equipments: updatedEquipments,
    }));
  };

  //Lanes
  const handleAddLane = () => {
    setFormCarrier((prev) => ({ ...prev, lanes: [...prev.lanes, { from: '', to: '' }] }));
  };

  const handleRemoveLane = (index: number) => {
    setFormCarrier((prev) => ({
      ...prev,
      lanes: prev.lanes.filter((_, i) => i !== index),
    }));
  };

  const handleLaneChange = (index: number, updatedLane: Lane) => {
    const updatedLanes = formCarrier.lanes.map((lane, i) => (i === index ? updatedLane : lane));
    setFormCarrier((prevCarrier) => ({
      ...prevCarrier,
      lanes: updatedLanes,
    }));
  };

  return {
    formCarrier,
    setFormCarrier,
    updateCarrier,
    handleAddContact,
    handleRemoveContact,
    handleContactChange,
    handleAddEquipment,
    handleRemoveEquipment,
    handleEquipmentChange,
    handleAddLane,
    handleRemoveLane,
    handleLaneChange,
  };
};
export default useEditCarrier;
