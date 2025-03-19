import React from 'react';

interface Charge {
  type?: string;
  charge?: string;
  percent?: string;
}

interface ViewOrderChargesProps {
  order: any;
  charge?: Charge;
  index: number;
  onRemove: (index: number) => void;
}

function ViewOrderCharges({ order, charge = {}, index, onRemove }: ViewOrderChargesProps) {
  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Type</label>
        <div>{charge.type || ''}</div>
      </div>
      <div className="form-group">
        <label>Charge</label>
        <div>{charge.charge || ''}</div>
      </div>
      <div className="form-group">
        <label>Percent/Flat Rate</label>
        <div>{charge.percent || ''}</div>
      </div>
    </div>
  );
}

export default ViewOrderCharges;
