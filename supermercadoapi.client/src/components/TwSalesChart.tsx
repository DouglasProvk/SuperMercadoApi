import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VendaDiaDto } from '../types';

export const TwSalesChart: React.FC<{ data: VendaDiaDto[]; height?: number }> = ({ data = [], height = 300 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-2 font-semibold">Vendas - últimos 7 dias</div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data as any}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#1abc9c" strokeWidth={3} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TwSalesChart;
