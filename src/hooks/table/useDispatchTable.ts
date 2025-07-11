import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Dispatch } from '../../types/DispatchTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

const useDispatchTable = () => {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Dispatch>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedDispatch, setSelectedDispatch] = useState<Dispatch | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const fetchDispatches = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      setLoading(true);
      const { data } = await axios.get<Dispatch[]>(`${API_URL}/dispatch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDispatches(data);
    } catch (error) {
      console.error('Error loading dispatches:', error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDispatches();
  }, []);

  const handleFetchError = (error: any) => {
    if (error.response && error.response.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You need to log in to access this resource.',
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openEditModal = (order: Dispatch) => {
    setSelectedDispatch(order);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedDispatch(null);
  };

  const openViewModal = (order: Dispatch) => {
    setSelectedDispatch(order);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedDispatch(null);
  };

  const updateDispatch = (updatedDispatch: Dispatch) => {
    setDispatches((prevDispatches) =>
      prevDispatches.map((dispatch) => (dispatch.id === updatedDispatch.id ? { ...dispatch, ...updatedDispatch } : dispatch))
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((dispatch) => dispatch.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
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

        await Promise.all(selectedIds.map((id) => axios.delete(`${API_URL}/dispatch/${id}`, { headers: { Authorization: `Bearer ${token}` } })));

        setDispatches((prevDispatches) => prevDispatches.filter((dispatch) => !selectedIds.includes(dispatch.id)));
        setSelectedIds([]);
        Swal.fire('Deleted!', 'Selected dispatches have been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting dispatches:', error);
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to delete selected dispatches.' });
      }
    }
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key as keyof Dispatch);
      setSortDesc(false);
    }
  };

  const filteredDispatches = dispatches.filter((dispatch) =>
    Object.values(dispatch).some((val) => val?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedDispatches = filteredDispatches.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDesc ? valB - valA : valA - valB;
    }

    return 0;
  });

  const paginatedData = sortedDispatches.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredDispatches.length / rowsPerPage);

  return {
    fetchDispatches,
    dispatches,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDesc,
    selectedIds,
    setSelectedIds,
    paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    isEditModalOpen,
    isAddModalOpen,
    isViewModalOpen,
    selectedDispatch,
    openEditModal,
    closeEditModal,
    openViewModal,
    closeViewModal,
    setEditModalOpen,
    setAddModalOpen,
    setViewModalOpen,
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    handleSort,
    updateDispatch,
    handlePageChange,
  };
};

export default useDispatchTable;
