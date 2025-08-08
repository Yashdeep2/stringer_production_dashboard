import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ stringer, modulesProduced, hourlyTarget, efficiency, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'on-target':
        return 'text-success border-success/20 bg-success/5';
      case 'warning':
        return 'text-warning border-warning/20 bg-warning/5';
      case 'critical':
        return 'text-error border-error/20 bg-error/5';
      default:
        return 'text-muted-foreground border-border bg-card';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'on-target':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'critical':
        return 'XCircle';
      default:
        return 'Activity';
    }
  };

  const progressPercentage = Math.min((modulesProduced / hourlyTarget) * 100, 100);

  return (
    <div className={`p-4 rounded-lg border-2 industrial-shadow hover-feedback ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Factory" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">{stringer}</h3>
        </div>
        <Icon name={getStatusIcon()} size={18} className={getStatusColor()?.split(' ')?.[0]} />
      </div>
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{modulesProduced}</p>
            <p className="text-sm text-muted-foreground">Modules Produced</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-muted-foreground">/{hourlyTarget}</p>
            <p className="text-xs text-muted-foreground">Target</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{efficiency}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                status === 'on-target' ? 'bg-success' : 
                status === 'warning' ? 'bg-warning' : 
                status === 'critical' ? 'bg-error' : 'bg-primary'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICard;