import React from 'react';

export const Produtos: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
            <p className="text-sm text-gray-500">Gerenciar catálogo de produtos</p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-md">Novo Produto</button>
        </div>

        <div className="bg-white p-4 rounded-lg mb-6">
          <input className="w-full p-2 border rounded" placeholder="Buscar por nome ou código de barras..." />
        </div>

        <div className="text-center text-gray-500">
          <h2 className="text-lg font-semibold mb-2">Em desenvolvimento</h2>
          <p>Esta página será preenchida com a listagem de produtos</p>
        </div>
      </div>
    </div>
  );
};
