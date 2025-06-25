import { FC } from 'react';
import { Company } from '../../../types/CompanyTypes';

interface ViewUploadDocumentsProps {
  formCompany: Company;
}

const ViewUploadDocuments: FC<ViewUploadDocumentsProps> = ({ formCompany }) => {
  const renderDownloadLink = (fileUrl?: string, fileLabel?: string) => {
    if (fileUrl) {
      return (
        <div>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Download {fileLabel}
          </a>
        </div>
      );
    }
    return null;
  };

  return (
    <fieldset className="form-section">
      <legend>Uploaded Documents</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Company Package</label>
          {renderDownloadLink(formCompany.company_package, 'Comapany Package')}
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Insurance</label>
          {renderDownloadLink(formCompany.insurance, 'Insurance')}
        </div>
      </div>
    </fieldset>
  );
};

export default ViewUploadDocuments;
