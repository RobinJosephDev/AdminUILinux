import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const useOrderHandler = ({ order,onClose, onUpdate }) => {
  const [formOrder, setFormOrder] = useState({
    id: '',
    customer: '',
    customer_ref_no: '',
    branch: '',
    booked_by: '',
    account_rep: '',
    sales_rep: '',
    customer_po_no: '',
    commodity: '',
    equipment: '',
    load_type: '',
    temperature: '',
    origin_location: [
      {
        address: '',
        city: '',
        state: '',
        country: '',
        postal: '',
        date: '',
        time: '',
        po: '',
        phone: '',
        notes: '',
        packages: '',
        weight: '',
        dimensions: '',
      },
    ],
    destination_location: [
      {
        address: '',
        city: '',
        state: '',
        country: '',
        postal: '',
        date: '',
        time: '',
        po: '',
        phone: '',
        notes: '',
        packages: '',
        weight: '',
        dimensions: '',
      },
    ],
    hot: false,
    team: false,
    air_ride: false,
    tarp: false,
    hazmat: false,
    currency: '',
    base_price: '',
    charges: [{ type: '', charge: '', percent: '' }],
    discounts: [{ type: '', charge: '', percent: '' }],
    gst: '',
    pst: '',
    hst: '',
    qst: '',
    final_price: '',
    notes: '',
  });
  var API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

    useEffect(() => {
      if (order) {
        const parsedOrigins = Array.isArray(order.origin_location) ? order.origin_location : JSON.parse(order.origin_location || '[]');
        const parsedDestinations = Array.isArray(order.destination_location)
          ? order.destination_location
          : JSON.parse(order.destination_location || '[]');
        const parsedCharges = Array.isArray(order.charges) ? order.charges : JSON.parse(order.charges || '[]');
        const parsedDiscounts = Array.isArray(order.discounts) ? order.discounts : JSON.parse(order.discounts || '[]');
        setFormOrder({
          ...order,
          origin_location: parsedOrigins.length > 0 ? parsedOrigins : [],
          destination_location: parsedDestinations.length > 0 ? parsedDestinations : [],
          charges: parsedCharges.length > 0 ? parsedCharges : [],
          discounts: parsedDiscounts.length > 0 ? parsedDiscounts : [],
        });
      }
    }, [order]);

  // Validation functions
  const sanitizeInput = (input) => input.replace(/[^\w\s]/g, '');
  const isValidPhone = (phone) => /^\+?\(?\d{1,3}\)?[\s-]?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}$/.test(phone);
  const isValidPostalCode = (postalCode) => /^[a-zA-Z0-9\s]{3,10}$/.test(postalCode);

  const validateOrigins = () => {
    for (let origin of formOrder.origin_location) {
      if (origin.phone && !isValidPhone(origin.phone)) {
        Swal.fire('Validation Error', `Please enter a valid phone number for ${origin.address}.`, 'error');
        return false;
      }
      if (origin.postal && !isValidPostalCode(origin.postal)) {
        Swal.fire('Validation Error', `Please enter a valid postal code for ${origin.address}.`, 'error');
        return false;
      }
    }
    return true;
  };

  const validateDestinations = () => {
    for (let destination of formOrder.destination_location) {
      if (destination.phone && !isValidPhone(destination.phone)) {
        Swal.fire('Validation Error', `Please enter a valid phone number for ${destination.address}.`, 'error');
        return false;
      }
      if (destination.postal && !isValidPostalCode(destination.postal)) {
        Swal.fire('Validation Error', `Please enter a valid postal code for ${destination.address}.`, 'error');
        return false;
      }
    }
    return true;
  };  

  const updateOrder = async () => {
    if (formOrder.phone && !isValidPhone(formOrder.phone)) {
      Swal.fire('Validation Error', 'Please enter a valid phone number.', 'error');
      return;
    }

    if (formOrder.postal && !isValidPostalCode(formOrder.postal)) {
      Swal.fire('Validation Error', 'Please enter a valid postal code.', 'error');
      return;
    }

    if (!validateOrigins()) return;
    if (!validateDestinations()) return;

    if (validateOrder()) {
      try {
        // Get the token from localStorage or from the UserContext
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

        if (!token) {
          // If no token is found, show an alert and exit the function
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'You are not logged in. Please log in again.',
          });
          return;
        }
        const sanitizedOrder = sanitizeOrder(formOrder);

        // Make the PUT request with the Authorization header
        const response = await axios.put(`${API_URL}/order/${formOrder.id}`, sanitizedOrder, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Order data has been updated successfully.',
        });

        // Call onUpdate to update the lead data in the parent component
        onUpdate(response.data);
        onClose();
      } catch (error) {
        console.error('Error updating order:', error);

        // Handle different errors, including the 401 Unauthorized
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response && error.response.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update formorder.',
        });
      }
    } else {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
    }
  };

  const validateOrder = () => {
    return formOrder.customer;
  };

  const sanitizeOrder = (formOrder) => {
    return {
      ...formOrder,
      customer: sanitizeInput(formOrder.customer),
      customer_ref_no: sanitizeInput(formOrder.customer_ref_no),
      branch: formOrder.branch,
      booked_by: sanitizeInput(formOrder.booked_by),
      account_rep: sanitizeInput(formOrder.account_rep),
      sales_rep: sanitizeInput(formOrder.sales_rep),
      customer_po_no: formOrder.customer_po_no,
      commodity: sanitizeInput(formOrder.commodity),
      equipment: sanitizeInput(formOrder.equipment),
      load_type: sanitizeInput(formOrder.load_type),
      temperature: sanitizeInput(formOrder.temperature),
      origin_location: formOrder.origin_location.map((origin) => ({
        ...origin,
        address: sanitizeInput(origin.address),
        city: sanitizeInput(origin.city),
        state: sanitizeInput(origin.state),
        postal: sanitizeInput(origin.postal),
        country: sanitizeInput(origin.country),
        date: origin.date,
        time: origin.time,
        currency: sanitizeInput(origin.currency),
        equipment: sanitizeInput(origin.equipment),
        pickup_po: sanitizeInput(origin.pickup_po),
        phone: origin.phone,
        packages: sanitizeInput(origin.packages),
        weight: sanitizeInput(origin.weight),
        dimensions: origin.dimensions,
        notes: sanitizeInput(origin.notes),
      })),
      destination_location: formOrder.destination_location.map((destination) => ({
        ...destination,
        address: sanitizeInput(destination.address),
        city: sanitizeInput(destination.city),
        state: sanitizeInput(destination.state),
        postal: sanitizeInput(destination.postal),
        country: sanitizeInput(destination.country),
        date: destination.date,
        time: destination.time,
        currency: sanitizeInput(destination.currency),
        equipment: sanitizeInput(destination.equipment),
        pickup_po: sanitizeInput(destination.pickup_po),
        phone: destination.phone,
        packages: sanitizeInput(destination.packages),
        weight: sanitizeInput(destination.weight),
        dimensions: destination.dimensions,
        notes: sanitizeInput(destination.notes),
      })),
      hot: formOrder.hot,
      team: formOrder.team,
      air_ride: formOrder.air_ride,
      hazmat: formOrder.hazmat,
      currency: sanitizeInput(formOrder.currency),
      base_price: formOrder.base_price,
      charges: formOrder.charges.map((charge) => ({
        ...charge,
        type: sanitizeInput(charge.type),
        charge: charge.charge,
        percent: charge.percent,
      })),
      discounts: formOrder.discounts.map((discount) => ({
        ...discount,
        type: sanitizeInput(discount.type),
        charge: discount.charge,
        percent: discount.percent,
      })),
      gst: formOrder.gst,
      pst: formOrder.pst,
      hst: formOrder.hst,
      qst: formOrder.qst,
      final_price: formOrder.final_price,
      notes: formOrder.notes,
    };
  };

  const handleApiError = (error) => {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors.website
        ? error.response.data.errors.website[0]
        : 'An error occurred while saving/updating the formorder.';
      Swal.fire('Error', errorMessage, 'error');
    } else {
      console.error('Error saving/updating order:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while saving/updating the formorder.', 'error');
    }
  };

  return {
    formOrder,
    setFormOrder,
    updateOrder,
  };
};

export default useOrderHandler;
