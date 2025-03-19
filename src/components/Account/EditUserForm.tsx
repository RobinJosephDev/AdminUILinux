import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { User } from './UserTypes'; // Import User interface

interface EditUserFormProps {
  onClose: () => void;
  onUpdate: (user: User) => void;
  selectedUser: User | null;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ onClose, onUpdate, selectedUser }) => {
  const [formUser, setFormUser] = useState<User>({
    id: 0,
    name: '',
    username: '',
    email: '',
    password: '',
    role: '',
    emp_code: '',
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  useEffect(() => {
    if (selectedUser) {
      console.log('Selected User:', selectedUser);
      setFormUser({
        id: selectedUser.id,
        name: selectedUser.name || '',
        username: selectedUser.username || '',
        email: selectedUser.email || '',
        password: '',
        role: selectedUser.role || '',
        emp_code: selectedUser.emp_code || '',
      });
    }
  }, [selectedUser]);

  const updateUser = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'You are not logged in. Please log in again.' });
        return;
      }

      const response = await axios.put(`${API_URL}/users/${formUser.id}`, formUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({ icon: 'success', title: 'Updated!', text: 'User data has been updated successfully.' });
      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response && error.response.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update user.',
      });
    }
  };

  const roleOptions: string[] = ['admin', 'employee', 'carrier'];

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateUser();
        }}
        className="form-main"
      >
        <fieldset className="form-section">
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="name">Name*</label>
              <input value={formUser.name} onChange={(e) => setFormUser({ ...formUser, name: e.target.value })} type="text" required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="username">Username*</label>
              <input value={formUser.username} onChange={(e) => setFormUser({ ...formUser, username: e.target.value })} type="text" required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="email">Email*</label>
              <input value={formUser.email} onChange={(e) => setFormUser({ ...formUser, email: e.target.value })} type="email" required />
            </div>
          </div>
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="password">Password*</label>
              <input value={formUser.password} onChange={(e) => setFormUser({ ...formUser, password: e.target.value })} type="password" required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="role">User Role*</label>
              <select value={formUser.role} onChange={(e) => setFormUser({ ...formUser, role: e.target.value })}>
                <option value="">Select User Role</option>
                {roleOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="emp_code">Employee Code*</label>
              <input value={formUser.emp_code} onChange={(e) => setFormUser({ ...formUser, emp_code: e.target.value })} type="text" required />
            </div>
          </div>
        </fieldset>
        <div className="form-actions">
          <button type="submit" className="btn-submit">Save</button>
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
