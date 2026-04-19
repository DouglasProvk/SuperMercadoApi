import React from 'react';
import type { AlertaDto } from '../types';

interface AlertsListProps {
  alertas: AlertaDto[];
}

export const AlertsList: React.FC<AlertsListProps> = ({ alertas }) => {
  if (!alertas || alertas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
        <div className="text-3xl">?</div>
        <div className="mt-2">Sem alertas no momento</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="font-semibold mb-3 text-gray-800">Alertas ({alertas.length})</div>
      <div className="space-y-2 max-h-96 overflow-auto">
        {alertas.map((a, i) => (
          <div key={i} className="p-3 border rounded flex items-start justify-between">
            <div>
              <div className="font-semibold text-gray-800">{a.mensagem}</div>
              <div className="text-xs text-gray-500">{a.tipo}</div>
            </div>
            <div className="text-xs text-gray-400 ml-4">{a.nivel}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
