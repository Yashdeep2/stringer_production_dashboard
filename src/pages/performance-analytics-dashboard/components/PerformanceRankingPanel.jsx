import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceRankingPanel = ({ onStringerSelect }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [sortBy, setSortBy] = useState('efficiency');

  const stringerPerformance = [
    {
      id: 'STR-001',
      name: 'Stringer 1',
      efficiency: 94.2,
      modulesProduced: 156,
      utilization: 88.5,
      qualityScore: 96.8,
      trend: 'up',
      trendValue: 2.3,
      status: 'optimal',
      lastUpdate: '2 min ago'
    },
    {
      id: 'STR-002',
      name: 'Stringer 2',
      efficiency: 91.7,
      modulesProduced: 148,
      utilization: 85.2,
      qualityScore: 94.1,
      trend: 'up',
      trendValue: 1.8,
      status: 'good',
      lastUpdate: '3 min ago'
    },
    {
      id: 'STR-003',
      name: 'Stringer 3',
      efficiency: 89.3,
      modulesProduced: 142,
      utilization: 82.7,
      qualityScore: 92.5,
      trend: 'stable',
      trendValue: 0.2,
      status: 'good',
      lastUpdate: '1 min ago'
    },
    {
      id: 'STR-004',
      name: 'Stringer 4',
      efficiency: 86.8,
      modulesProduced: 138,
      utilization: 79.4,
      qualityScore: 90.2,
      trend: 'down',
      trendValue: -1.5,
      status: 'attention',
      lastUpdate: '4 min ago'
    },
    {
      id: 'STR-005',
      name: 'Stringer 5',
      efficiency: 84.1,
      modulesProduced: 134,
      utilization: 76.8,
      qualityScore: 88.7,
      trend: 'down',
      trendValue: -2.1,
      status: 'attention',
      lastUpdate: '2 min ago'
    },
    {
      id: 'STR-006',
      name: 'Stringer 6',
      efficiency: 81.5,
      modulesProduced: 129,
      utilization: 74.2,
      qualityScore: 86.3,
      trend: 'down',
      trendValue: -3.2,
      status: 'critical',
      lastUpdate: '5 min ago'
    }
  ];

  const correlationInsights = [
    {
      title: 'Efficiency vs Quality',
      correlation: 0.87,
      insight: 'Strong positive correlation between efficiency and quality scores',
      icon: 'TrendingUp'
    },
    {
      title: 'Utilization Impact',
      correlation: 0.72,
      insight: 'Higher utilization generally leads to better module output',
      icon: 'Activity'
    },
    {
      title: 'Performance Variance',
      correlation: -0.65,
      insight: 'Lower variance indicates more consistent performance',
      icon: 'BarChart3'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'text-success bg-success/10 border-success/20';
      case 'good': return 'text-primary bg-primary/10 border-primary/20';
      case 'attention': return 'text-warning bg-warning/10 border-warning/20';
      case 'critical': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const sortedStringers = [...stringerPerformance]?.sort((a, b) => {
    switch (sortBy) {
      case 'efficiency': return b?.efficiency - a?.efficiency;
      case 'modules': return b?.modulesProduced - a?.modulesProduced;
      case 'utilization': return b?.utilization - a?.utilization;
      case 'quality': return b?.qualityScore - a?.qualityScore;
      default: return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Performance Ranking */}
      <div className="bg-card border border-border rounded-lg p-6 industrial-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Performance Ranking</h3>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-1 bg-background border border-border rounded text-sm"
            >
              <option value="efficiency">Efficiency</option>
              <option value="modules">Modules</option>
              <option value="utilization">Utilization</option>
              <option value="quality">Quality</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {sortedStringers?.map((stringer, index) => (
            <div
              key={stringer?.id}
              onClick={() => onStringerSelect && onStringerSelect(stringer)}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer hover-feedback"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full">
                  <span className="text-sm font-bold text-primary">#{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{stringer?.name}</h4>
                  <p className="text-xs text-muted-foreground">{stringer?.lastUpdate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {sortBy === 'efficiency' && `${stringer?.efficiency}%`}
                    {sortBy === 'modules' && `${stringer?.modulesProduced}`}
                    {sortBy === 'utilization' && `${stringer?.utilization}%`}
                    {sortBy === 'quality' && `${stringer?.qualityScore}%`}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={getTrendIcon(stringer?.trend)} 
                      size={12} 
                      className={getTrendColor(stringer?.trend)} 
                    />
                    <span className={`text-xs ${getTrendColor(stringer?.trend)}`}>
                      {Math.abs(stringer?.trendValue)}%
                    </span>
                  </div>
                </div>

                <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(stringer?.status)}`}>
                  {stringer?.status?.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Statistical Insights */}
      <div className="bg-card border border-border rounded-lg p-6 industrial-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Statistical Insights</h3>
          <Icon name="BarChart3" size={20} className="text-muted-foreground" />
        </div>

        <div className="space-y-4">
          {correlationInsights?.map((insight, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Icon name={insight?.icon} size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{insight?.title}</h4>
                    <span className="text-sm font-semibold text-primary">
                      r = {insight?.correlation}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight?.insight}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6 industrial-shadow">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            fullWidth
            iconName="FileText"
            iconPosition="left"
            onClick={() => console.log('Generate performance report')}
          >
            Generate Report
          </Button>
          <Button
            variant="outline"
            fullWidth
            iconName="Settings"
            iconPosition="left"
            onClick={() => console.log('Configure alerts')}
          >
            Configure Alerts
          </Button>
          <Button
            variant="outline"
            fullWidth
            iconName="Download"
            iconPosition="left"
            onClick={() => console.log('Export data')}
          >
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceRankingPanel;