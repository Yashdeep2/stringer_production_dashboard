import React from 'react';
import Icon from '../../../components/AppIcon';

const KPIMetricCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  trendValue, 
  benchmark, 
  icon, 
  color = 'primary',
  description 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success/10 border-success/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'error':
        return 'bg-error/10 border-error/20';
      default:
        return 'bg-primary/10 border-primary/20';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 industrial-shadow hover-feedback ${getColorClasses()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-${color}/20`}>
            <Icon name={icon} size={20} className={`text-${color}`} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground/80">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name={getTrendIcon()} size={16} className={getTrendColor()} />
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trendValue}%
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        
        {benchmark && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground">Benchmark:</span>
            <span className="font-medium text-foreground">{benchmark}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIMetricCard;