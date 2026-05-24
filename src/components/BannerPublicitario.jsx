const BannerPublicitario = () => {
  return (
    <div className="my-16 w-full px-4">
      <div className="relative w-full h-[300px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
        {/* Imagen de fondo del banner */}
        <img 
          src="https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=1200" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt="Colección Clásicos"
        />
        {/* Overlay con texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-12">
          <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-2">Colección "Jardín Secreto"</span>
          <h2 className="text-white text-4xl md:text-5xl font-black mb-6 max-w-md leading-tight">
            Grandes Clásicos de la Literatura
          </h2>
          <button className="bg-white text-black font-bold py-3 px-8 rounded-full w-fit hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110">
            COMPRA AQUÍ
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerPublicitario;