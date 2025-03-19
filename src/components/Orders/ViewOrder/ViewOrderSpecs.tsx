import React from 'react';

interface FormOrder {
  hot?: boolean;
  team?: boolean;
  air_ride?: boolean;
  tarp?: boolean;
  hazmat?: boolean;
}

interface ViewOrderSpecsProps {
  formOrder: FormOrder;
  setFormOrder: (order: FormOrder) => void;
}

const ViewOrderSpecs: React.FC<ViewOrderSpecsProps> = ({ formOrder, setFormOrder }) => {
  return (
    <fieldset className="form-section">
      <legend>Load Specifications</legend>
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {['hot', 'team', 'air_ride', 'tarp', 'hazmat'].map((spec) => (
          <div className="form-group" style={{ flex: 1 }} key={spec}>
            <label htmlFor={spec} style={{ display: 'inline-flex', alignItems: 'center', width: '100%' }}>
              {spec.replace('_', ' ').toUpperCase()}
              <input
                type="checkbox"
                checked={formOrder[spec as keyof FormOrder] || false}
                onChange={(e) => setFormOrder({ ...formOrder, [spec]: e.target.checked })}
                id={spec}
              />
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default ViewOrderSpecs;
