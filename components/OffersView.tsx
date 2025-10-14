import React from 'react';

const offers = [
    {
        type: 'Tarjeta de Crédito',
        name: 'Tarjeta Platinum Viajera',
        provider: 'BancoFin',
        description: 'Acumula el doble de millas en todas tus compras y accede a salas VIP en aeropuertos de todo el mundo.',
        highlight: 'Ideal para viajeros frecuentes',
        cta: 'Obtener Tarjeta',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
        bgColor: 'bg-blue-500'
    },
    {
        type: 'Seguro',
        name: 'Seguro de Salud Total',
        provider: 'Aseguradora Confianza',
        description: 'Cobertura completa para ti y tu familia, con acceso a una amplia red de clínicas y hospitales a nivel nacional.',
        highlight: '90% de cobertura en emergencias',
        cta: 'Cotizar Seguro',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        bgColor: 'bg-red-500'
    },
    {
        type: 'Préstamo Personal',
        name: 'Crédito Efectivo Flexible',
        provider: 'PrestaYa',
        description: 'Obtén el dinero que necesitas para tus proyectos con tasas de interés competitivas y un plan de pago a tu medida.',
        highlight: 'Aprobación en menos de 24h',
        cta: 'Solicitar Crédito',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.162-.328zM11.5 8.433c.058.083.11.168.157.254v-1.618c.155.07.303.15.44.242z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.5 4.5 0 00-1.879 3.103a1 1 0 101.853.492A2.5 2.5 0 0110 9.5a1 1 0 100-2 4.5 4.5 0 00-3.252 1.252 1 1 0 101.414 1.414A2.5 2.5 0 0110 10.5a1 1 0 100 2 4.5 4.5 0 003.252-1.252 1 1 0 10-1.414-1.414A2.5 2.5 0 0110 9.5a1 1 0 100-2zM10 13a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
        ),
        bgColor: 'bg-green-500'
    }
];


const OfferCard: React.FC<{ offer: typeof offers[0] }> = ({ offer }) => (
    <div className="bg-surface border border-border rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
        <div className={`p-6 ${offer.bgColor} text-white flex items-center space-x-4`}>
            <div className="flex-shrink-0">{offer.icon}</div>
            <div>
                <p className="text-sm font-semibold opacity-80">{offer.type}</p>
                <h3 className="text-xl font-bold">{offer.name}</h3>
            </div>
        </div>
        <div className="p-6 flex-grow flex flex-col">
            <p className="text-text-secondary flex-grow">{offer.description}</p>
            <div className="mt-4 bg-bkg p-3 rounded-lg text-center">
                <p className="font-semibold text-primary">{offer.highlight}</p>
            </div>
        </div>
        <div className="p-6 bg-bkg">
            <a 
                href="#" // Aquí iría tu enlace de afiliado real
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full block text-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                {offer.cta}
            </a>
        </div>
    </div>
);


const OffersView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Marketplace de Ofertas</h1>
        <p className="text-text-secondary mt-1">Descubre productos financieros seleccionados que pueden ayudarte a ahorrar y crecer.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map(offer => (
            <OfferCard key={offer.name} offer={offer} />
        ))}
      </div>
      
      <div className="mt-12 text-center text-xs text-text-secondary bg-surface p-4 rounded-lg border border-border">
          <p><span className="font-semibold">Divulgación de Afiliados:</span> Para mantener FinTrack sostenible, podemos recibir una comisión si contratas un producto a través de nuestros enlaces, sin ningún costo adicional para ti. Solo recomendamos productos que creemos que realmente aportan valor a nuestros usuarios.</p>
      </div>
    </div>
  );
};

export default OffersView;