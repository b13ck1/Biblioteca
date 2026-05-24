import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const Perfil = () => {
  const { user, login, logout } = useAuth();
  const { toggleFavorito } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('info');
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [librosFavoritos, setLibrosFavoritos] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(false);

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    correo: user?.correo || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        correo: user.correo || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        password: '',
      });
    }
  }, [user]);

  // Cargar favoritos al entrar a la pestaña
  useEffect(() => {
    if (activeTab === 'favoritos') fetchLibrosFavoritos();
  }, [activeTab]);

  const fetchLibrosFavoritos = async () => {
    setLoadingFavs(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('${import.meta.env.VITE_API_URL}/api/favoritos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibrosFavoritos(res.data);
    } catch (err) {
      console.error('Error al cargar favoritos:', err);
    } finally {
      setLoadingFavs(false);
    }
  };

  const handleQuitarFavorito = async (libro) => {
  // Soporta ambas capitalizaciones
  const id = libro.idLibro || libro.IdLibro;
  await toggleFavorito(id);
  setLibrosFavoritos(curr => curr.filter(f => (f.idLibro || f.IdLibro) !== id));
};

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: '' }), 5000);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('${import.meta.env.VITE_API_URL}/api/usuarios/actualizar', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        login({ ...user, ...formData }, token);
        setEditMode(false);
        setFormData(prev => ({ ...prev, password: '' }));
        showToast('¡Perfil actualizado correctamente!');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        showToast('Tu sesión ha expirado. Vuelve a iniciar sesión.', 'error');
        setTimeout(() => { logout(); navigate('/login'); }, 2000);
      } else {
        showToast('Error al actualizar los datos.', 'error');
      }
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      nombre: user?.nombre || '',
      correo: user?.correo || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || '',
      password: '',
    });
  };

  const inputClass = (enabled) =>
    `w-full px-4 py-3 rounded-xl text-sm border transition-all outline-none ${
      enabled
        ? 'bg-white border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
        : 'bg-gray-50 border-transparent text-gray-500 cursor-default'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
      <div className="max-w-2xl mx-auto">

        {/* Card superior — Avatar */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-4 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 mb-3 select-none">
            {user?.nombre?.charAt(0).toUpperCase() || '?'}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user?.nombre}</h2>
          <p className="text-sm text-gray-400">{user?.correo}</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-4">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'info'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Mi información
          </button>
          <button
            onClick={() => setActiveTab('favoritos')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'favoritos'
                ? 'bg-red-500 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <HeartIcon filled={activeTab === 'favoritos'} />
            Mis favoritos
          </button>
        </div>

        {/* Tab — Información */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Nombre</label>
                <input type="text" disabled={!editMode} value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  className={inputClass(editMode)} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Correo electrónico</label>
                <input type="email" disabled={!editMode} value={formData.correo}
                  onChange={e => setFormData({ ...formData, correo: e.target.value })}
                  className={inputClass(editMode)} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Teléfono</label>
                <input type="text" maxLength={9} disabled={!editMode} value={formData.telefono}
                  onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                  className={inputClass(editMode)} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Dirección</label>
                <input type="text" disabled={!editMode} value={formData.direccion}
                  onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                  className={inputClass(editMode)} />
              </div>

              {editMode && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-red-400 mb-1.5">
                    Nueva contraseña <span className="normal-case text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Dejar en blanco para no cambiar"
                      className="w-full px-4 py-3 pr-11 rounded-xl text-sm border border-red-100 bg-red-50 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors p-1" tabIndex={-1}>
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              {!editMode ? (
                <button onClick={() => setEditMode(true)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-100">
                  Editar información
                </button>
              ) : (
                <>
                  <button onClick={handleSave}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 active:scale-[0.98] transition-all shadow-md shadow-green-100">
                    Guardar cambios
                  </button>
                  <button onClick={handleCancel}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 active:scale-[0.98] transition-all">
                    Cancelar
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <button onClick={handleLogout}
                className="w-full py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        )}

        {/* Tab — Favoritos */}
        {activeTab === 'favoritos' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
              {librosFavoritos.length} {librosFavoritos.length === 1 ? 'libro guardado' : 'libros guardados'}
            </h3>

            {loadingFavs ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : librosFavoritos.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartIcon filled={false} />
                </div>
                <p className="text-gray-400 text-sm mb-4">Aún no tienes libros favoritos.</p>
                <Link to="/categorias"
                  className="text-indigo-600 font-semibold text-sm hover:underline">
                  Explorar libros →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {librosFavoritos.map(libro => (
                  <div key={libro.idLibro} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                    <Link to={`/libro/${libro.idLibro}`}>
                      <img src={libro.imagen} alt={libro.titulo}
                        className="w-14 h-20 object-cover rounded-xl shadow-sm flex-shrink-0" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/libro/${libro.idLibro}`}>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 hover:text-indigo-600 transition-colors">
                          {libro.titulo}
                        </h4>
                      </Link>
                      <p className="text-gray-400 text-xs italic mt-0.5">{libro.autor}</p>
                      <p className="text-indigo-600 font-black text-sm mt-1">
                        S/ {Number(libro.precio).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleQuitarFavorito(libro)}
                      className="text-red-300 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50 opacity-0 group-hover:opacity-100"
                      title="Quitar de favoritos"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast.visible && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <span>{toast.type === 'success' ? '✓' : '⚠️'} {toast.message}</span>
          <button onClick={() => setToast({ visible: false, message: '', type: '' })}
            className="ml-2 text-white/70 hover:text-white transition-colors font-bold text-lg leading-none">
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Perfil;