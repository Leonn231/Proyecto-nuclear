
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, PieChart, Download, Calendar, TrendingUp, Users, Heart, Activity } from 'lucide-react';
import { toast } from 'sonner';

const Reports = () => {
  const [reportType, setReportType] = useState('services');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-03-31');
  const [selectedVet, setSelectedVet] = useState('all');

  const veterinarians = ['all', 'Dr. Carlos Rodríguez', 'Dra. María González', 'Dr. Luis Martín'];
  
  const reportTypes = [
    { value: 'services', label: 'Servicios Realizados', icon: Activity },
    { value: 'patients', label: 'Pacientes Atendidos', icon: Heart },
    { value: 'appointments', label: 'Citas Programadas', icon: Calendar },
    { value: 'revenue', label: 'Ingresos', icon: TrendingUp },
    { value: 'veterinarians', label: 'Rendimiento Veterinarios', icon: Users }
  ];

  // Datos de ejemplo para los reportes
  const mockData = {
    services: {
      total: 156,
      data: [
        { name: 'Consultas Generales', value: 65, percentage: 41.7 },
        { name: 'Vacunaciones', value: 34, percentage: 21.8 },
        { name: 'Cirugías Menores', value: 23, percentage: 14.7 },
        { name: 'Emergencias', value: 18, percentage: 11.5 },
        { name: 'Controles Post-op', value: 16, percentage: 10.3 }
      ]
    },
    patients: {
      total: 89,
      data: [
        { name: 'Perros', value: 52, percentage: 58.4 },
        { name: 'Gatos', value: 28, percentage: 31.5 },
        { name: 'Conejos', value: 6, percentage: 6.7 },
        { name: 'Aves', value: 2, percentage: 2.2 },
        { name: 'Otros', value: 1, percentage: 1.1 }
      ]
    },
    appointments: {
      total: 178,
      data: [
        { name: 'Completadas', value: 134, percentage: 75.3 },
        { name: 'Canceladas', value: 24, percentage: 13.5 },
        { name: 'No Asistieron', value: 20, percentage: 11.2 }
      ]
    },
    revenue: {
      total: '€12,450',
      data: [
        { month: 'Enero', value: 3200 },
        { month: 'Febrero', value: 4100 },
        { month: 'Marzo', value: 5150 }
      ]
    },
    veterinarians: {
      data: [
        { name: 'Dr. Carlos Rodríguez', patients: 45, consultations: 78, rating: 4.8 },
        { name: 'Dra. María González', patients: 38, consultations: 65, rating: 4.9 },
        { name: 'Dr. Luis Martín', patients: 32, consultations: 54, rating: 4.7 }
      ]
    }
  };

  const handleGenerateReport = () => {
    toast.success(`Reporte de ${reportTypes.find(r => r.value === reportType)?.label} generado correctamente`);
  };

  const handleExportData = (format) => {
    toast.success(`Datos exportados en formato ${format.toUpperCase()}`);
  };

  const getCurrentData = () => {
    return mockData[reportType] || mockData.services;
  };

  const renderChart = () => {
    const data = getCurrentData();
    
    if (reportType === 'revenue') {
      return (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Ingresos por Mes</h4>
          <div className="space-y-2">
            {data.data.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{item.month}</span>
                <span className="text-lg font-bold text-emerald-600">€{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-emerald-600">{data.total}</span>
            </div>
          </div>
        </div>
      );
    }
    
    if (reportType === 'veterinarians') {
      return (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Rendimiento por Veterinario</h4>
          <div className="space-y-4">
            {data.data.map((vet, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-4">
                  <h5 className="font-semibold text-gray-900">{vet.name}</h5>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-gray-600">Pacientes</p>
                      <p className="text-xl font-bold text-blue-600">{vet.patients}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Consultas</p>
                      <p className="text-xl font-bold text-green-600">{vet.consultations}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Calificación</p>
                      <p className="text-xl font-bold text-yellow-600">{vet.rating}/5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Distribución de {reportTypes.find(r => r.value === reportType)?.label}</h4>
        <div className="space-y-2">
          {data.data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span>{item.value} ({item.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-emerald-600">{data.total}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart className="w-8 h-8 mr-3 text-emerald-600" />
            Reportes y Estadísticas
          </h2>
          <p className="text-gray-600 mt-1">Genera reportes y analiza el rendimiento de la clínica</p>
        </div>
        <Button
          onClick={handleGenerateReport}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Generar Reporte
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Filtros de Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 mr-2" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Fecha Desde</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateTo">Fecha Hasta</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="veterinarian">Veterinario</Label>
              <Select value={selectedVet} onValueChange={setSelectedVet}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los veterinarios</SelectItem>
                  {veterinarians.slice(1).map(vet => (
                    <SelectItem key={vet} value={vet}>{vet}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart/Data Visualization */}
        <div className="lg:col-span-2">
          <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                {reportTypes.find(r => r.value === reportType)?.icon && 
                  (() => {
                    const Icon = reportTypes.find(r => r.value === reportType).icon;
                    return <Icon className="w-5 h-5 mr-2 text-emerald-600" />;
                  })()
                }
                {reportTypes.find(r => r.value === reportType)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderChart()}
            </CardContent>
          </Card>
        </div>

        {/* Summary and Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Resumen del Período</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Desde:</span>
                  <span className="font-semibold">{new Date(dateFrom).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hasta:</span>
                  <span className="font-semibold">{new Date(dateTo).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Veterinario:</span>
                  <span className="font-semibold">{selectedVet === 'all' ? 'Todos' : selectedVet}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Opciones de Exportación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleExportData('pdf')}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar a PDF
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleExportData('excel')}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar a Excel
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleExportData('csv')}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar a CSV
              </Button>
            </CardContent>
          </Card>

          {/* Report Templates */}
          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Reportes Predefinidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm">
                📊 Reporte Mensual Completo
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                📈 Análisis de Productividad
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                💰 Reporte Financiero
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                🐾 Estadísticas de Pacientes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">89</h3>
            <p className="text-blue-100">Pacientes Atendidos</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">156</h3>
            <p className="text-green-100">Servicios Realizados</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">178</h3>
            <p className="text-purple-100">Citas Programadas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">€12.4K</h3>
            <p className="text-yellow-100">Ingresos Totales</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
