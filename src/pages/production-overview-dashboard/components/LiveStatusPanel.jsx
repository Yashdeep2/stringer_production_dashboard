import React from 'react';
import Icon from '../../../components/AppIcon';

const LiveStatusPanel = ({ connectionStatus, lastUpdate, shiftSummary, qualityAlerts }) => {
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Wifi';
      case 'warning':
        return 'WifiOff';
      case 'error':
        return 'AlertTriangle';
      default:
        return 'Loader';
    }
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'AlertCircle';
      case 'low':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-card rounded-lg border border-border p-4 industrial-shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">System Status</h3>
          <Icon 
            name={getConnectionIcon()} 
            size={18} 
            className={`${getConnectionStatusColor()} status-transition`}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Connection:</span>
            <span className={`font-medium ${getConnectionStatusColor()}`}>
              {connectionStatus === 'connected' ? 'Live' : 'Offline'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Update:</span>
            <span className="font-medium text-foreground">
              {lastUpdate?.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      {/* Shift Summary */}
      <div className="bg-card rounded-lg border border-border p-4 industrial-shadow">
        <h3 className="font-semibold text-foreground mb-3">Current Shift Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Modules:</span>
            <span className="text-lg font-bold text-foreground">{shiftSummary?.totalModules}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Target Achievement:</span>
            <span className={`text-sm font-semibold ${
              shiftSummary?.targetAchievement >= 100 ? 'text-success' : 
              shiftSummary?.targetAchievement >= 80 ? 'text-warning' : 'text-error'
            }`}>
              {shiftSummary?.targetAchievement}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Quality Rate:</span>
            <span className={`text-sm font-semibold ${
              shiftSummary?.qualityRate >= 95 ? 'text-success' : 
              shiftSummary?.qualityRate >= 90 ? 'text-warning' : 'text-error'
            }`}>
              {shiftSummary?.qualityRate}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Active Stringers:</span>
            <span className="text-sm font-medium text-foreground">
              {shiftSummary?.activeStringers}/6
            </span>
          </div>
        </div>
      </div>
      {/* Quality Alerts */}
      <div className="bg-card rounded-lg border border-border p-4 industrial-shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Quality Alerts</h3>
          <Icon name="Bell" size={16} className="text-muted-foreground" />
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {qualityAlerts?.length > 0 ? (
            qualityAlerts?.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-2 rounded bg-muted/50">
                <Icon 
                  name={getAlertIcon(alert.severity)} 
                  size={16} 
                  className={`mt-0.5 ${getAlertColor(alert.severity)}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.timestamp?.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active alerts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveStatusPanel;