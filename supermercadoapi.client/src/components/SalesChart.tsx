import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { VendaDiaDto } from '../types';

interface SalesChartProps {
  data: VendaDiaDto[];
  type?: 'line' | 'bar';
  height?: number;
}

export const SalesChart: React.FC<SalesChartProps> = ({
  data,
  type = 'line',
  height = 300,
}) => {
  const theme = useTheme();

  const chartData = data.map((item) => ({
    data: item.data,
    total: parseFloat(item.total.toFixed(2)),
    qtd: item.qtd,
  }));

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1px solid ${alpha('#1abc9c', 0.2)}`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#1abc9c' }}>
            {payload[0].payload.data}
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
            Total: R$ {payload[0].value.toFixed(2)}
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
            Qtd: {payload[0].payload.qtd}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: `1px solid ${alpha('#1abc9c', 0.1)}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      <CardHeader
        title="Vendas - Últimos 7 dias"
        subheader="Histórico de vendas realizadas"
        titleTypographyProps={{
          variant: 'h6',
          sx: { fontWeight: 700, color: '#2c3e50' },
        }}
        subheaderTypographyProps={{
          variant: 'caption',
          sx: { color: 'text.secondary' },
        }}
        sx={{ pb: 1 }}
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {type === 'line' ? (
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
              <XAxis
                dataKey="data"
                tick={{ fill: '#999', fontSize: 12 }}
                stroke={alpha('#000', 0.1)}
              />
              <YAxis
                tick={{ fill: '#999', fontSize: 12 }}
                stroke={alpha('#000', 0.1)}
                label={{ value: 'R$', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={customTooltip} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#1abc9c"
                strokeWidth={3}
                dot={{ fill: '#1abc9c', r: 5 }}
                activeDot={{ r: 7 }}
                isAnimationActive={true}
              />
            </LineChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
              <XAxis
                dataKey="data"
                tick={{ fill: '#999', fontSize: 12 }}
                stroke={alpha('#000', 0.1)}
              />
              <YAxis
                tick={{ fill: '#999', fontSize: 12 }}
                stroke={alpha('#000', 0.1)}
                label={{ value: 'R$', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={customTooltip} />
              <Bar
                dataKey="total"
                fill="#1abc9c"
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
