import { FC } from 'react';
import { Liability } from '../../../types/CompanyTypes';

interface ViewLiabilityInsuranceProps {
  liab_ins: Liability;
  index: number;
}

const ViewLiabilityInsurance: FC<ViewLiabilityInsuranceProps> = ({ liab_ins }) => {
  return (
    <fieldset className="form-section">
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Company</label>
          <span>{liab_ins.company || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Policy Start</label>
          <span>{liab_ins.policy_start || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Policy End</label>
          <span>{liab_ins.policy_end || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Amount</label>
          <span>{liab_ins.amount || 'N/A'}</span>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewLiabilityInsurance;
