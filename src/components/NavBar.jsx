import { Link } from 'react-router-dom';
import { ShoppingCart, User, BookOpen, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  
  const { user } = useAuth(); 
  const { cartCount } = useCart();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        
        {/* Lado Izquierdo: Logo y Links */}
        <div className="flex items-center gap-8">
          <Link to="/" onClick={() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 👈 Le da un deslizamiento elegante hacia arriba
    });
  }} className="flex items-center gap-2">
            <BookOpen className="text-indigo-600" size={32} />
            <span className="text-xl font-bold tracking-tighter text-gray-800">Biblioteca</span>
          </Link>

          <div className="hidden md:flex space-x-6 font-medium text-gray-600">
            
            <Link to="/categorias" className="hover:text-indigo-600 transition">Categorías</Link>
            <Link to="/nosotros" className="hover:text-indigo-600 transition">Nosotros</Link>
          </div>
        </div>

        {/* Lado Derecho: Iconos y Perfil */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r pr-6 border-gray-200">
            
            {/* Si 'user' cambia en el Context, esto se actualiza solo sin recargar la página */}
            {user ? (
              <Link to="/perfil" className="flex items-center gap-2 group">
                <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 transition-all">
                  <User size={20} className="text-indigo-600 group-hover:text-white" />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition">
                  {user.nombre}
                </span>
              </Link>
            ) : (
              <Link to="/login">
                <User className="text-gray-600 hover:text-indigo-600" />
              </Link>
            )}

            <Link to="/carrito" className="relative cursor-pointer">
              <ShoppingCart className="text-gray-600 hover:text-indigo-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>

          {/* Panel Admin condicional */}
          {user?.idRol === 1 && (
            <Link 
              to="/admin" 
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-all font-semibold text-sm"
            >
              <Settings size={18} />
              <span>Panel Admin</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};