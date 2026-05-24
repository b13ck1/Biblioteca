const BannerAnchoCompleto = () => {
  return (
    <div className="relative w-screen left-[50%] right-[50%] -ml-[50vw] mr-[50vw] my-20 h-[300px] md:h-[400px] overflow-hidden group">
      {/* Fondo del Banner */}
      <img 
        src="https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1600" 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        alt="Banner Ciencia Ficción"
      />
      
      {/* Contenido centrado */}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-white text-3xl md:text-5xl font-black mb-4 tracking-widest uppercase">
          Unleash New Worlds
        </h2>
        <p className="text-indigo-300 text-lg md:text-2xl font-bold mb-8 uppercase tracking-widest">
          Science Fiction & Fantasy
        </p>
        <button className="bg-pink-500 hover:bg-pink-600 text-white font-black py-3 px-10 rounded-full transition-all transform hover:scale-110 shadow-lg shadow-pink-500/40">
          EXPLORE THE UNIVERSE
        </button>
      </div>
    </div>
  );
};
export default BannerAnchoCompleto;