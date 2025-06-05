
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Receipt, Plus, Edit, Trash2, Search, DollarSign, FileText, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const BillingManagement = () => {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: 'FAC-2024-001',
      clientName: 'Ana García',
      clientId: 1,
      petName: 'Luna',
      date: '2024-01-22',
      dueDate: '2024-02-22',
      services: [
        { id: 1, name: 'Consulta General', price: 25.00, quantity: 1 },
        { id: 2, name: 'Vacuna Antirábica', price: 12.00, quantity: 1 }
      ],
      products: [
        { id: 1, name: 'Antiparasitario', price: 8.50, quantity: 1 }
      ],
      subtotal: 45.50,
      discount: 0,
      tax: 4.55,
      total: 50.05,
      status: 'paid',
      paymentMethod: 'efectivo',
      paymentDate: '2024-01-22'
    },
    {
      id: 2,
      invoiceNumber: 'FAC-2024-002',
      clientName: 'Carlos López',
      clientId: 2,
      petName: 'Max',
      date: '2024-01-20',
      dueDate: '2024-02-20',
      services: [
        { id: 3, name: 'Cirugía Menor', price: 150.00, quantity: 1 },
        { id: 4, name: 'Anestesia', price: 30.00, quantity: 1 }
      ],
      products: [
        { id: 2, name: 'Antibiótico', price: 15.00, quantity: 2 }
      ],
      subtotal: 210.00,
      discount: 10.50,
      tax: 19.95,
      total: 219.45,
      status: 'pending',
      paymentMethod: null,
      paymentDate: null
    }
  ]);

  const [payments, setPayments] = useState([
    {
      id: 1,
      invoiceId: 1,
      invoiceNumber: 'FAC-2024-001',
      amount: 50.05,
      method: 'efectivo',
      date: '2024-01-22',
      reference: 'EF-001'
    }
  ]);

  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [invoiceData, setInvoiceData] = useState({
    clientId: '',
    clientName: '',
    petName: '',
    services: [],
    products: [],
    discount: 0,
    paymentMethod: 'efectivo'
  });

  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method: 'efectivo',
    reference: ''
  });

  const availableServices = [
    { id: 1, name: 'Consulta General', price: 25.00 },
    { id: 2, name: 'Consulta Especializada', price: 40.00 },
    { id: 3, name: 'Vacunación', price: 12.00 },
    { id: 4, name: 'Desparasitación', price: 15.00 },
    { id: 5, name: 'Cirugía Menor', price: 150.00 },
    { id: 6, name: 'Cirugía Mayor', price: 300.00 },
    { id: 7, name: 'Radiografía', price: 35.00 },
    { id: 8, name: 'Análisis de Sangre', price: 25.00 },
    { id: 9, name: 'Hospitalización (día)', price: 45.00 },
    { id: 10, name: 'Grooming', price: 20.00 }
  ];

  const availableProducts = [
    { id: 1, name: 'Antiparasitario', price: 8.50 },
    { id: 2, name: 'Antibiótico', price: 15.00 },
    { id: 3, name: 'Vitaminas', price: 12.00 },
    { id: 4, name: 'Shampoo Medicado', price: 18.00 },
    { id: 5, name: 'Collar Antiparasitario', price: 25.00 }
  ];

  const clients = [
    { id: 1, name: 'Ana García', pets: ['Luna', 'Toby'] },
    { id: 2, name: 'Carlos López', pets: ['Max'] },
    { id: 3, name: 'María Fernández', pets: ['Bella', 'Rocky', 'Mia'] }
  ];

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    
    const subtotal = [...invoiceData.services, ...invoiceData.products]
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * invoiceData.discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * 0.1; // 10% tax
    const total = taxableAmount + tax;

    const newInvoice = {
      id: Date.now(),
      invoiceNumber: `FAC-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: invoiceData.clientName,
      clientId: parseInt(invoiceData.clientId),
      petName: invoiceData.petName,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      services: invoiceData.services,
      products: invoiceData.products,
      subtotal: subtotal,
      discount: discountAmount,
      tax: tax,
      total: total,
      status: 'pending',
      paymentMethod: null,
      paymentDate: null
    };

    setInvoices([newInvoice, ...invoices]);
    toast.success('Factura creada correctamente');
    resetInvoiceForm();
  };

  const handlePayment = (e) => {
    e.preventDefault();
    
    const invoice = invoices.find(inv => inv.id === selectedInvoiceForPayment.id);
    if (!invoice) return;

    // Update invoice status
    setInvoices(invoices.map(inv => 
      inv.id === selectedInvoiceForPayment.id
        ? { 
            ...inv, 
            status: 'paid',
            paymentMethod: paymentData.method,
            paymentDate: new Date().toISOString().split('T')[0]
          }
        : inv
    ));

    // Add payment record
    const newPayment = {
      id: Date.now(),
      invoiceId: selectedInvoiceForPayment.id,
      invoiceNumber: selectedInvoiceForPayment.invoiceNumber,
      amount: paymentData.amount,
      method: paymentData.method,
      date: new Date().toISOString().split('T')[0],
      reference: paymentData.reference || `${paymentData.method.toUpperCase()}-${Date.now()}`
    };

    setPayments([newPayment, ...payments]);
    toast.success('Pago registrado correctamente');
    resetPaymentForm();
  };

  const resetInvoiceForm = () => {
    setInvoiceData({
      clientId: '',
      clientName: '',
      petName: '',
      services: [],
      products: [],
      discount: 0,
      paymentMethod: 'efectivo'
    });
    setEditingInvoice(null);
    setShowInvoiceForm(false);
  };

  const resetPaymentForm = () => {
    setPaymentData({
      amount: 0,
      method: 'efectivo',
      reference: ''
    });
    setSelectedInvoiceForPayment(null);
    setShowPaymentForm(false);
  };

  const addServiceToInvoice = (serviceId) => {
    const service = availableServices.find(s => s.id === parseInt(serviceId));
    if (service && !invoiceData.services.find(s => s.id === service.id)) {
      setInvoiceData({
        ...invoiceData,
        services: [...invoiceData.services, { ...service, quantity: 1 }]
      });
    }
  };

  const addProductToInvoice = (productId) => {
    const product = availableProducts.find(p => p.id === parseInt(productId));
    if (product && !invoiceData.products.find(p => p.id === product.id)) {
      setInvoiceData({
        ...invoiceData,
        products: [...invoiceData.products, { ...product, quantity: 1 }]
      });
    }
  };

  const removeServiceFromInvoice = (serviceId) => {
    setInvoiceData({
      ...invoiceData,
      services: invoiceData.services.filter(s => s.id !== serviceId)
    });
  };

  const removeProductFromInvoice = (productId) => {
    setInvoiceData({
      ...invoiceData,
      products: invoiceData.products.filter(p => p.id !== productId)
    });
  };

  const updateServiceQuantity = (serviceId, quantity) => {
    setInvoiceData({
      ...invoiceData,
      services: invoiceData.services.map(s => 
        s.id === serviceId ? { ...s, quantity: Math.max(1, quantity) } : s
      )
    });
  };

  const updateProductQuantity = (productId, quantity) => {
    setInvoiceData({
      ...invoiceData,
      products: invoiceData.products.map(p => 
        p.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
      )
    });
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.petName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid': return 'Pagada';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencida';
      default: return 'Desconocido';
    }
  };

  const calculateInvoiceTotal = () => {
    const subtotal = [...invoiceData.services, ...invoiceData.products]
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * invoiceData.discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * 0.1;
    return {
      subtotal,
      discountAmount,
      tax,
      total: taxableAmount + tax
    };
  };

  const totals = calculateInvoiceTotal();

  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Receipt className="w-8 h-8 mr-3 text-emerald-600" />
            Facturación y Pagos
          </h2>
          <p className="text-gray-600 mt-1">Gestiona facturas, pagos y control financiero</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowPaymentForm(true)}
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Registrar Pago
          </Button>
          <Button
            onClick={() => setShowInvoiceForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100">Ingresos Totales</p>
                <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-emerald-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Pendiente de Cobro</p>
                <p className="text-3xl font-bold">${pendingAmount.toFixed(2)}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-yellow-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Facturas del Mes</p>
                <p className="text-3xl font-bold">{invoices.length}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por número, cliente o mascota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="paid">Pagadas</SelectItem>
                <SelectItem value="overdue">Vencidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Form */}
      {showInvoiceForm && (
        <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-emerald-600" />
              Nueva Factura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateInvoice} className="space-y-6">
              {/* Client Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Cliente *</Label>
                  <Select
                    value={invoiceData.clientId}
                    onValueChange={(value) => {
                      const client = clients.find(c => c.id === parseInt(value));
                      setInvoiceData({
                        ...invoiceData,
                        clientId: value,
                        clientName: client ? client.name : '',
                        petName: ''
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="petName">Mascota *</Label>
                  <Select
                    value={invoiceData.petName}
                    onValueChange={(value) => setInvoiceData({...invoiceData, petName: value})}
                    disabled={!invoiceData.clientId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar mascota" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoiceData.clientId && clients.find(c => c.id === parseInt(invoiceData.clientId))?.pets.map(pet => (
                        <SelectItem key={pet} value={pet}>
                          {pet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount">Descuento (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={invoiceData.discount}
                    onChange={(e) => setInvoiceData({...invoiceData, discount: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              {/* Services Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Servicios</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select onValueChange={addServiceToInvoice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Agregar servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableServices.filter(s => !invoiceData.services.find(is => is.id === s.id)).map(service => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name} - ${service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {invoiceData.services.map(service => (
                  <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{service.name}</p>
                      <p className="text-sm text-gray-600">${service.price} c/u</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="1"
                        value={service.quantity}
                        onChange={(e) => updateServiceQuantity(service.id, parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                      <p className="w-20 text-right font-semibold">${(service.price * service.quantity).toFixed(2)}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeServiceFromInvoice(service.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Products Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Productos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select onValueChange={addProductToInvoice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Agregar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.filter(p => !invoiceData.products.find(ip => ip.id === p.id)).map(product => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} - ${product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {invoiceData.products.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price} c/u</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                      <p className="w-20 text-right font-semibold">${(product.price * product.quantity).toFixed(2)}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProductFromInvoice(product.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoice Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Descuento ({invoiceData.discount}%):</span>
                  <span>-${totals.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos (10%):</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetInvoiceForm}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!invoiceData.clientId || !invoiceData.petName || (invoiceData.services.length === 0 && invoiceData.products.length === 0)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  Crear Factura
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Payment Form */}
      {showPaymentForm && (
        <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
              Registrar Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice">Factura *</Label>
                  <Select
                    value={selectedInvoiceForPayment?.id?.toString() || ''}
                    onValueChange={(value) => {
                      const invoice = invoices.find(inv => inv.id === parseInt(value));
                      setSelectedInvoiceForPayment(invoice);
                      setPaymentData({...paymentData, amount: invoice ? invoice.total : 0});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar factura pendiente" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoices.filter(inv => inv.status === 'pending').map(invoice => (
                        <SelectItem key={invoice.id} value={invoice.id.toString()}>
                          {invoice.invoiceNumber} - {invoice.clientName} - ${invoice.total.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="method">Método de Pago *</Label>
                  <Select
                    value={paymentData.method}
                    onValueChange={(value) => setPaymentData({...paymentData, method: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference">Referencia</Label>
                  <Input
                    id="reference"
                    value={paymentData.reference}
                    onChange={(e) => setPaymentData({...paymentData, reference: e.target.value})}
                    placeholder="Número de transacción, cheque, etc."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetPaymentForm}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedInvoiceForPayment || paymentData.amount <= 0}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  Registrar Pago
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Invoices Table */}
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Facturas ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Factura</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500">Mascota: {invoice.petName}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{invoice.clientName}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(invoice.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">${invoice.total.toFixed(2)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusBadgeColor(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {invoice.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedInvoiceForPayment(invoice);
                              setPaymentData({...paymentData, amount: invoice.total});
                              setShowPaymentForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <CreditCard className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info('Función de impresión pendiente de implementar')}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingManagement;
