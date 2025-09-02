import { FiHome, FiClipboard, FiUsers, FiFileText, FiPackage, FiTruck, FiBriefcase } from 'react-icons/fi';

export interface MenuItem {
  label: string;
  path?: string;
  icon: JSX.Element;
  children?: MenuItem[];
  roles: Role[];
}
export type Role = 'admin' | 'employee' | 'carrier' | 'customer';

export const menuConfig: MenuItem[] = [
  {
    label: 'Home',
    path: '/',
    icon: <FiHome />,
    roles: ['admin', 'employee', 'carrier', 'customer'], // lowercase
  },
  {
    label: 'CRM',
    icon: <FiClipboard />,
    roles: ['admin', 'employee'],
    children: [
      { label: 'Leads', path: '/lead-admin', icon: <FiClipboard />, roles: ['admin'] },
      { label: 'Leads', path: '/lead-employee', icon: <FiClipboard />, roles: ['employee'] },
      { label: 'Follow-up', path: '/follow-up', icon: <FiUsers />, roles: ['employee'] },
    ],
  },
  {
    label: 'Quotes',
    icon: <FiFileText />,
    roles: ['admin', 'carrier'],
    children: [
      { label: 'Shipments with Quotes', path: '/shipment-quote', icon: <FiUsers />, roles: ['admin', 'carrier'] },

      { label: 'Leads with Quotes', path: '/quotes-lead', icon: <FiUsers />, roles: ['admin'] },
    ],
  },
  {
    label: 'Customers',
    path: '/customer',
    icon: <FiUsers />,
    roles: ['admin'],
  },
  {
    label: 'Orders',
    icon: <FiClipboard />,
    roles: ['admin'],
    children: [
      { label: 'Orders', path: '/order', icon: <FiClipboard />, roles: ['admin'] },
      { label: 'Dispatches', path: '/dispatch', icon: <FiTruck />, roles: ['admin'] },
    ],
  },
  {
    label: 'Carriers & Co',
    icon: <FiTruck />,
    roles: ['admin'],
    children: [
      { label: 'Carriers', path: '/carrier', icon: <FiTruck />, roles: ['admin'] },
      { label: 'Vendors', path: '/vendor', icon: <FiPackage />, roles: ['admin'] },
      { label: 'Brokers', path: '/broker', icon: <FiUsers />, roles: ['admin'] },
    ],
  },
  {
    label: 'More',
    icon: <FiBriefcase />,
    roles: ['admin'],
    children: [
      { label: 'Users', path: '/user', icon: <FiUsers />, roles: ['admin'] },
      { label: 'Companies', path: '/company', icon: <FiBriefcase />, roles: ['admin'] },
    ],
  },

];
