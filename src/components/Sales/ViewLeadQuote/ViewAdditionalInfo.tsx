import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface FormLead {
  contact_person?: string;
  follow_up_date?: string;
  equipment_type?: string;
  assigned_to?: string;
  notes?: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

interface ViewAdditionalInfoProps {
  formLead: FormLead;
}

function ViewAdditionalInfo({ formLead }: ViewAdditionalInfoProps) {
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter employees
        const employeeList = response.data.filter((user) => user.role === 'employee');
        setEmployees(employeeList);
      } catch (error: any) {
        console.error('Error fetching users:', error);

        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'You are not authorized to view this data. Please log in again.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while fetching users. Please try again.',
          });
        }
      }
    };

    fetchUsers();
  }, [API_URL]);

  return (
    <fieldset className="form-section">
      <legend>Additional Information</legend>
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Contact Person</label>
          <p>{formLead.contact_person || 'N/A'}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Next Follow-Up Date</label>
          <p>{formLead.follow_up_date || 'N/A'}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Equipment Type</label>
          <p>{formLead.equipment_type || 'N/A'}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Assigned To</label>
          <p>{formLead.assigned_to || 'N/A'}</p>
        </div>
      </div>

      <div className="form-group" style={{ flex: 1 }}>
        <label>Notes</label>
        <p>{formLead.notes || 'N/A'}</p>
      </div>
    </fieldset>
  );
}

export default ViewAdditionalInfo;