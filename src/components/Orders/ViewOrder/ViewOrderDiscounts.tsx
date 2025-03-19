import React from 'react';

interface Discount {
  type?: string;
  charge?: string | number;
  percent?: string | number;
}

interface ViewOrderDiscountsProps {
  discount?: Discount;
  index: number;
  onRemove: (index: number) => void;
}

function ViewOrderDiscounts({ discount = {}, index, onRemove }: ViewOrderDiscountsProps) {
  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Type</label>
        <div>{discount.type || ''}</div>
      </div>
      <div className="form-group">
        <label>Charge</label>
        <div>{discount.charge || ''}</div>
      </div>
      <div className="form-group">
        <label>Percent/Flat Rate</label>
        <div>{discount.percent || ''}</div>
      </div>
    </div>
  );
}

export default ViewOrderDiscounts;
