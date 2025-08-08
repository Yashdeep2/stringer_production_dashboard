import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import KPIMetricCard from './components/KPIMetricCard';
import DateRangeSelector from './components/DateRangeSelector';
import ProductionTrendChart from './components/ProductionTrendChart';
import PerformanceRankingPanel from './components/PerformanceRankingPanel';
import DetailedDataGrid from './components/DetailedDataGrid';
import AdvancedAnalyticsPanel from './components/AdvancedAnalyticsPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PerformanceAnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [comparisonMode, setComparisonMode] = useState('none');
  const [selectedStringer, setSelectedStringer] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    console.log('Date range changed:', range);
  };

  const handleComparisonToggle = (mode) => {
    setComparisonMode(mode);
    console.log('Comparison mode:', mode);
  };

  const handleStringerSelect = (stringer) => {
    setSelectedStringer(stringer);
    console.log('Selected stringer:', stringer);
  };

  const handleExportSelection = (selectedIds) => {
    console.log('Exporting selected rows:', selectedIds);
  };

  const handleGenerateReport = () => {
    console.log('Generating performance report');
  };

  const handleScheduleReport = () => {
    console.log('Scheduling report');
  };

  // Mock KPI data
  const kpiData = [
    {
      title: 'Production Efficiency',
      value: '89.4',
      unit: '%',
      trend: 'up',
      trendValue: 2.3,
      benchmark: '85%',
      icon: 'Activity',
      color: 'primary',
      description: 'Overall production efficiency score'
    },
    {
      title: 'Avg Modules/Hour',
      value: '46.8',
      unit: 'modules',
      trend: 'up',
      trendValue: 1.8,
      benchmark: '45',
      icon: 'Package',
      color: 'success',
      description: 'Average module production rate'
    },
    {
      title: 'Capacity Utilization',
      value: '82.7',
      unit: '%',
      trend: 'stable',
      trendValue: 0.2,
      benchmark: '80%',
      icon: 'Gauge',
      color: 'secondary',
      description: 'Equipment capacity utilization'
    },
    {
      title: 'Performance Variance',
      value: '7.2',
      unit: '%',
      trend: 'down',
      trendValue: -1.5,
      benchmark: '10%',
      icon: 'TrendingDown',
      color: 'warning',
      description: 'Performance consistency metric'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Performance Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive production insights and efficiency analysis for manufacturing optimization
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} />
                  <span>Last updated: {lastUpdate?.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Database" size={14} />
                  <span>Real-time data</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="FileText"
                iconPosition="left"
                onClick={handleGenerateReport}
              >
                Generate Report
              </Button>
              <Button
                variant="outline"
                iconName="Calendar"
                iconPosition="left"
                onClick={handleScheduleReport}
              >
                Schedule Report
              </Button>
              <Button
                variant="default"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => setLastUpdate(new Date())}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="mb-8">
            <DateRangeSelector
              onDateRangeChange={handleDateRangeChange}
              onComparisonToggle={handleComparisonToggle}
            />
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData?.map((kpi, index) => (
              <KPIMetricCard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                unit={kpi?.unit}
                trend={kpi?.trend}
                trendValue={kpi?.trendValue}
                benchmark={kpi?.benchmark}
                icon={kpi?.icon}
                color={kpi?.color}
                description={kpi?.description}
              />
            ))}
          </div>

          {/* Main Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Production Trend Chart */}
            <div className="lg:col-span-3">
              <ProductionTrendChart
                comparisonData={comparisonMode !== 'none' ? [] : null}
                showComparison={comparisonMode !== 'none'}
              />
            </div>

            {/* Performance Ranking Panel */}
            <div className="lg:col-span-1">
              <PerformanceRankingPanel
                onStringerSelect={handleStringerSelect}
              />
            </div>
          </div>

          {/* Advanced Analytics */}
          <div className="mb-8">
            <AdvancedAnalyticsPanel />
          </div>

          {/* Detailed Data Grid */}
          <div className="mb-8">
            <DetailedDataGrid
              onExportSelection={handleExportSelection}
            />
          </div>

          {/* Selected Stringer Details */}
          {selectedStringer && (
            <div className="bg-card border border-border rounded-lg p-6 industrial-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedStringer?.name} - Detailed Analysis
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="X"
                  onClick={() => setSelectedStringer(null)}
                >
                  Close
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Activity" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">Efficiency</span>
                  </div>
                  <p className="text-xl font-bold text-primary">{selectedStringer?.efficiency}%</p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Package" size={16} className="text-success" />
                    <span className="text-sm font-medium text-foreground">Modules</span>
                  </div>
                  <p className="text-xl font-bold text-success">{selectedStringer?.modulesProduced}</p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Gauge" size={16} className="text-secondary" />
                    <span className="text-sm font-medium text-foreground">Utilization</span>
                  </div>
                  <p className="text-xl font-bold text-secondary">{selectedStringer?.utilization}%</p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="CheckCircle" size={16} className="text-warning" />
                    <span className="text-sm font-medium text-foreground">Quality</span>
                  </div>
                  <p className="text-xl font-bold text-warning">{selectedStringer?.qualityScore}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PerformanceAnalyticsDashboard;