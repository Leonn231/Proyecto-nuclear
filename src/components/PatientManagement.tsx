
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Edit, Trash2, Search, Calendar, Weight, Ruler } from 'lucide-react';
import { toast } from 'sonner';

const PatientManagement = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Max',
      species: 'Perro',
      breed: 'Golden Retriever',
      age: 3,
      weight: 28.5,
      color: 'Dorado',
      ownerId: 1,
      ownerName: 'Ana García',
      registerDate: '2024-01-15',
      lastVisit: '2024-03-01',
      status: 'Saludable'
    },
    {
      id: 2,
      name: 'Luna',
      species: 'Gato',
      breed: 'Persa',
      age: 2,
      weight: 4.2,
      color: 'Blanco',
      ownerId: 2,
      ownerName: 'Carlos López',
      registerDate: '2024-02-20',
      lastVisit: '2024-02-28',
      status: 'En tratamiento'
    },
    {
      id: 3,
      name: 'Rocky',
      species: 'Perro',
      breed: 'Bulldog',
      age: 5,
      weight: 22.0,
      color: 'Atigrado',
      ownerId: 3,
      ownerName: 'María Fernández',
      registerDate: '2024-01-08',
      lastVisit: '2024-03-05',
      status: 'Saludable'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    species: 'Perro',
    breed: '',
    age: '',
    weight: '',
    color: '',
    ownerId: '',
    ownerName: '',
    status: 'Saludable'
  });

  // Propietarios disponibles (normalmente vendría de la base de datos)
  const owners = [
    { id: 1, name: 'Ana García' },
    { id: 2, name: 'Carlos López' },
    { id: 3, name: 'María Fernández' },
  ];

  const species = ['Perro', 'Gato', 'Conejo', 'Hámster', 'Ave', 'Reptil', 'Otro'];
  const statuses = ['Saludable', 'En tratamiento', 'Crítico', 'Recuperándose'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const selectedOwner = owners.find(owner => owner.id === parseInt(formData.ownerId));
    
    if (editingPatient) {
      setPatients(patients.map(patient => 
        patient.id === editingPatient.id 
          ? { 
              ...patient, 
              ...formData, 
              age: parseInt(formData.age),
              weight: parseFloat(formData.weight),
              ownerId: parseInt(formData.ownerId),
              ownerName: selectedOwner?.name || ''
            }
          : patient
      ));
      toast.success('Paciente actualizado correctamente');
    } else {
      const newPatient = {
        ...formData,
        id: Date.now(),
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        ownerId: parseInt(formData.ownerId),
        ownerName: selectedOwner?.name || '',
        registerDate: new Date().toISOString().split('T')[0],
        lastVisit: null
      };
      setPatients([...patients, newPatient]);
      toast.success('Paciente registrado correctamente');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      species: 'Perro',
      breed: '',
      age: '',
      weight: '',
      color: '',
      ownerId: '',
      ownerName: '',
      status: 'Saludable'
    });
    setEditingPatient(null);
    setShowForm(false);
  };

  const handleEdit = (patient) => {
    setFormData({
      ...patient,
      age: patient.age.toString(),
      weight: patient.weight.toString(),
      ownerId: patient.ownerId.toString()
    });
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDelete = (patientId) => {
    setPatients(patients.filter(patient => patient.id !== patientId));
    toast.success('Paciente eliminado correctamente');
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Saludable': return 'bg-green-100 text-green-800';
      case 'En tratamiento': return 'bg-yellow-100 text-yellow-800';
      case 'Crítico': return 'bg-red-100 text-red-800';
      case 'Recuperándose': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpeciesIcon = (species) => {
    switch (species) {
      case 'Perro': return '🐕';
      case 'Gato': return '🐱';
      case 'Conejo': return '🐰';
      case 'Ave': return '🐦';
      default: return '🐾';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-emerald-600" />
            Gestión de Pacientes
          </h2>
          <p className="text-gray-600 mt-1">Administra la información de las mascotas</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Mascota
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, especie, raza o propietario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient Form */}
      {showForm && (
        <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-emerald-600" />
              {editingPatient ? 'Editar Paciente' : 'Nueva Mascota'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Mascota *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Ej: Max, Luna, Rocky"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="species">Especie *</Label>
                <Select
                  value={formData.species}
                  onValueChange={(value) => setFormData({...formData, species: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {species.map(sp => (
                      <SelectItem key={sp} value={sp}>
                        {getSpeciesIcon(sp)} {sp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="breed">Raza *</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                  required
                  placeholder="Ej: Golden Retriever, Persa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Edad (años) *</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color *</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  required
                  placeholder="Ej: Dorado, Negro, Blanco"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ownerId">Propietario *</Label>
                <Select
                  value={formData.ownerId}
                  onValueChange={(value) => setFormData({...formData, ownerId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar propietario" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map(owner => (
                      <SelectItem key={owner.id} value={owner.id.toString()}>
                        {owner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Estado de Salud</Label>
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
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  {editingPatient ? 'Actualizar' : 'Registrar'} Paciente
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getSpeciesIcon(patient.species)}</span>
                  <div>
                    <CardTitle className="text-lg text-gray-900">{patient.name}</CardTitle>
                    <p className="text-sm text-gray-600">{patient.breed}</p>
                  </div>
                </div>
                <Badge className={getStatusBadgeColor(patient.status)}>
                  {patient.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-blue-600" />
                  <span>{patient.age} años</span>
                </div>
                <div className="flex items-center">
                  <Weight className="w-4 h-4 mr-1 text-green-600" />
                  <span>{patient.weight} kg</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Propietario:</span> {patient.ownerName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Color:</span> {patient.color}
                </p>
                {patient.lastVisit && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Última visita:</span>{' '}
                    {new Date(patient.lastVisit).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Registrado: {new Date(patient.registerDate).toLocaleDateString('es-ES')}
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(patient)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(patient.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron pacientes</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza registrando una nueva mascota'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold">{patients.length}</h3>
            <p className="text-blue-100">Total Pacientes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold">
              {patients.filter(p => p.status === 'Saludable').length}
            </h3>
            <p className="text-green-100">Saludables</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold">
              {patients.filter(p => p.status === 'En tratamiento').length}
            </h3>
            <p className="text-yellow-100">En Tratamiento</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold">
              {patients.filter(p => p.species === 'Perro').length}
            </h3>
            <p className="text-purple-100">Perros</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientManagement;
