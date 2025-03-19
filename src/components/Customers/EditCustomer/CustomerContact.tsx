import { DeleteOutlined } from '@ant-design/icons';
import { Contact } from '../../../types/CustomerTypes';

interface CustomerContactProps {
  contact: Contact;
  index: number;
  onChange: (index: number, updatedContact: Contact) => void;
  onRemove: (index: number) => void;
}

const defaultContact: Contact = {
  name: '',
  phone: '',
  ext: '',
  email: '',
  fax: '',
  designation: ''
};

const CustomerContact: React.FC<CustomerContactProps> = ({ contact = defaultContact, index, onChange, onRemove }) => {
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedContact = { ...contact, [name]: value };
    onChange(index, updatedContact);
  };

  return (
    <fieldset className="form-section">
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={contact?.name || ''}
            onChange={handleContactChange}
            placeholder="Name"
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Contact No</label>
          <input
            type="tel"
            name="phone"
            value={contact?.phone || ''}
            onChange={handleContactChange}
            placeholder="Contact No"
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Contact No Ext</label>
          <input
            type="text"
            name="ext"
            value={contact?.ext || ''}
            onChange={handleContactChange}
            placeholder="Contact No Ext"
          />
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={contact?.email || ''}
            onChange={handleContactChange}
            placeholder="Email"
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Fax</label>
          <input
            type="text"
            name="fax"
            value={contact?.fax || ''}
            onChange={handleContactChange}
            placeholder="Fax"
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Designation</label>
          <input
            type="text"
            name="designation"
            value={contact?.designation || ''}
            onChange={handleContactChange}
            placeholder="Designation"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="trash-bottom"
        style={{ float: 'right', marginTop: '10px', display: 'inline-block' }}
      >
        <DeleteOutlined />
      </button>
    </fieldset>
  );
};

export default CustomerContact;
