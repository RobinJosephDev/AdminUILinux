import { PlusOutlined } from '@ant-design/icons';
import '../../../styles/Form.css';
import General from './General';
import Address from './Address';
import OtherInfo from './OtherInfo';
import BankingInfo from '../BankingInfo';
import CargoInsurance from '../CargoInsurance';
import LiabilityInsurance from '../LiabilityInsurance';
import { useAddCompany } from '../../../hooks/add/useAddCompany';
import UploadDocuments from './UploadDocuments';

interface AddCompanyFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddCompanyForm: React.FC<AddCompanyFormProps> = ({ onClose, onSuccess }) => {
  const {
    company,
    setCompany,
    handleSubmit,
    handleAddBank,
    handleRemoveBank,
    handleBankChange,
    handleAddCargo,
    handleRemoveCargo,
    handleCargoChange,
    handleAddLiability,
    handleRemoveLiability,
    handleLiabilityChange,
    clearCompanyForm,
  } = useAddCompany(onClose, onSuccess);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-main">
        <General company={company} setCompany={setCompany} />
        <Address company={company} setCompany={setCompany} />
        <OtherInfo company={company} setCompany={setCompany} />

        <fieldset className="form-section">
          <legend>Banking Info</legend>
          <hr />
          <div className="form-row">
            {company.bank_info.map((banking_info, index) => (
              <BankingInfo
                key={index}
                bank_info={company.bank_info}
                index={index}
                onAddBank={handleAddBank}
                handleBankChange={handleBankChange}
                handleRemoveBank={handleRemoveBank}
              />
            ))}
          </div>
          {company.bank_info.length === 0 && (
            <button type="button" onClick={handleAddBank} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>

        <fieldset className="form-section">
          <legend>Cargo Insurance</legend>
          <hr />
          <div className="form-row">
            {company.cargo_insurance.map((cargo_ins, index) => (
              <CargoInsurance
                key={index}
                cargo_insurance={company.cargo_insurance}
                index={index}
                onAddCargo={handleAddCargo}
                handleCargoChange={handleCargoChange}
                handleRemoveCargo={handleRemoveCargo}
              />
            ))}
          </div>
          {company.cargo_insurance.length === 0 && (
            <button type="button" onClick={handleAddCargo} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>

        <fieldset className="form-section">
          <legend>Liability Insurance</legend>
          <hr />
          <div className="form-row">
            {company.liablility_insurance.map((liablility_ins, index) => (
              <LiabilityInsurance
                key={index}
                liablility_insurance={company.liablility_insurance}
                index={index}
                onAddLiability={handleAddLiability}
                handleLiabilityChange={handleLiabilityChange}
                handleRemoveLiability={handleRemoveLiability}
              />
            ))}
          </div>
          {company.liablility_insurance.length === 0 && (
            <button type="button" onClick={handleAddLiability} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>
        <UploadDocuments company={company} setCompany={setCompany} />
        
        <div className="form-actions">
          <button type="submit" className="btn-submit" data-testid="submit-button">
            Add Company
          </button>

          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompanyForm;
