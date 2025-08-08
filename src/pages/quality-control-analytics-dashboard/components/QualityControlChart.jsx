import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';

const QualityControlChart = ({ controlData, controlLimits }) => {
  const [selectedMetric, setSelectedMetric] = useState('qualityRate');
  const [showControlLimits, setShowControlLimits] = useState(true);
  const [showAnomalies, setShowAnomalies] = useState(true);

  const metrics = [
    { id: 'qualityRate', label: 'Quality Rate (%)', color: '#1E40AF' },
    { id: 'ngRate', label: 'NG Rate (%)', color: '#DC2626' },
    { id: 'defectDensity', label: 'Defect Density', color: '#F59E0B' }
  ];

  const currentMetric = metrics?.find(m => m?.id === selectedMetric);

  const getAnomalyPoints = () => {
    return controlData?.filter(point => {
      const value = point?.[selectedMetric];
      const limits = controlLimits?.[selectedMetric];
      return value > limits?.upperControl || value < limits?.lowerControl;
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      const isAnomaly = getAnomalyPoints()?.some(p => p?.time === label);
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{`Time: ${label}`}</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: currentMetric?.color }}
              />
              <span className="text-sm text-muted-foreground">{currentMetric?.label}:</span>
              <span className="text-sm font-medium text-foreground">{payload?.[0]?.value}</span>
            </div>
            {isAnomaly && (
              <div className="flex items-center space-x-2 text-error">
                <Icon name="AlertTriangle" size={12} />
                <span className="text-xs">Out of control</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const isAnomaly = getAnomalyPoints()?.some(p => p?.time === payload?.time);
    
    if (isAnomaly && showAnomalies) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="#DC2626"
          stroke="#FFFFFF"
          strokeWidth={2}
        />
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 industrial-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Statistical Quality Control Chart</h3>
          <p className="text-sm text-muted-foreground">Hourly quality metrics with control limits</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Metric Selector */}
          <div className="flex items-center space-x-2">
            {metrics?.map((metric) => (
              <button
                key={metric?.id}
                onClick={() => setSelectedMetric(metric?.id)}
                className={`px-3 py-1 text-sm font-medium rounded-lg hover-feedback ${
                  selectedMetric === metric?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {metric?.label}
              </button>
            ))}
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowControlLimits(!showControlLimits)}
              className={`p-2 rounded-lg hover-feedback ${
                showControlLimits ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title="Toggle control limits"
            >
              <Icon name="Target" size={16} />
            </button>
            <button
              onClick={() => setShowAnomalies(!showAnomalies)}
              className={`p-2 rounded-lg hover-feedback ${
                showAnomalies ? 'text-error bg-error/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title="Toggle anomaly highlighting"
            >
              <Icon name="AlertTriangle" size={16} />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg hover-feedback">
              <Icon name="Download" size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Control Limits Info */}
      {showControlLimits && (
        <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Upper Control</p>
            <p className="text-sm font-medium text-error">{controlLimits?.[selectedMetric]?.upperControl}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Upper Warning</p>
            <p className="text-sm font-medium text-warning">{controlLimits?.[selectedMetric]?.upperWarning}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Target</p>
            <p className="text-sm font-medium text-success">{controlLimits?.[selectedMetric]?.target}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Lower Warning</p>
            <p className="text-sm font-medium text-warning">{controlLimits?.[selectedMetric]?.lowerWarning}</p>
          </div>
        </div>
      )}
      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={controlData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Control Limits */}
            {showControlLimits && (
              <>
                <ReferenceLine 
                  y={controlLimits?.[selectedMetric]?.upperControl} 
                  stroke="#DC2626" 
                  strokeDasharray="5 5"
                  label={{ value: "UCL", position: "topRight" }}
                />
                <ReferenceLine 
                  y={controlLimits?.[selectedMetric]?.upperWarning} 
                  stroke="#F59E0B" 
                  strokeDasharray="3 3"
                  label={{ value: "UWL", position: "topRight" }}
                />
                <ReferenceLine 
                  y={controlLimits?.[selectedMetric]?.target} 
                  stroke="#10B981" 
                  strokeDasharray="1 1"
                  label={{ value: "Target", position: "topRight" }}
                />
                <ReferenceLine 
                  y={controlLimits?.[selectedMetric]?.lowerWarning} 
                  stroke="#F59E0B" 
                  strokeDasharray="3 3"
                  label={{ value: "LWL", position: "bottomRight" }}
                />
              </>
            )}
            
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric?.color}
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 4, fill: currentMetric?.color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-foreground">
              {getAnomalyPoints()?.length}
            </p>
            <p className="text-xs text-muted-foreground">Out of Control Points</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">
              {controlData?.length > 0 ? Math.round(controlData?.reduce((sum, item) => sum + item?.[selectedMetric], 0) / controlData?.length * 10) / 10 : 0}
            </p>
            <p className="text-xs text-muted-foreground">Average {currentMetric?.label}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">
              {controlData?.length > 0 ? Math.round((1 - getAnomalyPoints()?.length / controlData?.length) * 100) : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Process Capability</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">
              {controlData?.length > 0 ? Math.round(Math.sqrt(controlData?.reduce((sum, item) => sum + Math.pow(item?.[selectedMetric] - controlLimits?.[selectedMetric]?.target, 2), 0) / controlData?.length) * 10) / 10 : 0}
            </p>
            <p className="text-xs text-muted-foreground">Standard Deviation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityControlChart;