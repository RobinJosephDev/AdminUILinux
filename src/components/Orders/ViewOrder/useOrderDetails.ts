import { useState } from 'react';

const useOrderDetails = () => {
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


  const sanitizeInput = (input) => input.replace(/[^\w\s]/g, '');

  const handleOriginChange = (index, updatedOrigin) => {
    const sanitizedOrigin = {
      ...updatedOrigin,
      address: sanitizeInput(updatedOrigin.address),
      city: sanitizeInput(updatedOrigin.city),
      state: sanitizeInput(updatedOrigin.state),
      postal: sanitizeInput(updatedOrigin.postal),
      country: sanitizeInput(updatedOrigin.country),
      date: updatedOrigin.date,
      time: updatedOrigin.time,
      currency: sanitizeInput(updatedOrigin.currency),
      equipment: sanitizeInput(updatedOrigin.equipment),
      pickup_po: sanitizeInput(updatedOrigin.pickup_po),
      phone: updatedOrigin.phone,
      packages: sanitizeInput(updatedOrigin.packages),
      weight: sanitizeInput(updatedOrigin.weight),
      dimensions: updatedOrigin.dimensions,
      notes: sanitizeInput(updatedOrigin.notes),
    };
    const updatedOrigins = [...formOrder.origin_location];
    updatedOrigins[index] = sanitizedOrigin;
    setFormOrder({ ...formOrder, origin_location: updatedOrigins });
  };

  const handleDestinationChange = (index, updatedDestination) => {
    const sanitizedDestination = {
      ...updatedDestination,
      address: sanitizeInput(updatedDestination.address),
      city: sanitizeInput(updatedDestination.city),
      state: sanitizeInput(updatedDestination.state),
      postal: sanitizeInput(updatedDestination.postal),
      country: sanitizeInput(updatedDestination.country),
      date: updatedDestination.date,
      time: updatedDestination.time,
      currency: sanitizeInput(updatedDestination.currency),
      equipment: sanitizeInput(updatedDestination.equipment),
      pickup_po: sanitizeInput(updatedDestination.pickup_po),
      phone: updatedDestination.phone,
      packages: sanitizeInput(updatedDestination.packages),
      weight: sanitizeInput(updatedDestination.weight),
      dimensions: updatedDestination.dimensions,
      notes: sanitizeInput(updatedDestination.notes),
    };
    const updatedDestinations = [...formOrder.destination_location];
    updatedDestinations[index] = sanitizedDestination;
    setFormOrder({ ...formOrder, destination_location: updatedDestinations });
  };

  const handleChargeChange = (index, updatedCharge) => {
    const sanitizedCharge = {
      ...updatedCharge,
      type: sanitizeInput(updatedCharge.type),
      charge: sanitizeInput(updatedCharge.charge),
      percent: sanitizeInput(updatedCharge.percent),
    };
    const updatedCharges = [...formOrder.charges];
    updatedCharges[index] = sanitizedCharge;
    setFormOrder({ ...formOrder, charges: updatedCharges });
  };

  const handleDiscountChange = (index, updatedDiscount) => {
    const sanitizedDiscount = {
      ...updatedDiscount,
      type: sanitizeInput(updatedDiscount.type),
      charge: sanitizeInput(updatedDiscount.charge),
      percent: sanitizeInput(updatedDiscount.percent),
    };
    const updatedDiscounts = [...formOrder.discounts];
    updatedDiscounts[index] = sanitizedDiscount;
    setFormOrder({ ...formOrder, discounts: updatedDiscounts });
  };

  const handleRemoveOrigin = (index) => {
    const updatedOrigins = formOrder.origin_location.filter((_, i) => i !== index);
    setFormOrder({ ...formOrder, origin_location: updatedOrigins });
  };

  const handleRemoveDestination = (index) => {
    const updatedDestinations = formOrder.destination_location.filter((_, i) => i !== index);
    setFormOrder({ ...formOrder, destination_location: updatedDestinations });
  };

  const handleRemoveCharge = (index) => {
    const updatedCharges = formOrder.charges.filter((_, i) => i !== index);
    setFormOrder({ ...formOrder, charges: updatedCharges });
  };

  const handleRemoveDiscount = (index) => {
    const updatedDiscounts = formOrder.discounts.filter((_, i) => i !== index);
    setFormOrder({ ...formOrder, discounts: updatedDiscounts });
  };

  return {
    handleOriginChange,
    handleDestinationChange,
    handleChargeChange,
    handleDiscountChange,
    handleRemoveOrigin,
    handleRemoveDestination,
    handleRemoveCharge,
    handleRemoveDiscount,
  };
};

export default useOrderDetails;
