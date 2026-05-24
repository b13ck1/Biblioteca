import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 
import { Navbar } from './components/NavBar';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Carrito from './pages/Carrito';
import ScrollToTop from './components/ScrollToTop';
import Admin from './components/Admin';
import DetalleLibro from './pages/DetalleLibro';
import Nosotros from './pages/Nosotros';
import Categorias from './pages/Categorias';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Perfil from './components/Perfil';
import Checkout from './pages/Checkout';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
  // Al cargar o recargar el componente, fuerza el scroll al punto 0,0 de la pantalla
  window.scrollTo(0, 0);
}, []);
  return (
    <AuthProvider>
      <CartProvider> 
        <Router>
          {/* 2. Añadimos flex y flex-col aquí para controlar el alto global */}
          <div className="flex flex-col min-h-screen bg-gray-50">
            <ScrollToTop />
            <Navbar /> 

            {/* 3. Envolvemos las rutas en un <main> con flex-grow */}
            <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
            <main className="flex-grow">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Inicio />} />
                <Route path="/libro/:id" element={<DetalleLibro />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </main>

            {/* 4. Colocamos el Footer al final, fuera del main */}
            <Footer />
</div>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;