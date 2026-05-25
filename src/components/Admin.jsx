import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioLibro from '../components/FormularioLibro';
import { Edit, Trash2, Plus, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const Admin = () => {
  const [libros, setLibros] = useState([]);
  const [libroEdit, setLibroEdit] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    fetchLibros();
  }, []);

  const handleEditarClick = (libro) => {
    setLibroEdit(libro);
    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchLibros = async () => {
    try {
      const res = await axios.get(`${API}/api/libros`);
      setLibros(res.data);
    } catch (error) {
      console.error("Error cargando libros:", error);
    }
  };

  const handleSave = async (libroData) => {
    try {
      if (libroData.idLibro) {
        await axios.put(`${API}/api/libros/${libroData.idLibro}`, libroData);
      } else {
        await axios.post(`${API}/api/libros`, libroData);
      }
      cerrarFormulario();
      fetchLibros();
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  const cerrarFormulario = () => {
    setLibroEdit(null);
    setMostrarForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Gestión de Inventario</h1>
            <p className="text-gray-500">Administra los libros de tu Biblioteca 2.0</p>
          </div>
          
          {!mostrarForm && (
            <button 
              onClick={() => setMostrarForm(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              <Plus size={20} /> Agregar Nuevo Libro
            </button>
          )}
        </div>

        {mostrarForm && (
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-end mb-2">
              <button onClick={cerrarFormulario} className="text-gray-400 hover:text-red-500 flex items-center gap-1 text-sm font-medium">
                <X size={18} /> Cerrar formulario
              </button>
            </div>
            <FormularioLibro 
              libroEdit={libroEdit} 
              onSave={handleSave} 
              onCancel={cerrarFormulario} 
            />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Portada</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Información</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Stock / Precio</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {libros.map((libro) => (
                <tr key={libro.idLibro} className="hover:bg-indigo-50/30 transition">
                  <td className="px-6 py-4 text-sm">
                    <img src={libro.imagen} alt="Portada" className="w-12 h-16 object-cover rounded shadow-sm" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{libro.titulo}</div>
                    <div className="text-gray-500 text-xs">{libro.autor}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm"><span className="font-medium">Stock:</span> {libro.stock}</div>
                    <div className="text-indigo-600 font-bold">S/ {libro.precio}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleEditarClick(libro)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {libros.length === 0 && (
            <div className="p-10 text-center text-gray-400">No hay libros registrados en la base de datos.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;