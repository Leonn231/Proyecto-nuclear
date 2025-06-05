
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import PasswordRecovery from './PasswordRecovery';

const LoginForm = ({ onLogin }) => {
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Usuarios de demostración
  const demoUsers = [
    { username: 'admin', password: 'admin123', name: 'Dr. María González', role: 'admin' },
    { username: 'vet1', password: 'vet123', name: 'Dr. Carlos Rodríguez', role: 'veterinario' },
    { username: 'recep1', password: 'recep123', name: 'Ana López', role: 'recepcionista' },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular autenticación
    setTimeout(() => {
      const user = demoUsers.find(
        u => u.username === username && u.password === password
      );

      if (user) {
        toast.success(`¡Bienvenido ${user.name}!`);
        onLogin(user);
      } else {
        toast.error('Credenciales inválidas');
      }
      setIsLoading(false);
    }, 1000);
  };

  if (showPasswordRecovery) {
    return <PasswordRecovery onBackToLogin={() => setShowPasswordRecovery(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20"></div>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl border-0 animate-scale-in">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Clinica Veterinaria Alexander Von Humboldt
          </CardTitle>
          <p className="text-gray-600 font-medium">Sistema Veterinario Integral</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                placeholder="Ingresa tu usuario"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl pr-12"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transform transition-transform hover:scale-105"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setShowPasswordRecovery(true)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </div>

          {/* Demo credentials */}
          <div className="bg-emerald-50 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-emerald-800 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Credenciales de demostración:
            </p>
            <div className="text-xs text-emerald-700 space-y-1">
              <div>Admin: admin / admin123</div>
              <div>Veterinario: vet1 / vet123</div>
              <div>Recepcionista: recep1 / recep123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
