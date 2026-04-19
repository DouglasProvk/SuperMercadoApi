import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, icon, color = '#1abc9c' }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
        </div>
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ background: color }}>
          {icon}
        </div>
      </div>
      {subtitle && <div className="text-xs text-gray-500 mt-2">{subtitle}</div>}
    </div>
  );
};
