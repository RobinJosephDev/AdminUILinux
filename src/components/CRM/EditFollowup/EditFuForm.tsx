import EditFuAddress from './EditFuAddress';
import EditFuLeadType from './EditFuLeadType';
import EditFuDetail from './EditFuDetail';
import EditFuAddInfo from './EditFuAddInfo';
import EditFuInfo from './EditFuInfo';
import { PlusOutlined } from '@ant-design/icons';
import FuContactForm from '../FuContactForm';
import FuProductForm from '../FuProductForm';
import { Followup } from '../../../types/FollowupTypes';
import useEditFollowup from '../../../hooks/edit/useEditFollowup';
import { v4 as uuidv4 } from 'uuid';

interface EditFuFormProps {
  followup: Followup | null;
  onClose: () => void;
  onUpdate: (updatedFollowUp: Followup) => void;
}

const EditFuForm: React.FC<EditFuFormProps> = ({ followup, onClose, onUpdate }) => {
  const {
    followupEdit,
    setFollowupEdit,
    handleAddContact,
    handleAddProduct,
    handleContactChange,
    handleRemoveContact,
    handleProductChange,
    handleRemoveProduct,
    updateFollowup,
  } = useEditFollowup(followup, onClose, onUpdate);

  const contactIds = followupEdit.contacts.map((contact) => contact.id);
  const hasDuplicateContacts = new Set(contactIds).size !== contactIds.length;
  console.log('Has duplicate contacts:', hasDuplicateContacts);

  const productIds = followupEdit.products.map((product) => product.id);
  const hasDuplicateProducts = new Set(productIds).size !== productIds.length;
  console.log('Has duplicate products:', hasDuplicateProducts);
  // Fallback to a generated UUID if the id is missing

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateFollowup();
        }}
        className="form-main"
      >
        <EditFuInfo followupEdit={followupEdit} setFollowupEdit={setFollowupEdit} />
        <EditFuAddress followupEdit={followupEdit} setFollowupEdit={setFollowupEdit} />
        <EditFuLeadType followupEdit={followupEdit} setFollowupEdit={setFollowupEdit} />
        <EditFuDetail followupEdit={followupEdit} setFollowupEdit={setFollowupEdit} />
        <EditFuAddInfo followupEdit={followupEdit} setFollowupEdit={setFollowupEdit} />
        <fieldset className="form-section">
          <legend>Contacts</legend>
          {followupEdit.contacts && followupEdit.contacts.length > 0 ? (
            followupEdit.contacts.map((contact) => {
              const contactId = contact.id || uuidv4(); // Generate once per render cycle
              return (
                <FuContactForm
                  key={contactId} // Stable key
                  contact={{ ...contact, id: contactId }} // Ensure id is set
                  onAddContact={handleAddContact}
                  handleRemoveContact={handleRemoveContact}
                  handleContactChange={handleContactChange}
                />
              );
            })
          ) : (
            <p>No contacts available</p> // Show a message when there are no contacts
          )}

          <button type="button" onClick={handleAddContact} className="add-button">
            <PlusOutlined />
          </button>
        </fieldset>

        <fieldset className="form-section">
          <legend>Products</legend>
          {followupEdit.products && followupEdit.products.length > 0 ? (
            followupEdit.products.map((product) => {
              const productId = Number(product.id) || uuidv4();
              return (
                <FuProductForm
                  key={productId}
                  product={{ ...product, id: productId }}
                  onAddProduct={handleAddProduct}
                  handleRemoveProduct={handleRemoveProduct}
                  handleProductChange={handleProductChange}
                />
              );
            })
          ) : (
            <p>No products available</p> // Show a message when there are no contacts
          )}

          <button type="button" onClick={handleAddProduct} className="add-button">
            <PlusOutlined />
          </button>
        </fieldset>

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

export default EditFuForm;
