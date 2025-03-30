import { DeleteOutlined } from '@ant-design/icons';
import React, { ChangeEvent } from 'react';

type Contact = {
  name?: string;
  phone?: string;
  email?: string;
};

type LeadContactFormProps = {
  contact?: Contact;
  index: number;
  onChange: (index: number, updatedContact: Contact) => void;
  onRemove: (index: number) => void;
};

const LeadContactForm: React.FC<LeadContactFormProps> = ({ contact = {}, index, onChange, onRemove }) => {
  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedContact: Contact = { ...contact, [name]: value };
    onChange(index, updatedContact);
  };

  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Name</label>
        <input type="text" name="name" value={contact.name || ''} onChange={handleContactChange} placeholder="Name" />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input type="tel" name="phone" value={contact.phone || ''} onChange={handleContactChange} placeholder="Phone" />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" value={contact.email || ''} onChange={handleContactChange} placeholder="Email" />
      </div>

      <button type="button" onClick={() => onRemove(index)} className="remove">
        <DeleteOutlined />
      </button>
    </div>
  );
};

export default LeadContactForm;
