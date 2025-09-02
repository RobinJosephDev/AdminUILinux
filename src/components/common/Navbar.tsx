import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FiLogOut } from 'react-icons/fi';
import { useUser } from '../../UserProvider';
import { menuConfig } from '../../config/menuConfig';
import '../../styles/Navbar.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const HoverDropdown: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [show, setShow] = useState(false);

  return (
    <NavDropdown title={title} show={show} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} id={`dropdown-${title}`}>
      {children}
    </NavDropdown>
  );
};

const CustomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, setUserRole } = useUser();

  const handleLogout = async (): Promise<void> => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
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
    if (!userRole) navigate('/login', { replace: true });
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
          {menuConfig
            .filter((item) => item.roles.includes(userRole))
            .map((item) =>
              item.children ? (
                <HoverDropdown key={item.label} title={item.label}>
                  {item.children
                    .filter((child) => child.roles.includes(userRole))
                    .map((child) => (
                      <NavDropdown.Item as={NavLink} to={child.path!} key={child.label}>
                        {child.icon} {child.label}
                      </NavDropdown.Item>
                    ))}
                </HoverDropdown>
              ) : (
                <Nav.Link as={NavLink} to={item.path!} key={item.label}>
                  {item.icon} {item.label}
                </Nav.Link>
              )
            )}

          <Nav.Link onClick={handleLogout} id="logout">
            <FiLogOut /> Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
