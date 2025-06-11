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
import EditOrderForm from './EditOrder/EditOrderForm';
import AddOrderForm from './AddOrder/AddOrderForm';
import AddDispatchForm from '../Dispatches/AddDispatch/AddDispatchForm';
import ViewOrderForm from './ViewOrder/ViewOrderForm';
import useOrderTable from '../../hooks/table/useOrderTable';
import useDispatchTable from '../../hooks/table/useDispatchTable';
import Pagination from '../common/Pagination';
import jsPDF from 'jspdf';

const OrderTable: React.FC = () => {
  const {
    fetchOrders,
    orders,
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
    selectedOrder,
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
    duplicateOrder,
    handleSort,
    updateOrder,
    handlePageChange,
  } = useOrderTable();

  const { fetchDispatches } = useDispatchTable();

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
    const selectedOrderId = selectedIds[0];
    const order = orders.find((o) => o.id === selectedOrderId);
    if (!order) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Order Details - ID: ${order.id}`, 10, 10);

    doc.setFontSize(12);
    doc.text(`Customer: ${order.customer || '-'}`, 10, 20);
    doc.text(`Ref No: ${order.customer_ref_no || '-'}`, 10, 30);
    doc.text(`PO No: ${order.customer_po_no || '-'}`, 10, 40);
    doc.text(`Equipment: ${order.equipment || '-'}`, 10, 50);

    try {
      const origin = typeof order.origin_location === 'string' ? JSON.parse(order.origin_location) : order.origin_location;
      const destination = typeof order.destination_location === 'string' ? JSON.parse(order.destination_location) : order.destination_location;

      doc.text(`Pickup Date: ${origin?.[0]?.date || '-'}`, 10, 60);
      doc.text(`Pickup Time: ${origin?.[0]?.time || '-'}`, 10, 70);

      doc.text(`Delivery Date: ${destination?.[0]?.date || '-'}`, 10, 80);
      doc.text(`Delivery Time: ${destination?.[0]?.time || '-'}`, 10, 90);
    } catch (err) {
      doc.text('Error parsing pickup/delivery data.', 10, 100);
    }

    doc.save(`Order_${order.id}.pdf`);
  };

  const headers: TableHeader[] = [
    {
      key: 'checkbox',
      label: <input type="checkbox" checked={selectedIds.length === paginatedData.length && paginatedData.length > 0} onChange={toggleSelectAll} />,
      render: (order) => <input type="checkbox" checked={selectedIds.includes(order.id)} onChange={() => toggleSelect(order.id)} />,
    },
    { key: 'customer', label: 'Customer', render: (order) => order.customer || <span>-</span> },
    { key: 'customer_ref_no', label: 'Ref No', render: (order) => order.customer_ref_no || <span>-</span> },
    { key: 'customer_po_no', label: 'PO No', render: (order) => order.customer_po_no || <span>-</span> },
    { key: 'equipment', label: 'Equipment', render: (order) => order.equipment || <span>-</span> },
    {
      key: 'pickup_date',
      label: 'Pickup Date/Time',
      render: (order) => {
        try {
          const originLocations = typeof order.origin_location === 'string' ? JSON.parse(order.origin_location) : order.origin_location;
          const pickupDate = originLocations?.[0]?.date || null;
          const pickupTime = originLocations?.[0]?.time || null;

          return pickupDate && pickupTime ? (
            <div className="pickup-date-time">
              <CalendarOutlined /> {pickupDate} <ClockCircleOutlined /> {pickupTime}
            </div>
          ) : (
            <span>-</span>
          );
        } catch (error) {
          console.error('Error parsing pickup location data:', error);
          return <span>-</span>;
        }
      },
    },
    {
      key: 'delivery_date',
      label: 'Delivery Date/Time',
      render: (order) => {
        try {
          const destinationLocations =
            typeof order.destination_location === 'string' ? JSON.parse(order.destination_location) : order.destination_location;
          const deliveryDate = destinationLocations?.[0]?.date || null;
          const deliveryTime = destinationLocations?.[0]?.time || null;

          return deliveryDate && deliveryTime ? (
            <div className="delivery-date-time">
              <CalendarOutlined /> {deliveryDate} <ClockCircleOutlined /> {deliveryTime}
            </div>
          ) : (
            <span>-</span>
          );
        } catch (error) {
          console.error('Error parsing delivery location data:', error);
          return <span>-</span>;
        }
      },
    },
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
          <button onClick={() => duplicateOrder(item.id)} className="btn-duplicate">
            <CopyOutlined />
          </button>
        </>
      ),
    },
  ];
  return (
    <div>
      <div className="header-container">
        <div className="header-container-left">
          <h1 className="page-heading">Orders</h1>
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
          <button onClick={() => setAddModalOpen(true)} className="dispatch-button" disabled={selectedIds.length !== 1}>
            <TruckOutlined />
          </button>
          <button onClick={deleteSelected} className="delete-button">
            <DeleteOutlined />
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
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

      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Order">
        {selectedOrder && <EditOrderForm order={selectedOrder} onClose={() => setEditModalOpen(false)} onUpdate={updateOrder} />}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add Order">
        <AddOrderForm onClose={() => setAddModalOpen(false)} onSuccess={fetchOrders} />
      </Modal>
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add Dispatch">
        <AddDispatchForm onClose={() => setAddModalOpen(false)} onSuccess={fetchDispatches} />
      </Modal>
      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} title="Order Details">
        {selectedOrder && <ViewOrderForm order={selectedOrder} onClose={() => setViewModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default OrderTable;
