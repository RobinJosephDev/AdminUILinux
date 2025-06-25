import { FC } from 'react';
import { Company } from '../../../types/CompanyTypes';

interface ViewGeneralProps {
  formCompany: Company;
}

const ViewGeneral: FC<ViewGeneralProps> = ({ formCompany }) => {
  return (
    <fieldset className="form-section">
      <legend>General</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="name">Name</label>
          <span>{formCompany.name || 'N/A'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="invoiceTerms">Invoice Terms</label>
          <span>{formCompany.invoice_terms || 'N/A'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="rateConfTerms">Rate Conf terms</label>
          <span>{formCompany.rate_conf_terms || 'N/A'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="quoteTerms">Quote Terms</label>
          <span>{formCompany.quote_terms || 'N/A'}</span>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="inoviceReminder">Inovice Reminder</label>
          <span>{formCompany.invoice_reminder || 'N/A'}</span>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewGeneral;
