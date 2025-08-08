import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DateRangeSelector = ({ onDateRangeChange, onComparisonToggle }) => {
  const [selectedRange, setSelectedRange] = useState('7d');
  const [comparisonMode, setComparisonMode] = useState('none');
  const [customRange, setCustomRange] = useState({
    start: '',
    end: ''
  });
  const [showCustom, setShowCustom] = useState(false);

  const predefinedRanges = [
    { value: '24h', label: 'Last 24 Hours', icon: 'Clock' },
    { value: '7d', label: 'Last 7 Days', icon: 'Calendar' },
    { value: '30d', label: 'Last 30 Days', icon: 'CalendarDays' },
    { value: '90d', label: 'Last 90 Days', icon: 'CalendarRange' },
    { value: 'custom', label: 'Custom Range', icon: 'Settings' }
  ];

  const comparisonOptions = [
    { value: 'none', label: 'No Comparison' },
    { value: 'previous', label: 'Previous Period' },
    { value: 'year', label: 'Same Period Last Year' }
  ];

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    if (range === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onDateRangeChange(range);
    }
  };

  const handleCustomRangeApply = () => {
    if (customRange?.start && customRange?.end) {
      onDateRangeChange(customRange);
      setShowCustom(false);
    }
  };

  const handleComparisonChange = (mode) => {
    setComparisonMode(mode);
    onComparisonToggle(mode);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 industrial-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Date Range & Analysis</h3>
        <Icon name="Calendar" size={16} className="text-muted-foreground" />
      </div>
      {/* Predefined Ranges */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-4">
        {predefinedRanges?.map((range) => (
          <button
            key={range?.value}
            onClick={() => handleRangeSelect(range?.value)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium hover-feedback
              ${selectedRange === range?.value 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }
            `}
          >
            <Icon name={range?.icon} size={14} />
            <span className="hidden sm:inline">{range?.label}</span>
            <span className="sm:hidden">{range?.value?.toUpperCase()}</span>
          </button>
        ))}
      </div>
      {/* Custom Range Inputs */}
      {showCustom && (
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Start Date</label>
              <input
                type="datetime-local"
                value={customRange?.start}
                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e?.target?.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1">End Date</label>
              <input
                type="datetime-local"
                value={customRange?.end}
                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e?.target?.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCustomRangeApply}
              iconName="Check"
              className="mt-5"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
      {/* Comparison Options */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-muted-foreground">Comparison Mode</label>
        <div className="flex space-x-2">
          {comparisonOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => handleComparisonChange(option?.value)}
              className={`
                px-3 py-1 rounded text-xs font-medium hover-feedback
                ${comparisonMode === option?.value 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              {option?.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;