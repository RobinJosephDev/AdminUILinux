import { FC } from 'react';
import { Bank } from '../../../types/CompanyTypes';

interface ViewBankingInfoProps {
  banking_info: Bank;
  index: number;
}

const ViewBankingInfo: FC<ViewBankingInfoProps> = ({ banking_info }) => {
  return (
    <fieldset className="form-section">
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Name</label>
          <span>{banking_info.name || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Contact No</label>
          <span>{banking_info.phone || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Email</label>
          <span>{banking_info.email || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Address</label>
          <span>{banking_info.address || 'N/A'}</span>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>US Account No.</label>
          <span>{banking_info.us_account_no || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>CAN Account No.</label>
          <span>{banking_info.cdn_account_no || 'N/A'}</span>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewBankingInfo;
