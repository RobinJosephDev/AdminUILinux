import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Dispatch, Charge } from '../../types/DispatchTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const useEditDispatch = (dispatch: Dispatch | null, onClose: () => void, onUpdate: (dispatch: Dispatch) => void) => {
  const [formDispatch, setFormDispatch] = useState<Dispatch>({
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

  useEffect(() => {
    if (dispatch) {
      let parsedCharges = dispatch.charges;
      let parsedDiscounts = dispatch.discounts;

      // Only parse if they're strings
      if (typeof parsedCharges === 'string') {
        try {
          parsedCharges = JSON.parse(parsedCharges);
        } catch (e) {
          console.error('Failed to parse charges:', e);
          parsedCharges = [];
        }
      }

      if (typeof parsedDiscounts === 'string') {
        try {
          parsedDiscounts = JSON.parse(parsedDiscounts);
        } catch (e) {
          console.error('Failed to parse discounts:', e);
          parsedDiscounts = [];
        }
      }

      const updatedDispatch = {
        ...dispatch,
        charges: Array.isArray(parsedCharges) ? parsedCharges : [],
        discounts: Array.isArray(parsedDiscounts) ? parsedDiscounts : [],
      };

      setFormDispatch(updatedDispatch);
    }
  }, [dispatch]);

  const validateDispatch = (): boolean => {
    return !!formDispatch.carrier && !!formDispatch.equipment && !!formDispatch.currency && !!formDispatch.rate;
  };

  const updateDispatch = async () => {
    if (!validateDispatch()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token || typeof token !== 'string') {
        Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'Please log in again.' });
        return;
      }

      const response = await axios.put(`${API_URL}/dispatch/${formDispatch.id}`, formDispatch, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({ icon: 'success', title: 'Updated!', text: 'Dispatch updated successfully.' });
      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      console.error('Error updating dispatch:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update dispatch.',
      });
    }
  };

  //Charges
  const handleAddCharge = () => {
    setFormDispatch((prevDispatch) =>
      prevDispatch
        ? {
            ...prevDispatch,
            charges: [
              ...prevDispatch.charges,
              {
                type: '',
                charge: 0,
                percent: '',
              },
            ],
          }
        : prevDispatch
    );
  };

  const handleRemoveCharge = (index: number) => {
    setFormDispatch((prevDispatch) =>
      prevDispatch
        ? {
            ...prevDispatch,
            charges: prevDispatch.charges.filter((_, i) => i !== index),
          }
        : prevDispatch
    );
  };

  const handleChargeChange = (index: number, updatedCharge: Charge) => {
    setFormDispatch((prevDispatch) =>
      prevDispatch
        ? {
            ...prevDispatch,
            charges: prevDispatch.charges.map((charge, i) => (i === index ? updatedCharge : charge)),
          }
        : prevDispatch
    );
  };

  //Discounts
  const handleAddDiscount = () => {
    setFormDispatch((prevDispatch) =>
      prevDispatch
        ? {
            ...prevDispatch,
            discounts: [
              ...prevDispatch.discounts,
              {
                type: '',
                charge: 0,
                percent: '',
              },
            ],
          }
        : prevDispatch
    );
  };

  const handleRemoveDiscount = (index: number) => {
    setFormDispatch((prevDispatch) =>
      prevDispatch
        ? {
            ...prevDispatch,
            discounts: prevDispatch.discounts.filter((_, i) => i !== index),
          }
        : prevDispatch
    );
  };

  const handleDiscountChange = (index: number, updatedDiscount: Charge) => {
    setFormDispatch((prevDispatch) =>
      prevDispatch
        ? {
            ...prevDispatch,
            discounts: prevDispatch.discounts.map((discount, i) => (i === index ? updatedDiscount : discount)),
          }
        : prevDispatch
    );
  };

  return {
    formDispatch,
    setFormDispatch,
    updateDispatch,
    handleAddCharge,
    handleRemoveCharge,
    handleChargeChange,
    handleAddDiscount,
    handleRemoveDiscount,
    handleDiscountChange,
  };
};

export default useEditDispatch;
