
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Shield, Users, Calendar, FileText, Pill, BarChart, User, Search, Receipt } from 'lucide-react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import UserManagement from '@/components/UserManagement';
import ClientManagement from '@/components/ClientManagement';
import PatientManagement from '@/components/PatientManagement';
import AppointmentManagement from '@/components/AppointmentManagement';
import MedicalHistory from '@/components/MedicalHistory';
import PrescriptionManagement from '@/components/PrescriptionManagement';
import InventoryManagement from '@/components/InventoryManagement';
import BillingManagement from '@/components/BillingManagement';
import Reports from '@/components/Reports';

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setActiveSection('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveSection('dashboard');
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart },
    { id: 'users', label: 'Usuarios', icon: Users, adminOnly: true },
    { id: 'clients', label: 'Propietarios', icon: User },
    { id: 'patients', label: 'Pacientes', icon: Heart },
    { id: 'appointments', label: 'Citas', icon: Calendar },
    { id: 'medical', label: 'Historia Clínica', icon: FileText },
    { id: 'prescriptions', label: 'Prescripciones', icon: Pill },
    { id: 'inventory', label: 'Inventario', icon: Search },
    { id: 'billing', label: 'Facturación', icon: Receipt },
    { id: 'reports', label: 'Reportes', icon: BarChart },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || currentUser.role === 'admin'
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard user={currentUser} />;
      case 'users':
        return <UserManagement />;
      case 'clients':
        return <ClientManagement />;
      case 'patients':
        return <PatientManagement />;
      case 'appointments':
        return <AppointmentManagement user={currentUser} />;
      case 'medical':
        return <MedicalHistory user={currentUser} />;
      case 'prescriptions':
        return <PrescriptionManagement user={currentUser} />;
      case 'inventory':
        return <InventoryManagement />;
      case 'billing':
        return <BillingManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-emerald-200/50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Clínica Veterinaria Universitaria Humboldt
              </h1>
              <p className="text-sm text-gray-600">Sistema Veterinario Integral</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800">{currentUser.name}</p>
              <p className="text-sm text-gray-600 capitalize">{currentUser.role}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/80 hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-emerald-200/50 min-h-screen shadow-lg">
          <nav className="p-4">
            <div className="space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="animate-fade-in">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
