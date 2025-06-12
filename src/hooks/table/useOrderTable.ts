import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Order } from '../../types/OrderTypes';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

const useOrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Order>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      setLoading(true);
      const { data } = await axios.get<Order[]>(`${API_URL}/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
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

  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedOrder(null);
  };

  const openViewModal = (order: Order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedOrder(null);
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders((prevOrders) => prevOrders.map((order) => (order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order)));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((order) => order.id));
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

        await Promise.all(selectedIds.map((id) => axios.delete(`${API_URL}/order/${id}`, { headers: { Authorization: `Bearer ${token}` } })));

        setOrders((prevOrders) => prevOrders.filter((order) => !selectedIds.includes(order.id)));
        setSelectedIds([]);
        Swal.fire('Deleted!', 'Selected orders have been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting orders:', error);
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to delete selected orders.' });
      }
    }
  };

  const duplicateOrder = async (id: number) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_URL}/order/${id}/duplicate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const duplicatedOrder = response.data.order;

      Swal.fire({
        icon: 'success',
        title: 'Duplicated!',
        text: 'Order has been duplicated successfully.',
        timer: 2000,
        showConfirmButton: false,
      });

      setOrders((prev) => [duplicatedOrder, ...prev]);
    } catch (error: any) {
      console.error('Failed to duplicate order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.response?.data?.message || 'Could not duplicate the order.',
      });
    }
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

  const generateInvoice = () => {
    const selectedOrderId = selectedIds[0];
    const order = orders.find((o) => o.id === selectedOrderId);
    if (!order) return;

    const doc = new jsPDF();

    // === Title ===
    doc.setFontSize(20);
    doc.text('INVOICE', 105, 20, { align: 'center' });

    // === Company Info ===
    doc.setFontSize(12);
    doc.text('MAGMA LOGISTICS INC.', 14, 30);
    doc.text('8501 Bruceville RD APT 235', 14, 36);
    doc.text('Elk Grove ,CA,95758', 14, 42);
    doc.text('Phone: 916-301-2136 Fax:', 14, 48);

    // === Logo (top right) ===
    const logoBase64 =
      'data:image/jpeg;base64,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'; // your base64-encoded logo
    doc.addImage(logoBase64, 'JPEG', 150, 20, 40, 40); // adjust size as needed

    // === Invoice Metadata Table (Right Column) ===
    const invoiceData = [
      ['INVOICE No.', `${order.id}`],
      ['Invoice Date', new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })],
      ['Customer Order', order.customer_ref_no || '-'],
      ['Order Date', order.order_date || '-'],
      ['Equipment', order.equipment || '-'],
    ];

    const metaTableY = 54;

    autoTable(doc, {
      body: invoiceData,
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: 130 },
      startY: metaTableY,
      tableWidth: 65,
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 35 },
      },
    });

    // === Invoice To Box (Left Column) ===
    const boxX = 14;
    const boxY = metaTableY;
    const boxWidth = 90;
    const boxHeight = 30;

    doc.setDrawColor(0);
    doc.rect(boxX, boxY, boxWidth, boxHeight);

    doc.setFontSize(12);
    doc.text('Invoice To:', boxX + 2, boxY + 6);
    doc.setFontSize(10);
    doc.text(order.customer || 'N/A', boxX + 2, boxY + 12);
    doc.text(`Phone: ${order.customer_phone || ''} Fax: ${order.customer_fax || ''}`, boxX + 2, boxY + 18);
    doc.text(`Email: ${order.customer_email || ''}`, boxX + 2, boxY + 24);

    // === Pickup / Delivery Table ===
    let pickup = {},
      delivery = {};
    try {
      pickup = typeof order.origin_location === 'string' ? JSON.parse(order.origin_location)[0] : order.origin_location?.[0];
      delivery = typeof order.destination_location === 'string' ? JSON.parse(order.destination_location)[0] : order.destination_location?.[0];
    } catch {}

    const tableY = boxY + boxHeight + 20;

    const tableBody = [
      ['0-Partial', pickup?.name || '', pickup?.date || '-', delivery?.name || '', delivery?.date || '-', `$ ${order.amount?.toFixed(2) || '0.00'}`],
    ];

    autoTable(doc, {
      head: [['Item', 'Shipper', 'Pick-up Date', 'Consignee', 'Delivery Date', 'Amount CAD']],
      body: tableBody,
      startY: tableY,
      styles: { fontSize: 10 },
    });

    const afterTableY = (doc as any).lastAutoTable.finalY || tableY + 30;

    // === Footer ===
    doc.setFontSize(10);
    doc.text(`Terms: ${order.terms || '0'}`, 14, afterTableY + 10);
    doc.text(`Due Date: ${order.due_date || new Date().toLocaleDateString()}`, 14, afterTableY + 16);
    doc.text('Thank you for your business', 14, afterTableY + 24);

    const subtotal = order.amount?.toFixed(2) || '0.00';
    doc.text(`Sub Total (CAD) = $ ${subtotal}`, 14, afterTableY + 34);
    doc.text('Tax Exempt', 14, afterTableY + 40);
    doc.text(`Total Amount (CAD) = $ ${subtotal}`, 14, afterTableY + 46);

    // === Terms & Conditions ===
    const termsText = [
      'Terms & Conditions',
      'Invoice is payable to - Magma Logistics inc.',
      'Mailing Address #34073 RPO Clover Square',
      'Surrey ,BC.V3S 8C4',
      'GST#719716607',
      'Overdue Invoices will be charged 2% monthly interest.',
    ];

    let termsY = afterTableY + 56;
    termsText.forEach((line) => {
      doc.text(line, 14, termsY);
      termsY += 6;
    });

    doc.save(`Invoice_${order.id}.pdf`);
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key as keyof Order);
      setSortDesc(false);
    }
  };

  const filteredOrders = orders.filter((order) =>
    Object.values(order).some((val) => val?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedOrders = filteredOrders.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDesc ? valB - valA : valA - valB;
    }

    return 0;
  });

  const paginatedData = sortedOrders.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  return {
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
    generatePdf,
    generateInvoice,
    handleSort,
    updateOrder,
    handlePageChange,
  };
};

export default useOrderTable;
