import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Company, Bank, Cargo, Liability } from '../../types/CompanyTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const useAddCompany = (onClose: () => void, onSuccess: () => void) => {
  const defaultCompany: Company = {
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
  };
  const [company, setCompany] = useState<Company>(defaultCompany);

  const validateCompany = (): boolean => {
    return !!company.name;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateCompany()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'No token found', 'error');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const formData = new FormData();

      Object.keys(company).forEach((key) => {
        const value = company[key as keyof Company];

        if (key === 'obsolete') {
          formData.append(key, value ? '1' : '0');
        } else if (key !== 'company_package' && key !== 'insurance') {
          formData.append(key, String(value || ''));
        }
      });

      if (company.company_package && company.company_package instanceof File) {
        formData.append('company_package', company.company_package);
      }

      if (company.insurance && company.insurance instanceof File) {
        formData.append('insurance', company.insurance);
      }

      const response = company.id
        ? await axios.put(`${API_URL}/company/${company.id}`, company, { headers })
        : await axios.post(`${API_URL}/company`, company, { headers });

      Swal.fire(company.id ? 'Success!' : 'Saved!', 'Company added successfully.', 'success');
      clearCompanyForm();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving/updating company:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while processing the company.', 'error');
    }
  };

  const clearCompanyForm = (): void => {
    setCompany({
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
  };

  const handleAddBank = () => {
    setCompany((prev) => ({
      ...prev,
      bank_info: [...prev.bank_info, { name: '', phone: '', email: '', address: '', us_account_no: '', cdn_account_no: '' }],
    }));
  };

  const handleRemoveBank = (index: number) => {
    setCompany((prev) => ({
      ...prev,
      bank_info: prev.bank_info.filter((_, i) => i !== index),
    }));
  };

  const handleBankChange = (index: number, updatedBank: Bank) => {
    const updatedBanks = company.bank_info.map((banking_info, i) => (i === index ? updatedBank : banking_info));
    setCompany((prevCompany) => ({
      ...prevCompany,
      bank_info: updatedBanks,
    }));
  };

  const handleAddCargo = () => {
    setCompany((prev) => ({ ...prev, cargo_insurance: [...prev.cargo_insurance, { company: '', policy_start: '', policy_end: '', amount: '' }] }));
  };

  const handleRemoveCargo = (index: number) => {
    setCompany((prev) => ({
      ...prev,
      cargo_insurance: prev.cargo_insurance.filter((_, i) => i !== index),
    }));
  };

  const handleCargoChange = (index: number, updatedCargo: Cargo) => {
    const updatedCargos = company.cargo_insurance.map((cargo_ins, i) => (i === index ? updatedCargo : cargo_ins));
    setCompany((prevCompany) => ({
      ...prevCompany,
      cargo_insurance: updatedCargos,
    }));
  };

  const handleAddLiability = () => {
    setCompany((prev) => ({
      ...prev,
      liablility_insurance: [...prev.liablility_insurance, { company: '', policy_start: '', policy_end: '', amount: '' }],
    }));
  };

  const handleRemoveLiability = (index: number) => {
    setCompany((prev) => ({
      ...prev,
      liablility_insurance: prev.liablility_insurance.filter((_, i) => i !== index),
    }));
  };

  const handleLiabilityChange = (index: number, updatedLiability: Liability) => {
    const updatedLiabilities = company.liablility_insurance.map((liab_ins, i) => (i === index ? updatedLiability : liab_ins));
    setCompany((prevCompany) => ({
      ...prevCompany,
      liablility_insurance: updatedLiabilities,
    }));
  };

  return {
    company,
    setCompany,
    handleSubmit,
    handleAddBank,
    handleRemoveBank,
    handleBankChange,
    handleAddCargo,
    handleRemoveCargo,
    handleCargoChange,
    handleAddLiability,
    handleRemoveLiability,
    handleLiabilityChange,
    clearCompanyForm
  };
};
