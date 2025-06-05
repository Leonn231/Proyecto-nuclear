
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
}

interface Patient {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  clientId: number;
  clientName: string;
  registrationDate: string;
  medicalHistory?: any;
}

interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  clientName: string;
  date: string;
  time: string;
  type: string;
  status: string;
  veterinarian: string;
  notes: string;
}

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  batch: string;
  expiryDate: string;
  lastMovement: string;
  movementType: string;
}

interface Movement {
  id: number;
  productId: number;
  productName: string;
  type: string;
  quantity: number;
  date: string;
  reason: string;
  user: string;
}

interface MedicalConsultation {
  id: number;
  patientId: number;
  date: string;
  veterinarian: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  weight: number;
  temperature: number;
  heartRate: number;
  notes?: string;
  attachments: string[];
}

interface DataContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  movements: Movement[];
  setMovements: React.Dispatch<React.SetStateAction<Movement[]>>;
  consultations: MedicalConsultation[];
  setConsultations: React.Dispatch<React.SetStateAction<MedicalConsultation[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Dr. Carlos Rodríguez', email: 'carlos@humboldt.vet', role: 'veterinario', phone: '+1234567890', isActive: true },
    { id: 2, name: 'Ana López', email: 'ana@humboldt.vet', role: 'recepcionista', phone: '+1234567891', isActive: true },
    { id: 3, name: 'Dra. María González', email: 'maria@humboldt.vet', role: 'veterinario', phone: '+1234567892', isActive: true },
    { id: 4, name: 'Pedro Martínez', email: 'pedro@humboldt.vet', role: 'admin', phone: '+1234567893', isActive: true }
  ]);

  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'Ana García', email: 'ana.garcia@email.com', phone: '+1234567890', address: 'Av. Libertador 1234', registrationDate: '2024-01-15' },
    { id: 2, name: 'Carlos López', email: 'carlos.lopez@email.com', phone: '+1234567891', address: 'Calle Corrientes 567', registrationDate: '2024-02-20' },
    { id: 3, name: 'María Rodríguez', email: 'maria.rodriguez@email.com', phone: '+1234567892', address: 'Av. Rivadavia 890', registrationDate: '2024-03-10' }
  ]);

  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: 'Max', species: 'Perro', breed: 'Golden Retriever', age: 3, weight: 28.5, clientId: 1, clientName: 'Ana García', registrationDate: '2024-01-15' },
    { id: 2, name: 'Luna', species: 'Gato', breed: 'Persa', age: 2, weight: 4.2, clientId: 2, clientName: 'Carlos López', registrationDate: '2024-02-20' },
    { id: 3, name: 'Rocky', species: 'Perro', breed: 'Pastor Alemán', age: 5, weight: 32.0, clientId: 3, clientName: 'María Rodríguez', registrationDate: '2024-03-10' }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, patientId: 1, patientName: 'Max', clientName: 'Ana García', date: '2024-01-25', time: '10:00', type: 'Consulta General', status: 'Confirmada', veterinarian: 'Dr. Carlos Rodríguez', notes: 'Revisión rutinaria' },
    { id: 2, patientId: 2, patientName: 'Luna', clientName: 'Carlos López', date: '2024-01-26', time: '14:30', type: 'Vacunación', status: 'Pendiente', veterinarian: 'Dra. María González', notes: 'Vacuna antirrábica' }
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Amoxicilina 500mg', category: 'antibiotico', currentStock: 45, minStock: 20, maxStock: 100, unitPrice: 2.50, supplier: 'Laboratorios Veterinarios SA', batch: 'AMX-2024-001', expiryDate: '2025-06-15', lastMovement: '2024-01-20', movementType: 'entrada' },
    { id: 2, name: 'Vacuna Antirábica', category: 'vacuna', currentStock: 8, minStock: 15, maxStock: 50, unitPrice: 12.00, supplier: 'BioVet Internacional', batch: 'VAC-2024-002', expiryDate: '2024-12-30', lastMovement: '2024-01-18', movementType: 'salida' },
    { id: 3, name: 'Jeringa 5ml', category: 'material', currentStock: 150, minStock: 50, maxStock: 300, unitPrice: 0.35, supplier: 'Suministros Médicos López', batch: 'JER-2024-003', expiryDate: '2026-03-20', lastMovement: '2024-01-22', movementType: 'entrada' }
  ]);

  const [movements, setMovements] = useState<Movement[]>([
    { id: 1, productId: 1, productName: 'Amoxicilina 500mg', type: 'entrada', quantity: 50, date: '2024-01-20', reason: 'Compra a proveedor', user: 'Ana López' },
    { id: 2, productId: 2, productName: 'Vacuna Antirábica', type: 'salida', quantity: 7, date: '2024-01-18', reason: 'Vacunación pacientes', user: 'Dr. Carlos Rodríguez' }
  ]);

  const [consultations, setConsultations] = useState<MedicalConsultation[]>([
    { id: 1, patientId: 1, date: '2024-03-01', veterinarian: 'Dr. Carlos Rodríguez', reason: 'Consulta rutinaria', diagnosis: 'Estado de salud excelente', treatment: 'Continuar con alimentación actual. Próxima revisión en 6 meses.', weight: 28.5, temperature: 38.2, heartRate: 90, attachments: [] },
    { id: 2, patientId: 1, date: '2024-01-15', veterinarian: 'Dra. María González', reason: 'Primera consulta', diagnosis: 'Paciente sano, vacunas al día', treatment: 'Plan de vacunación completado. Desparasitación cada 3 meses.', weight: 27.8, temperature: 38.1, heartRate: 88, attachments: ['vacunas.pdf', 'analisis_sangre.pdf'] },
    { id: 3, patientId: 2, date: '2024-02-28', veterinarian: 'Dra. María González', reason: 'Problema digestivo', diagnosis: 'Gastritis leve', treatment: 'Dieta blanda por 5 días. Medicación: Omeprazol 5mg cada 24h.', weight: 4.2, temperature: 38.8, heartRate: 180, attachments: [] }
  ]);

  return (
    <DataContext.Provider value={{
      users, setUsers,
      clients, setClients,
      patients, setPatients,
      appointments, setAppointments,
      inventory, setInventory,
      movements, setMovements,
      consultations, setConsultations
    }}>
      {children}
    </DataContext.Provider>
  );
};
