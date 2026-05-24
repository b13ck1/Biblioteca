import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // useLocation detecta cada vez que la URL (ruta) cambia
  const { pathname } = useLocation();

  useEffect(() => {
    // Mueve el scroll al inicio (coordenadas x:0, y:0) de forma inmediata
    window.scrollTo(0, 0);
  }, [pathname]); // Se ejecuta cada vez que el pathname cambie

  return null; 
};

export default ScrollToTop;