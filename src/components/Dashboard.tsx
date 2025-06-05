
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Calendar, TrendingUp, Clock, Star, Activity, FileText } from 'lucide-react';

const Dashboard = ({ user }) => {
  const stats = [
    {
      title: "Pacientes Totales",
      value: "1,248",
      change: "+12%",
      icon: Heart,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Citas Hoy",
      value: "24",
      change: "+5",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Propietarios",
      value: "892",
      change: "+8%",
      icon: Users,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Consultas Mes",
      value: "156",
      change: "+18%",
      icon: Activity,
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const recentActivities = [
    {
      title: "Consulta - Max (Golden Retriever)",
      time: "Hace 10 min",
      doctor: "Dr. Carlos Rodríguez",
      type: "consulta"
    },
    {
      title: "Vacunación - Luna (Gato Persa)",
      time: "Hace 25 min",
      doctor: "Dra. María González",
      type: "vacuna"
    },
    {
      title: "Cirugía - Rocky (Bulldog)",
      time: "Hace 1 hora",
      doctor: "Dr. Carlos Rodríguez",
      type: "cirugia"
    },
    {
      title: "Control - Mimi (Conejo)",
      time: "Hace 2 horas",
      doctor: "Dra. María González",
      type: "control"
    }
  ];

  const upcomingAppointments = [
    {
      time: "09:00",
      patient: "Bella",
      owner: "Ana García",
      type: "Consulta General"
    },
    {
      time: "10:30",
      patient: "Rex",
      owner: "Carlos López",
      type: "Vacunación"
    },
    {
      time: "11:15",
      patient: "Nala",
      owner: "María Fernández",
      type: "Control Post-op"
    },
    {
      time: "14:00",
      patient: "Thor",
      owner: "José Martínez",
      type: "Cirugía Menor"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">¡Bienvenido, {user.name}!</h2>
        <p className="text-emerald-100 text-lg">
          {user.role === 'admin' && "Panel de administración - Gestiona todo el sistema"}
          {user.role === 'veterinario' && "Panel veterinario - Cuida a tus pacientes"}
          {user.role === 'recepcionista' && "Panel de recepción - Gestiona citas y clientes"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Activity className="w-5 h-5 mr-2 text-emerald-600" />
              Actividades Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'consulta' ? 'bg-blue-500' :
                    activity.type === 'vacuna' ? 'bg-green-500' :
                    activity.type === 'cirugia' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.doctor}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Próximas Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-lg font-semibold text-sm">
                    {appointment.time}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{appointment.patient}</p>
                    <p className="text-sm text-gray-600">{appointment.owner}</p>
                    <p className="text-xs text-blue-600 font-medium">{appointment.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-center transition-all duration-300 hover:scale-105">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Nuevo Paciente</p>
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-center transition-all duration-300 hover:scale-105">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Agendar Cita</p>
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-center transition-all duration-300 hover:scale-105">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Historia Clínica</p>
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-center transition-all duration-300 hover:scale-105">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Ver Propietarios</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
