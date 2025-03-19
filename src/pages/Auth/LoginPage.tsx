import { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Auth.css';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state for login
  const [mfaRequired, setMfaRequired] = useState(false); // Toggle MFA modal
  const [mfaCode, setMfaCode] = useState(''); // Store entered MFA code
  const [mfaToken, setMfaToken] = useState(''); // Temporary token for MFA process
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch CSRF token before making login request
  useEffect(() => {
    const getCsrfCookie = async () => {
      try {
        await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true });
      } catch (error) {
        console.error('CSRF cookie error:', error);
      }
    };
    getCsrfCookie();
  }, []);

  const sanitizeInput = (input) => input.replace(/[<>"/=]/g, '');

  // Handle MFA code input (ensure only digits are entered)
  const handleMfaCodeInput = (value) => {
    // Ensure only digits are entered
    if (!/^\d*$/.test(value)) {
      message.error("Only numeric values are allowed for MFA code.");
      return;
    }
    setMfaCode(value); // Update MFA code state
  };

  // Handle primary login form submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Sanitize inputs before sending to the backend
      const sanitizedUsername = sanitizeInput(values.username);
      const sanitizedPassword = sanitizeInput(values.password);

      const response = await axios.post(`${API_URL}/login`, {
        username: sanitizedUsername,
        password: sanitizedPassword,
      });

      // MFA handling logic here
      if (response.data.mfa_required) {
        setMfaRequired(true);
        setMfaToken(response.data.mfa_token);
        message.info('MFA required, please check your authenticator app.');
      } else if (response.data.token) {
        handleLoginSuccess(response.data);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 419) {
        message.error('Session expired. Please log in again.');
      } else {
        message.error(error.response?.data?.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle MFA code submission
  const onMfaSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}/verify-mfa`, {
        mfa_code: mfaCode,
        mfa_token: mfaToken, // Pass temporary MFA token
      });

      if (response.data.token) {
        setMfaRequired(false); // Close MFA modal
        handleLoginSuccess(response.data); // Process successful login
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      message.error(error.response?.data?.message || 'Invalid MFA code. Please try again.');
    }
  };

  // Handle successful login (save token and navigate)
  const handleLoginSuccess = (data) => {
    localStorage.setItem('token', data.token); // Save token to localStorage
    localStorage.setItem('userId', data.user.id); // Save user ID
    localStorage.setItem('userRole', data.user.role); // Save user role

    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`; // Set header for future requests

    // Navigate based on user role
    if (data.user.role === 'admin') {
      navigate('/');
    } else {
      message.error('Access denied: Invalid role.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Title level={3} className="auth-title">
          Admin Login
        </Title>
        <Form onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="auth-button" loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* MFA Modal */}
      <Modal
        title="Multi-Factor Authentication"
        visible={mfaRequired}
        onOk={onMfaSubmit}
        onCancel={() => setMfaRequired(false)}
        okText="Verify MFA"
        cancelText="Cancel"
      >
        <p>Please enter the MFA code from your authenticator app:</p>
        <Form>
          <Form.Item>
            <Input
              type="text"
              value={mfaCode}
              onChange={(e) => handleMfaCodeInput(e.target.value)} // Use the handleMfaCodeInput function
              placeholder="Enter 6-digit MFA code"
              maxLength={6}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoginPage;
