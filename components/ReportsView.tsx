import React from 'react';

const ReportsView: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Reportes</h1>
      <div className="bg-surface border border-border rounded-lg p-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 className="mt-4 text-xl font-semibold text-text-primary">Página de Reportes en Construcción</h2>
        <p className="mt-2 text-text-secondary">Próximamente podrás ver análisis detallados, comparativas mensuales y tendencias de tus gastos e ingresos.</p>
      </div>
    </div>
  );
};

export default ReportsView;