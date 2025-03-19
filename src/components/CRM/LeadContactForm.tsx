import { DeleteOutlined } from '@ant-design/icons';
import { ChangeEvent } from 'react';
import { Contact } from '../../types/LeadTypes';

interface LeadContactFormProps {
  contact: Contact;
  index: number;
  handleContactChange: (index: number, updatedContact: Contact) => void;
  handleRemoveContact: (index: number) => void;
}

const LeadContactForm: React.FC<LeadContactFormProps> = ({ contact, index, handleRemoveContact, handleContactChange }) => {
  const sanitizeInput = (value: string) => value.replace(/[^a-zA-Z0-9 @._-]/g, ''); // Removes special characters

  // Handle Input Change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = sanitizeInput(value);

    if (name === 'phone') {
      sanitizedValue = sanitizedValue.replace(/[^0-9+]/g, ''); // Allow only numbers and "+"
    }

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedValue)) {
        sanitizedValue = ''; 
      }
    }

    handleContactChange(index, { ...contact, [name]: sanitizedValue });
  };

  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Name</label>
        <input type="text" name="name" value={contact.name} onChange={handleChange} placeholder="Name" />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input type="tel" name="phone" value={contact.phone} onChange={handleChange} placeholder="Phone" />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" value={contact.email} onChange={handleChange} placeholder="Email" />
      </div>

      <button type="button" onClick={() => handleRemoveContact(index)} className="remove">
        <DeleteOutlined />
      </button>
    </div>
  );
};

export default LeadContactForm;
