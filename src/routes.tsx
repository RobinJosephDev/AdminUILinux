import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PrivateRoute from './components/common/PrivateRoute';
import UserProvider from './UserProvider';

const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const Logout = lazy(() => import('./pages/Auth/Logout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LeadsPage = lazy(() => import('./pages/CRM/LeadsPage'));
const AddLeadForm = lazy(() => import('./components/CRM/AddLead/AddLeadForm'));
const EditLeadForm = lazy(() => import('./components/CRM/EditLead/EditLeadForm'));
const LeadFollowupPage = lazy(() => import('./pages/CRM/LeadFollowupPage'));
const LeadQuotesPage = lazy(() => import('./pages/Sales/LeadQuotesPage'));
const CustomersPage = lazy(() => import('./pages/Customers/CustomersPage'));
const EditCustomerForm = lazy(() => import('./components/Customers/EditCustomer/EditCustomerForm'));
const OrderPage = lazy(() => import('./pages/Orders/OrderPage'));
const AddOrderForm = lazy(() => import('./components/Orders/AddOrder/AddOrderForm'));
const EditOrderForm = lazy(() => import('./components/Orders/EditOrder/EditOrderForm'));
const CarrierPage = lazy(() => import('./pages/Carriers&Co/CarrierPage'));
const AddCarrierForm = lazy(() => import('./components/Carriers&Co/AddCarrier/AddCarrierForm'));
const EditCarrierForm = lazy(() => import('./components/Carriers&Co/EditCarrier/EditCarrierForm'));
const VendorPage = lazy(() => import('./pages/Carriers&Co/VendorPage'));
const AddVendorForm = lazy(() => import('./components/Carriers&Co/AddVendor/AddVendorForm'));
const EditVendorForm = lazy(() => import('./components/Carriers&Co/EditVendor/EditVendorForm'));
const BrokerPage = lazy(() => import('./pages/Carriers&Co/BrokerPage'));
const AddBrokerForm = lazy(() => import('./components/Carriers&Co/AddBroker/AddBrokerForm'));
const EditBrokerForm = lazy(() => import('./components/Carriers&Co/EditBroker/EditBrokerForm'));
const UserPage = lazy(() => import('./pages/Account/UserPage'));
const EditUserFormWrapper = lazy(() => import('./components/Account/EditUserFormWrapper'));
const QuotePage = lazy(() => import('./pages/Sales/QuotePage'));
const EditQuoteForm = lazy(() => import('./components/Sales/EditQuote/EditQuoteForm'));

const AppRoutes: React.FC = () => (
  <UserProvider>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/lead"
          element={
            <PrivateRoute>
              <LeadsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/lead/add-lead"
          element={
            <PrivateRoute>
              <AddLeadForm onClose={() => {}} onAddLead={() => {}} />
            </PrivateRoute>
          }
        />
        <Route
          path="/lead/:id"
          element={
            <PrivateRoute>
              <EditLeadForm lead={() => {}} onClose={() => {}} onUpdate={() => {}} />
            </PrivateRoute>
          }
        />
        <Route
          path="/follow-up"
          element={
            <PrivateRoute>
              <LeadFollowupPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/quotes-lead"
          element={
            <PrivateRoute>
              <LeadQuotesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer"
          element={
            <PrivateRoute>
              <CustomersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/:id"
          element={
            <PrivateRoute>
              <EditCustomerForm customer={() => {}} onClose={() => {}} onUpdate={() => {}} />
            </PrivateRoute>
          }
        />
        <Route
          path="/order"
          element={
            <PrivateRoute>
              <OrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/order/add-order"
          element={
            <PrivateRoute>
              <AddOrderForm onClose={() => {}} onAddOrder={() => {}} />
            </PrivateRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <PrivateRoute>
              <EditOrderForm order={() => {}} onClose={() => {}} onUpdate={() => {}} />
            </PrivateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <PrivateRoute>
              <EditUserFormWrapper />
            </PrivateRoute>
          }
        />
        <Route
          path="/carrier"
          element={
            <PrivateRoute>
              <CarrierPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/carrier/add-carrier"
          element={
            <PrivateRoute>
              <AddCarrierForm onClose={() => {}} onAddCarrier={() => {}} />
            </PrivateRoute>
          }
        />
        <Route
          path="/carrier/:id"
          element={
            <PrivateRoute>
              <EditCarrierForm carrier={() => {}} onClose={() => {}} onUpdate={() => {}} />
            </PrivateRoute>
          }
        />
        <Route
          path="/vendor"
          element={
            <PrivateRoute>
              <VendorPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/vendor/add-vendor"
          element={
            <PrivateRoute>
              <AddVendorForm onClose={() => {}} onAddVendor={() => {}} />
            </PrivateRoute>
          }
        />
        <Route
          path="/vendor/:id"
          element={
            <PrivateRoute>
              <EditVendorForm vendor={() => {}} onClose={() => {}} onUpdate={() => {}} />
            </PrivateRoute>
          }
        />
        <Route
          path="/broker"
          element={
            <PrivateRoute>
              <BrokerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/broker/add-broker"
          element={
            <PrivateRoute>
              <AddBrokerForm onClose={() => {}} onAddBroker={() => {}} />
            </PrivateRoute>
          }
        />
        <Route
          path="/broker/:id"
          element={
            <PrivateRoute>
              <EditBrokerForm broker={() => {}} onClose={() => {}} onUpdate={() => {}} />
            </PrivateRoute>
          }
        />
        <Route
          path="/shipment"
          element={
            <PrivateRoute>
              <QuotePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/quote/:id"
          element={
            <PrivateRoute>
              <EditQuoteForm quote={() => {}} onClose={() => {}} onUpdate={() => {}} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  </UserProvider>
);

export default AppRoutes;
