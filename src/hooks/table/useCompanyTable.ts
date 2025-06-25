import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Company } from '../../types/CompanyTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

const useCompanyTable = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Company>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailData, setEmailData] = useState<{ subject: string; content: string }>({
    subject: '',
    content: '',
  });

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      setLoading(true);
      const { data } = await axios.get<Company[]>(`${API_URL}/company`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleFetchError = (error: any) => {
    if (error.response?.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You need to log in to access this resource.',
      });
    }
  };

  const filteredCompanies = companies.filter((company) =>
    Object.values(company).some((val) => val && val.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedCompanies = filteredCompanies.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDesc ? valB - valA : valA - valB;
    }

    return 0;
  });
  const paginatedData = sortedCompanies.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalPages = Math.ceil(filteredCompanies.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key as keyof Company);
      setSortDesc(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedCompanies.length === paginatedData.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(paginatedData.map((company) => company.id!).filter((id): id is number => id !== undefined));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedCompanies((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const updateCompany = (updatedCompany: Company) => {
    setCompanies((prevCompanies) => prevCompanies.map((company) => (company.id === updatedCompany.id ? { ...company, ...updatedCompany } : company)));
  };

  const deleteSelected = async () => {
    if (!selectedCompanies.length) {
      Swal.fire({ icon: 'warning', title: 'No record selected', text: 'Please select a record to delete.' });
      return;
    }

    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete selected!',
      cancelButtonText: 'No, cancel!',
    });

    if (confirmed.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        await Promise.all(selectedCompanies.map((id) => axios.delete(`${API_URL}/company/${id}`, { headers: { Authorization: `Bearer ${token}` } })));

        setCompanies((prev) => prev.filter((company) => !selectedCompanies.includes(company.id)));
        setSelectedCompanies([]);
        Swal.fire('The selected companies have been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting companies:', error);
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to delete selected companies.' });
      }
    }
  };

  const openEditModal = (company: Company) => {
    setSelectedCompany(company);
    setEditModalOpen(true);
  };

  const openViewModal = (company: Company) => {
    setSelectedCompany(company);
    setViewModalOpen(true);
  };

  const sendEmails = async () => {
    if (selectedCompanies.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No companies selected', text: 'Please select companies to send emails to.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.post(
        `${API_URL}/email`,
        { ids: selectedCompanies, ...emailData, module: 'carriers' },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      Swal.fire('Success!', 'Emails have been sent.', 'success');
      setEmailModalOpen(false);
      setSelectedCompanies([]);
    } catch (error) {
      console.error('Error sending emails:', error);
      Swal.fire('Error!', 'Failed to send emails.', 'error');
    }
  };

  return {
    fetchCompanies,
    companies,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDesc,
    selectedCompanies,
    setSelectedCompanies,
    paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    isEditModalOpen,
    isAddModalOpen,
    isViewModalOpen,
    isEmailModalOpen,
    selectedCompany,
    setEditModalOpen,
    setAddModalOpen,
    setViewModalOpen,
    setEmailModalOpen,
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    openEditModal,
    emailData,
    setEmailData,
    sendEmails,
    openViewModal,
    handleSort,
    updateCompany,
    handlePageChange,
  };
};

export default useCompanyTable;
