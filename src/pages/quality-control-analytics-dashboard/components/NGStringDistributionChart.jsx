import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const NGStringDistributionChart = ({ chartData, stringers }) => {
  const [selectedStringers, setSelectedStringers] = useState(stringers?.map(s => s?.id));
  const [zoomDomain, setZoomDomain] = useState(null);

  const colors = [
    '#1E40AF', '#059669', '#DC2626', '#F59E0B', '#8B5CF6', '#EC4899'
  ];

  const toggleStringer = (stringerId) => {
    setSelectedStringers(prev => 
      prev?.includes(stringerId) 
        ? prev?.filter(id => id !== stringerId)
        : [...prev, stringerId]
    );
  };

  const resetZoom = () => {
    setZoomDomain(null);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{`Time: ${label}`}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.dataKey}:</span>
              <span className="font-medium text-foreground">{entry?.value} NG strings</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 industrial-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">NG String Distribution by Stringer</h3>
          <p className="text-sm text-muted-foreground">Hourly NG string patterns across all stringers</p>
        </div>
        <div className="flex items-center space-x-2">
          {zoomDomain && (
            <button
              onClick={resetZoom}
              className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded hover:bg-muted hover-feedback"
            >
              Reset Zoom
            </button>
          )}
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg hover-feedback">
            <Icon name="Download" size={16} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg hover-feedback">
            <Icon name="Maximize2" size={16} />
          </button>
        </div>
      </div>
      {/* Interactive Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {stringers?.map((stringer, index) => (
          <button
            key={stringer?.id}
            onClick={() => toggleStringer(stringer?.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border hover-feedback ${
              selectedStringers?.includes(stringer?.id)
                ? 'border-primary bg-primary/10 text-primary' :'border-border bg-muted/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: colors?.[index % colors?.length] }}
            />
            <span className="text-sm font-medium">{stringer?.name}</span>
            <span className="text-xs opacity-75">
              ({chartData?.reduce((sum, item) => sum + (item?.[stringer?.id] || 0), 0)} total)
            </span>
          </button>
        ))}
      </div>
      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            domain={zoomDomain}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              label={{ value: 'NG Strings', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {stringers?.map((stringer, index) => (
              selectedStringers?.includes(stringer?.id) && (
                <Area
                  key={stringer?.id}
                  type="monotone"
                  dataKey={stringer?.id}
                  stackId="1"
                  stroke={colors?.[index % colors?.length]}
                  fill={colors?.[index % colors?.length]}
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              )
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Controls */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Total NG Strings: {chartData?.reduce((sum, item) => {
            return sum + stringers?.reduce((stringerSum, stringer) => {
              return stringerSum + (selectedStringers?.includes(stringer?.id) ? (item?.[stringer?.id] || 0) : 0);
            }, 0);
          }, 0)}</span>
          <span>•</span>
          <span>Active Stringers: {selectedStringers?.length}/{stringers?.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded hover:bg-muted hover-feedback">
            Export Data
          </button>
          <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded hover:bg-muted hover-feedback">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default NGStringDistributionChart;