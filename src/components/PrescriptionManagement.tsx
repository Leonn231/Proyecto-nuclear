import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pill, Plus, Search, Download, Printer, FileText, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

const PrescriptionManagement = ({ user }) => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: 'Max',
      ownerName: 'Ana García',
      veterinarian: 'Dr. Carlos Rodríguez',
      date: '2024-03-01',
      medications: [
        {
          name: 'Amoxicilina',
          dosage: '250mg',
          frequency: 'Cada 8 horas',
          duration: '7 días',
          instructions: 'Administrar con comida'
        }
      ],
      status: 'activa'
    },
    {
      id: 2,
      patientName: 'Luna',
      ownerName: 'Carlos López',
      veterinarian: 'Dra. María González',
      date: '2024-02-28',
      medications: [
        {
          name: 'Omeprazol',
          dosage: '5mg',
          frequency: 'Cada 24 horas',
          duration: '5 días',
          instructions: 'En ayunas, 30 min antes de la comida'
        },
        {
          name: 'Probióticos',
          dosage: '1 sobre',
          frequency: 'Cada 12 horas',
          duration: '10 días',
          instructions: 'Mezclar con comida húmeda'
        }
      ],
      status: 'completada'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);

  const patients = [
    { name: 'Max', owner: 'Ana García' },
    { name: 'Luna', owner: 'Carlos López' },
    { name: 'Rocky', owner: 'María Fernández' }
  ];

  const availableMedications = [
    'Amoxicilina', 'Cefalexina', 'Doxiciclina', 'Omeprazol', 'Meloxicam',
    'Carprofeno', 'Probióticos', 'Vitamina B12', 'Hierro', 'Antihistamínico'
  ];

  const frequencies = [
    'Cada 6 horas', 'Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas',
    'Cada 48 horas', 'Una vez por semana', 'Según necesidad'
  ];

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleRemoveMedication = (index) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = medications.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    );
    setMedications(updatedMedications);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (user.role !== 'veterinario' && user.role !== 'admin') {
      toast.error('Solo los veterinarios pueden prescribir medicamentos');
      return;
    }

    const patient = patients.find(p => p.name === selectedPatient);
    
    const newPrescription = {
      id: Date.now(),
      patientName: selectedPatient,
      ownerName: patient?.owner || '',
      veterinarian: user.name,
      date: new Date().toISOString().split('T')[0],
      medications: medications.filter(med => med.name && med.dosage),
      status: 'activa'
    };

    setPrescriptions([newPrescription, ...prescriptions]);
    toast.success('Prescripción creada correctamente');
    resetForm();
  };

  const resetForm = () => {
    setSelectedPatient('');
    setMedications([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    setShowForm(false);
  };

  const handleGeneratePDF = (prescription) => {
    // Simular generación de PDF
    toast.success('Receta generada en PDF');
  };

  const handlePrint = (prescription) => {
    // Simular impresión
    toast.success('Enviando a impresora...');
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.veterinarian.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'activa': return 'bg-green-100 text-green-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      case 'suspendida': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Pill className="w-8 h-8 mr-3 text-emerald-600" />
            Gestión de Prescripciones
          </h2>
          <p className="text-gray-600 mt-1">Prescribe medicamentos y genera recetas</p>
        </div>
        {(user.role === 'veterinario' || user.role === 'admin') && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Prescripción
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por paciente, propietario o veterinario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Prescription Form */}
      {showForm && (
        <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pill className="w-5 h-5 mr-2 text-emerald-600" />
              Nueva Prescripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Selection */}
              <div className="space-y-2">
                <Label htmlFor="patient">Paciente *</Label>
                <Select
                  value={selectedPatient}
                  onValueChange={setSelectedPatient}
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

              {/* Medications */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Medicamentos</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddMedication}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Medicamento
                  </Button>
                </div>

                {medications.map((medication, index) => (
                  <Card key={index} className="bg-gray-50 border border-gray-200">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Medicamento *</Label>
                          <Select
                            value={medication.name}
                            onValueChange={(value) => handleMedicationChange(index, 'name', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar medicamento" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableMedications.map(med => (
                                <SelectItem key={med} value={med}>
                                  {med}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Dosis *</Label>
                          <Input
                            value={medication.dosage}
                            onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                            placeholder="Ej: 250mg, 1 comprimido"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Frecuencia *</Label>
                          <Select
                            value={medication.frequency}
                            onValueChange={(value) => handleMedicationChange(index, 'frequency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar frecuencia" />
                            </SelectTrigger>
                            <SelectContent>
                              {frequencies.map(freq => (
                                <SelectItem key={freq} value={freq}>
                                  {freq}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Duración *</Label>
                          <Input
                            value={medication.duration}
                            onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                            placeholder="Ej: 7 días, 2 semanas"
                            required
                          />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <Label>Instrucciones</Label>
                          <Input
                            value={medication.instructions}
                            onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                            placeholder="Ej: Administrar con comida, en ayunas"
                          />
                        </div>
                      </div>

                      {medications.length > 1 && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMedication(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Eliminar
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
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
                  Crear Prescripción
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription.id} className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-emerald-600" />
                    Prescripción #{prescription.id}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {prescription.patientName} ({prescription.ownerName})
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(prescription.date).toLocaleDateString('es-ES')}
                    </span>
                    <span>{prescription.veterinarian}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusBadgeColor(prescription.status)}>
                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGeneratePDF(prescription)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrint(prescription)}
                  >
                    <Printer className="w-4 h-4 mr-1" />
                    Imprimir
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Medicamentos Prescritos:</h4>
                {prescription.medications.map((medication, index) => (
                  <div key={index} className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="font-semibold text-emerald-800">{medication.name}</p>
                        <p className="text-sm text-emerald-600">Dosis: {medication.dosage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Frecuencia</p>
                        <p className="font-medium">{medication.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duración</p>
                        <p className="font-medium">{medication.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Instrucciones</p>
                        <p className="font-medium">{medication.instructions || 'Ninguna'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrescriptions.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron prescripciones</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando una nueva prescripción'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold">{prescriptions.length}</h3>
            <p className="text-emerald-100">Total Prescripciones</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold">
              {prescriptions.filter(p => p.status === 'activa').length}
            </h3>
            <p className="text-green-100">Activas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold">
              {prescriptions.filter(p => p.status === 'completada').length}
            </h3>
            <p className="text-blue-100">Completadas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrescriptionManagement;
