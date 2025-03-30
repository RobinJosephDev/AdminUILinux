import CustomerInfo from './CustomerInfo';
import PrimaryAddress from './PrimaryAddress';
import MailingAddress from './MailingAddress';
import AccountsPayable from './AccountsPayable';
import CustomBroker from './CustomBroker';
import CustomerCredit from './CustomerCredit';
import CustomerContact from './CustomerContact';
import CustomerEquipment from './CustomerEquipment';
import { PlusOutlined } from '@ant-design/icons';
import useEditCustomer from '../../../hooks/edit/useEditCustomer';
import { Customer, Contact, Equipment } from '../../../types/CustomerTypes';

interface EditCustomerFormProps {
  customer: Customer;
  onClose: () => void;
  onUpdate: () => void;
}

function EditCustomerForm({ customer, onClose, onUpdate }: EditCustomerFormProps) {
  const { formCustomer, setFormCustomer, updateCustomer, handleContactChange, handleEquipmentChange, handleRemoveContact, handleRemoveEquipment } =
    useEditCustomer({ customer, onUpdate, onClose });

  // Initialize `contacts` and `equipment` to empty arrays if undefined
  const contacts = formCustomer?.contact || [];
  const equipment = Array.isArray(formCustomer?.cust_equipment) ? formCustomer.cust_equipment : [];

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateCustomer();
        }}
        className="form-main"
      >
        <CustomerInfo formCustomer={formCustomer} setFormCustomer={setFormCustomer} />
        <PrimaryAddress formCustomer={formCustomer} setFormCustomer={setFormCustomer} />
        <MailingAddress formCustomer={formCustomer} setFormCustomer={setFormCustomer} />
        <AccountsPayable formCustomer={formCustomer} setFormCustomer={setFormCustomer} />
        <CustomBroker formCustomer={formCustomer} setFormCustomer={setFormCustomer} />
        <CustomerCredit formCustomer={formCustomer} setFormCustomer={setFormCustomer} />

        <fieldset className="form-section">
          <legend>Contacts</legend>
          <div className="form-row">
            {contacts.map((contact: Contact, index: number) => (
              <CustomerContact key={index} contact={contact} index={index} onChange={handleContactChange} onRemove={handleRemoveContact} />
            ))}
            <button
              type="button"
              onClick={() =>
                setFormCustomer((prevCustomer) => ({
                  ...prevCustomer,
                  contact: [...prevCustomer.contact, { name: '', phone: '', ext: '', email: '', fax: '', designation: '' }],
                }))
              }
              className="add-button"
            >
              <PlusOutlined />
            </button>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Equipments</legend>
          <div className="form-row">
            {equipment.map((equipmentItem: Equipment, index: number) => (
              <CustomerEquipment
                key={index}
                equipment={equipmentItem}
                index={index}
                onChange={handleEquipmentChange}
                onRemove={handleRemoveEquipment}
              />
            ))}
            <button
              type="button"
              onClick={() =>
                setFormCustomer((prevCustomer) => ({
                  ...prevCustomer,
                  cust_equipment: [...prevCustomer.cust_equipment, { equipment: '' }],
                }))
              }
              className="add-button"
            >
              <PlusOutlined />
            </button>
          </div>
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
}

export default EditCustomerForm;
