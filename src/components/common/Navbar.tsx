import React, { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../../styles/Navbar.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FiClipboard, FiUsers, FiLogOut, FiFileText, FiPackage, FiTruck, FiLock } from 'react-icons/fi';
import { useUser } from '../../UserProvider';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CustomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, userPermissions, setUserRole } = useUser();

  const handleLogout = async (): Promise<void> => {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (error) {
      console.error('Logout failed', error);
    }

    localStorage.clear();
    setUserRole(null);

    Swal.fire({
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      navigate('/login', { replace: true });
      window.location.reload();
    });
  };

  useEffect(() => {
    if (!userRole) {
      navigate('/login', { replace: true });
    }
  }, [userRole, navigate]);

  if (!userRole) return null;

  // Helper function for permission checks
  const canAccess = (permission: string) => userRole === 'Admin' || (userRole === 'Employee' && userPermissions?.includes(permission));
  console.log('User Role:', userRole);
  console.log('User Permissions:', userPermissions);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Navbar.Brand as={NavLink} to="/">
        Sealink Logistics
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          {/* CRM Dropdown */}
          {(canAccess('Leads') || canAccess('Followup')) && (
            <NavDropdown title="CRM" id="crm-dropdown" className="custom-dropdown">
              {canAccess('Leads') && (
                <NavDropdown.Item as={NavLink} to="/lead" className="custom-dropdown-item">
                  <FiClipboard className="dropdown-icon" /> Leads
                </NavDropdown.Item>
              )}
              {canAccess('Followup') && (
                <NavDropdown.Item as={NavLink} to="/follow-up" className="custom-dropdown-item">
                  <FiUsers className="dropdown-icon" /> Follow-up
                </NavDropdown.Item>
              )}
            </NavDropdown>
          )}

          {/* Quotes Dropdown */}
          {(canAccess('Quotes') || canAccess('Leads_Quotes')) && (
            <NavDropdown title="Quotes" id="quotes-dropdown" className="custom-dropdown">
              {canAccess('Quotes') && (
                <NavDropdown.Item as={NavLink} to="/quote" className="custom-dropdown-item">
                  <FiFileText className="dropdown-icon" /> Quotes
                </NavDropdown.Item>
              )}
              {canAccess('Leads_Quotes') && (
                <NavDropdown.Item as={NavLink} to="/quotes-lead" className="custom-dropdown-item">
                  <FiUsers className="dropdown-icon" /> Leads with Quotes
                </NavDropdown.Item>
              )}
            </NavDropdown>
          )}

          {/* Single Nav Links with permission checks */}
          {canAccess('Customers') && (
            <Nav.Link as={NavLink} to="/customer">
              <FiUsers className="nav-icon" /> Customers
            </Nav.Link>
          )}
          {canAccess('Orders') && (
            <Nav.Link as={NavLink} to="/order">
              <FiPackage className="nav-icon" /> Orders
            </Nav.Link>
          )}
          {canAccess('Carriers') && (
            <Nav.Link as={NavLink} to="/carrier">
              <FiTruck className="nav-icon" /> Carriers
            </Nav.Link>
          )}
          {canAccess('Vendors') && (
            <Nav.Link as={NavLink} to="/vendor">
              <FiPackage className="nav-icon" /> Vendors
            </Nav.Link>
          )}
          {canAccess('Brokers') && (
            <Nav.Link as={NavLink} to="/broker">
              <FiUsers className="nav-icon" /> Brokers
            </Nav.Link>
          )}

          {/* More Dropdown */}
          {(userRole === 'Admin' || userRole === 'Employee') && (
            <NavDropdown title="More" id="more-dropdown" className="custom-dropdown">
              {/* Users menu: only Admin */}
              {userRole === 'Admin' && (
                <NavDropdown.Item as={NavLink} to="/user" className="custom-dropdown-item">
                  <FiUsers className="dropdown-icon" /> Users
                </NavDropdown.Item>
              )}

              {/* Access Control: Admin + Employee (or customize if needed) */}
              {(userRole === 'Admin' || userRole === 'Employee') && (
                <NavDropdown.Item as={NavLink} to="/access" className="custom-dropdown-item">
                  <FiLock className="dropdown-icon" /> Access Control
                </NavDropdown.Item>
              )}

              <NavDropdown.Divider />

              <NavDropdown.Item onClick={handleLogout} className="custom-dropdown-item logout">
                <FiLogOut className="dropdown-icon" /> Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
