type ContactProps = {
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
};

function ViewLeadContactForm({ contact = {} }: ContactProps) {
  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Name</label>
        <p>{contact.name || 'N/A'}</p>
      </div>
      <div className="form-group">
        <label>Phone</label>
        <p>{contact.phone || 'N/A'}</p>
      </div>
      <div className="form-group">
        <label>Email</label>
        <p>{contact.email || 'N/A'}</p>
      </div>
    </div>
  );
}

export default ViewLeadContactForm;
