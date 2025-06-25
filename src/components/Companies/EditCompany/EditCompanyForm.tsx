import useEditCompany from '../../../hooks/edit/useEditCompany';
import EditGeneral from './EditGeneral';
import EditAddress from './EditAddress';
import EditOtherInfo from './EditOtherInfo';
import BankingInfo from '../BankingInfo';
import CargoInsurance from '../CargoInsurance';
import { Company } from '../../../types/CompanyTypes';
import { PlusOutlined } from '@ant-design/icons';
import LiabilityInsurance from '../LiabilityInsurance';
import EditUploadDocuments from './EditUploadDocuments';

interface EditCompanyFormProps {
  company: Company | null;
  onClose: () => void;
  onUpdate: (company: Company) => void;
}

const EditCompanyForm: React.FC<EditCompanyFormProps> = ({ company, onClose, onUpdate }) => {
  const {
    formCompany,
    setFormCompany,
    updateCompany,
    handleAddBank,
    handleRemoveBank,
    handleBankChange,
    handleAddCargo,
    handleRemoveCargo,
    handleCargoChange,
    handleAddLiability,
    handleRemoveLiability,
    handleLiabilityChange,
  } = useEditCompany(company, onClose, onUpdate);

  console.log('Form company:', formCompany);

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateCompany();
        }}
        className="form-main"
      >
        {formCompany && (
          <>
            <EditGeneral formCompany={formCompany} setFormCompany={setFormCompany} />
            <EditAddress formCompany={formCompany} setFormCompany={setFormCompany} />
            <EditOtherInfo formCompany={formCompany} setFormCompany={setFormCompany} />

            <fieldset className="form-section">
              <legend>Banking Info</legend>
              <hr />
              <div className="form-row">
                {formCompany.bank_info.map((banking_info, index) => (
                  <BankingInfo
                    key={index}
                    bank_info={formCompany.bank_info}
                    index={index}
                    onAddBank={handleAddBank}
                    handleRemoveBank={handleRemoveBank}
                    handleBankChange={handleBankChange}
                  />
                ))}
                {formCompany.bank_info.length === 0 && (
                  <button type="button" onClick={handleAddBank} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Cargo Insurance</legend>
              <hr />
              <div className="form-row">
                {formCompany.cargo_insurance.map((cargo_ins, index) => (
                  <CargoInsurance
                    key={index}
                    cargo_insurance={formCompany.cargo_insurance}
                    index={index}
                    onAddCargo={handleAddCargo}
                    handleRemoveCargo={handleRemoveCargo}
                    handleCargoChange={handleCargoChange}
                  />
                ))}
                {formCompany.cargo_insurance.length === 0 && (
                  <button type="button" onClick={handleAddCargo} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Liability Insurance</legend>
              <hr />
              <div className="form-row">
                {formCompany.liablility_insurance.map((liablility_ins, index) => (
                  <LiabilityInsurance
                    key={index}
                    liablility_insurance={formCompany.liablility_insurance}
                    index={index}
                    onAddLiability={handleAddLiability}
                    handleRemoveLiability={handleRemoveLiability}
                    handleLiabilityChange={handleLiabilityChange}
                  />
                ))}
                {formCompany.liablility_insurance.length === 0 && (
                  <button type="button" onClick={handleAddLiability} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>
          </>
        )}
        <EditUploadDocuments formCompany={formCompany} setFormCompany={setFormCompany} />

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Save
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyForm;
