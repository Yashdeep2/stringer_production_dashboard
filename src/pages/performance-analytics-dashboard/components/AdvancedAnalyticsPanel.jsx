import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdvancedAnalyticsPanel = () => {
  const [activeAnalysis, setActiveAnalysis] = useState('forecasting');

  const forecastData = [
    { period: 'Current', actual: 142, predicted: 142, confidence: 95 },
    { period: 'Next Hour', actual: null, predicted: 145, confidence: 92 },
    { period: '+2 Hours', actual: null, predicted: 148, confidence: 88 },
    { period: '+3 Hours', actual: null, predicted: 144, confidence: 85 },
    { period: '+4 Hours', actual: null, predicted: 147, confidence: 82 },
    { period: '+5 Hours', actual: null, predicted: 149, confidence: 78 }
  ];

  const anomalyData = [
    { time: '00:00', efficiency: 85, anomaly: false, severity: 0 },
    { time: '01:00', efficiency: 88, anomaly: false, severity: 0 },
    { time: '02:00', efficiency: 92, anomaly: false, severity: 0 },
    { time: '03:00', efficiency: 67, anomaly: true, severity: 3 },
    { time: '04:00', efficiency: 90, anomaly: false, severity: 0 },
    { time: '05:00', efficiency: 94, anomaly: false, severity: 0 },
    { time: '06:00', efficiency: 89, anomaly: false, severity: 0 },
    { time: '07:00', efficiency: 72, anomaly: true, severity: 2 },
    { time: '08:00', efficiency: 86, anomaly: false, severity: 0 },
    { time: '09:00', efficiency: 93, anomaly: false, severity: 0 }
  ];

  const efficiencyScores = [
    { stringer: 'STR-001', score: 94.2, category: 'Excellent', color: '#10B981' },
    { stringer: 'STR-002', score: 91.7, category: 'Very Good', color: '#059669' },
    { stringer: 'STR-003', score: 89.3, category: 'Good', color: '#1E40AF' },
    { stringer: 'STR-004', score: 86.8, category: 'Fair', color: '#F59E0B' },
    { stringer: 'STR-005', score: 84.1, category: 'Needs Attention', color: '#EF4444' },
    { stringer: 'STR-006', score: 81.5, category: 'Critical', color: '#DC2626' }
  ];

  const analysisTypes = [
    { key: 'forecasting', label: 'Production Forecasting', icon: 'TrendingUp' },
    { key: 'anomaly', label: 'Anomaly Detection', icon: 'AlertTriangle' },
    { key: 'efficiency', label: 'Efficiency Scoring', icon: 'Target' }
  ];

  const getAnomalyColor = (anomaly, severity) => {
    if (!anomaly) return '#10B981';
    switch (severity) {
      case 1: return '#F59E0B';
      case 2: return '#EF4444';
      case 3: return '#DC2626';
      default: return '#10B981';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 industrial-shadow">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value}${entry?.name?.includes('confidence') ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderForecastingAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-2">Production Forecast Model</h4>
        <p className="text-sm text-muted-foreground mb-4">
          AI-powered forecasting based on historical patterns, current performance, and external factors.
        </p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="period" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="actual" fill="var(--color-primary)" name="Actual" />
              <Bar dataKey="predicted" fill="var(--color-secondary)" name="Predicted" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Forecast Accuracy</span>
          </div>
          <p className="text-xl font-bold text-success">94.2%</p>
          <p className="text-xs text-success/80">Last 30 predictions</p>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Next Hour Prediction</span>
          </div>
          <p className="text-xl font-bold text-primary">145 modules</p>
          <p className="text-xs text-primary/80">92% confidence</p>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertCircle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Risk Assessment</span>
          </div>
          <p className="text-xl font-bold text-warning">Low</p>
          <p className="text-xs text-warning/80">Stable conditions</p>
        </div>
      </div>
    </div>
  );

  const renderAnomalyDetection = () => (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-2">Anomaly Detection Results</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Statistical analysis identifying unusual patterns and performance deviations.
        </p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={anomalyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter dataKey="efficiency" name="Efficiency">
                {anomalyData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getAnomalyColor(entry?.anomaly, entry?.severity)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">Anomalies Detected</span>
          </div>
          <p className="text-xl font-bold text-error">2</p>
          <p className="text-xs text-error/80">In last 10 hours</p>
        </div>

        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Detection Accuracy</span>
          </div>
          <p className="text-xl font-bold text-success">97.8%</p>
          <p className="text-xs text-success/80">Model performance</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h5 className="font-medium text-foreground mb-3">Recent Anomalies</h5>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-error/5 rounded">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={14} className="text-error" />
              <span className="text-sm text-foreground">03:00 - Efficiency Drop</span>
            </div>
            <span className="text-xs text-error font-medium">High Severity</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-warning/5 rounded">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={14} className="text-warning" />
              <span className="text-sm text-foreground">07:00 - Performance Dip</span>
            </div>
            <span className="text-xs text-warning font-medium">Medium Severity</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEfficiencyScoring = () => (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-2">Efficiency Scoring Algorithm</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Multi-factor scoring system evaluating production efficiency, quality, and consistency.
        </p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={efficiencyScores} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis dataKey="stringer" type="category" stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" name="Efficiency Score">
                {efficiencyScores?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Award" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Top Performer</span>
          </div>
          <p className="text-xl font-bold text-success">STR-001</p>
          <p className="text-xs text-success/80">94.2% efficiency</p>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="BarChart3" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Average Score</span>
          </div>
          <p className="text-xl font-bold text-primary">87.9%</p>
          <p className="text-xs text-primary/80">All stringers</p>
        </div>

        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">Needs Attention</span>
          </div>
          <p className="text-xl font-bold text-error">2 Units</p>
          <p className="text-xs text-error/80">Below 85% threshold</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h5 className="font-medium text-foreground mb-3">Scoring Factors</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Production Rate</span>
              <span className="text-sm font-medium text-foreground">35%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Quality Score</span>
              <span className="text-sm font-medium text-foreground">30%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Consistency</span>
              <span className="text-sm font-medium text-foreground">20%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Utilization</span>
              <span className="text-sm font-medium text-foreground">10%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Downtime</span>
              <span className="text-sm font-medium text-foreground">5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 industrial-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Advanced Analytics</h3>
          <p className="text-sm text-muted-foreground">AI-powered insights and predictive analysis</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Settings"
          onClick={() => console.log('Configure analytics')}
        >
          Configure
        </Button>
      </div>
      {/* Analysis Type Selector */}
      <div className="flex space-x-2 mb-6 p-1 bg-muted/50 rounded-lg">
        {analysisTypes?.map((type) => (
          <button
            key={type?.key}
            onClick={() => setActiveAnalysis(type?.key)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium hover-feedback flex-1
              ${activeAnalysis === type?.key 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }
            `}
          >
            <Icon name={type?.icon} size={16} />
            <span className="hidden sm:inline">{type?.label}</span>
          </button>
        ))}
      </div>
      {/* Analysis Content */}
      <div className="min-h-96">
        {activeAnalysis === 'forecasting' && renderForecastingAnalysis()}
        {activeAnalysis === 'anomaly' && renderAnomalyDetection()}
        {activeAnalysis === 'efficiency' && renderEfficiencyScoring()}
      </div>
    </div>
  );
};

export default AdvancedAnalyticsPanel;