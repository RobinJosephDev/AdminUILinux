import { FC } from 'react';
import { Company } from '../../../types/CompanyTypes';

interface ViewAddressProps {
  formCompany: Company;
}

const ViewAddress: FC<ViewAddressProps> = ({ formCompany }) => {
  return (
    <fieldset>
      <legend>Address</legend>
      <hr />

      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressStreet">Street</label>
          <span>{formCompany.address || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressCity">City</label>
          <span>{formCompany.city || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressState">State</label>
          <span>{formCompany.state || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressCountry">Country</label>
          <span>{formCompany.country || 'N/A'}</span>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressPostalCode">Postal Code</label>
          <span>{formCompany.postal || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressUnitNo">Phone</label>
          <span>{formCompany.phone || 'N/A'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressPostalCode">Cell</label>
          <span>{formCompany.cell || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressUnitNo">Fax</label>
          <span>{formCompany.fax || 'N/A'}</span>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressPostalCode">Invoice Prefix</label>
          <span>{formCompany.invoice_prefix || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressUnitNo">SCAC</label>
          <span>{formCompany.SCAC || 'N/A'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressPostalCode">Docket#</label>
          <span>{formCompany.docket_no || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressUnitNo">Carrier Code</label>
          <span>{formCompany.carrier_code || 'N/A'}</span>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressPostalCode">GST/HST#</label>
          <span>{formCompany.gst_hst_no || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressUnitNo">QST#</label>
          <span>{formCompany.qst_no || 'N/A'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressPostalCode">CA Bond#</label>
          <span>{formCompany.ca_bond_no || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressUnitNo">Website</label>
          <span>{formCompany.website || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="mailingAddressUnitNo">Obsolete</label>
          <span>{formCompany.obsolete ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewAddress;
