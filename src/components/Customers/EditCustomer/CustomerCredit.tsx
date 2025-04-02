import { useState } from 'react';
import { Customer, FileData } from '../../../types/CustomerTypes';

interface CustomerCreditProps {
  formCustomer: Customer;
  setFormCustomer: (customer: Customer) => void;
}

const CustomerCredit: React.FC<CustomerCreditProps> = ({ formCustomer, setFormCustomer }) => {
  const creditStatusOptions = ['Approved', 'Not Approved'];
  const [uploading, setUploading] = useState(false);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Customer) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      setFormCustomer({
        ...formCustomer,
        [fieldName]: { url: data.fileUrl, name: file.name },
      });
    } catch (error) {
      console.error('File upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  const renderDownloadLink = (fileData?: FileData | string, fileLabel?: string) => {
    if (fileData) {
      const fileObject = typeof fileData === 'string' ? JSON.parse(fileData) : fileData;
      if (fileObject?.url) {
        return (
          <a href={fileObject.url} target="_blank" rel="noopener noreferrer">
            Download {fileLabel}: {fileObject.name}
          </a>
        );
      }
    }
    return null;
  };

  return (
    <fieldset>
      <legend>Customer Credit</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="creditStatus">Credit Status</label>
          <select
            name="creditStatus"
            value={formCustomer.cust_credit_status}
            onChange={(e) => setFormCustomer({ ...formCustomer, cust_credit_status: e.target.value })}
          >
            <option value="">Select..</option>
            {creditStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="creditAgreement">Credit Agreement</label>
          <input type="file" name="creditAgreement" onChange={(e) => handleFileChange(e, 'cust_credit_agreement')} />
          {renderDownloadLink(formCustomer?.cust_credit_agreement, 'Credit Agreement')}
          {uploading && <p>Uploading...</p>}
        </div>
      </div>
    </fieldset>
  );
};

export default CustomerCredit;
