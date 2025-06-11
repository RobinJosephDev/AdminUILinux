import { Table, TableHeader } from '../common/Table';
import Modal from '../common/Modal';
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  FilePdfOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import EditDispatchForm from './EditDispatch/EditDispatchForm';
import AddDispatchForm from './AddDispatch/AddDispatchForm';
import ViewDispatchForm from './ViewDispatch/ViewDispatchForm';
import useDispatchTable from '../../hooks/table/useDispatchTable';
import Pagination from '../common/Pagination';
import jsPDF from 'jspdf';

const OrderTable: React.FC = () => {
  const {
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
  } = useDispatchTable();

  const renderSortableHeader = (header: TableHeader) => {
    if (header.key === 'checkbox' || header.key === 'actions') return header.label;
    return (
      <div className="sortable-header" onClick={() => handleSort(header.key)}>
        {header.label}
        <span className="sort-icon">{sortBy === header.key ? (sortDesc ? '▼' : '▲') : '▼'}</span>
      </div>
    );
  };
  const generatePdf = () => {
    const selectedDispatchId = selectedIds[0];
    const dispatch = dispatches.find((o) => o.id === selectedDispatchId);
    if (!dispatch) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Dispatch Details - ID: ${dispatch.id}`, 10, 10);

    doc.setFontSize(12);
    doc.text(`Carrier: ${dispatch.carrier || '-'}`, 10, 20);
    doc.text(`Truck Unit No: ${dispatch.truck_unit_no || '-'}`, 10, 30);
    doc.text(`Trailer Unit No: ${dispatch.trailer_unit_no || '-'}`, 10, 40);
    doc.text(`Equipment: ${dispatch.equipment || '-'}`, 10, 50);
    doc.text(`Tracking Code: ${dispatch.tracking_code || '-'}`, 10, 50);

    doc.save(`Dispatch_${dispatch.id}.pdf`);
  };

  const headers: TableHeader[] = [
    {
      key: 'checkbox',
      label: <input type="checkbox" checked={selectedIds.length === paginatedData.length && paginatedData.length > 0} onChange={toggleSelectAll} />,
      render: (dispatch) => <input type="checkbox" checked={selectedIds.includes(dispatch.id)} onChange={() => toggleSelect(dispatch.id)} />,
    },
    { key: 'carrier', label: 'Carrier', render: (dispatch) => dispatch.carrier || <span>-</span> },
    { key: 'truck_unit_no', label: 'Truck Unit No', render: (dispatch) => dispatch.truck_unit_no || <span>-</span> },
    { key: 'trailer_unit_no', label: 'Trailer Unit No', render: (dispatch) => dispatch.trailer_unit_no || <span>-</span> },
    { key: 'equipment', label: 'Equipment', render: (dispatch) => dispatch.equipment || <span>-</span> },
    { key: 'border', label: 'Border', render: (dispatch) => dispatch.border || <span>-</span> },
    { key: 'tracking_code', label: 'Tracking Code', render: (dispatch) => dispatch.tracking_code || <span>-</span> },
    { key: 'final_price', label: 'Final Price', render: (dispatch) => dispatch.final_price || <span>-</span> },
    {
      key: 'actions',
      label: 'Actions',
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
          <h1 className="page-heading">Dispatches</h1>
        </div>
        <div className="search-container">
          <div className="search-input-wrapper">
            <SearchOutlined className="search-icon" />
            <input className="search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={() => setAddModalOpen(true)} className="add-button">
            <PlusOutlined />
          </button>
          <button onClick={generatePdf} className="pdf-button" disabled={selectedIds.length !== 1}>
            <FilePdfOutlined />
          </button>
          <button onClick={deleteSelected} className="delete-button">
            <DeleteOutlined />
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : dispatches.length === 0 ? (
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

      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Dispatch">
        {selectedDispatch && <EditDispatchForm dispatch={selectedDispatch} onClose={() => setEditModalOpen(false)} onUpdate={updateDispatch} />}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add Dispatch">
        <AddDispatchForm onClose={() => setAddModalOpen(false)} onSuccess={fetchDispatches} />
      </Modal>
      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} title="Dispatch Details">
        {selectedDispatch && <ViewDispatchForm dispatch={selectedDispatch} onClose={() => setViewModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default OrderTable;
