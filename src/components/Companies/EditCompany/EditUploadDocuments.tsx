import { useState } from 'react';
import { Company } from '../../../types/CompanyTypes';

interface EditUploadDocumentsProps {
  formCompany: Company;
  setFormCompany: React.Dispatch<React.SetStateAction<Company>>;
}

const EditUploadDocuments: React.FC<EditUploadDocumentsProps> = ({ formCompany, setFormCompany }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const API_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://127.0.0.1:8000/api';
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileKey: 'company_package' | 'insurance') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, [fileKey]: 'File size exceeds 10MB limit.' }));
      return;
    }

    setErrors((prev) => ({ ...prev, [fileKey]: '' }));
    setUploading((prev) => ({ ...prev, [fileKey]: true }));

    const formData = new FormData();
    formData.append(fileKey, file);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      console.log(`Upload response for ${fileKey}:`, data);

      const fileData = data.files?.[fileKey];

      if (fileData?.fileUrl) {
        const baseURL = API_URL.replace('/api', '');
        const fullFileUrl = fileData.fileUrl.startsWith('http') ? fileData.fileUrl : `${baseURL}${fileData.fileUrl}`;

        setFormCompany((prev) => ({
          ...prev,
          [fileKey]: fullFileUrl,
          [`${fileKey}_name`]: fileData.fileName,
        }));
      } else {
        console.error('Missing fileUrl in response:', data);
        setErrors((prev) => ({
          ...prev,
          [fileKey]: 'File upload failed: Missing URL in response.',
        }));
      }
    } catch (error) {
      console.error(`Error uploading ${fileKey}:`, error);
      setErrors((prev) => ({
        ...prev,
        [fileKey]: 'Network error during file upload.',
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [fileKey]: false }));
    }
  };

  return (
    <fieldset className="form-section">
      <legend>Uploaded Documents</legend>
      <hr />
      <div
        className="form-grid"
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        }}
      >
        {/* Company Package Upload */}
        <div className="form-group">
          <label htmlFor="company_package">Company Package</label>
          <input id="company_package" type="file" onChange={(e) => handleFileChange(e, 'company_package')} />
          {typeof formCompany.company_package === 'string' && formCompany.company_package && (
            <div>
              <a href={formCompany.company_package} target="_blank" rel="noopener noreferrer">
                Download Company Package
              </a>
            </div>
          )}

          {uploading.company_package && <p>Uploading...</p>}
          {errors.company_package && <p className="error">{errors.company_package}</p>}
        </div>

        {/* Insurance Upload */}
        <div className="form-group">
          <label htmlFor="insurance">Insurance</label>
          <input id="insurance" type="file" onChange={(e) => handleFileChange(e, 'insurance')} />
          {typeof formCompany.insurance === 'string' && formCompany.insurance && (
            <div>
              <a href={formCompany.insurance} target="_blank" rel="noopener noreferrer">
                Download Insurance
              </a>
            </div>
          )}

          {uploading.insurance && <p>Uploading...</p>}
          {errors.insurance && <p className="error">{errors.insurance}</p>}
        </div>
      </div>
    </fieldset>
  );
};

export default EditUploadDocuments;
