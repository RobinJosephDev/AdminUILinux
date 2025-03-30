import React from 'react';

type Pickup = {
  address: string;
  city: string;
  state: string;
  postal: string;
  country: string;
};

type ViewQuotePickupProps = {
  pickup: Pickup;
  index: number;
};

const ViewQuotePickup: React.FC<ViewQuotePickupProps> = ({ pickup, index }) => {
  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Address</label>
        <p>{pickup.address || 'N/A'}</p>
      </div>
      <div className="form-group">
        <label>City</label>
        <p>{pickup.city || 'N/A'}</p>
      </div>
      <div className="form-group">
        <label>State</label>
        <p>{pickup.state || 'N/A'}</p>
      </div>
      <div className="form-group">
        <label>Postal Code</label>
        <p>{pickup.postal || 'N/A'}</p>
      </div>
      <div className="form-group">
        <label>Country</label>
        <p>{pickup.country || 'N/A'}</p>
      </div>
    </div>
  );
};

export default ViewQuotePickup;
