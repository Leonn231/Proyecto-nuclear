
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Plus, Edit, Trash2, Search, Phone, Mail, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

const ClientManagement = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Ana García',
      document: '12345678A',
      phone: '666-123-456',
      email: 'ana.garcia@email.com',
      address: 'Calle Mayor 123, Madrid',
      pets: 2,
      registerDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Carlos López',
      document: '87654321B',
      phone: '666-789-123',
      email: 'carlos.lopez@email.com',
      address: 'Avenida de la Paz 45, Barcelona',
      pets: 1,
      registerDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'María Fernández',
      document: '11223344C',
      phone: '666-456-789',
      email: 'maria.fernandez@email.com',
      address: 'Plaza España 7, Valencia',
      pets: 3,
      registerDate: '2024-01-08'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    phone: '',
    email: '',
    address: '',
    pets: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar documento único
    const existingClient = clients.find(client => 
      client.document === formData.document && 
      client.id !== editingClient?.id
    );
    
    if (existingClient) {
      toast.error('Ya existe un cliente con este documento');
      return;
    }

    if (editingClient) {
      setClients(clients.map(client => 
        client.id === editingClient.id 
          ? { ...client, ...formData }
          : client
      ));
      toast.success('Cliente actualizado correctamente');
    } else {
      const newClient = {
        ...formData,
        id: Date.now(),
        registerDate: new Date().toISOString().split('T')[0],
        pets: 0
      };
      setClients([...clients, newClient]);
      toast.success('Cliente registrado correctamente');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      document: '',
      phone: '',
      email: '',
      address: '',
      pets: 0
    });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleEdit = (client) => {
    setFormData(client);
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = (clientId) => {
    setClients(clients.filter(client => client.id !== clientId));
    toast.success('Cliente eliminado correctamente');
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="w-8 h-8 mr-3 text-emerald-600" />
            Gestión de Propietarios
          </h2>
          <p className="text-gray-600 mt-1">Administra la información de los propietarios de mascotas</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Propietario
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, documento, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Client Form */}
      {showForm && (
        <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-emerald-600" />
              {editingClient ? 'Editar Propietario' : 'Nuevo Propietario'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Nombre y apellidos"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document">Documento de Identidad *</Label>
                <Input
                  id="document"
                  value={formData.document}
                  onChange={(e) => setFormData({...formData, document: e.target.value})}
                  required
                  placeholder="DNI/NIE/Pasaporte"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  placeholder="666-123-456"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="correo@ejemplo.com"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Dirección Completa *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  placeholder="Calle, número, ciudad, código postal"
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end space-x-2">
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
                  {editingClient ? 'Actualizar' : 'Registrar'} Propietario
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-gray-900">{client.name}</CardTitle>
                  <p className="text-sm text-gray-600">Doc: {client.document}</p>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {client.pets} {client.pets === 1 ? 'mascota' : 'mascotas'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-emerald-600" />
                  {client.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  {client.email}
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-red-600 flex-shrink-0" />
                  <span className="line-clamp-2">{client.address}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Registrado: {new Date(client.registerDate).toLocaleDateString('es-ES')}
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(client)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
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

      {filteredClients.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron propietarios</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza registrando un nuevo propietario'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Resumen de Propietarios</h3>
              <p className="text-emerald-100">Total registrados: {clients.length}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{clients.reduce((sum, client) => sum + client.pets, 0)}</p>
              <p className="text-emerald-100">Mascotas totales</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientManagement;
