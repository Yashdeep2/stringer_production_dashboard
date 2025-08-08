import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const QualityFilters = ({ onFiltersChange, stringers }) => {
  const [dateRange, setDateRange] = useState('24h');
  const [selectedStringers, setSelectedStringers] = useState([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [shiftFilter, setShiftFilter] = useState('all');

  const dateRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '3d', label: 'Last 3 Days' },
    { value: '1w', label: 'Last Week' },
    { value: '1m', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const stringerOptions = stringers?.map(stringer => ({
    value: stringer?.id,
    label: stringer?.name,
    description: `${stringer?.trackCount} tracks`
  }));

  const shiftOptions = [
    { value: 'all', label: 'All Shifts' },
    { value: 'shift1', label: 'Shift 1 (6AM-2PM)' },
    { value: 'shift2', label: 'Shift 2 (2PM-10PM)' },
    { value: 'shift3', label: 'Shift 3 (10PM-6AM)' }
  ];

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    onFiltersChange({
      dateRange: value,
      selectedStringers,
      comparisonMode,
      shiftFilter
    });
  };

  const handleStringersChange = (value) => {
    setSelectedStringers(value);
    onFiltersChange({
      dateRange,
      selectedStringers: value,
      comparisonMode,
      shiftFilter
    });
  };

  const handleComparisonToggle = () => {
    const newMode = !comparisonMode;
    setComparisonMode(newMode);
    onFiltersChange({
      dateRange,
      selectedStringers,
      comparisonMode: newMode,
      shiftFilter
    });
  };

  const handleShiftChange = (value) => {
    setShiftFilter(value);
    onFiltersChange({
      dateRange,
      selectedStringers,
      comparisonMode,
      shiftFilter: value
    });
  };

  const resetFilters = () => {
    setDateRange('24h');
    setSelectedStringers([]);
    setComparisonMode(false);
    setShiftFilter('all');
    onFiltersChange({
      dateRange: '24h',
      selectedStringers: [],
      comparisonMode: false,
      shiftFilter: 'all'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 industrial-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quality Analysis Filters</h3>
        <button
          onClick={resetFilters}
          className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground border border-border rounded hover:bg-muted hover-feedback"
        >
          Reset Filters
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range Filter */}
        <div>
          <Select
            label="Time Period"
            options={dateRangeOptions}
            value={dateRange}
            onChange={handleDateRangeChange}
            className="w-full"
          />
        </div>

        {/* Stringer Multi-Select */}
        <div>
          <Select
            label="Stringers"
            options={stringerOptions}
            value={selectedStringers}
            onChange={handleStringersChange}
            multiple
            searchable
            placeholder="Select stringers..."
            className="w-full"
          />
        </div>

        {/* Shift Filter */}
        <div>
          <Select
            label="Shift"
            options={shiftOptions}
            value={shiftFilter}
            onChange={handleShiftChange}
            className="w-full"
          />
        </div>

        {/* Comparison Mode Toggle */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Analysis Mode
          </label>
          <button
            onClick={handleComparisonToggle}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border hover-feedback ${
              comparisonMode
                ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={comparisonMode ? 'GitCompare' : 'BarChart3'} size={16} />
            <span className="text-sm font-medium">
              {comparisonMode ? 'Comparison Mode' : 'Standard View'}
            </span>
          </button>
        </div>
      </div>
      {/* Active Filters Display */}
      {(selectedStringers?.length > 0 || dateRange !== '24h' || shiftFilter !== 'all' || comparisonMode) && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {dateRange !== '24h' && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {dateRangeOptions?.find(opt => opt?.value === dateRange)?.label}
              </span>
            )}
            
            {selectedStringers?.length > 0 && (
              <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                {selectedStringers?.length} Stringer{selectedStringers?.length > 1 ? 's' : ''}
              </span>
            )}
            
            {shiftFilter !== 'all' && (
              <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">
                {shiftOptions?.find(opt => opt?.value === shiftFilter)?.label}
              </span>
            )}
            
            {comparisonMode && (
              <span className="px-2 py-1 bg-accent/10 text-accent-foreground text-xs rounded-full">
                Comparison Mode
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityFilters;