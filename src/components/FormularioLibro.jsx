import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const FormularioLibro = ({ libroEdit, onSave, onCancel }) => {
  const [libro, setLibro] = useState({
    idProveedor: 1,
    titulo: '',
    autor: '',
    descripcion: '',
    idGenero: '',
    stock: 0,
    precio: 0,
    imagen: ''
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [generos, setGeneros] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/generos`)
      .then(res => setGeneros(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (libroEdit) {
      setLibro(libroEdit);
    }
  }, [libroEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLibro({ ...libro, [name]: value });
  };

  const uploadImageToCloudinary = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'biblioteca_preset');
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dsybrm0a6/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let finalImageUrl = libro.imagen;
    if (file) {
      const uploadedUrl = await uploadImageToCloudinary();
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    onSave({ ...libro, imagen: finalImageUrl });
    setUploading(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {libroEdit ? '📝 Editar Libro' : '📚 Registrar Nuevo Libro'}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input type="text" name="titulo" value={libro.titulo} onChange={handleChange} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 bg-gray-50" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Autor</label>
          <input type="text" name="autor" value={libro.autor} onChange={handleChange} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 bg-gray-50" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Género</label>
          <select name="idGenero" value={libro.idGenero} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 p-2 bg-gray-50">
            <option value="">Seleccione un género</option>
            {generos.map(g => (
              <option key={g.idGenero} value={g.idGenero}>{g.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Precio (S/)</label>
          <input type="number" step="0.01" name="precio" value={libro.precio} onChange={handleChange} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 bg-gray-50" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input type="number" name="stock" value={libro.stock} onChange={handleChange} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 bg-gray-50" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Portada del Libro</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          {libro.imagen && !file && (
            <p className="text-xs text-gray-400 mt-2 italic">Ya tiene una imagen registrada.</p>
          )}
        </div>

        <div className="md:col-span-2 mt-4 flex gap-3">
          <button type="submit" disabled={uploading}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:bg-gray-400">
            {uploading ? '🔄 Procesando...' : (libroEdit ? 'Actualizar Cambios' : 'Guardar Libro')}
          </button>
          {libroEdit && (
            <button type="button" onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormularioLibro;