import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12">
        
        {/* Columna 1: Branding */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic">
            Biblioteca<span className="text-indigo-500">2.0</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Tu próxima gran aventura comienza entre las páginas de nuestros libros. 
            Explora nuestra colección seleccionada de Ciencia Ficción, Tecnología y más.
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h3 className="text-lg font-bold mb-6">Navegación</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><a href="/" className="hover:text-indigo-400 transition-colors">Inicio</a></li>
            <li><a href="/categorias" className="hover:text-indigo-400 transition-colors">Categorías</a></li>
            <li><a href="/novedades" className="hover:text-indigo-400 transition-colors">Novedades</a></li>
            <li><a href="/admin" className="hover:text-indigo-400 transition-colors">Panel Admin</a></li>
          </ul>
        </div>

        {/* Columna 3: Categorías Top */}
        <div>
          <h3 className="text-lg font-bold mb-6">Populares</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Tecnología</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Ciencia Ficción</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Finanzas</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Autoayuda</a></li>
          </ul>
        </div>

        {/* Columna 4: Newsletter / Contacto */}
        <div>
          <h3 className="text-lg font-bold mb-6">Suscríbete</h3>
          <p className="text-gray-400 text-sm mb-4">Recibe ofertas exclusivas y nuevos lanzamientos.</p>
          <div className="flex flex-col space-y-2">
            <input 
              type="email" 
              placeholder="tu@email.com" 
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-all text-sm uppercase tracking-widest">
              Unirse
            </button>
          </div>
        </div>
      </div>

      {/* Copyright y Social */}
      <div className="max-w-7xl mx-auto px-4 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-gray-500 text-xs">
        <p>© 2026 Biblioteca E-commerce. Todos los derechos reservados.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors underline">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors underline">Términos</a>
          <a href="#" className="hover:text-white transition-colors underline">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;