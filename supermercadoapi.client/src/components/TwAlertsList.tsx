import React from 'react';
import type { AlertaDto } from '../types';

export const TwAlertsList: React.FC<{ alertas: AlertaDto[] }> = ({ alertas }) => {
  if (!alertas || alertas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 text-center text-gray-500">
        <div className="text-2xl">?</div>
        <div className="mt-2">Sem alertas no momento</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {alertas.map((a, i) => (
        <div key={i} className="p-3 border rounded mb-2">
          <div className="font-semibold">{a.mensagem}</div>
          <div className="text-xs text-gray-500">{a.tipo}</div>
        </div>
      ))}
    </div>
  );
};

export default TwAlertsList;
