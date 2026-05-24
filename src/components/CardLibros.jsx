import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; // 👈 Solo importamos tu hook personalizado
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const CardLibros = ({ libro }) => {
  // 💡 EXTRAEMOS TODO DE TU HOOK: addToCart, toggleFavorito y tu lista global de favoritos
  const { addToCart, toggleFavorito, favoritos , esFavorito } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Verificamos si este libro específico ya está guardado en tu arreglo de favoritos
  const esFavoritoActivo = esFavorito(libro.idLibro);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    
    const result = await addToCart(libro);
    if (result?.success) {
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1500);
    }
  };

  

  const handleToggleFavorito = async (e) => {
    e.preventDefault(); // Evita que se abra el detalle del libro al darle clic al corazón
    if (!user) { navigate('/login'); return; }
    await toggleFavorito(libro.idLibro);
  };

  return (
    <div className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative p-4">
      
      <Link to={`/libro/${libro.idLibro}`} className="flex flex-col flex-grow">
        
        {/* Contenedor de Imagen */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-50 rounded-2xl">
          <img
            src={libro.imagen}
            alt={libro.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {libro.genero && (
            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider">
              {libro.genero}
            </span>
          )}

          {/* BOTÓN FAVORITO (CORAZÓN DINÁMICO) */}
          <button
            onClick={handleToggleFavorito}
            className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full shadow-md transition-all duration-300 hover:scale-110 active:scale-95 z-10 ${
              esFavoritoActivo 
                ? 'bg-red-500 text-white shadow-red-100' 
                : 'bg-white/90 text-gray-400 hover:text-red-500'
            }`}
            title={esFavoritoActivo ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              viewBox="0 0 24 24"
              fill={esFavoritoActivo ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>
        </div>

        {/* Información del Libro */}
        <div className="p-4 pt-5 flex flex-col flex-grow">
          <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 mb-1 min-h-[3rem]">
            {libro.titulo}
          </h3>
          <p className="text-gray-400 text-sm font-medium italic mt-1">{libro.autor}</p>
        </div>
      </Link>

      {/* Footer — Precio y Botón de Carrito */}
      <div className="p-4 pt-0">
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Precio</span>
            <span className="text-xl font-black text-indigo-600">
              S/ {Number(libro.precio).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-3 rounded-xl transition-all duration-200 shadow-lg hover:scale-110 active:scale-95 ${
              addedFeedback
                ? 'bg-green-500 shadow-green-100 shadow-md'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
            } text-white`}
            title="Añadir al carrito"
          >
            {addedFeedback ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default CardLibros;