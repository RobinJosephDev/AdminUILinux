import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import '../../styles/Auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserProvider';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { setUserRole } = useUser();

  const sanitizeInput = (input: string): string => input.replace(/[<>"/=]/g, '');

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          username: sanitizeInput(values.username),
          password: sanitizeInput(values.password),
        },
        {
          headers: { 'Cache-Control': 'no-cache' },
        }
      );

      if (!response.data?.token || !response.data?.user?.role) {
        message.error('Invalid login response');
        return;
      }

      handleLoginSuccess(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          message.error('Too many attempts. Please try again later.');
        } else {
          message.error(error.response?.data?.message || 'Login failed');
        }
      } else {
        message.error('Unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (data: { token: string; user: { id: number; role: string } }) => {
    const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour

    // Store auth data
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id.toString());
    localStorage.setItem('userRole', data.user.role);
    localStorage.setItem('tokenExpiry', expiryTime.toString());

    // Set axios default header
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;

    // Update context FIRST
    setUserRole(data.user.role);

    // Navigate without reload
    navigate('/', { replace: true });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login to Continue</h2>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter your username' }]}>
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="auth-button" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
