import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Carrito = () => {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart, loadingCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Usuario no logueado
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 font-medium mb-4">Debes iniciar sesión para ver tu carrito.</p>
          <Link to="/login" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loadingCart) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-2xl px-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tu <span className="text-indigo-600">carrito</span>
            {cartCount > 0 && (
              <span className="ml-3 text-sm font-semibold text-gray-400 normal-case">
                {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
              </span>
            )}
          </h1>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-400 hover:text-red-600 uppercase tracking-wider transition-colors"
            >
              Vaciar carrito
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium mb-6">Tu carrito está vacío.</p>
              <Link to="/categorias" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all">
                Explorar libros
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.idLibro} className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-gray-50 last:border-0">
                  <img
                    src={item.imagen}
                    alt={item.titulo}
                    className="w-20 h-28 object-cover rounded-xl shadow-sm flex-shrink-0"
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{item.titulo}</h3>
                    <p className="text-gray-400 text-sm italic mt-0.5">{item.autor}</p>
                    <p className="text-indigo-600 font-black mt-2 text-lg">
                      S/ {(Number(item.precio) * item.cantidad).toFixed(2)}
                    </p>

                    {/* Cantidad */}
                    <div className="flex items-center justify-center sm:justify-start mt-3 gap-3">
                      <button
                        onClick={() => updateQuantity(item.idLibro, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 font-bold transition-colors text-gray-600"
                      >−</button>
                      <span className="font-bold text-gray-700 w-6 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item.idLibro, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 font-bold transition-colors text-gray-600"
                      >+</button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.idLibro)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
                    title="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Total y botón */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-700">Total</span>
                  <span className="text-2xl font-black text-indigo-600">S/ {cartTotal.toFixed(2)}</span>
                </div>
                <button onClick={() => navigate('/checkout')}  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100">
                  Finalizar compra
                </button>
                <Link to="/categorias" className="block text-center mt-4 text-sm text-gray-400 hover:text-indigo-600 transition-colors font-medium">
                  ← Seguir comprando
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Carrito;