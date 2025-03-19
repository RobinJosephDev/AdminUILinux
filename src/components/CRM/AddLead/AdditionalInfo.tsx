import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { z } from 'zod';
import { Lead, User } from "../../../types/LeadTypes";


interface AdditionalInfoProps {
  lead: Lead;
  setLead: (lead: Lead) => void;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ lead, setLead }) => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
  
  const [employees, setEmployees] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get<User[]>(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const employees = response.data.filter((user) => user.role === 'employee');
        setEmployees(employees);
      } catch (error: any) {
        console.error('Error fetching users:', error);

        Swal.fire({
          icon: 'error',
          title: error.response?.status === 401 ? 'Unauthorized' : 'Error',
          text: error.response?.status === 401
            ? 'You are not authorized to view this data. Please log in again.'
            : 'An error occurred while fetching users. Please try again.',
        });
      }
    };

    fetchUsers();
  }, [API_URL]);

  const equipmentTypeOptions: string[] = ['Van', 'Reefer', 'Flatbed', 'Triaxle', 'Maxi', 'Btrain', 'Roll tite'];
 
  const leadSchema = z.object({
    follow_up_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    equipment_type: z.string().refine((type) => equipmentTypeOptions.includes(type), {
      message: 'Invalid equipment type',
    }),
    assigned_to: z.string().min(1, 'Assigned to is required'),
    contact_person: z.string().min(1, 'Contact person is required').max(50, 'Contact person is too long'),
    notes: z.string().max(200, 'Notes cannot exceed 200 characters'),
  });

  const sanitizeInput = (input: string) => input.trim().replace(/<[^>]*>?/gm, '');

  const handleChange = (field: keyof Lead, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    const updatedLead = { ...lead, [field]: sanitizedValue };
    
    const validation = leadSchema.safeParse(updatedLead);
    if (!validation.success) {
      console.error(validation.error.format());
      return;
    }

    setLead(updatedLead);
  };

  return (
    <fieldset className="form-section">
      <legend>Additional Information</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="follow_up_date">Next Follow-Up Date</label>
          <input type="date" value={lead.follow_up_date} onChange={(e) => handleChange('follow_up_date', e.target.value)} id="follow_up_date" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="equipmentType">Equipment Type</label>
          <select id="equipmentType" value={lead.equipment_type} onChange={(e) => handleChange('equipment_type', e.target.value)}>
            <option value="">Select Equipment Type</option>
            {equipmentTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="assignedTo">Assigned To</label>
          <select id="assignedTo" value={lead.assigned_to} onChange={(e) => handleChange('assigned_to', e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map((user) => (
              <option key={user.name} value={user.name}>{user.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="contactPerson">Contact Person</label>
          <input type="text" value={lead.contact_person} onChange={(e) => handleChange('contact_person', e.target.value)} id="contactPerson" placeholder="Contact Person" />
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="notes">Notes</label>
          <textarea value={lead.notes} onChange={(e) => handleChange('notes', e.target.value)} id="notes" placeholder="Notes" />
        </div>
      </div>
    </fieldset>
  );
};

export default AdditionalInfo;
