import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ControlPanel = ({ 
  selectedDateRange, 
  onDateRangeChange, 
  selectedShift, 
  onShiftChange, 
  autoRefresh, 
  onAutoRefreshToggle,
  onExportReport,
  onRefreshData 
}) => {
  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const shiftOptions = [
    { value: 'all', label: 'All Shifts' },
    { value: 'shift1', label: 'Shift 1 (06:00-14:00)' },
    { value: 'shift2', label: 'Shift 2 (14:00-22:00)' },
    { value: 'shift3', label: 'Shift 3 (22:00-06:00)' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4 industrial-shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
        {/* Date Range Selector */}
        <div className="lg:col-span-2">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={selectedDateRange}
            onChange={onDateRangeChange}
            className="w-full"
          />
        </div>

        {/* Shift Selector */}
        <div className="lg:col-span-2">
          <Select
            label="Shift"
            options={shiftOptions}
            value={selectedShift}
            onChange={onShiftChange}
            className="w-full"
          />
        </div>

        {/* Auto Refresh Toggle */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Auto Refresh</label>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={onAutoRefreshToggle}
            iconName={autoRefresh ? "Pause" : "Play"}
            iconPosition="left"
            className="w-full"
          >
            {autoRefresh ? "On" : "Off"}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onRefreshData}
              iconName="RefreshCw"
              size="sm"
              className="flex-1"
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              onClick={onExportReport}
              iconName="Download"
              size="sm"
              className="flex-1"
            >
              Export
            </Button>
          </div>
        </div>
      </div>
      {/* Status Indicators */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`}></div>
            <span className="text-muted-foreground">
              {autoRefresh ? 'Auto-refreshing every 30s' : 'Manual refresh mode'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;