import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Lead, User } from '../../../types/LeadTypes';

interface EditAdditionalInfoProps {
  formLead: Lead;
  setFormLead: (form: Lead) => void;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const sanitizeInput = (value: string): string => {
  return value.trim().replace(/<\/?[^>]+(>|$)/g, ''); // Remove HTML tags to prevent XSS
};

const EditAdditionalInfo: React.FC<EditAdditionalInfoProps> = ({ formLead, setFormLead }) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const equipmentTypeOptions = ['Van', 'Reefer', 'Flatbed', 'Triaxle', 'Maxi', 'Btrain', 'Roll tite'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get<User[]>(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && Array.isArray(response.data)) {
          const employees = response.data.filter((user) => user.role === 'employee');
          setEmployees(employees);
        } else {
          throw new Error('Invalid response format.');
        }
      } catch (error: any) {
        console.error('Error fetching users:', error);
        Swal.fire({
          icon: 'error',
          title: error.response?.status === 401 ? 'Unauthorized' : 'Error',
          text:
            error.response?.status === 401
              ? 'You are not authorized to view this data. Please log in again.'
              : 'An error occurred while fetching users. Please try again.',
        });
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (field: keyof Lead, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormLead({ ...formLead, [field]: sanitizedValue });
  };

  return (
    <fieldset className="form-section">
      <legend>Additional Information</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="follow_up_date">Next Follow-Up Date</label>
          <input
            type="date"
            id="follow_up_date"
            value={formLead.follow_up_date || ''}
            onChange={(e) => handleChange('follow_up_date', e.target.value)}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="equipmentType">Equipment Type</label>
          <select id="equipmentType" value={formLead.equipment_type || ''} onChange={(e) => handleChange('equipment_type', e.target.value)}>
            <option value="">Select Equipment Type</option>
            {equipmentTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="assignedTo">Assigned To</label>
          <select id="assignedTo" value={formLead.assigned_to || ''} onChange={(e) => handleChange('assigned_to', e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="contactPerson">Contact Person</label>
          <input
            type="text"
            id="contactPerson"
            value={formLead.contact_person || ''}
            onChange={(e) => handleChange('contact_person', e.target.value)}
            pattern="^[a-zA-Z\s]+$" // Only allow letters and spaces
            maxLength={100}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" value={formLead.notes || ''} onChange={(e) => handleChange('notes', e.target.value)} maxLength={500} />
        </div>
      </div>
    </fieldset>
  );
};

export default EditAdditionalInfo;
