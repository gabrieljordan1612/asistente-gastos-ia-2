import React from 'react';

const testimonials = [
  {
    name: 'Martin K',
    date: '4 de agosto de 2024',
    text: 'La app es genial y estoy muy satisfecho con el análisis de gastos. No es tan costosa como otras y los planes valen la pena.',
    initials: 'MK',
    color: 'bg-green-200 text-green-800'
  },
  {
    name: 'Gabriela I.',
    date: '3 de marzo de 2025',
    text: '¡Estoy increíblemente satisfecha con FinTrack! Su disponibilidad es siempre excelente, lo que garantiza que mis finanzas funcionen a la perfección. Siempre que he necesitado ayuda, su equipo de soporte técnico ha sido rápido, competente y realmente servicial.',
    initials: 'GI',
    color: 'bg-orange-200 text-orange-800'
  },
  {
    name: 'Maxim S.',
    date: '14 de abril de 2025',
    text: 'Todo va perfecto con la app, el chatbot con IA y el chat humano, si la IA no puede resolver tu duda. El análisis de boletas es genial, sin altibajos. Gracias al equipo de desarrollo y a todos los involucrados. ¡Sigan así! 🚀',
    initials: 'MS',
    color: 'bg-gray-200 text-gray-800',
    isImage: true,
    imageUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'Noel',
    date: '26 de abril de 2025',
    text: '¡Por fin una app de finanzas que lo hace bien! Buen precio. Un portal excelente que respeta el tiempo de sus usuarios. Análisis impecables, buen soporte, fiable y tan sólido como una roca.',
    initials: 'ND',
    color: 'bg-blue-200 text-blue-800'
  },
  {
    name: 'Omkar',
    date: '30 de mayo de 2025',
    text: 'Contacté con el soporte de FinTrack tras problemas con una boleta y quedé muy impresionado. El equipo de soporte fue increíblemente paciente y minucioso.',
    initials: 'O',
    color: 'bg-red-200 text-red-800',
    isImage: true,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'Ana García',
    date: '12 de junio de 2024',
    text: 'La mejor decisión para mis finanzas personales. La categorización automática me ahorra horas cada mes. Totalmente recomendada.',
    initials: 'AG',
    color: 'bg-purple-200 text-purple-800'
  }
];

const TestimonialCard: React.FC<{ testimonial: typeof testimonials[0] }> = ({ testimonial }) => (
    <div className="bg-surface border border-border rounded-2xl p-6 text-left flex flex-col h-full w-[380px] shadow-lg">
        <div className="flex items-center mb-4">
            {testimonial.isImage ? (
                <img className="h-11 w-11 rounded-full object-cover" src={testimonial.imageUrl} alt={testimonial.name} />
            ) : (
                <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-lg ${testimonial.color}`}>
                    {testimonial.initials}
                </div>
            )}
            <div className="ml-4">
                <p className="font-bold text-text-primary">{testimonial.name}</p>
                <p className="text-sm text-text-secondary">{testimonial.date}</p>
            </div>
        </div>
        <p className="text-text-secondary text-base leading-relaxed flex-grow">{testimonial.text}</p>
    </div>
);


const TestimonialsSection = () => {
    const duplicatedTestimonials = [...testimonials, ...testimonials];

    return (
        <section id="testimonials" className="bg-bkg py-20 overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 opacity-0 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-text-primary tracking-tight">Lo que dicen nuestros clientes</h2>
                <p className="mt-2 text-lg text-text-secondary">Opiniones reales de usuarios que han transformado sus finanzas con FinTrack.</p>
            </div>
             <div
                className="group w-full"
                style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
            >
                <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused]">
                    {duplicatedTestimonials.map((testimonial, index) => (
                        <div key={index} className="px-4 flex-shrink-0">
                            <TestimonialCard testimonial={testimonial} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;