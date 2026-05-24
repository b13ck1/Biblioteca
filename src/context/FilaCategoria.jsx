import React, { useRef } from 'react';
import BookCard from './CardLibros';

const FilaCategoria = ({ categoria, libros }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      // Desplazamos 300px (aprox una card + gap)
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-12 relative group">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-indigo-600 pl-3">
          {categoria}
        </h2>
        <button className="text-indigo-600 font-semibold hover:underline text-sm">Ver todos</button>
      </div>

      <div className="relative">
        {/* Botón Izquierda */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl rounded-full p-2 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Contenedor con Scroll */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x scroll-smooth"
        >
          {libros.map((libro) => (
            <div key={libro.idLibro} className="min-w-[220px] max-w-[220px] snap-start">
              <BookCard libro={libro} />
            </div>
          ))}
        </div>

        {/* Botón Derecha */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl rounded-full p-2 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};