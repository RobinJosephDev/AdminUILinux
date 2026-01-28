import { useEffect, useState, useContext } from 'react';
import { useUser } from '../../../UserProvider';
import ViewGeneral from './ViewGeneral';
import ViewAddress from './ViewAddress';
import ViewOtherInfo from './ViewOtherInfo';
import ViewBankingInfo from './ViewBankingInfo';
import ViewCargoInsurance from './ViewCargoInsurance';
import ViewLiabilityInsurance from './ViewLiabilityInsurance';
import { Company } from '../../../types/CompanyTypes';
import ViewUploadDocuments from './ViewUploadDocuments';

interface ViewCompanyFormProps {
  company: Company | null;
  onClose: () => void;
}

const ViewCompanyForm: React.FC<ViewCompanyFormProps> = ({ company, onClose }) => {
  const { userRole, setUserRole } = useUser();
  const [formCompany, setFormCompany] = useState<Company>({
    id: 0,
    name: '',
    invoice_terms: '',
    rate_conf_terms: '',
    quote_terms: '',
    invoice_reminder: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal: '',
    email: '',
    phone: '',
    cell: '',
    fax: '',
    invoice_prefix: '',
    SCAC: '',
    docket_no: '',
    carrier_code: '',
    gst_hst_no: '',
    qst_no: '',
    ca_bond_no: '',
    website: '',
    obsolete: false,
    us_tax_id: '',
    payroll_no: '',
    wcb_no: '',
    dispatch_email: '',
    ap_email: '',
    ar_email: '',
    cust_comm_email: '',
    quot_email: '',
    bank_info: [],
    cargo_insurance: [],
    liablility_insurance: [],
    company_package: '',
    insurance: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (company) {
      setFormCompany({
        ...company,
        bank_info: Array.isArray(company.bank_info) ? company.bank_info : JSON.parse((company.bank_info as any) || '[]'),
        cargo_insurance: Array.isArray(company.cargo_insurance) ? company.cargo_insurance : JSON.parse((company.cargo_insurance as any) || '[]'),
        liablility_insurance: Array.isArray(company.liablility_insurance)
          ? company.liablility_insurance
          : JSON.parse((company.liablility_insurance as any) || '[]'),
      });
    }
  }, [company]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewGeneral formCompany={formCompany} />
        <ViewAddress formCompany={formCompany} />
        <ViewOtherInfo formCompany={formCompany} />
        <fieldset className="form-section">
          <legend>Banking Info</legend>
          <hr />
          <div className="form-row">
            {formCompany.bank_info.map((banking_info, index) => (
              <ViewBankingInfo key={index} banking_info={banking_info} index={index} />
            ))}
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Cargo Insurance</legend>
          <hr />
          <div className="form-row">
            {formCompany.cargo_insurance.map((cargo_ins, index) => (
              <ViewCargoInsurance key={index} cargo_ins={cargo_ins} index={index} />
            ))}
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Liability Insurance</legend>
          <hr />
          <div className="form-row">
            {formCompany.liablility_insurance.map((liab_ins, index) => (
              <ViewLiabilityInsurance key={index} liab_ins={liab_ins} index={index} />
            ))}
          </div>
        </fieldset>
        <ViewUploadDocuments formCompany={formCompany} />

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose} style={{ padding: '9px 15px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewCompanyForm;
