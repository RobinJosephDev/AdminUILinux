import LeadContactForm from '../LeadContactForm';
import '../../../styles/Form.css';
import LeadDetails from './LeadDetails';
import AddressDetails from './AddressDetails';
import AdditionalInfo from './AdditionalInfo';
import { PlusOutlined } from '@ant-design/icons';
import { Lead } from '../../../types/LeadTypes';
import { useAddLead } from '../../../hooks/add/useAddLead';

interface AddLeadFormProps {
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
}

const AddLeadForm: React.FC<AddLeadFormProps> = ({ onClose, onAddLead }) => {
  const { lead, setLead, handleAddContact, handleRemoveContact, handleContactChange, handleSubmit } = useAddLead(onClose, onAddLead);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-main">
        <LeadDetails lead={lead} setLead={setLead} />
        <AddressDetails lead={lead} setLead={setLead} />
        <AdditionalInfo lead={lead} setLead={setLead} />
        <fieldset className="form-section">
          <legend>Contacts</legend>
          <hr />
          <div className="form-row">
            {lead.contacts.map((contact, index) => (
              <LeadContactForm
                key={index}
                contact={contact}
                index={index}
                handleContactChange={handleContactChange}
                handleRemoveContact={handleRemoveContact}
              />
            ))}
            <button type="button" onClick={handleAddContact} className="add-button">
              <PlusOutlined />
            </button>
          </div>
        </fieldset>
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Create Lead
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeadForm;
