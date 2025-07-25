import React, { useState } from 'react';
import { mockPatients } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  AlertTriangle,
  FileText,
  Download
} from 'lucide-react';
import jsPDF from 'jspdf';

const Patients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'create'

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleCreatePatient = () => {
    setSelectedPatient({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      emergencyContact: '',
      bloodType: '',
      allergies: [],
      medicalHistory: [],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    });
    setModalType('create');
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleDeletePatient = (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const handleSavePatient = (patientData) => {
    if (modalType === 'create') {
      const newPatient = {
        ...patientData,
        id: Date.now(),
        medicalHistory: [],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };
      setPatients([...patients, newPatient]);
    } else {
      setPatients(patients.map(p => 
        p.id === patientData.id ? patientData : p
      ));
    }
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const generatePrescription = (patient) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('MEDICAL PRESCRIPTION', 105, 20, { align: 'center' });
    
    // Clinic info
    doc.setFontSize(12);
    doc.text('Clinic Manager', 20, 40);
    doc.text('123 Medical Street, City, State 12345', 20, 50);
    doc.text('Phone: (555) 123-4567', 20, 60);
    
    // Patient info
    doc.setFontSize(14);
    doc.text('Patient Information:', 20, 80);
    doc.setFontSize(12);
    doc.text(`Name: ${patient.name}`, 20, 95);
    doc.text(`Date of Birth: ${patient.dateOfBirth}`, 20, 105);
    doc.text(`Blood Type: ${patient.bloodType}`, 20, 115);
    
    // Prescription details
    doc.setFontSize(14);
    doc.text('Prescription:', 20, 135);
    doc.setFontSize(12);
    doc.text('Medication: Sample Medication 10mg', 20, 150);
    doc.text('Instructions: Take once daily with food', 20, 160);
    doc.text('Quantity: 30 tablets', 20, 170);
    doc.text('Refills: 2', 20, 180);
    
    // Doctor signature
    doc.text(`Prescribed by: ${user.name}`, 20, 200);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 210);
    doc.text('Signature: _______________________', 20, 230);
    
    doc.save(`prescription_${patient.name.replace(/\s+/g, '_')}.pdf`);
  };

  const PatientModal = ({ patient, type, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      name: patient?.name || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      dateOfBirth: patient?.dateOfBirth || '',
      address: patient?.address || '',
      emergencyContact: patient?.emergencyContact || '',
      bloodType: patient?.bloodType || '',
      allergies: patient?.allergies || [],
      medicalHistory: patient?.medicalHistory || []
    });

    const [newAllergy, setNewAllergy] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ ...patient, ...formData });
    };

    const addAllergy = () => {
      if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
        setFormData({
          ...formData,
          allergies: [...formData.allergies, newAllergy.trim()]
        });
        setNewAllergy('');
      }
    };

    const removeAllergy = (allergy) => {
      setFormData({
        ...formData,
        allergies: formData.allergies.filter(a => a !== allergy)
      });
    };

    const isReadOnly = type === 'view';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {type === 'create' ? 'Add New Patient' : 
               type === 'edit' ? 'Edit Patient' : 'Patient Details'}
            </h3>
            <div className="flex gap-2">
              {type === 'view' && user.role === 'doctor' && (
                <button
                  onClick={() => generatePrescription(patient)}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Download size={16} className="mr-2" />
                  Prescription
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={isReadOnly}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={isReadOnly}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={isReadOnly}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={isReadOnly}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                readOnly={isReadOnly}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={isReadOnly}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isReadOnly}
                  required
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allergies
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {allergy}
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => removeAllergy(allergy)}
                          className="ml-1 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {!isReadOnly && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Add new allergy"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                    />
                    <button
                      type="button"
                      onClick={addAllergy}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {formData.medicalHistory.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical History
                </label>
                <div className="space-y-2">
                  {formData.medicalHistory.map((record, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{record.diagnosis}</p>
                          <p className="text-sm text-gray-600">{record.treatment}</p>
                          <p className="text-sm text-gray-500">Dr. {record.doctor} - {record.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isReadOnly && (
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {type === 'create' ? 'Create Patient' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>
        {(user.role === 'admin' || user.role === 'secretary') && (
          <button
            onClick={handleCreatePatient}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Patient
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <div key={patient.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={patient.avatar}
                  alt={patient.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-500">
                    Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={16} className="mr-2" />
                  {patient.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={16} className="mr-2" />
                  {patient.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2" />
                  Blood Type: {patient.bloodType}
                </div>
                {patient.allergies.length > 0 && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertTriangle size={16} className="mr-2" />
                    {patient.allergies.length} allergies
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleViewPatient(patient)}
                  className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Eye size={16} className="mr-1" />
                  View
                </button>
                <div className="flex gap-2">
                  {(user.role === 'admin' || user.role === 'secretary') && (
                    <>
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="flex items-center px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <User size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No patients found matching your search.</p>
        </div>
      )}

      {isModalOpen && (
        <PatientModal
          patient={selectedPatient}
          type={modalType}
          onSave={handleSavePatient}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
};

export default Patients;