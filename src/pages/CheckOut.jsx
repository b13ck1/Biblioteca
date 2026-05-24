import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '15px',
      color: '#1f2937',
      fontFamily: 'inherit',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
};

// ── Formulario interno ────────────────────────────────────────────────────────
const CheckoutForm = ({ cart, cartTotal, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { clearCart } = useCart();

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardComplete, setCardComplete] = useState(false);

  // Crear PaymentIntent al montar
  useEffect(() => {
    const crearIntent = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Llamando a:', '${import.meta.env.VITE_API_URL}/api/pago/crear-intent');
        const res = await axios.post(
          '${import.meta.env.VITE_API_URL}/api/pago/crear-intent',
          { total: cartTotal },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        setError('Error al iniciar el pago. Intenta de nuevo.');
      }
    };
    if (cartTotal > 0) crearIntent();
  }, [cartTotal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);
    setError('');

    // Confirmar pago con Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: user.nombre, email: user.correo },
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        const token = localStorage.getItem('token');
        const detalles = cart.map(item => ({
        idLibro: item.idLibro,
        cantidad: item.cantidad,
        precio: Number(item.precio),
        titulo: item.titulo, 
      }));

        await axios.post(
          '${import.meta.env.VITE_API_URL}/api/pago/confirmar',
          { paymentIntentId: paymentIntent.id, detalles, total: cartTotal },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        clearCart();
        onSuccess();
      } catch (err) {
        setError('Pago exitoso pero hubo un error al registrar la venta. Contacta soporte.');
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Datos del titular */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
          Nombre del titular
        </label>
        <input
          type="text"
          value={user?.nombre || ''}
          disabled
          className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border border-transparent text-gray-500 cursor-default outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
          Correo
        </label>
        <input
          type="email"
          value={user?.correo || ''}
          disabled
          className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border border-transparent text-gray-500 cursor-default outline-none"
        />
      </div>

      {/* Tarjeta Stripe */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
          Datos de la tarjeta
        </label>
        <div className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <CardElement options={CARD_STYLE} onChange={e => setCardComplete(e.complete)} />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Prueba: <span className="font-mono font-semibold">4242 4242 4242 4242</span> · cualquier fecha y CVC
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold border-l-4 border-red-400">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !clientSecret || !cardComplete || loading}
        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          `Pagar S/ ${cartTotal.toFixed(2)}`
        )}
      </button>

      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Pago seguro procesado por Stripe
      </p>
    </form>
  );
};

// ── Página principal ──────────────────────────────────────────────────────────
const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Tu carrito está vacío.</p>
          <Link to="/categorias" className="text-indigo-600 font-semibold hover:underline">
            Explorar libros →
          </Link>
        </div>
      </div>
    );
  }

  // Pantalla de éxito
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-12 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago exitoso!</h2>
          <p className="text-gray-400 text-sm mb-8">
            Tu compra fue procesada correctamente. Recibirás un correo con los detalles.
          </p>
          <Link
            to="/"
            className="block w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Resumen del pedido */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Resumen del pedido</h2>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.idLibro} className="flex items-center gap-4">
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="w-12 h-16 object-cover rounded-lg shadow-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.titulo}</p>
                  <p className="text-gray-400 text-xs">x{item.cantidad}</p>
                </div>
                <p className="text-indigo-600 font-bold text-sm flex-shrink-0">
                  S/ {(Number(item.precio) * item.cantidad).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <hr className="my-5 border-gray-100" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-700">Total</span>
            <span className="text-2xl font-black text-indigo-600">S/ {cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Formulario de pago */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Datos de pago</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              cart={cart}
              cartTotal={cartTotal}
              onSuccess={() => setSuccess(true)}
            />
          </Elements>
        </div>

      </div>
    </div>
  );
};

export default Checkout;