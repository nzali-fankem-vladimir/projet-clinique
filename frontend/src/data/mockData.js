// Mock data for the medical clinic management system

export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Dr. Sarah Johnson',
    email: 'admin@clinic.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    username: 'doctor1',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Michael Chen',
    email: 'mchen@clinic.com',
    phone: '+1 (555) 234-5678',
    specialization: 'Cardiology',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 3,
    username: 'doctor2',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Emily Rodriguez',
    email: 'erodriguez@clinic.com',
    phone: '+1 (555) 345-6789',
    specialization: 'Dermatology',
    avatar: 'https://images.unsplash.com/photo-1594824758057-c8d25e67e5d3?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 4,
    username: 'secretary1',
    password: 'secretary123',
    role: 'secretary',
    name: 'Lisa Thompson',
    email: 'lthompson@clinic.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face'
  }
];

export const mockPatients = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 111-2222',
    dateOfBirth: '1985-03-15',
    address: '123 Main St, City, State 12345',
    emergencyContact: 'Jane Smith - +1 (555) 111-3333',
    bloodType: 'A+',
    allergies: ['Penicillin', 'Shellfish'],
    medicalHistory: [
      {
        date: '2024-01-15',
        diagnosis: 'Hypertension',
        treatment: 'Lisinopril 10mg daily',
        doctor: 'Dr. Michael Chen'
      },
      {
        date: '2023-12-10',
        diagnosis: 'Annual Checkup',
        treatment: 'Routine blood work, all normal',
        doctor: 'Dr. Sarah Johnson'
      }
    ],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1 (555) 222-3333',
    dateOfBirth: '1990-07-22',
    address: '456 Oak Ave, City, State 12345',
    emergencyContact: 'Carlos Garcia - +1 (555) 222-4444',
    bloodType: 'O-',
    allergies: ['Latex'],
    medicalHistory: [
      {
        date: '2024-02-20',
        diagnosis: 'Eczema',
        treatment: 'Topical corticosteroid cream',
        doctor: 'Dr. Emily Rodriguez'
      }
    ],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert.johnson@email.com',
    phone: '+1 (555) 333-4444',
    dateOfBirth: '1975-11-08',
    address: '789 Pine St, City, State 12345',
    emergencyContact: 'Susan Johnson - +1 (555) 333-5555',
    bloodType: 'B+',
    allergies: ['Aspirin'],
    medicalHistory: [
      {
        date: '2024-03-10',
        diagnosis: 'Diabetes Type 2',
        treatment: 'Metformin 500mg twice daily',
        doctor: 'Dr. Michael Chen'
      }
    ],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

export const mockAppointments = [
  {
    id: 1,
    title: 'John Smith - Cardiology Consultation',
    start: new Date(2024, 6, 15, 9, 0),
    end: new Date(2024, 6, 15, 9, 30),
    patientId: 1,
    doctorId: 2,
    room: 'Room 101',
    type: 'consultation',
    status: 'confirmed',
    notes: 'Follow-up for hypertension'
  },
  {
    id: 2,
    title: 'Maria Garcia - Dermatology Checkup',
    start: new Date(2024, 6, 15, 10, 0),
    end: new Date(2024, 6, 15, 10, 30),
    patientId: 2,
    doctorId: 3,
    room: 'Room 102',
    type: 'checkup',
    status: 'confirmed',
    notes: 'Eczema treatment review'
  },
  {
    id: 3,
    title: 'Robert Johnson - Diabetes Management',
    start: new Date(2024, 6, 16, 14, 0),
    end: new Date(2024, 6, 16, 14, 30),
    patientId: 3,
    doctorId: 2,
    room: 'Room 101',
    type: 'follow-up',
    status: 'pending',
    notes: 'Blood sugar monitoring'
  }
];

export const mockInvoices = [
  {
    id: 1,
    patientId: 1,
    patientName: 'John Smith',
    amount: 250.00,
    date: '2024-01-15',
    status: 'paid',
    services: ['Consultation', 'Blood Pressure Check'],
    dueDate: '2024-02-15'
  },
  {
    id: 2,
    patientId: 2,
    patientName: 'Maria Garcia',
    amount: 180.00,
    date: '2024-02-20',
    status: 'unpaid',
    services: ['Dermatology Consultation', 'Prescription'],
    dueDate: '2024-03-20'
  },
  {
    id: 3,
    patientId: 3,
    patientName: 'Robert Johnson',
    amount: 320.00,
    date: '2024-03-10',
    status: 'overdue',
    services: ['Blood Tests', 'Consultation', 'Prescription'],
    dueDate: '2024-04-10'
  }
];

export const mockChatMessages = [
  {
    id: 1,
    senderId: 2,
    senderName: 'Dr. Michael Chen',
    senderRole: 'doctor',
    message: 'Lisa, can you please reschedule Mr. Johnson\'s appointment to next Tuesday?',
    timestamp: new Date(2024, 6, 15, 8, 30),
    read: false
  },
  {
    id: 2,
    senderId: 4,
    senderName: 'Lisa Thompson',
    senderRole: 'secretary',
    message: 'Sure, Dr. Chen. I\'ll move it to Tuesday at 2 PM. Should I call the patient to confirm?',
    timestamp: new Date(2024, 6, 15, 8, 35),
    read: true
  },
  {
    id: 3,
    senderId: 2,
    senderName: 'Dr. Michael Chen',
    senderRole: 'doctor',
    message: 'Yes, please. Also, make sure to remind him about the fasting requirement for his blood work.',
    timestamp: new Date(2024, 6, 15, 8, 40),
    read: true
  }
];

export const mockRooms = [
  { id: 1, name: 'Room 101', type: 'consultation', available: true },
  { id: 2, name: 'Room 102', type: 'consultation', available: true },
  { id: 3, name: 'Room 103', type: 'procedure', available: false },
  { id: 4, name: 'Room 104', type: 'consultation', available: true }
];

export const mockStats = {
  totalPatients: 150,
  totalAppointments: 45,
  monthlyRevenue: 15750,
  pendingInvoices: 8,
  todayAppointments: 12,
  availableRooms: 3
};