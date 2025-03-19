import React from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import '../../styles/Form.css';
import { useState } from 'react';
import { User } from './UserTypes';

interface AddUserFormProps {
  onClose: () => void;
  onAddUser: (user: User) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose, onAddUser }) => {
  const [user, setUser] = useState<User>({
    id: 0,
    name: '',
    username: '',
    email: '',
    password: '',
    role: '',
    emp_code: '',
  });
  
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const roleOptions: string[] = ['admin', 'employee', 'carrier', 'customer'];
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateUser()) {
      try {
        let response;
        const token = localStorage.getItem('token');

        if (!token) {
          Swal.fire('Error', 'No token found', 'error');
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const userPayload = {
          ...user,
          password_confirmation: confirmPassword,
        };

        if (user.id) {
          response = await axios.put(`${API_URL}/users/${user.id}`, userPayload, { headers });
          Swal.fire('Updated!', 'User data has been updated successfully.', 'success');
        } else {
          response = await axios.post(`${API_URL}/register`, userPayload, { headers });
          Swal.fire('Saved!', 'User data has been saved successfully.', 'success');
        }

        onAddUser(response.data);
        clearUserForm();
        onClose();
      } catch (error: any) {
        console.error('Error saving/updating user:', error.response ? error.response.data : error.message);
        Swal.fire('Error', 'An error occurred while saving/updating the user.', 'error');
      }
    }
  };

  const validateUser = (): boolean => {
    const { name, username, email, password, role, emp_code } = user;
    if (!name || !username || !email || !password || !role || !emp_code || password !== confirmPassword) {
      if (password !== confirmPassword) {
        Swal.fire('Validation Error', 'Passwords do not match.', 'error');
      } else {
        Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      }
      return false;
    }
    return true;
  };

  const clearUserForm = () => {
    setUser({
      id: 0,
      name: '',
      username: '',
      email: '',
      password: '',
      role: '',
      emp_code: '',
    });
    setConfirmPassword('');
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-main">
        <fieldset className="form-section">
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="name">Name*</label>
              <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} type="text" required placeholder="Name" />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="username">Username*</label>
              <input value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} type="text" required placeholder="Username" />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="email">Email*</label>
              <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} id="email" type="email" required placeholder="Email" />
            </div>
          </div>
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="password">Password*</label>
              <input value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} type="password" required placeholder="Password" />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="confirmPassword">Confirm Password*</label>
              <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} id="confirmPassword" type="password" required placeholder="Confirm Password" />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="role">User Role*</label>
              <select id="role" value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
                <option value="">Select User Role</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="emp_code">Employee Code*</label>
              <input value={user.emp_code} onChange={(e) => setUser({ ...user, emp_code: e.target.value })} type="text" required placeholder="Employee Code" />
            </div>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Add User
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
