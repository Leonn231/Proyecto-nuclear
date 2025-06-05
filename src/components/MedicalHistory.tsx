import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search, Calendar, User, Heart, Upload, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';

const MedicalHistory = ({ user }) => {
  const { patients, consultations, setConsultations } = useData();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [consultationForm, setConsultationForm] = useState({
    reason: '',
    diagnosis: '',
    treatment: '',
    weight: '',
    temperature: '',
    heartRate: '',
    notes: ''
  });

  // Get consultations for selected patient
  const getPatientConsultations = (patientId) => {
    return consultations.filter(consultation => consultation.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Add medical history to patient data
  const patientsWithHistory = patients.map(patient => ({
    ...patient,
    medicalHistory: {
      created: patient.registrationDate,
      consultations: getPatientConsultations(patient.id)
    }
  }));

  const filteredPatients = patientsWithHistory.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewConsultation = () => {
    if (!selectedPatient) {
      toast.error('Selecciona un paciente primero');
      return;
    }
    setShowConsultationForm(true);
  };

  const handleSubmitConsultation = (e) => {
    e.preventDefault();
    
    if (user.role !== 'veterinario' && user.role !== 'admin') {
      toast.error('Solo los veterinarios pueden registrar consultas');
      return;
    }

    const newConsultation = {
      id: Date.now(),
      patientId: selectedPatient.id,
      date: new Date().toISOString().split('T')[0],
      veterinarian: user.name,
      ...consultationForm,
      weight: parseFloat(consultationForm.weight) || 0,
      temperature: parseFloat(consultationForm.temperature) || 0,
      heartRate: parseInt(consultationForm.heartRate) || 0,
      attachments: []
    };

    setConsultations(prev => [newConsultation, ...prev]);
    toast.success('Consulta registrada correctamente');
    
    setConsultationForm({
      reason: '',
      diagnosis: '',
      treatment: '',
      weight: '',
      temperature: '',
      heartRate: '',
      notes: ''
    });
    setShowConsultationForm(false);
  };

  const handleFileUpload = (consultationId) => {
    toast.success('Archivo adjuntado correctamente');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-emerald-600" />
            Historia Clínica
          </h2>
          <p className="text-gray-600 mt-1">Gestiona el historial médico de los pacientes</p>
        </div>
        {(user.role === 'veterinario' || user.role === 'admin') && (
          <Button
            onClick={handleNewConsultation}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Consulta
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-600" />
                Buscar Pacientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Buscar por nombre, propietario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </CardContent>
          </Card>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPatients.map((patient) => (
              <Card
                key={patient.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedPatient?.id === patient.id
                    ? 'bg-emerald-100 border-emerald-300 shadow-lg'
                    : 'bg-white/80 hover:bg-emerald-50 border-0'
                } backdrop-blur-lg shadow-md hover:shadow-lg`}
                onClick={() => setSelectedPatient(patient)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.breed}</p>
                      <p className="text-xs text-gray-500">{patient.clientName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Medical History Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPatient ? (
            <>
              {/* Patient Info */}
              <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-pink-600" />
                    Historia Clínica - {selectedPatient.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Especie</p>
                      <p className="font-semibold">{selectedPatient.species}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Raza</p>
                      <p className="font-semibold">{selectedPatient.breed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Edad</p>
                      <p className="font-semibold">{selectedPatient.age} años</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Peso Actual</p>
                      <p className="font-semibold">{selectedPatient.weight} kg</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-700">
                      <strong>Propietario:</strong> {selectedPatient.clientName}
                    </p>
                    <p className="text-sm text-emerald-700">
                      <strong>Historia creada:</strong> {new Date(selectedPatient.medicalHistory.created).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Consultation Form */}
              {showConsultationForm && (
                <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle>Nueva Consulta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitConsultation} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="reason">Motivo de Consulta *</Label>
                          <Input
                            id="reason"
                            value={consultationForm.reason}
                            onChange={(e) => setConsultationForm({...consultationForm, reason: e.target.value})}
                            required
                            placeholder="Ej: Revisión rutinaria, Problema digestivo"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="weight">Peso (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            value={consultationForm.weight}
                            onChange={(e) => setConsultationForm({...consultationForm, weight: e.target.value})}
                            placeholder="Peso actual"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="temperature">Temperatura (°C)</Label>
                          <Input
                            id="temperature"
                            type="number"
                            step="0.1"
                            value={consultationForm.temperature}
                            onChange={(e) => setConsultationForm({...consultationForm, temperature: e.target.value})}
                            placeholder="Temperatura corporal"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="heartRate">Frecuencia Cardíaca (bpm)</Label>
                          <Input
                            id="heartRate"
                            type="number"
                            value={consultationForm.heartRate}
                            onChange={(e) => setConsultationForm({...consultationForm, heartRate: e.target.value})}
                            placeholder="Pulsaciones por minuto"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="diagnosis">Diagnóstico *</Label>
                        <Textarea
                          id="diagnosis"
                          value={consultationForm.diagnosis}
                          onChange={(e) => setConsultationForm({...consultationForm, diagnosis: e.target.value})}
                          required
                          placeholder="Descripción del diagnóstico"
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="treatment">Tratamiento *</Label>
                        <Textarea
                          id="treatment"
                          value={consultationForm.treatment}
                          onChange={(e) => setConsultationForm({...consultationForm, treatment: e.target.value})}
                          required
                          placeholder="Descripción del tratamiento y medicamentos"
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notas Adicionales</Label>
                        <Textarea
                          id="notes"
                          value={consultationForm.notes}
                          onChange={(e) => setConsultationForm({...consultationForm, notes: e.target.value})}
                          placeholder="Observaciones adicionales"
                          rows={2}
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowConsultationForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        >
                          Registrar Consulta
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Consultations History */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Historial de Consultas ({selectedPatient.medicalHistory.consultations.length})
                </h3>
                
                {selectedPatient.medicalHistory.consultations.map((consultation) => (
                  <Card key={consultation.id} className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{consultation.reason}</h4>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(consultation.date).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {consultation.veterinarian}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                          Consulta #{consultation.id}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Signos Vitales</h5>
                          <div className="space-y-1 text-sm">
                            <p><strong>Peso:</strong> {consultation.weight} kg</p>
                            <p><strong>Temperatura:</strong> {consultation.temperature} °C</p>
                            <p><strong>Freq. Cardíaca:</strong> {consultation.heartRate} bpm</p>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Diagnóstico</h5>
                          <p className="text-sm text-gray-700">{consultation.diagnosis}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Tratamiento</h5>
                          <p className="text-sm text-gray-700">{consultation.treatment}</p>
                        </div>
                      </div>
                      
                      {consultation.attachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Upload className="w-4 h-4 mr-1" />
                            Archivos Adjuntos
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {consultation.attachments.map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-sm">{file}</span>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {(user.role === 'veterinario' || user.role === 'admin') && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFileUpload(consultation.id)}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Adjuntar Archivo
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Selecciona un paciente
                </h3>
                <p className="text-gray-500">
                  Elige un paciente de la lista para ver su historia clínica completa
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
