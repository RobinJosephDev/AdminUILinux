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
    let y = 10;

    doc.setFontSize(16);
    doc.text(`Magma Confirmation #${dispatch.id}`, 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text('MAGMA LOGISTICS INC.', 10, y);
    doc.text('Carrier: ' + (dispatch.carrier || '-'), 130, y);
    y += 7;

    doc.text('8501 Bruceville RD APT 235', 10, y);
    doc.text(dispatch.carrier_address || '-', 130, y);
    y += 7;

    doc.text('Elk Grove ,CA,USA ,95758', 10, y);
    doc.text('Phone: ' + (dispatch.carrier_phone || '-'), 130, y);
    y += 10;

    doc.text(`Date: ${new Date().toLocaleDateString('en-CA')}`, 10, y);
    y += 10;

    // Equipment and Commodity
    doc.text(`Equipment: ${dispatch.equipment || '-'}`, 10, y);
    doc.text(`Temperature: ${dispatch.temperature || '-'}`, 80, y);
    doc.text(`Load Type: ${dispatch.load_type || '-'}`, 130, y);
    y += 7;
    doc.text(`Commodity: ${dispatch.commodity || '-'}`, 10, y);
    y += 10;

    // Pickup Section
    doc.setFont(undefined, 'bold');
    doc.text('Pickup Shipper(s) Details', 10, y);
    doc.setFont(undefined, 'normal');
    y += 7;

    doc.text(dispatch.pickup_address || '-', 10, y);
    y += 7;
    doc.text(`Pickup Date & Time: ${dispatch.pickup_time || '-'}`, 10, y);
    y += 7;
    doc.text(`Skids: ${dispatch.pickup_skids || '0'}, Weight: ${dispatch.pickup_weight || '-'} LBS`, 10, y);
    y += 7;
    doc.text(`Dims: ${dispatch.pickup_dims || '-'}`, 10, y);
    y += 10;

    // Delivery Section
    doc.setFont(undefined, 'bold');
    doc.text('Delivery Consignee(s) Details', 10, y);
    doc.setFont(undefined, 'normal');
    y += 7;

    doc.text(dispatch.delivery_address || '-', 10, y);
    y += 7;
    doc.text(`Delivery Date & Time: ${dispatch.delivery_time || '-'}`, 10, y);
    y += 7;
    doc.text(`Skids: ${dispatch.delivery_skids || '0'}, Weight: ${dispatch.delivery_weight || '-'} LBS`, 10, y);
    y += 7;
    doc.text(`Dims: ${dispatch.delivery_dims || '-'}`, 10, y);
    y += 10;

    // Charges
    doc.text(`Charges = USD$${dispatch.final_price || '0.00'}`, 10, y);
    y += 7;
    doc.text(`All Inclusive Rate = USD$${dispatch.final_price || '0.00'}`, 10, y);
    y += 10;

    // Notes
    const notes = `Payment term is 30 working days from receipt of freight bill and proof of delivery. 
Any delays in pickup and delivery will apply rescheduling fee $350. 
Check-in call needed for in-transit shipments 7:00 AM pacific time. 
Double brokered shipment leads to non-payment of freight charges and Magma Logistics reserves the right to pay to end carrier whosoever in ACI/ACE manifest. 
Pallet Case count discrepancy must be reported at the time of loading and unloading. 
Clear copy of ACI/ACE manifest, shipper packing slip, Bill of Lading, and signed Carrier Confirmation are required to process invoice.`;

    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(notes, 180), 10, y);
    y += 50;

    // Signature Lines
    doc.text('For Magma Logistics Inc. ____________________', 10, y);
    doc.text('For Carrier ____________________', 130, y);

    doc.save(`Dispatch_${dispatch.id}_RateConfirmation.pdf`);
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
