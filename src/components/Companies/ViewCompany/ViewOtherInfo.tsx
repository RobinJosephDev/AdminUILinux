import { FC } from 'react';
import { Company } from '../../../types/CompanyTypes';

interface ViewOtherInfoProps {
  formCompany: Company;
}

const ViewOtherInfo: FC<ViewOtherInfoProps> = ({ formCompany }) => {
  return (
    <fieldset className="form-section">
      <legend>Other Info</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>US Tax id</label>
          <p>{formCompany.us_tax_id || 'N/A'}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Payroll#</label>
          <p>{formCompany.payroll_no || 'N/A'}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>WCB#</label>
          <p>{formCompany.wcb_no || 'N/A'}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Dispatch Email</label>
          <p>{formCompany.dispatch_email || 'N/A'}</p>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Account Payable Email</label>
          <p>{formCompany.ap_email || 'N/A'}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Account Receivable email</label>
          <p>{formCompany.ar_email || 'N/A'}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Customer Communication Email</label>
          <p>{formCompany.cust_comm_email || 'N/A'}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Quotation Email</label>
          <p>{formCompany.quot_email || 'N/A'}</p>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewOtherInfo;
