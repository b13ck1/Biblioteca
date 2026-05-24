import React, { useState } from 'react'; // Asegúrate de incluir useState
import InfoBar from '../components/InfoBar';
import BannerAnchoCompleto from '../components/BannerAnchoCompleto';
import Footer from '../components/Footer';

// 1. Sub-componente para cada ítem del acordeón
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        className="w-full flex justify-between items-center text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-bold text-gray-800">{question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 mt-4' : 'max-h-0'}`}>
        <p className="text-gray-600 leading-relaxed font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
};

const Nosotros = () => {
  // Datos de las preguntas
  const faqs = [
    {
      question: "¿Hacen envíos a todo el Perú?",
      answer: "Sí, realizamos envíos a nivel nacional. El tiempo estimado de entrega para Lima es de 24 a 48 horas y para provincias de 3 a 5 días hábiles."
    },
    {
      question: "¿Es seguro comprar en la plataforma?",
      answer: "Absolutamente. Utilizamos pasarelas de pago cifradas para garantizar que tus transacciones y datos personales estén 100% protegidos."
    },
    {
      question: "¿Tienen tienda física?",
      answer: "Por el momento operamos exclusivamente de manera digital desde Lima, lo que nos permite ofrecer precios más competitivos."
    }
  ];

  return (
    <div className="bg-white">
      {/* 1. Header con Imagen de Impacto */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600" 
          className="absolute w-full h-full object-cover"
          alt="Nuestra historia"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <h1 className="relative text-white text-5xl md:text-7xl font-black uppercase tracking-tighter">
          Nuestra Esencia
        </h1>
      </section>

      {/* 2. Bloque de Texto "Quiénes Somos" */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-indigo-600 font-bold uppercase tracking-widest mb-4">Desde Lima</h2>
        <h3 className="text-4xl font-black text-gray-900 mb-8">Pasión por la lectura y la tecnología</h3>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          Somos una plataforma nacida con el sueño de democratizar el acceso al conocimiento. 
          Como apasionados del desarrollo de software y la literatura, creamos este espacio 
          donde cada libro es seleccionado cuidadosamente.
        </p>
      </section>

      {/* 3. Banner Promocional */}
      <BannerAnchoCompleto />

      {/* 4. Valores o Misión */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-6">Nuestra Misión</h3>
            <p className="text-gray-600 text-lg mb-4">
              Conectar a cada lector con su próxima gran historia, ofreciendo una experiencia digital fluida y segura.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700 font-medium">
                <span className="h-2 w-2 bg-indigo-600 rounded-full mr-3"></span>
                Calidad garantizada en cada ejemplar.
              </li>
              <li className="flex items-center text-gray-700 font-medium">
                <span className="h-2 w-2 bg-indigo-600 rounded-full mr-3"></span>
                Atención personalizada por expertos.
              </li>
            </ul>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800" alt="Misión" />
          </div>
        </div>
      </section>

      {/* 5. PREGUNTAS FRECUENTES (FAQ) */}
      <section className="max-w-3xl mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Preguntas Frecuentes</h2>
          <div className="h-1.5 w-16 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      {/* 6. Barra de beneficios y Footer */}
      <InfoBar />
      
    </div>
  );
};

export default Nosotros;