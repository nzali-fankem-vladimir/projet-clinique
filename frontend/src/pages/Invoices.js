import React, { useState } from 'react';
import { mockInvoices } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Eye, 
  Download, 
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import jsPDF from 'jspdf';

const Invoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'unpaid':
        return <Clock size={16} className="text-yellow-600" />;
      case 'overdue':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  const generateInvoicePDF = (invoice) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    // Clinic info
    doc.setFontSize(12);
    doc.text('Clinic Manager', 20, 40);
    doc.text('123 Medical Street, City, State 12345', 20, 50);
    doc.text('Phone: (555) 123-4567', 20, 60);
    doc.text('Email: info@clinicmanager.com', 20, 70);
    
    // Invoice details
    doc.setFontSize(14);
    doc.text(`Invoice #${invoice.id}`, 140, 40);
    doc.setFontSize(12);
    doc.text(`Date: ${invoice.date}`, 140, 50);
    doc.text(`Due Date: ${invoice.dueDate}`, 140, 60);
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 140, 70);
    
    // Patient info
    doc.setFontSize(14);
    doc.text('Bill To:', 20, 90);
    doc.setFontSize(12);
    doc.text(invoice.patientName, 20, 105);
    
    // Services table
    doc.setFontSize(14);
    doc.text('Services:', 20, 125);
    
    let yPosition = 140;
    doc.setFontSize(12);
    doc.text('Service', 20, yPosition);
    doc.text('Amount', 150, yPosition);
    
    // Draw line
    doc.line(20, yPosition + 5, 190, yPosition + 5);
    yPosition += 15;
    
    invoice.services.forEach(service => {
      doc.text(service, 20, yPosition);
      yPosition += 10;
    });
    
    // Total
    yPosition += 10;
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 15;
    doc.setFontSize(14);
    doc.text('Total:', 130, yPosition);
    doc.text(`$${invoice.amount.toFixed(2)}`, 150, yPosition);
    
    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for choosing our clinic!', 105, 250, { align: 'center' });
    
    doc.save(`invoice_${invoice.id}.pdf`);
  };

  const handleMarkAsPaid = (invoiceId) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
    ));
  };

  const InvoiceModal = ({ invoice, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Invoice #{invoice.id}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => generateInvoicePDF(invoice)}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download size={16} className="mr-2" />
                PDF
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Patient Information</h4>
                <p className="text-gray-700">{invoice.patientName}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Invoice Details</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Date:</span> {invoice.date}</p>
                  <p><span className="font-medium">Due Date:</span> {invoice.dueDate}</p>
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  {invoice.services.map((service, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{service}</span>
                      <span className="text-gray-900 font-medium">-</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-gray-900">${invoice.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {(user.role === 'admin' || user.role === 'secretary') && invoice.status !== 'paid' && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleMarkAsPaid(invoice.id);
                    onClose();
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Mark as Paid
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage patient invoices and payments</p>
        </div>
        {(user.role === 'admin' || user.role === 'secretary') && (
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} className="mr-2" />
            New Invoice
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices by patient name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
              <p className="text-2xl font-bold text-gray-900">
                {invoices.filter(inv => inv.status === 'paid').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unpaid Invoices</p>
              <p className="text-2xl font-bold text-gray-900">
                {invoices.filter(inv => inv.status === 'unpaid').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue Invoices</p>
              <p className="text-2xl font-bold text-gray-900">
                {invoices.filter(inv => inv.status === 'overdue').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{invoice.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.patientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${invoice.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.date}</div>
                    <div className="text-sm text-gray-500">Due: {invoice.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(invoice.status)}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => generateInvoicePDF(invoice)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No invoices found matching your criteria.</p>
        </div>
      )}

      {isModalOpen && selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default Invoices;