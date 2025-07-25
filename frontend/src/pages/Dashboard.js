import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  Activity,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import { mockStats, mockAppointments, mockPatients, mockInvoices } from '../data/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  
  const today = new Date();
  const todayAppointments = mockAppointments.filter(apt => 
    apt.start.toDateString() === today.toDateString()
  );

  const unpaidInvoices = mockInvoices.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue');

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp size={16} className="mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={mockStats.totalPatients}
          icon={Users}
          color="text-blue-600"
          trend="+12% from last month"
        />
        <StatCard
          title="This Month Appointments"
          value={mockStats.totalAppointments}
          icon={Calendar}
          color="text-green-600"
          trend="+8% from last month"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${mockStats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="text-purple-600"
          trend="+15% from last month"
        />
        <StatCard
          title="Pending Invoices"
          value={mockStats.pendingInvoices}
          icon={FileText}
          color="text-orange-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>
          <div className="space-y-3">
            {todayAppointments.length > 0 ? (
              todayAppointments.map(apt => (
                <div key={apt.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Clock size={16} className="text-gray-500 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{apt.title}</p>
                    <p className="text-sm text-gray-500">
                      {apt.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {apt.room}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Unpaid Invoices</h3>
          <div className="space-y-3">
            {unpaidInvoices.slice(0, 5).map(invoice => (
              <div key={invoice.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <AlertCircle size={16} className={`mr-3 ${
                  invoice.status === 'overdue' ? 'text-red-500' : 'text-orange-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{invoice.patientName}</p>
                  <p className="text-sm text-gray-500">${invoice.amount} - Due: {invoice.dueDate}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDoctorDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="My Patients"
          value={mockPatients.length}
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={Calendar}
          color="text-green-600"
        />
        <StatCard
          title="This Week"
          value={mockAppointments.length}
          icon={Activity}
          color="text-purple-600"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
        <div className="space-y-3">
          {todayAppointments.length > 0 ? (
            todayAppointments.map(apt => (
              <div key={apt.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Clock size={16} className="text-gray-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{apt.title}</p>
                  <p className="text-sm text-gray-500">{apt.notes}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {apt.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-gray-500">{apt.room}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderSecretaryDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={Calendar}
          color="text-blue-600"
        />
        <StatCard
          title="Pending Invoices"
          value={unpaidInvoices.length}
          icon={FileText}
          color="text-orange-600"
        />
        <StatCard
          title="Total Patients"
          value={mockPatients.length}
          icon={Users}
          color="text-green-600"
        />
        <StatCard
          title="Available Rooms"
          value={mockStats.availableRooms}
          icon={Activity}
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {mockAppointments.slice(0, 5).map(apt => (
              <div key={apt.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Calendar size={16} className="text-gray-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{apt.title}</p>
                  <p className="text-sm text-gray-500">
                    {apt.start.toLocaleDateString()} at {apt.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Status</h3>
          <div className="space-y-3">
            {mockInvoices.slice(0, 5).map(invoice => (
              <div key={invoice.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FileText size={16} className="text-gray-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{invoice.patientName}</p>
                  <p className="text-sm text-gray-500">${invoice.amount} - {invoice.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'unpaid' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening at your clinic today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {user.role === 'admin' && renderAdminDashboard()}
      {user.role === 'doctor' && renderDoctorDashboard()}
      {user.role === 'secretary' && renderSecretaryDashboard()}
    </div>
  );
};

export default Dashboard;