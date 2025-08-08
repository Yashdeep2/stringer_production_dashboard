import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const location = useLocation();
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const navigationItems = [
    {
      label: 'Production Overview',
      path: '/production-overview-dashboard',
      icon: 'Activity',
      tooltip: 'Real-time production monitoring and status'
    },
    {
      label: 'Quality Control',
      path: '/quality-control-analytics-dashboard',
      icon: 'CheckCircle',
      tooltip: 'Quality analytics and NG pattern analysis'
    },
    {
      label: 'Data Entry',
      path: '/data-entry-validation-dashboard',
      icon: 'Edit3',
      tooltip: 'Production data capture and validation'
    },
    {
      label: 'Performance Analytics',
      path: '/performance-analytics-dashboard',
      icon: 'BarChart3',
      tooltip: 'Strategic performance analysis and trends'
    }
  ];

  const handleTabClick = (path) => {
    window.location.href = path;
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
    window.location?.reload();
  };

  const getStatusColor = () => {
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

  const getStatusIcon = () => {
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

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border industrial-shadow">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="Factory" size={24} color="white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Stringer Production</h1>
            <p className="text-sm text-muted-foreground">Manufacturing Dashboard</p>
          </div>
        </div>

        {/* Real-time Status Indicator */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
            <Icon 
              name={getStatusIcon()} 
              size={16} 
              className={`${getStatusColor()} status-transition`}
            />
            <span className="text-sm font-medium text-foreground">
              {connectionStatus === 'connected' ? 'Live' : 'Offline'}
            </span>
            <span className="text-xs text-muted-foreground">
              {lastUpdate?.toLocaleTimeString()}
            </span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 text-muted-foreground hover:text-foreground hover-feedback rounded-lg hover:bg-muted"
            title="Refresh data"
          >
            <Icon name="RefreshCw" size={18} />
          </button>
        </div>
      </div>
      {/* Primary Tab Navigation */}
      <nav className="border-t border-border">
        <div className="flex items-center px-6">
          {navigationItems?.map((item) => {
            const isActive = location.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleTabClick(item?.path)}
                className={`
                  flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 hover-feedback
                  ${isActive 
                    ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      {/* Context-Sensitive Action Bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              Last updated: {lastUpdate?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {location.pathname === '/production-overview-dashboard' && (
              <>
                <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover-feedback rounded">
                  Export Report
                </button>
                <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover-feedback rounded">
                  View Settings
                </button>
              </>
            )}
            {location.pathname === '/quality-control-analytics-dashboard' && (
              <>
                <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover-feedback rounded">
                  Export Analysis
                </button>
                <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover-feedback rounded">
                  Filter Data
                </button>
              </>
            )}
            {location.pathname === '/data-entry-validation-dashboard' && (
              <>
                <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover-feedback rounded">
                  Batch Import
                </button>
                <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover-feedback rounded">
                  Validation Rules
                </button>
              </>
            )}
            {location.pathname === '/performance-analytics-dashboard' && (
              <>
                <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover-feedback rounded">
                  Generate Report
                </button>
                <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover-feedback rounded">
                  Compare Periods
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;