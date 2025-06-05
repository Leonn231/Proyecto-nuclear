import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Edit, Trash2, Search, AlertTriangle, Calendar, TrendingDown, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';

const InventoryManagement = () => {
  const { inventory, setInventory, movements, setMovements } = useData();
  const [showForm, setShowForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: 'medicamento',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unitPrice: 0,
    supplier: '',
    batch: '',
    expiryDate: ''
  });

  const [movementData, setMovementData] = useState({
    productId: '',
    type: 'entrada',
    quantity: 0,
    reason: ''
  });

  const categories = [
    { value: 'medicamento', label: 'Medicamento' },
    { value: 'antibiotico', label: 'Antibiótico' },
    { value: 'vacuna', label: 'Vacuna' },
    { value: 'material', label: 'Material Médico' },
    { value: 'alimento', label: 'Alimento' },
    { value: 'otros', label: 'Otros' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setInventory(inventory.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, lastMovement: new Date().toISOString().split('T')[0] }
          : item
      ));
      toast.success('Producto actualizado correctamente');
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        lastMovement: new Date().toISOString().split('T')[0],
        movementType: 'entrada'
      };
      setInventory([...inventory, newItem]);
      toast.success('Producto agregado al inventario');
    }
    resetForm();
  };

  const handleMovement = (e) => {
    e.preventDefault();
    const product = inventory.find(item => item.id === parseInt(movementData.productId));
    
    if (!product) {
      toast.error('Producto no encontrado');
      return;
    }

    const newStock = movementData.type === 'entrada' 
      ? product.currentStock + Number(movementData.quantity)
      : product.currentStock - Number(movementData.quantity);

    if (newStock < 0) {
      toast.error('Stock insuficiente para la salida');
      return;
    }

    // Actualizar stock
    setInventory(inventory.map(item => 
      item.id === parseInt(movementData.productId)
        ? { 
            ...item, 
            currentStock: newStock,
            lastMovement: new Date().toISOString().split('T')[0],
            movementType: movementData.type
          }
        : item
    ));

    // Registrar movimiento
    const newMovement = {
      id: Date.now(),
      productId: parseInt(movementData.productId),
      productName: product.name,
      type: movementData.type,
      quantity: Number(movementData.quantity),
      date: new Date().toISOString().split('T')[0],
      reason: movementData.reason,
      user: 'Usuario Actual'
    };

    setMovements([newMovement, ...movements]);
    toast.success('Movimiento registrado correctamente');
    resetMovementForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'medicamento',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unitPrice: 0,
      supplier: '',
      batch: '',
      expiryDate: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const resetMovementForm = () => {
    setMovementData({
      productId: '',
      type: 'entrada',
      quantity: 0,
      reason: ''
    });
    setShowMovementForm(false);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (itemId) => {
    setInventory(inventory.filter(item => item.id !== itemId));
    toast.success('Producto eliminado del inventario');
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item) => {
    if (item.currentStock <= item.minStock) return 'critical';
    if (item.currentStock <= item.minStock * 1.5) return 'warning';
    return 'good';
  };

  const getStockBadgeColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'good': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'medicamento': return 'bg-blue-100 text-blue-800';
      case 'antibiotico': return 'bg-purple-100 text-purple-800';
      case 'vacuna': return 'bg-green-100 text-green-800';
      case 'material': return 'bg-orange-100 text-orange-800';
      case 'alimento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const criticalStock = inventory.filter(item => getStockStatus(item) === 'critical');
  const expiringItems = inventory.filter(item => {
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 30 && daysToExpiry >= 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="w-8 h-8 mr-3 text-emerald-600" />
            Control de Inventario
          </h2>
          <p className="text-gray-600 mt-1">Gestiona medicamentos, materiales e insumos veterinarios</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowMovementForm(true)}
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Registrar Movimiento
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {(criticalStock.length > 0 || expiringItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criticalStock.length > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    <h4 className="font-semibold text-red-800">Stock Crítico</h4>
                    <p className="text-sm text-red-600">{criticalStock.length} productos por debajo del mínimo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {expiringItems.length > 0 && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Próximos a Vencer</h4>
                    <p className="text-sm text-yellow-600">{expiringItems.length} productos vencen en 30 días</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nombre, proveedor o lote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Form */}
      {showForm && (
        <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2 text-emerald-600" />
              {editingItem ? 'Editar Producto' : 'Nuevo Producto'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentStock">Stock Actual *</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({...formData, currentStock: Number(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minStock">Stock Mínimo *</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData({...formData, minStock: Number(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxStock">Stock Máximo *</Label>
                <Input
                  id="maxStock"
                  type="number"
                  min="0"
                  value={formData.maxStock}
                  onChange={(e) => setFormData({...formData, maxStock: Number(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Precio Unitario *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({...formData, unitPrice: Number(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Proveedor *</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="batch">Lote *</Label>
                <Input
                  id="batch"
                  value={formData.batch}
                  onChange={(e) => setFormData({...formData, batch: e.target.value})}
                  required
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="expiryDate">Fecha de Vencimiento *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  {editingItem ? 'Actualizar' : 'Agregar'} Producto
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Movement Form */}
      {showMovementForm && (
        <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Registrar Movimiento de Inventario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMovement} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Producto *</Label>
                <Select
                  value={movementData.productId}
                  onValueChange={(value) => setMovementData({...movementData, productId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventory.map(item => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name} (Stock: {item.currentStock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Movimiento *</Label>
                <Select
                  value={movementData.type}
                  onValueChange={(value) => setMovementData({...movementData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="salida">Salida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={movementData.quantity}
                  onChange={(e) => setMovementData({...movementData, quantity: Number(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo *</Label>
                <Input
                  id="reason"
                  value={movementData.reason}
                  onChange={(e) => setMovementData({...movementData, reason: e.target.value})}
                  placeholder="Compra, venta, uso en consulta, etc."
                  required
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetMovementForm}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  Registrar Movimiento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Inventario ({filteredInventory.length} productos)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoría</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Precio</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vencimiento</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Lote: {item.batch}</p>
                          <p className="text-sm text-gray-500">{item.supplier}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getCategoryBadgeColor(item.category)}>
                          {categories.find(c => c.value === item.category)?.label}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <Badge className={getStockBadgeColor(stockStatus)}>
                            {item.currentStock} unidades
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Min: {item.minStock} | Max: {item.maxStock}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">
                          {new Date(item.expiryDate).toLocaleDateString('es-ES')}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Movements */}
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-blue-600" />
            Movimientos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movements.slice(0, 5).map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${movement.type === 'entrada' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {movement.type === 'entrada' ? 
                      <TrendingUp className="w-4 h-4 text-green-600" /> : 
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{movement.productName}</p>
                    <p className="text-sm text-gray-600">{movement.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${movement.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {movement.type === 'entrada' ? '+' : '-'}{movement.quantity}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(movement.date).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
