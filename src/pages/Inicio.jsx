import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BookCard from '../components/CardLibros';
import BannerPublicitario from '../components/BannerPublicitario';
import BannerAnchoCompleto from '../components/BannerAnchoCompleto';
import Footer from '../components/Footer';
import InfoBar from '../components/InfoBar';

// Sub-componente para cada fila de categoría con sus botones
const FilaCategoria = ({ categoria, libros }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      // Desplazamos aproximadamente el ancho de una tarjeta + el gap
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-12 relative group">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-indigo-600 pl-3">
            {categoria}
          </h2>
          <p className="text-gray-500 text-sm ml-4">Libros de {categoria.toLowerCase()}</p>
        </div>
        <button className="text-indigo-600 font-semibold hover:underline text-sm">Ver todos</button>
      </div>
      
      <div className="relative flex items-center">
        {/* Botón Izquierda */}
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-4 z-10 bg-white shadow-lg rounded-full p-2 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 hidden md:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Contenedor con Scroll */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x scroll-smooth w-full"
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
          className="absolute -right-4 z-10 bg-white shadow-lg rounded-full p-2 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 hidden md:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

const Inicio = () => {
  const [librosPorCategoria, setLibrosPorCategoria] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&h=400&fit=crop', title: 'Novedades de Verano' },
    { url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&h=400&fit=crop', title: 'Zona de Ofertas' }
  ];

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const res = await axios.get('${import.meta.env.VITE_API_URL}/api/libros');
        
        const agrupados = res.data.reduce((acc, libro) => {
          const cat = libro.genero || 'General';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(libro);
          return acc;
        }, {});

        setLibrosPorCategoria(agrupados);
      } catch (error) {
        console.error("Error al cargar libros", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLibros();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Carrusel */}
      <section className="relative w-full h-[350px] overflow-hidden">
        {slides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={slide.url} className="w-full h-full object-cover" alt={slide.title} />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
              <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-2xl">
                {slide.title}
              </h2>
            </div>
          </div>
        ))}
      </section>

      {/* Secciones por Categoría */}
      {/* Secciones por Categoría */}
      

<main className="max-w-7xl mx-auto px-4 py-16">
  {loading ? (
    <div className="text-center py-20">Cargando...</div>
  ) : (
    Object.keys(librosPorCategoria).map((categoria, index) => (
      <React.Fragment key={categoria}>
        
        {/* Renderiza la fila de libros */}
        <FilaCategoria 
          categoria={categoria} 
          libros={librosPorCategoria[categoria]} 
        />

        {/* BANNER 1: Estilo tarjeta redondeada (Después de la 2da categoría) */}
        {index === 1 && (
          <div className="my-16">
            <BannerPublicitario /> 
          </div>
        )}

        {/* BANNER 2: Estilo Ancho Completo (Después de la 4ta categoría) */}
        {index === 3 && (
          <BannerAnchoCompleto />
        )}

      </React.Fragment>
    ))
  )}
</main>
<InfoBar />

    </div>
  );
};

export default Inicio;