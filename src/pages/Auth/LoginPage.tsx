import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';
import axios from 'axios';
import { useUser } from '../../UserProvider';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const { setUserRole } = useUser();

  const sanitizeInput = (input: string): string => input.replace(/[<>"/=]/g, '');

  interface LoginValues {
    username: string;
    password: string;
  }

  const onFinish = async (values: LoginValues) => {
    setLoading(true);
    try {
      const sanitizedUsername = sanitizeInput(values.username);
      const sanitizedPassword = sanitizeInput(values.password);

      const response = await axios.post(`${API_URL}/login`, {
        username: sanitizedUsername,
        password: sanitizedPassword,
      });

      if (response.data.token) {
        handleLoginSuccess(response.data);
      }
    } catch (error: unknown) {
      console.error('Login error:', error);

      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.message || 'Login failed.');
      } else {
        message.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  interface LoginResponse {
    token: string;
    user: {
      id: number;
      role: string;
    };
  }

  const handleLoginSuccess = (data: LoginResponse) => {
    const expiryTime = Date.now() + 1 * 60 * 60 * 1000;

    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id.toString());
    localStorage.setItem('userRole', data.user.role);
    localStorage.setItem('tokenExpiry', expiryTime.toString());

    setUserRole(data.user.role);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    if (data.user.role === 'admin') {
      navigate('/lead');
    } else {
      message.error('Access denied: Invalid role.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Admin Login</h2>
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
    </div>
  );
};

export default LoginPage;
