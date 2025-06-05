
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle, Key } from 'lucide-react';
import { toast } from 'sonner';

const PasswordRecovery = ({ onBackToLogin }) => {
  const [step, setStep] = useState('email'); // 'email', 'code', 'reset'
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular envío de código
    setTimeout(() => {
      toast.success('Código de verificación enviado a tu correo');
      setStep('code');
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular verificación de código
    setTimeout(() => {
      if (verificationCode === '123456') {
        toast.success('Código verificado correctamente');
        setStep('reset');
      } else {
        toast.error('Código incorrecto');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    setIsLoading(true);
    
    // Simular cambio de contraseña
    setTimeout(() => {
      toast.success('Contraseña cambiada exitosamente');
      onBackToLogin();
      setIsLoading(false);
    }, 1500);
  };

  const renderEmailStep = () => (
    <form onSubmit={handleSendCode} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Recuperar Contraseña</h3>
        <p className="text-gray-600 mt-2">
          Ingresa tu correo electrónico y te enviaremos un código de verificación
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12"
          placeholder="usuario@ejemplo.com"
        />
      </div>
      
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
      >
        {isLoading ? 'Enviando...' : 'Enviar Código'}
      </Button>
    </form>
  );

  const renderCodeStep = () => (
    <form onSubmit={handleVerifyCode} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Verificar Código</h3>
        <p className="text-gray-600 mt-2">
          Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="code">Código de Verificación</Label>
        <Input
          id="code"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          maxLength={6}
          className="h-12 text-center text-2xl tracking-widest"
          placeholder="123456"
        />
        <p className="text-xs text-gray-500 text-center">
          Código de demostración: 123456
        </p>
      </div>
      
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
      >
        {isLoading ? 'Verificando...' : 'Verificar Código'}
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        onClick={() => setStep('email')}
        className="w-full text-blue-600 hover:text-blue-700"
      >
        Reenviar código
      </Button>
    </form>
  );

  const renderResetStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Nueva Contraseña</h3>
        <p className="text-gray-600 mt-2">
          Ingresa tu nueva contraseña
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nueva Contraseña</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          className="h-12"
          placeholder="Mínimo 8 caracteres"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="h-12"
          placeholder="Confirma tu nueva contraseña"
        />
      </div>
      
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
      >
        {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl border-0 animate-scale-in relative z-10">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToLogin}
              className="mr-2 p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Veterinaria Alexander Von Humboldt
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'email' && renderEmailStep()}
          {step === 'code' && renderCodeStep()}
          {step === 'reset' && renderResetStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordRecovery;
