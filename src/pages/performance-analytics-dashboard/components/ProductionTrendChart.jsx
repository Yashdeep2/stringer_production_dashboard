import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

import Button from '../../../components/ui/Button';

const ProductionTrendChart = ({ data, comparisonData, showComparison }) => {
  const [chartOptions, setChartOptions] = useState({
    showTargets: true,
    showMovingAverage: false,
    showSeasonalPattern: false,
    zoomEnabled: false
  });

  const [selectedMetrics, setSelectedMetrics] = useState({
    efficiency: true,
    modulesPerHour: true,
    utilization: true,
    variance: false
  });

  const mockData = [
    { time: '00:00', efficiency: 85, modulesPerHour: 42, utilization: 78, variance: 12, target: 80, movingAvg: 83 },
    { time: '01:00', efficiency: 88, modulesPerHour: 45, utilization: 82, variance: 8, target: 80, movingAvg: 84 },
    { time: '02:00', efficiency: 92, modulesPerHour: 48, utilization: 85, variance: 5, target: 80, movingAvg: 85 },
    { time: '03:00', efficiency: 87, modulesPerHour: 44, utilization: 80, variance: 10, target: 80, movingAvg: 86 },
    { time: '04:00', efficiency: 90, modulesPerHour: 47, utilization: 83, variance: 7, target: 80, movingAvg: 87 },
    { time: '05:00', efficiency: 94, modulesPerHour: 50, utilization: 88, variance: 3, target: 80, movingAvg: 88 },
    { time: '06:00', efficiency: 89, modulesPerHour: 46, utilization: 81, variance: 9, target: 80, movingAvg: 89 },
    { time: '07:00', efficiency: 91, modulesPerHour: 48, utilization: 84, variance: 6, target: 80, movingAvg: 90 },
    { time: '08:00', efficiency: 86, modulesPerHour: 43, utilization: 79, variance: 11, target: 80, movingAvg: 89 },
    { time: '09:00', efficiency: 93, modulesPerHour: 49, utilization: 86, variance: 4, target: 80, movingAvg: 90 },
    { time: '10:00', efficiency: 95, modulesPerHour: 51, utilization: 90, variance: 2, target: 80, movingAvg: 91 },
    { time: '11:00', efficiency: 88, modulesPerHour: 45, utilization: 82, variance: 8, target: 80, movingAvg: 90 }
  ];

  const chartData = data || mockData;

  const toggleChartOption = (option) => {
    setChartOptions(prev => ({
      ...prev,
      [option]: !prev?.[option]
    }));
  };

  const toggleMetric = (metric) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev?.[metric]
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 industrial-shadow">
          <p className="text-sm font-medium text-foreground mb-2">{`Time: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value}${entry?.name?.includes('efficiency') || entry?.name?.includes('utilization') ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 industrial-shadow">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Production Performance Trends</h3>
          <p className="text-sm text-muted-foreground">Real-time and historical performance analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => console.log('Export chart')}
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Maximize2"
            onClick={() => toggleChartOption('zoomEnabled')}
          >
            {chartOptions?.zoomEnabled ? 'Reset' : 'Zoom'}
          </Button>
        </div>
      </div>
      {/* Chart Controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex flex-wrap items-center space-x-4 mb-2 sm:mb-0">
          <span className="text-sm font-medium text-foreground">Overlays:</span>
          {Object.entries(chartOptions)?.map(([key, value]) => (
            <button
              key={key}
              onClick={() => toggleChartOption(key)}
              className={`
                px-3 py-1 rounded text-xs font-medium hover-feedback
                ${value ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}
              `}
            >
              {key?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase())}
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap items-center space-x-4">
          <span className="text-sm font-medium text-foreground">Metrics:</span>
          {Object.entries(selectedMetrics)?.map(([key, value]) => (
            <button
              key={key}
              onClick={() => toggleMetric(key)}
              className={`
                px-3 py-1 rounded text-xs font-medium hover-feedback
                ${value ? 'bg-secondary text-secondary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}
              `}
            >
              {key?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase())}
            </button>
          ))}
        </div>
      </div>
      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Target Line */}
            {chartOptions?.showTargets && (
              <ReferenceLine 
                y={80} 
                stroke="var(--color-warning)" 
                strokeDasharray="5 5" 
                label="Target"
              />
            )}
            
            {/* Performance Lines */}
            {selectedMetrics?.efficiency && (
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                name="Efficiency %"
              />
            )}
            
            {selectedMetrics?.modulesPerHour && (
              <Line
                type="monotone"
                dataKey="modulesPerHour"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
                name="Modules/Hour"
              />
            )}
            
            {selectedMetrics?.utilization && (
              <Line
                type="monotone"
                dataKey="utilization"
                stroke="var(--color-success)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                name="Utilization %"
              />
            )}
            
            {selectedMetrics?.variance && (
              <Line
                type="monotone"
                dataKey="variance"
                stroke="var(--color-error)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 4 }}
                name="Variance %"
              />
            )}
            
            {/* Moving Average */}
            {chartOptions?.showMovingAverage && (
              <Line
                type="monotone"
                dataKey="movingAvg"
                stroke="var(--color-warning)"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                name="Moving Average"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Peak Efficiency</p>
          <p className="text-lg font-semibold text-success">95%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Avg Modules/Hr</p>
          <p className="text-lg font-semibold text-primary">46.8</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Best Utilization</p>
          <p className="text-lg font-semibold text-secondary">90%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Min Variance</p>
          <p className="text-lg font-semibold text-warning">2%</p>
        </div>
      </div>
    </div>
  );
};

export default ProductionTrendChart;