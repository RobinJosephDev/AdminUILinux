import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Company, Bank, Cargo, Liability } from '../../types/CompanyTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const useEditCompany = (company: Company | null, onClose: () => void, onUpdate: (company: Company) => void) => {
  const [formCompany, setFormCompany] = useState<Company>({
    id: 0,
    name: '',
    invoice_terms: '',
    rate_conf_terms: '',
    quote_terms: '',
    invoice_reminder: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal: '',
    email: '',
    phone: '',
    cell: '',
    fax: '',
    invoice_prefix: '',
    SCAC: '',
    docket_no: '',
    carrier_code: '',
    gst_hst_no: '',
    qst_no: '',
    ca_bond_no: '',
    website: '',
    obsolete: false,
    us_tax_id: '',
    payroll_no: '',
    wcb_no: '',
    dispatch_email: '',
    ap_email: '',
    ar_email: '',
    cust_comm_email: '',
    quot_email: '',
    bank_info: [],
    cargo_insurance: [],
    liablility_insurance: [],
    company_package: '',
    insurance: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (company) {
      const parsedBanks = Array.isArray(company.bank_info) ? company.bank_info : JSON.parse(company.bank_info || '[]');
      const parsedCargos = Array.isArray(company.cargo_insurance) ? company.cargo_insurance : JSON.parse(company.cargo_insurance || '[]');
      const parsedLiabilities = Array.isArray(company.liablility_insurance)
        ? company.liablility_insurance
        : JSON.parse(company.liablility_insurance || '[]');

      const updatedCompany = {
        ...company,
        bank_info: parsedBanks.length > 0 ? parsedBanks : [],
        cargo_insurance: parsedCargos.length > 0 ? parsedCargos : [],
        liablility_insurance: parsedLiabilities.length > 0 ? parsedLiabilities : [],
      };

      setFormCompany(updatedCompany);
    }
  }, [company]);

  const validateCompany = (): boolean => {
    return !!formCompany.name;
  };

  const updateCompany = async () => {
    if (!validateCompany()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You are not logged in. Please log in again.',
        });
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const formData = new FormData();

      Object.keys(formCompany).forEach((key) => {
        const value = formCompany[key as keyof Company];

        if (key === 'obsolete') {
          formData.append(key, value ? '1' : '0');
        } else if (key !== 'company_package' && key !== 'insurance') {
          formData.append(key, String(value || ''));
        }
      });

      if (formCompany.company_package && formCompany.company_package instanceof File) {
        formData.append('company_package', formCompany.company_package);
      }

      if (formCompany.insurance && formCompany.insurance instanceof File) {
        formData.append('insurance', formCompany.insurance);
      }

      const response = formCompany.id
        ? await axios.put(`${API_URL}/company/${formCompany.id}`, formCompany, { headers })
        : await axios.post(`${API_URL}/company`, formCompany, { headers });

      Swal.fire(formCompany.id ? 'Success!' : 'Saved!', 'Company updated successfully.', 'success');
      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      console.error('Error saving/updating company:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while processing the company.', 'error');
    }
  };

  const handleAddBank = () => {
    setFormCompany((prevCompany) =>
      prevCompany
        ? {
            ...prevCompany,
            bank_info: [...prevCompany.bank_info, { name: '', phone: '', email: '', address: '', us_account_no: '', cdn_account_no: '' }],
          }
        : prevCompany
    );
  };

  const handleRemoveBank = (index: number) => {
    setFormCompany((prevCompany) => (prevCompany ? { ...prevCompany, bank_info: prevCompany.bank_info.filter((_, i) => i !== index) } : prevCompany));
  };

  const handleBankChange = (index: number, updatedBank: Bank) => {
    setFormCompany((prevCompany) =>
      prevCompany
        ? { ...prevCompany, bank_info: prevCompany.bank_info.map((banking_info, i) => (i === index ? updatedBank : banking_info)) }
        : prevCompany
    );
  };

  const handleAddCargo = () => {
    setFormCompany((prev) => ({
      ...prev,
      cargo_insurance: [...prev.cargo_insurance, { company: '', policy_start: '', policy_end: '', amount: '' }],
    }));
  };

  const handleRemoveCargo = (index: number) => {
    setFormCompany((prev) => ({
      ...prev,
      cargo_insurance: prev.cargo_insurance.filter((_, i) => i !== index),
    }));
  };

  const handleCargoChange = (index: number, updatedCargo: Cargo) => {
    const updatedCargos = formCompany.cargo_insurance.map((cargo_ins, i) => (i === index ? updatedCargo : cargo_ins));
    setFormCompany((prevCompany) => ({
      ...prevCompany,
      cargo_insurance: updatedCargos,
    }));
  };

  const handleAddLiability = () => {
    setFormCompany((prev) => ({
      ...prev,
      liablility_insurance: [...prev.liablility_insurance, { company: '', policy_start: '', policy_end: '', amount: '' }],
    }));
  };

  const handleRemoveLiability = (index: number) => {
    setFormCompany((prev) => ({
      ...prev,
      liablility_insurance: prev.liablility_insurance.filter((_, i) => i !== index),
    }));
  };

  const handleLiabilityChange = (index: number, updatedLiability: Liability) => {
    const updatedLiabilities = formCompany.liablility_insurance.map((liablility_ins, i) => (i === index ? updatedLiability : liablility_ins));
    setFormCompany((prevCompany) => ({
      ...prevCompany,
      liablility_insurance: updatedLiabilities,
    }));
  };

  return {
    formCompany,
    setFormCompany,
    updateCompany,
    handleAddBank,
    handleRemoveBank,
    handleBankChange,
    handleAddCargo,
    handleRemoveCargo,
    handleCargoChange,
    handleAddLiability,
    handleRemoveLiability,
    handleLiabilityChange,
  };
};
export default useEditCompany;
