import '../../../styles/Form.css';
import LeadInfo from './LeadInfo';
import AddressDetails from './AddressDetails';
import AdditionalInfo from './AdditionalInfo';
import { PlusOutlined } from '@ant-design/icons';
import { useAddFollowup } from '../../../hooks/add/useAddFollowup';
import FuProductForm from '../FuProductForm';
import FuContactForm from '../FuContactForm';

interface AddLeadFollowupProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddLeadFollowupForm: React.FC<AddLeadFollowupProps> = ({ onClose, onSuccess }) => {
  const {
    followup,
    setFollowup,
    handleAddContact,
    handleRemoveContact,
    handleContactChange,
    handleAddProduct,
    handleRemoveProduct,
    handleProductChange,
    handleSubmit,
  } = useAddFollowup(onClose, onSuccess);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-main">
        <LeadInfo followup={followup} setFollowup={setFollowup} />
        <AddressDetails followup={followup} setFollowup={setFollowup} />
        <AdditionalInfo followup={followup} setFollowup={setFollowup} />
        <fieldset className="form-section">
          <legend>Contacts</legend>
          <hr />
          <div className="form-row">
            {followup.contacts.map((contact, index) => (
              <FuContactForm
                key={index}
                contacts={followup.contacts}
                index={index}
                onAddContact={handleAddContact}
                handleContactChange={handleContactChange}
                handleRemoveContact={handleRemoveContact}
              />
            ))}
          </div>
          {followup.contacts.length === 0 && (
            <button type="button" onClick={handleAddContact} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>
        <fieldset className="form-section">
          <legend>Products</legend>
          <hr />
          <div className="form-row">
            {followup.products.map((product, index) => (
              <FuProductForm
                key={index}
                products={followup.products}
                index={index}
                onAddProduct={handleAddProduct}
                handleProductChange={handleProductChange}
                handleRemoveProduct={handleRemoveProduct}
              />
            ))}
          </div>
          {followup.products.length === 0 && (
            <button type="button" onClick={handleAddProduct} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Create Follow-up
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeadFollowupForm;
