import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../../styles/Navbar.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FiHome, FiClipboard, FiUsers, FiLogOut, FiFileText, FiPackage, FiTruck, FiSettings, FiBriefcase } from 'react-icons/fi';
import { useUser } from '../../UserProvider';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CustomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, setUserRole } = useUser();

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

    // Clear stored credentials
    localStorage.clear();
    setUserRole(null);

    Swal.fire({
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      navigate('/login', { replace: true });
      window.location.reload(); // Ensure a full state reset
    });
  };

  useEffect(() => {
    if (!userRole) {
      navigate('/login', { replace: true });
    }
  }, [userRole, navigate]);

  if (!userRole) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Navbar.Brand as={NavLink} to="/">
        Sealink Logistics
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <Nav.Link as={NavLink} to="/">
            <FiHome className="nav-icon" /> Home
          </Nav.Link>

          <NavDropdown title="CRM" id="crm-dropdown" className="custom-dropdown">
            <NavDropdown.Item as={NavLink} to="/lead" className="custom-dropdown-item">
              <FiClipboard className="dropdown-icon" /> Leads
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/follow-up" className="custom-dropdown-item">
              <FiUsers className="dropdown-icon" /> Follow-up
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Quotes" id="quotes-dropdown" className="custom-dropdown">
            <NavDropdown.Item as={NavLink} to="/quote" className="custom-dropdown-item">
              <FiFileText className="dropdown-icon" /> Quotes
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/quotes-lead" className="custom-dropdown-item">
              <FiUsers className="dropdown-icon" /> Leads with Quotes
            </NavDropdown.Item>
          </NavDropdown>

          <Nav.Link as={NavLink} to="/customer">
            <FiUsers className="nav-icon" /> Customers
          </Nav.Link>

          <NavDropdown title="Orders" id="quotes-dropdown" className="custom-dropdown">
            <NavDropdown.Item as={NavLink} to="/order" className="custom-dropdown-item">
              <FiClipboard className="dropdown-icon" /> Orders
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/dispatch" className="custom-dropdown-item">
              <FiTruck className="dropdown-icon" /> Dispatches
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Carriers & Co" id="quotes-dropdown" className="custom-dropdown">
            <NavDropdown.Item as={NavLink} to="/carrier" className="custom-dropdown-item">
              <FiTruck className="dropdown-icon" /> Carriers
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/vendor" className="custom-dropdown-item">
              <FiPackage className="dropdown-icon" /> Vendors
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/broker" className="custom-dropdown-item">
              <FiUsers className="dropdown-icon" /> Brokers
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="More" id="more-dropdown" className="custom-dropdown">
            <NavDropdown.Item as={NavLink} to="/user" className="custom-dropdown-item">
              <FiUsers className="dropdown-icon" /> Users
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/company" className="custom-dropdown-item">
              <FiBriefcase className="dropdown-icon" /> Companies
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout} className="custom-dropdown-item logout">
              <FiLogOut className="dropdown-icon" /> Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
