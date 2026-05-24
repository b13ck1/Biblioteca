import { useEffect, useState } from 'react';
import axios from 'axios';

const ListaLibros = () => {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    // Petición a tu API de Node
    axios.get('http://localhost:3000/api/libros')
      .then(response => {   
        setLibros(response.data);
      })
      .catch(error => console.error("Error al traer libros:", error));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* EL TÍTULO VA FUERA DEL MAP PARA QUE NO SE REPITA */}
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900">Nuestro Catálogo</h2>
        <p className="text-gray-500 mt-1">Explora nuestra selección completa de libros.</p>
      </div>
      
      {/* GRID CORREGIDO: 
          - grid-cols-2 (móvil)
          - md:grid-cols-3 (tablet)
          - lg:grid-cols-5 (PC) 
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {libros.map(libro => (
          <div key={libro.idLibro} className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            
            {/* CONTENEDOR DE IMAGEN: Aspecto 3/4 para que parezca un libro real */}
            <div className="aspect-[3/4] w-full overflow-hidden bg-gray-200">
              <img 
                src={libro.imagen} 
                alt={libro.titulo} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>

            {/* DETALLES DEL LIBRO */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1 min-h-[40px]">
                {libro.titulo}
              </h3>
              <p className="text-[11px] text-gray-500 mb-4 uppercase tracking-wider">{libro.autor}</p>
              
              <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-base font-black text-indigo-600">S/ {libro.precio}</span>
                <button className="bg-indigo-600 text-white text-[10px] px-3 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                  AÑADIR
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {libros.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No hay libros disponibles en este momento.
        </div>
      )}
    </div>
  );
};

export default ListaLibros;