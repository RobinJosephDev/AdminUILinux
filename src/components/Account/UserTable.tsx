import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Table from '../common/Table';
import Modal from '../common/Modal';
import EditUserForm from './EditUserForm';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import AddUserForm from './AddUserForm';
import ViewUserForm from './ViewUserForm';
import { User } from './UserTypes'; 

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof User>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(100);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      setLoading(true);
      const { data } = await axios.get<User[]>(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (error: unknown) {
      console.error('Error loading users:', error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFetchError = (error: any) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You need to log in to access this resource.',
      });
    }
  };

  const handleSort = (column: keyof User) => {
    if (sortBy === column) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(column);
      setSortDesc(true);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };
  const closeEditModal = () => setEditModalOpen(false);
  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);
  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };
  const closeViewModal = () => setViewModalOpen(false);

  const filteredUsers = users.filter((user) => Object.values(user).some((val) => val?.toString().toLowerCase().includes(searchQuery.toLowerCase())));

  const sortedUsers = filteredUsers.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';
    if (sortBy === 'created_at' || sortBy === 'updated_at') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    }
    return 0;
  });

  const paginatedData = sortedUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div>
      <div className="header-container">
        <div className="header-container-left">
          <h1 className="page-heading">Users</h1>
        </div>
        <div className="search-container">
          <SearchOutlined className="search-icon" />
          <input className="search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button onClick={openAddModal} className="add-button">
            <PlusOutlined />
          </button>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : users.length === 0 ? (
        <div>No records found</div>
      ) : (
        <Table
          data={paginatedData}
          headers={[
            { key: 'name', label: 'Name' },
            { key: 'username', label: 'Username' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'created_at', label: 'Created At' },
            { key: 'updated_at', label: 'Updated At' },
            {
              key: 'actions',
              label: 'Actions',
              render: (user) => (
                <>
                  <button onClick={() => openViewModal(user)}>
                    <EyeOutlined />
                  </button>
                  <button onClick={() => openEditModal(user)}>
                    <EditOutlined />
                  </button>
                </>
              ),
            },
          ]}
          handleSort={(key: string) => handleSort(key as keyof User)}
          sortBy={sortBy}
          sortDesc={sortDesc}
        />
      )}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit User">
        {selectedUser && <EditUserForm selectedUser={selectedUser} onClose={closeEditModal} onUpdate={fetchUsers} />}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={closeAddModal} title="Add User">
        <AddUserForm onClose={closeAddModal} onAddUser={fetchUsers} />
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={closeViewModal} title="User Details">
        {selectedUser && <ViewUserForm user={selectedUser} onClose={closeViewModal} />}
      </Modal>
    </div>
  );
};

export default UserTable;
