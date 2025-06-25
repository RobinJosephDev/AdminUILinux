import { FC } from 'react';
import { Cargo } from '../../../types/CompanyTypes';

interface ViewCargoInsuranceProps {
  cargo_ins: Cargo;
  index: number;
}

const ViewCargoInsurance: FC<ViewCargoInsuranceProps> = ({ cargo_ins }) => {
  return (
    <fieldset className="form-section">
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Company</label>
          <span>{cargo_ins.company || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Policy Start</label>
          <span>{cargo_ins.policy_start || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Policy End</label>
          <span>{cargo_ins.policy_end || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Amount</label>
          <span>{cargo_ins.amount || 'N/A'}</span>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewCargoInsurance;
