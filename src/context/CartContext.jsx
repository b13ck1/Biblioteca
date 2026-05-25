import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const API = `${import.meta.env.VITE_API_URL}/api`;

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  const getToken = () => localStorage.getItem('token');
  const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

  const fetchCart = async () => {
    const token = getToken();
    if (!token) return;
    try {
      setLoadingCart(true);
      const res = await axios.get(`${API}/carrito`, authHeaders());
      setCart(res.data);
    } catch (err) {
      console.error('Error al cargar carrito:', err);
    } finally {
      setLoadingCart(false);
    }
  };

  const fetchFavoritos = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await axios.get(`${API}/favoritos`, authHeaders());
      setFavoritos(res.data.map(f => f.idLibro));
    } catch (err) {
      console.error('Error al cargar favoritos:', err);
    }
  };

  // Carga inicial — se ejecuta una vez al montar,
  // sirve cuando el usuario ya estaba logueado (token en localStorage)
  useEffect(() => {
    if (getToken()) {
      fetchCart();
      fetchFavoritos();
    }
  }, []); // <- sin dependencias, solo al montar

  // Carga cuando el user cambia (login / logout)
  useEffect(() => {
    if (user) {
      fetchCart();
      fetchFavoritos();
    } else {
      setCart([]);
      setFavoritos([]);
    }
  }, [user]);

  // ─── Carrito ─────────────────────────────────────────────────────────────
  const addToCart = async (libro) => {
    if (!user) return { needsLogin: true };
    try {
      await axios.post(`${API}/carrito`, { idLibro: libro.idLibro }, authHeaders());
      setCart(curr => {
        const exists = curr.find(i => i.idLibro === libro.idLibro);
        if (exists) {
          return curr.map(i => i.idLibro === libro.idLibro ? { ...i, cantidad: i.cantidad + 1 } : i);
        }
        return [...curr, { ...libro, cantidad: 1 }];
      });
      return { success: true };
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      return { error: true };
    }
  };

  const removeFromCart = async (idLibro) => {
    try {
      await axios.delete(`${API}/carrito/${idLibro}`, authHeaders());
      setCart(curr => curr.filter(i => i.idLibro !== idLibro));
    } catch (err) {
      console.error('Error al eliminar del carrito:', err);
    }
  };

  const updateQuantity = async (idLibro, delta) => {
    const item = cart.find(i => i.idLibro === idLibro);
    if (!item) return;
    const nuevaCantidad = item.cantidad + delta;
    try {
      await axios.put(`${API}/carrito/${idLibro}`, { cantidad: nuevaCantidad }, authHeaders());
      if (nuevaCantidad <= 0) {
        setCart(curr => curr.filter(i => i.idLibro !== idLibro));
      } else {
        setCart(curr => curr.map(i => i.idLibro === idLibro ? { ...i, cantidad: nuevaCantidad } : i));
      }
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API}/carrito`, authHeaders());
      setCart([]);
    } catch (err) {
      console.error('Error al vaciar carrito:', err);
    }
  };

  // ─── Favoritos ───────────────────────────────────────────────────────────
  const toggleFavorito = async (idLibro) => {
    console.log('toggleFavorito llamado con:', idLibro); // ← agrega esto
    if (!user) return { needsLogin: true };
    try {
      const res = await axios.post(`${API}/favoritos/toggle`, { idLibro }, authHeaders());
      console.log('Respuesta toggle:', res.data);
      if (res.data.action === 'added') {
  setFavoritos(curr => [...curr, idLibro]);
} else {
  setFavoritos(curr => curr.filter(id => id !== idLibro));
}
      return { success: true, accion: res.data.accion };
    } catch (err) {
      console.error('Error al toggle favorito:', err);
      return { error: true };
    }
  };

  const esFavorito = (idLibro) => favoritos.includes(idLibro);

  const cartTotal = cart.reduce((acc, item) => acc + Number(item.precio) * item.cantidad, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, cartCount, loadingCart,
      favoritos, toggleFavorito, esFavorito,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);