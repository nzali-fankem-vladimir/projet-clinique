import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { mockAppointments, mockPatients, mockUsers } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, User, MapPin, Clock } from 'lucide-react';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(mockAppointments);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleSelectSlot = useCallback((slotInfo) => {
    if (user.role === 'doctor' || user.role === 'secretary') {
      const newAppointment = {
        id: Date.now(),
        title: 'New Appointment',
        start: slotInfo.start,
        end: slotInfo.end,
        patientId: null,
        doctorId: user.role === 'doctor' ? user.id : null,
        room: '',
        type: 'consultation',
        status: 'pending',
        notes: ''
      };
      setSelectedEvent(newAppointment);
      setIsModalOpen(true);
    }
  }, [user]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#3174ad';
    
    switch (event.status) {
      case 'confirmed':
        backgroundColor = '#10b981';
        break;
      case 'pending':
        backgroundColor = '#f59e0b';
        break;
      case 'cancelled':
        backgroundColor = '#ef4444';
        break;
      default:
        backgroundColor = '#3174ad';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const saveAppointment = (appointmentData) => {
    if (appointmentData.id && appointments.find(apt => apt.id === appointmentData.id)) {
      // Update existing appointment
      setAppointments(appointments.map(apt => 
        apt.id === appointmentData.id ? appointmentData : apt
      ));
    } else {
      // Create new appointment
      const newAppointment = {
        ...appointmentData,
        id: Date.now()
      };
      setAppointments([...appointments, newAppointment]);
    }
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const AppointmentModal = ({ appointment, onSave, onDelete, onClose }) => {
    const [formData, setFormData] = useState({
      title: appointment?.title || '',
      start: appointment?.start || new Date(),
      end: appointment?.end || new Date(),
      patientId: appointment?.patientId || '',
      doctorId: appointment?.doctorId || '',
      room: appointment?.room || '',
      type: appointment?.type || 'consultation',
      status: appointment?.status || 'pending',
      notes: appointment?.notes || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const patient = mockPatients.find(p => p.id === parseInt(formData.patientId));
      const doctor = mockUsers.find(u => u.id === parseInt(formData.doctorId));
      
      const appointmentData = {
        ...appointment,
        ...formData,
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        title: patient ? `${patient.name} - ${formData.type}` : formData.title,
        start: new Date(formData.start),
        end: new Date(formData.end)
      };
      
      onSave(appointmentData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">
            {appointment?.id ? 'Edit Appointment' : 'New Appointment'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient
              </label>
              <select
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a patient</option>
                {mockPatients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor
              </label>
              <select
                value={formData.doctorId}
                onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a doctor</option>
                {mockUsers.filter(u => u.role === 'doctor').map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={moment(formData.start).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => setFormData({...formData, start: new Date(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={moment(formData.end).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => setFormData({...formData, end: new Date(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Room 101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="consultation">Consultation</option>
                  <option value="checkup">Checkup</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="procedure">Procedure</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex justify-between pt-4">
              <div>
                {appointment?.id && (
                  <button
                    type="button"
                    onClick={() => onDelete(appointment.id)}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                )}
              </div>
              <div className="flex gap-2">
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
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Manage appointments and schedules</p>
        </div>
        {(user.role === 'doctor' || user.role === 'secretary') && (
          <button
            onClick={() => {
              setSelectedEvent({
                title: 'New Appointment',
                start: new Date(),
                end: new Date(),
                patientId: null,
                doctorId: user.role === 'doctor' ? user.id : null,
                room: '',
                type: 'consultation',
                status: 'pending',
                notes: ''
              });
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            New Appointment
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={user.role === 'doctor' || user.role === 'secretary'}
          eventPropGetter={eventStyleGetter}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          popup
          views={['month', 'week', 'day']}
        />
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Confirmed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Cancelled</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AppointmentModal
          appointment={selectedEvent}
          onSave={saveAppointment}
          onDelete={deleteAppointment}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default CalendarPage;