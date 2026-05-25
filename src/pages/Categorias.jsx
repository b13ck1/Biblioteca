import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/CardLibros';
import { Paginator } from 'primereact/paginator';

const Categorias = () => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(8); 
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/libros`);
        setLibros(res.data);
        const cats = ['Todas', ...new Set(res.data.map(l => l.genero))];
        setCategorias(cats);
      } catch (error) {
        console.error("Error al cargar datos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  

  // LÓGICA DE FILTRADO DOBLE: Por categoría Y por texto (Título o Autor)
  const librosFiltrados = libros.filter(libro => {
    const cumpleCategoria = categoriaSeleccionada === 'Todas' || libro.genero === categoriaSeleccionada;
    const cumpleBusqueda = 
      libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
      libro.autor.toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleCategoria && cumpleBusqueda;
  });

  const librosAMostrar = librosFiltrados.slice(first, first + rows);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        
        <div className="flex justify-center items-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tight relative after:content-[''] after:absolute after:w-16 after:h-1 after:bg-indigo-600 after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2">
            Categorías
          </h1>
        </div>

        {/* Barra de búsqueda superior */}
        <div className="mb-14 relative max-w-2xl mx-auto">
          <input 
            type="text"
            placeholder="Buscar por título o autor..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-gray-700"
            value={busqueda}
            onChange={(e) => {
                setBusqueda(e.target.value);
                setFirst(0);
            }}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar de Géneros */}
          <aside className="w-full md:w-64 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tighter italic border-b-2 border-indigo-600 pb-2">
              Géneros
            </h2>
            <div className="flex flex-wrap md:flex-col gap-2">
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoriaSeleccionada(cat);
                    setBusqueda(''); 
                    setFirst(0);
                  }}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 text-left border-2 ${
                    categoriaSeleccionada === cat 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-105 translate-x-2' 
                    : 'bg-white text-gray-500 border-transparent hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Listado de Libros */}
          <main className="flex-1">
            
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                {categoriaSeleccionada}
              </h2>
              <p className="text-gray-500 font-medium">
                {librosFiltrados.length} resultados
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : (
              <>
                {librosFiltrados.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      
                      {librosAMostrar.map(libro => (
                        <BookCard key={libro.idLibro} libro={libro} />
                      ))}
                    </div>

                    {/* COMPONENTE PAGINATOR */}
                    <div className="mt-12 bg-white p-2 rounded-full shadow-sm border border-gray-100 flex justify-center items-center max-w-max mx-auto">
  <Paginator 
    first={first} 
    rows={rows} 
    totalRecords={librosFiltrados.length} 
    onPageChange={onPageChange} 
    pageLinkSize={5}
    alwaysShow={true}
    template="PrevPageLink PageLinks NextPageLink"
    
    pt={{
        pages: { className: 'flex gap-2' },
        pageButton: ({ context }) => ({
            className: `
                w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 font-bold text-sm
                ${context.active 
                    ? '!bg-indigo-600 !text-white shadow-md scale-110' 
                    : 'hover:bg-indigo-50 text-gray-500 hover:text-indigo-600'
                }
            `
        }),
        prevPageLink: { className: 'hover:bg-indigo-50 !rounded-full w-10 h-10 transition-colors flex items-center justify-center' },
        nextPageLink: { className: 'hover:bg-indigo-50 !rounded-full w-10 h-10 transition-colors flex items-center justify-center' }
    }}
    className="!bg-transparent !border-none"
/>
</div>
                  </>
                ) : (
                  <p className="text-xl text-gray-400 font-bold">
  {busqueda
    ? `No encontramos libros con "${busqueda}"`
    : `No hay libros en esta categoría`}
</p>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Categorias;