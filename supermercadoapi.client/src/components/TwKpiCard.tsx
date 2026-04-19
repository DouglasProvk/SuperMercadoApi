import React from 'react';

export const TwKpiCard: React.FC<{ title: string; value: React.ReactNode; subtitle?: string; color?: string }> = ({ title, value, subtitle, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white`} style={{ background: color || '#1abc9c' }}>
          {/* icon placeholder */}
        </div>
      </div>
      {subtitle && <div className="text-xs text-gray-500 mt-2">{subtitle}</div>}
    </div>
  );
};

export default TwKpiCard;
