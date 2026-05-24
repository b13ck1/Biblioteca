import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { OrbitProgress } from 'react-loading-indicators';

// Evalúa la fortaleza de la contraseña: 0-4
const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return score;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  return score;
};

const strengthLabels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];

// Input de contraseña con ojo toggle
const PasswordInput = ({ name, value, onChange, placeholder, required }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative w-full">
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-4 pr-12 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 border border-transparent focus:border-indigo-300"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
        tabIndex={-1}
        aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {show ? (
          // Ojo tachado
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          // Ojo normal
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  );
};

const Registro = () => {
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

const showToast = (message, type = 'success') => {
  setToast({ visible: true, message, type });
  setTimeout(() => setToast({ visible: false, message: '', type: '' }), 5000);
};
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: '',
    direccion: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await axios.post('http://localhost:3000/api/register/start', formData);
      showToast('¡Registro completo! Bienvenido a la biblioteca.');
    } catch (err) {
      showToast('Código reenviado con éxito.');
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStartRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden. Por favor, verifícalas.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/register/start', formData);
      if (response.data.success) {
        setLoading(false);
        setShowModal(true);
      }
    } catch (err) {
      setLoading(false);
      const mensajeError = err.response?.data?.message || 'Servidor no responde';
      setError(mensajeError);
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axios.post('http://localhost:3000/api/register/verify', {
        correo: formData.correo,
        codigoIngresado: codigoIngresado,
      });
      alert('¡Registro completo! Bienvenido a la biblioteca.');
      navigate('/login');
    } catch (err) {
      setError('Código incorrecto o expirado.');
    }
  };
  {toast.visible && (
  <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl text-white font-semibold text-sm transition-all duration-300 ${
    toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`}>
    <span>{toast.type === 'success' ? '✓' : '⚠️'} {toast.message}</span>
    <button
      onClick={() => setToast({ visible: false, message: '', type: '' })}
      className="ml-2 text-white/70 hover:text-white transition-colors font-bold text-lg leading-none"
    >
      ✕
    </button>
  </div>
)}

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 flex justify-center px-4 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8 text-center">
          Crear <span className="text-indigo-600">Cuenta</span>
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold border-l-4 border-red-500">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleStartRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre y Apellido */}
          <input
            type="text" name="nombre" placeholder="Nombre"
            onChange={handleChange}
            className="p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 border border-transparent focus:border-indigo-300"
            required
          />
          <input
            type="text" name="apellido" placeholder="Apellido"
            onChange={handleChange}
            className="p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 border border-transparent focus:border-indigo-300"
            required
          />

          {/* Correo */}
          <input
            type="email" name="correo" placeholder="Correo electrónico"
            onChange={handleChange}
            className="md:col-span-2 p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 border border-transparent focus:border-indigo-300"
            required
          />

          {/* Contraseña con medidor de fuerza */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
            />
            {/* Medidor de fortaleza — solo aparece cuando hay texto */}
            {formData.password.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="h-1.5 flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          passwordStrength >= level
                            ? strengthColors[passwordStrength]
                            : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
                <p
                  className="text-xs font-bold"
                  style={{ color: strengthColors[passwordStrength] }}
                >
                  {strengthLabels[passwordStrength]}
                </p>
              </div>
            )}
            {/* Sugerencias compactas debajo */}
            <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-gray-400 pl-1 mt-1">
              <li className={`flex items-center gap-1 ${/[a-z]/.test(formData.password) ? 'text-green-500' : ''}`}>
                <span>{/[a-z]/.test(formData.password) ? '✓' : '·'}</span> Al menos una minúscula
              </li>
              <li className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}`}>
                <span>{/[A-Z]/.test(formData.password) ? '✓' : '·'}</span> Al menos una mayúscula
              </li>
              <li className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-500' : ''}`}>
                <span>{/[0-9]/.test(formData.password) ? '✓' : '·'}</span> Al menos un número
              </li>
              <li className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-500' : ''}`}>
                <span>{formData.password.length >= 8 ? '✓' : '·'}</span> Mínimo 8 caracteres
              </li>
            </ul>
          </div>

          {/* Confirmar contraseña */}
          <div className="md:col-span-2">
            <PasswordInput
              name="confirmarPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar Contraseña"
              required
            />
            {/* Indicador de coincidencia */}
            {confirmPassword.length > 0 && (
              <p className={`text-xs font-bold mt-1.5 ml-1 ${formData.password === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                {formData.password === confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
              </p>
            )}
          </div>

          {/* Teléfono y Dirección */}
          <input
            type="text" name="telefono" maxLength={9} placeholder="Teléfono / Celular"
            onChange={handleChange}
            className="p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 border border-transparent focus:border-indigo-300"
            required
          />
          <input
            type="text" name="direccion" placeholder="Dirección de envío"
            onChange={handleChange}
            className="p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 border border-transparent focus:border-indigo-300"
            required
          />

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 mt-4 bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center disabled:opacity-70"
          >
            {loading ? (
              <OrbitProgress variant="split-disc" color="#eeeeee" size="medium" text="" textColor="" />
            ) : (
              'Verificar Correo'
            )}
          </button>

          <p className="md:col-span-2 mt-4 text-center text-gray-500 font-medium text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-indigo-600 font-black hover:underline transition-all">
              Inicia sesión aquí
            </Link>
          </p>
        </form>
      </div>

      {/* Modal de verificación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-black uppercase mb-2 italic">Revisa tu e-mail</h3>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              Hemos enviado un código a <br />
              <span className="text-indigo-600 font-bold">{formData.correo}</span>
            </p>

            <input
              type="text" maxLength="6" placeholder="000000"
              className="w-full text-center text-4xl font-black tracking-[0.4em] p-4 bg-gray-50 rounded-2xl mb-6 outline-none border-2 border-indigo-100 focus:border-indigo-600"
              onChange={(e) => setCodigoIngresado(e.target.value)}
            />

            <button
              onClick={handleVerifyCode}
              className="w-full bg-green-500 text-white py-4 rounded-2xl font-black uppercase hover:bg-green-600 transition-all shadow-lg shadow-green-100 mb-4"
            >
              Confirmar y Registrar
            </button>

            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors disabled:opacity-50"
            >
              {isResending ? 'Enviando...' : '¿No recibiste el código? Reenviar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registro;