import React from 'react';
import Icon from '../../../components/AppIcon';

const QualityMetricsStrip = ({ qualityData, timeRange }) => {
  const metrics = [
    {
      id: 'overall-quality',
      title: 'Overall Quality Rate',
      value: `${qualityData?.overallQualityRate}%`,
      change: qualityData?.qualityRateChange,
      trend: qualityData?.qualityRateTrend,
      icon: 'CheckCircle',
      color: qualityData?.overallQualityRate >= 95 ? 'text-success' : qualityData?.overallQualityRate >= 90 ? 'text-warning' : 'text-error',
      bgColor: qualityData?.overallQualityRate >= 95 ? 'bg-success/10' : qualityData?.overallQualityRate >= 90 ? 'bg-warning/10' : 'bg-error/10'
    },
    {
      id: 'total-ng',
      title: 'Total NG Strings',
      value: qualityData?.totalNGStrings?.toLocaleString(),
      change: qualityData?.ngStringsChange,
      trend: qualityData?.ngStringsTrend,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      id: 'problematic-stringer',
      title: 'Top Problematic Stringer',
      value: qualityData?.topProblematicStringer?.name,
      change: `${qualityData?.topProblematicStringer?.ngRate}% NG Rate`,
      trend: qualityData?.topProblematicStringer?.trend,
      icon: 'AlertCircle',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      id: 'quality-trend',
      title: 'Quality Trend Direction',
      value: qualityData?.trendDirection?.status,
      change: qualityData?.trendDirection?.description,
      trend: qualityData?.trendDirection?.direction,
      icon: qualityData?.trendDirection?.direction === 'up' ? 'TrendingUp' : qualityData?.trendDirection?.direction === 'down' ? 'TrendingDown' : 'Minus',
      color: qualityData?.trendDirection?.direction === 'up' ? 'text-success' : qualityData?.trendDirection?.direction === 'down' ? 'text-error' : 'text-muted-foreground',
      bgColor: qualityData?.trendDirection?.direction === 'up' ? 'bg-success/10' : qualityData?.trendDirection?.direction === 'down' ? 'bg-error/10' : 'bg-muted/10'
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up') return 'ArrowUp';
    if (trend === 'down') return 'ArrowDown';
    return 'Minus';
  };

  const getTrendColor = (trend, metricType) => {
    if (metricType === 'quality-rate') {
      return trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-muted-foreground';
    } else if (metricType === 'ng-strings') {
      return trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-muted-foreground';
    }
    return trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-muted-foreground';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="bg-card border border-border rounded-lg p-6 industrial-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${metric?.bgColor}`}>
              <Icon name={metric?.icon} size={24} className={metric?.color} />
            </div>
            <div className="flex items-center space-x-1">
              <Icon 
                name={getTrendIcon(metric?.trend)} 
                size={16} 
                className={getTrendColor(metric?.trend, metric?.id?.includes('quality') ? 'quality-rate' : 'ng-strings')}
              />
              <span className={`text-sm font-medium ${getTrendColor(metric?.trend, metric?.id?.includes('quality') ? 'quality-rate' : 'ng-strings')}`}>
                {metric?.change}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{metric?.title}</h3>
            <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
          </div>

          {/* Mini Sparkline Placeholder */}
          <div className="mt-4 h-8 bg-muted/30 rounded flex items-end justify-between px-1">
            {Array.from({ length: 12 })?.map((_, index) => (
              <div
                key={index}
                className={`w-1 rounded-t ${metric?.color?.replace('text-', 'bg-')}/60`}
                style={{ height: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QualityMetricsStrip;