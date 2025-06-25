import { EditOutlined, DeleteOutlined, MailOutlined, PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { Table, TableHeader } from '../common/Table';
import Modal from '../common/Modal';
import useCompanyTable from '../../hooks/table/useCompanyTable';
import EditCompanyForm from './EditCompany/EditCompanyForm';
import AddCompanyForm from './AddCompany/AddCompanyForm';
import ViewCarrierForm from './ViewCompany/ViewCompanyForm';
import Pagination from '../common/Pagination';

const CompanyTable: React.FC = () => {
  const {
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
  } = useCompanyTable();

  const renderSortableHeader = (header: TableHeader) => {
    if (header.key === 'checkbox' || header.key === 'actions') return header.label;
    return (
      <div className="sortable-header" onClick={() => handleSort(header.key)}>
        {header.label}
        <span className="sort-icon">{sortBy === header.key ? (sortDesc ? '▼' : '▲') : '▼'}</span>
      </div>
    );
  };

  const headers: TableHeader[] = [
    {
      key: 'checkbox',
      label: (
        <input type="checkbox" onChange={toggleSelectAll} checked={selectedCompanies.length === paginatedData.length && paginatedData.length > 0} />
      ) as JSX.Element,
      render: (item) => <input type="checkbox" checked={selectedCompanies.includes(item.id!)} onChange={() => toggleSelect(item.id)} />,
    },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'cell', label: 'Cell' },
    { key: 'email', label: 'Email' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'website', label: 'Website' },
    { key: 'gst_hst_no', label: 'GST/HST No.' },
    { key: 'qst_no', label: 'QST No.' },
    {
      key: 'actions',
      label: '',
      render: (item) => (
        <>
          <button onClick={() => openViewModal(item)} className="btn-view">
            <EyeOutlined />
          </button>
          <button onClick={() => openEditModal(item)} className="btn-edit">
            <EditOutlined />
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="header-container">
        <div className="header-container-left">
          <h1 className="page-heading">Companies</h1>
        </div>
        <div className="search-container">
          <div className="search-input-wrapper">
            <SearchOutlined className="search-icon" />
            <input className="search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={() => setAddModalOpen(true)} className="add-button">
            <PlusOutlined />
          </button>
          <button onClick={() => setEmailModalOpen(true)} className="send-email-button" disabled={selectedCompanies.length === 0}>
            <MailOutlined />
          </button>
          <button onClick={deleteSelected} className="delete-button">
            <DeleteOutlined />
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : companies.length === 0 ? (
        <div>No records found</div>
      ) : (
        <Table
          data={paginatedData}
          headers={headers.map((header) => ({
            ...header,
            label: renderSortableHeader(header),
          }))}
          handleSort={handleSort}
          sortBy={sortBy}
          sortDesc={sortDesc}
        />
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <Modal isOpen={isEditModalOpen} title="Edit Company" onClose={() => setEditModalOpen(false)}>
        {selectedCompany && <EditCompanyForm company={selectedCompany} onUpdate={updateCompany} onClose={() => setEditModalOpen(false)} />}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add Company">
        <AddCompanyForm onClose={() => setAddModalOpen(false)} onSuccess={fetchCompanies} />
      </Modal>

      <Modal isOpen={isEmailModalOpen} onClose={() => setEmailModalOpen(false)} title="Send Email">
        <button onClick={sendEmails}>Send</button>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} title="Company Details">
        {selectedCompany && <ViewCarrierForm company={selectedCompany} onClose={() => setViewModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default CompanyTable;
