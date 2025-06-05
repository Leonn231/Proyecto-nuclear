
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, Trash2, Search, Clock, User, Heart, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const AppointmentManagement = ({ user }) => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: '2024-03-15',
      time: '09:00',
      patientName: 'Max',
      ownerName: 'Ana García',
      veterinarian: 'Dr. Carlos Rodríguez',
      service: 'Consulta General',
      status: 'confirmada',
      notes: 'Revisión rutinaria'
    },
    {
      id: 2,
      date: '2024-03-15',
      time: '10:30',
      patientName: 'Luna',
      ownerName: 'Carlos López',
      veterinarian: 'Dra. María González',
      service: 'Vacunación',
      status: 'pendiente',
      notes: 'Vacuna anual'
    },
    {
      id: 3,
      date: '2024-03-15',
      time: '11:15',
      patientName: 'Rocky',
      ownerName: 'María Fernández',
      veterinarian: 'Dr. Carlos Rodríguez',
      service: 'Cirugía Menor',
      status: 'completada',
      notes: 'Extracción de quiste'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    patientName: '',
    ownerName: '',
    veterinarian: '',
    service: 'Consulta General',
    status: 'pendiente',
    notes: ''
  });

  const veterinarians = ['Dr. Carlos Rodríguez', 'Dra. María González', 'Dr. Luis Martín'];
  const services = ['Consulta General', 'Vacunación', 'Cirugía Menor', 'Cirugía Mayor', 'Emergencia', 'Control Post-op'];
  const statuses = ['pendiente', 'confirmada', 'completada', 'cancelada'];
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const patients = [
    { name: 'Max', owner: 'Ana García' },
    { name: 'Luna', owner: 'Carlos López' },
    { name: 'Rocky', owner: 'María Fernández' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar disponibilidad
    const existingAppointment = appointments.find(apt => 
      apt.date === formData.date && 
      apt.time === formData.time && 
      apt.veterinarian === formData.veterinarian &&
      apt.id !== editingAppointment?.id
    );
    
    if (existingAppointment) {
      toast.error('Ya existe una cita en ese horario para este veterinario');
      return;
    }

    if (editingAppointment) {
      setAppointments(appointments.map(apt => 
        apt.id === editingAppointment.id 
          ? { ...apt, ...formData }
          : apt
      ));
      toast.success('Cita actualizada correctamente');
    } else {
      const newAppointment = {
        ...formData,
        id: Date.now()
      };
      setAppointments([...appointments, newAppointment]);
      toast.success('Cita agendada correctamente');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      patientName: '',
      ownerName: '',
      veterinarian: '',
      service: 'Consulta General',
      status: 'pendiente',
      notes: ''
    });
    setEditingAppointment(null);
    setShowForm(false);
  };

  const handleEdit = (appointment) => {
    setFormData(appointment);
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = (appointmentId) => {
    setAppointments(appointments.filter(apt => apt.id !== appointmentId));
    toast.success('Cita cancelada correctamente');
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: newStatus }
        : apt
    ));
    toast.success(`Cita ${newStatus}`);
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.veterinarian.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'confirmada': return 'bg-blue-100 text-blue-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmada': return <CheckCircle className="w-4 h-4" />;
      case 'completada': return <CheckCircle className="w-4 h-4" />;
      case 'cancelada': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const todaysAppointments = appointments.filter(apt => apt.date === selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-emerald-600" />
            Gestión de Citas
          </h2>
          <p className="text-gray-600 mt-1">Administra las citas veterinarias</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            Lista
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            Agenda
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Search and Date Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por paciente, propietario, veterinario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </CardContent>
        </Card>
        
        {viewMode === 'calendar' && (
          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
            <CardContent className="p-4">
              <Label htmlFor="date-filter">Fecha</Label>
              <Input
                id="date-filter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-10"
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Appointment Form */}
      {showForm && (
        <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
              {editingAppointment ? 'Editar Cita' : 'Nueva Cita'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Hora *</Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => setFormData({...formData, time: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="veterinarian">Veterinario *</Label>
                <Select
                  value={formData.veterinarian}
                  onValueChange={(value) => setFormData({...formData, veterinarian: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar veterinario" />
                  </SelectTrigger>
                  <SelectContent>
                    {veterinarians.map(vet => (
                      <SelectItem key={vet} value={vet}>
                        {vet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patientName">Paciente *</Label>
                <Select
                  value={formData.patientName}
                  onValueChange={(value) => {
                    const patient = patients.find(p => p.name === value);
                    setFormData({
                      ...formData, 
                      patientName: value,
                      ownerName: patient?.owner || ''
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.name} value={patient.name}>
                        {patient.name} ({patient.owner})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Servicio *</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData({...formData, service: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Notas adicionales sobre la cita"
                />
              </div>
              
              <div className="md:col-span-3 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  {editingAppointment ? 'Actualizar' : 'Agendar'} Cita
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Appointments View */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="grid grid-cols-1 gap-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Fecha y Hora</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(appointment.date).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-emerald-600 font-medium">{appointment.time}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Paciente</p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <Heart className="w-4 h-4 mr-1 text-pink-600" />
                        {appointment.patientName}
                      </p>
                      <p className="text-gray-600 text-sm">{appointment.ownerName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Veterinario</p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <User className="w-4 h-4 mr-1 text-blue-600" />
                        {appointment.veterinarian}
                      </p>
                      <p className="text-gray-600 text-sm">{appointment.service}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <Badge className={`${getStatusBadgeColor(appointment.status)} flex items-center w-fit`}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1 capitalize">{appointment.status}</span>
                      </Badge>
                      {appointment.notes && (
                        <p className="text-xs text-gray-500 mt-1">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    {appointment.status === 'pendiente' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id, 'confirmada')}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Confirmar
                      </Button>
                    )}
                    {appointment.status === 'confirmada' && user.role === 'veterinario' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id, 'completada')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Completar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(appointment)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(appointment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Calendar View */
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
              Agenda del {new Date(selectedDate).toLocaleDateString('es-ES', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysAppointments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay citas programadas para esta fecha</p>
              ) : (
                todaysAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="bg-emerald-500 text-white px-3 py-2 rounded-lg font-semibold">
                        {appointment.time}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {appointment.patientName} - {appointment.service}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.ownerName} | {appointment.veterinarian}
                        </p>
                      </div>
                      <Badge className={getStatusBadgeColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold">{appointments.length}</h3>
            <p className="text-blue-100">Total Citas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold">
              {appointments.filter(apt => apt.status === 'pendiente').length}
            </h3>
            <p className="text-yellow-100">Pendientes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold">
              {appointments.filter(apt => apt.status === 'completada').length}
            </h3>
            <p className="text-green-100">Completadas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold">
              {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length}
            </h3>
            <p className="text-purple-100">Hoy</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentManagement;
