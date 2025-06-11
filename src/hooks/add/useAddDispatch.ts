import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Dispatch, Charge } from '../../types/DispatchTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const useAddDispatch = (onClose: () => void, onSuccess: () => void) => {
  const initialDispatchState: Dispatch = {
    id: 0,
    carrier: '',
    contact: '',
    equipment: '',
    driver_mobile: '',
    truck_unit_no: '',
    trailer_unit_no: '',
    paps_pars_no: '',
    tracking_code: '',
    border: '',
    currency: '',
    rate: '',
    charges: [],
    discounts: [],
    gst: '',
    pst: '',
    hst: '',
    qst: '',
    final_price: '',
    status: '',
    created_at: '',
    updated_at: '',
  };

  const [dispatch, setDispatch] = useState<Dispatch>(initialDispatchState);

  const validateDispatch = (): boolean => {
    return !!dispatch.carrier && !!dispatch.equipment && !!dispatch.currency && !!dispatch.rate;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateDispatch()) {
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

      const response = dispatch.id
        ? await axios.put(`${API_URL}/dispatch/${dispatch.id}`, dispatch, { headers })
        : await axios.post(`${API_URL}/dispatch`, dispatch, { headers });

      Swal.fire(dispatch.id ? 'Success!' : 'Saved!', 'Dispatch created successfully.', 'success');
      clearDispatchForm();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving/updating dispatch:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while processing the dispatch.', 'error');
    }
  };

  const clearDispatchForm = (): void => {
    setDispatch({
      id: 0,
      carrier: '',
      contact: '',
      equipment: '',
      driver_mobile: '',
      truck_unit_no: '',
      trailer_unit_no: '',
      paps_pars_no: '',
      tracking_code: '',
      border: '',
      currency: '',
      rate: '',
      charges: [],
      discounts: [],
      gst: '',
      pst: '',
      hst: '',
      qst: '',
      final_price: '',
      status: '',
      created_at: '',
      updated_at: '',
    });
  };

  const handleAddCharge = () => {
    setDispatch((prev) => ({
      ...prev,
      charges: [
        ...prev.charges,
        {
          type: '',
          charge: 0,
          percent: '',
        },
      ],
    }));
  };

  const handleRemoveCharge = (index: number) => {
    setDispatch((prevDispatch) => ({
      ...prevDispatch,
      charges: prevDispatch.charges.filter((_, i) => i !== index),
    }));
  };

  const handleChargeChange = (index: number, updatedCharge: Charge) => {
    const updatedCharges = dispatch.charges.map((charge, i) => (i === index ? updatedCharge : charge));
    setDispatch((prevDispatch) => ({
      ...prevDispatch,
      charges: updatedCharges,
    }));
  };

  const handleAddDiscount = () => {
    setDispatch((prev) => ({
      ...prev,
      discounts: [
        ...prev.discounts,
        {
          type: '',
          charge: 0,
          percent: '',
        },
      ],
    }));
  };

  const handleRemoveDiscount = (index: number) => {
    setDispatch((prevDispatch) => ({
      ...prevDispatch,
      discounts: prevDispatch.discounts.filter((_, i) => i !== index),
    }));
  };

  const handleDiscountChange = (index: number, updatedDiscount: Charge) => {
    const updatedDiscounts = dispatch.discounts.map((discount, i) => (i === index ? updatedDiscount : discount));
    setDispatch((prevDispatch) => ({
      ...prevDispatch,
      discounts: updatedDiscounts,
    }));
  };

  return {
    dispatch,
    setDispatch,
    handleSubmit,
    clearDispatchForm,
    handleAddCharge,
    handleChargeChange,
    handleRemoveCharge,
    handleAddDiscount,
    handleDiscountChange,
    handleRemoveDiscount,
  };
};

export default useAddDispatch;
