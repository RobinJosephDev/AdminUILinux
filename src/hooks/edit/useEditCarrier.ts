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
      const parsedEquipments = Array.isArray(carrier.equipments) ? carrier.equipments : JSON.parse(carrier.equipments || '[]');
      const parsedLanes = Array.isArray(carrier.lanes) ? carrier.lanes : JSON.parse(carrier.lanes || '[]');

      const updatedVendor = {
        ...carrier,
        contacts: parsedContacts.length > 0 ? parsedContacts : [],
        equipments: parsedEquipments.length > 0 ? parsedEquipments : [],
        lanes: parsedLanes.length > 0 ? parsedLanes : [],
        li_start_date: formatDateForInput(carrier.li_start_date),
        li_end_date: formatDateForInput(carrier.li_end_date),
        ci_start_date: formatDateForInput(carrier.ci_start_date),
        ci_end_date: formatDateForInput(carrier.ci_end_date),
      };

      setFormCarrier(updatedVendor);
    }
  }, [carrier]);

  const validateCarrier = () => formCarrier?.dba;

  const updateCarrier = async () => {
    if (validateCarrier() && formCarrier) {
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

        const response = await axios.put(`${API_URL}/carrier/${formCarrier.id}`, formCarrier, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Carrier details updated.',
        });

        onUpdate(response.data);
        onClose();
      } catch (error) {
        console.error('Error updating carrier:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to update carrier.',
        });
      }
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
    setFormCarrier((prevCarrier) => (prevCarrier ? { ...prevCarrier, equipments: [...prevCarrier.equipments, { equipment: '' }] } : prevCarrier));
  };

  const handleRemoveEquipment = (index: number) => {
    setFormCarrier((prevCarrier) =>
      prevCarrier ? { ...prevCarrier, equipments: prevCarrier.equipments.filter((_, i) => i !== index) } : prevCarrier
    );
  };

  const handleEquipmentChange = (index: number, updatedEquipment: Equipment) => {
    setFormCarrier((prevCarrier) =>
      prevCarrier
        ? { ...prevCarrier, equipments: prevCarrier.equipments.map((equipment, i) => (i === index ? updatedEquipment : equipment)) }
        : prevCarrier
    );
  };

  //Lanes
  const handleAddLane = () => {
    setFormCarrier((prevCarrier) => (prevCarrier ? { ...prevCarrier, lanes: [...prevCarrier.lanes, { from: '', to: '' }] } : prevCarrier));
  };

  const handleRemoveLane = (index: number) => {
    setFormCarrier((prevCarrier) => (prevCarrier ? { ...prevCarrier, lanes: prevCarrier.lanes.filter((_, i) => i !== index) } : prevCarrier));
  };

  const handleLaneChange = (index: number, updatedContact: Lane) => {
    setFormCarrier((prevCarrier) =>
      prevCarrier ? { ...prevCarrier, lanes: prevCarrier.lanes.map((lane, i) => (i === index ? updatedContact : lane)) } : prevCarrier
    );
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
