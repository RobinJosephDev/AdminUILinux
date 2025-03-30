import { DeleteOutlined } from '@ant-design/icons';
import { ChangeEvent, useCallback } from 'react';
import { Contact } from '../../types/FollowupTypes';

// Define Props
interface FuContactFormProps {
  contact: Contact;
  onAddContact: () => void;
  handleRemoveContact: (id: number) => void;
  handleContactChange: (id: number, updatedContact: Contact) => void;
}

// Validation Functions
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^\+?[0-9\s-]{7,15}$/.test(phone);

const FuContactForm: React.FC<FuContactFormProps> = ({ contact, handleContactChange, handleRemoveContact }) => {
  const handleInputChange = useCallback(
    (field: keyof Contact) => (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.trim();

      if (field === 'email' && value && !validateEmail(value)) return;
      if (field === 'phone' && value && !validatePhone(value)) return;

      handleContactChange(Number(contact.id), { ...contact, [field]: value });
    },
    [contact, handleContactChange]
  );

  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Name</label>
        <input
          id={`name-${contact.id}`}
          type="text"
          name="name"
          value={contact.name || ''}
          onChange={handleInputChange('name')}
        />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input
          id={`phone-${contact.id}`}
          type="tel"
          name="phone"
          value={contact.phone || ''}
          onChange={handleInputChange('phone')}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          id={`email-${contact.id}`}
          type="email"
          name="email"
          value={contact.email || ''}
          onChange={handleInputChange('email')}
        />
      </div>
      <button type="button" className="remove" onClick={() => handleRemoveContact(Number(contact.id))}>
        <DeleteOutlined />
      </button>
    </div>
  );
};

export default FuContactForm;
