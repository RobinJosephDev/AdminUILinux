export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  emp_code: string;
  role: string;
  permissions?: string[];
  created_at: string;
  updated_at: string;
}
