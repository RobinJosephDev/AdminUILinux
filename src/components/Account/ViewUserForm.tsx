import { useState, useEffect } from 'react';
import { User } from './UserTypes';

interface ViewUserFormProps {
  onClose: () => void;
  user: User | null;
}

const ViewUserForm: React.FC<ViewUserFormProps> = ({ onClose, user }) => {
  const [formUser, setFormUser] = useState<User>({
    id: 0,
    name: '',
    username: '',
    email: '',
    password: '',
    role: '',
    emp_code: '',
  });

  // Update form when user changes
  useEffect(() => {
    if (user) { 
      console.log('Selected User:', user);

      setFormUser({
        id: user.id,
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        password: '',
        role: user.role || '',
        emp_code: user.emp_code || '',
      });
    }
  }, [user]);

  return (
    <div className="form-container">
      <form className="form-main">
        <fieldset className="form-section">
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="name">Name</label>
              <div>{formUser.name}</div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="username">Username</label>
              <div>{formUser.username}</div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="email">Email</label>
              <div>{formUser.email}</div>
            </div>
          </div>
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="role">User Role</label>
              <div>{formUser.role}</div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="emp_code">Employee Code</label>
              <div>{formUser.emp_code}</div>
            </div>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewUserForm;
