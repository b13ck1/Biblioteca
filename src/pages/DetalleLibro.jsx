import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InfoBar from '../components/InfoBar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const DetalleLibro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleFavorito, esFavorito } = useCart();
  const { user } = useAuth();

  const [libro, setLibro] = useState(null);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/libros/${id}`);
        setLibro(res.data);
      } catch (error) {
        console.error('Error al cargar el detalle', error);
      }
    };
    fetchDetalle();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    const result = await addToCart(libro);
    if (result?.success) {
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1500);
    }
  };

  const handleToggleFavorito = async () => {
    if (!user) { navigate('/login'); return; }
    await toggleFavorito(libro.idLibro);
  };

  if (!libro) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const favorito = esFavorito(libro.idLibro);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-20 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Imagen */}
          <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-xl">
            <img
              src={libro.imagen}
              alt={libro.titulo}
              className="w-full h-full object-contain max-h-[600px]"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-6">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold w-fit uppercase">
              {libro.genero}
            </span>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              {libro.titulo}
            </h1>
            <p className="text-xl text-gray-500 italic">de {libro.autor}</p>

            <div className="text-3xl font-black text-indigo-600">
              S/ {Number(libro.precio).toFixed(2)}
            </div>

            <div className="border-t border-b py-6">
              <h3 className="font-bold text-gray-900 mb-2">Sinopsis</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{libro.descripcion}</p>
            </div>

            <div className="flex space-x-4">
              {/* Botón carrito */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 font-bold py-4 rounded-xl transition-all shadow-lg uppercase tracking-widest text-white ${
                  addedFeedback
                    ? 'bg-green-500 shadow-green-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {addedFeedback ? '✓ Agregado' : 'Agregar al carrito'}
              </button>

              {/* Botón favorito */}
              <button
                onClick={handleToggleFavorito}
                className={`p-4 border-2 rounded-xl transition-all ${
                  favorito
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-400 hover:text-red-500'
                }`}
                title={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24"
                  fill={favorito ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      <InfoBar />
    </>
  );
};

export default DetalleLibro;