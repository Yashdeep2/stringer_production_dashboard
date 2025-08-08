import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import QualityFilters from './components/QualityFilters';
import QualityMetricsStrip from './components/QualityMetricsStrip';
import NGStringDistributionChart from './components/NGStringDistributionChart';
import QualityRankingTable from './components/QualityRankingTable';
import QualityControlChart from './components/QualityControlChart';

const QualityControlAnalyticsDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: '24h',
    selectedStringers: [],
    comparisonMode: false,
    shiftFilter: 'all'
  });

  const [refreshTime, setRefreshTime] = useState(new Date());

  // Mock data for stringers
  const stringers = [
    { id: 'stringer1', name: 'Stringer 1', trackCount: 2, status: 'active' },
    { id: 'stringer2', name: 'Stringer 2', trackCount: 2, status: 'active' },
    { id: 'stringer3', name: 'Stringer 3', trackCount: 2, status: 'active' },
    { id: 'stringer4', name: 'Stringer 4', trackCount: 2, status: 'warning' },
    { id: 'stringer5', name: 'Stringer 5', trackCount: 2, status: 'active' },
    { id: 'stringer6', name: 'Stringer 6', trackCount: 2, status: 'error' }
  ];

  // Mock quality metrics data
  const qualityData = {
    overallQualityRate: 92.5,
    qualityRateChange: '+2.3%',
    qualityRateTrend: 'up',
    totalNGStrings: 1247,
    ngStringsChange: '-8.5%',
    ngStringsTrend: 'down',
    topProblematicStringer: {
      name: 'Stringer 6',
      ngRate: 15.2,
      trend: 'up'
    },
    trendDirection: {
      status: 'Improving',
      description: '+1.2% vs yesterday',
      direction: 'up'
    }
  };

  // Mock NG string distribution chart data
  const ngDistributionData = [
    { time: '00:00', stringer1: 12, stringer2: 8, stringer3: 15, stringer4: 22, stringer5: 9, stringer6: 28 },
    { time: '01:00', stringer1: 10, stringer2: 12, stringer3: 18, stringer4: 25, stringer5: 7, stringer6: 32 },
    { time: '02:00', stringer1: 8, stringer2: 15, stringer3: 12, stringer4: 28, stringer5: 11, stringer6: 35 },
    { time: '03:00', stringer1: 14, stringer2: 9, stringer3: 20, stringer4: 24, stringer5: 8, stringer6: 30 },
    { time: '04:00', stringer1: 11, stringer2: 13, stringer3: 16, stringer4: 26, stringer5: 12, stringer6: 33 },
    { time: '05:00', stringer1: 9, stringer2: 11, stringer3: 14, stringer4: 23, stringer5: 10, stringer6: 29 },
    { time: '06:00', stringer1: 13, stringer2: 7, stringer3: 19, stringer4: 27, stringer5: 6, stringer6: 31 },
    { time: '07:00', stringer1: 15, stringer2: 14, stringer3: 17, stringer4: 29, stringer5: 13, stringer6: 34 },
    { time: '08:00', stringer1: 7, stringer2: 16, stringer3: 13, stringer4: 21, stringer5: 9, stringer6: 27 },
    { time: '09:00', stringer1: 12, stringer2: 10, stringer3: 21, stringer4: 25, stringer5: 14, stringer6: 36 },
    { time: '10:00', stringer1: 16, stringer2: 8, stringer3: 15, stringer4: 30, stringer5: 7, stringer6: 32 },
    { time: '11:00', stringer1: 10, stringer2: 12, stringer3: 18, stringer4: 24, stringer5: 11, stringer6: 28 }
  ];

  // Mock quality ranking data
  const qualityRankingData = [
    {
      id: 'stringer1',
      name: 'Stringer 1',
      trackCount: 2,
      qualityRate: 96.8,
      ngStrings: 142,
      trend: 'up',
      status: 'active',
      trendData: [95.2, 95.8, 96.1, 96.5, 96.8, 96.4, 96.8]
    },
    {
      id: 'stringer2',
      name: 'Stringer 2',
      trackCount: 2,
      qualityRate: 95.4,
      ngStrings: 198,
      trend: 'up',
      status: 'active',
      trendData: [94.8, 95.1, 95.0, 95.3, 95.4, 95.2, 95.4]
    },
    {
      id: 'stringer3',
      name: 'Stringer 3',
      trackCount: 2,
      qualityRate: 94.2,
      ngStrings: 256,
      trend: 'stable',
      status: 'active',
      trendData: [94.0, 94.3, 94.1, 94.2, 94.4, 94.1, 94.2]
    },
    {
      id: 'stringer5',
      name: 'Stringer 5',
      trackCount: 2,
      qualityRate: 93.7,
      ngStrings: 287,
      trend: 'down',
      status: 'active',
      trendData: [94.5, 94.2, 93.9, 93.8, 93.7, 93.6, 93.7]
    },
    {
      id: 'stringer4',
      name: 'Stringer 4',
      trackCount: 2,
      qualityRate: 89.3,
      ngStrings: 445,
      trend: 'down',
      status: 'warning',
      trendData: [91.2, 90.8, 90.1, 89.7, 89.3, 89.1, 89.3]
    },
    {
      id: 'stringer6',
      name: 'Stringer 6',
      trackCount: 2,
      qualityRate: 84.8,
      ngStrings: 672,
      trend: 'down',
      status: 'error',
      trendData: [87.1, 86.5, 85.9, 85.2, 84.8, 84.3, 84.8]
    }
  ];

  // Mock quality control chart data
  const qualityControlData = [
    { time: '00:00', qualityRate: 92.5, ngRate: 7.5, defectDensity: 2.1 },
    { time: '01:00', qualityRate: 91.8, ngRate: 8.2, defectDensity: 2.3 },
    { time: '02:00', qualityRate: 93.2, ngRate: 6.8, defectDensity: 1.9 },
    { time: '03:00', qualityRate: 89.7, ngRate: 10.3, defectDensity: 2.8 },
    { time: '04:00', qualityRate: 94.1, ngRate: 5.9, defectDensity: 1.7 },
    { time: '05:00', qualityRate: 92.9, ngRate: 7.1, defectDensity: 2.0 },
    { time: '06:00', qualityRate: 91.3, ngRate: 8.7, defectDensity: 2.4 },
    { time: '07:00', qualityRate: 95.2, ngRate: 4.8, defectDensity: 1.4 },
    { time: '08:00', qualityRate: 88.9, ngRate: 11.1, defectDensity: 3.1 },
    { time: '09:00', qualityRate: 93.7, ngRate: 6.3, defectDensity: 1.8 },
    { time: '10:00', qualityRate: 90.4, ngRate: 9.6, defectDensity: 2.7 },
    { time: '11:00', qualityRate: 94.8, ngRate: 5.2, defectDensity: 1.5 }
  ];

  // Mock control limits
  const controlLimits = {
    qualityRate: {
      upperControl: 98.0,
      upperWarning: 96.0,
      target: 94.0,
      lowerWarning: 92.0,
      lowerControl: 90.0
    },
    ngRate: {
      upperControl: 10.0,
      upperWarning: 8.0,
      target: 6.0,
      lowerWarning: 4.0,
      lowerControl: 2.0
    },
    defectDensity: {
      upperControl: 3.0,
      upperWarning: 2.5,
      target: 2.0,
      lowerWarning: 1.5,
      lowerControl: 1.0
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date());
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // In a real application, this would trigger data refetch
    console.log('Filters changed:', newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Quality Control Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive quality analysis and NG string pattern monitoring for production optimization
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>Live data • Last updated: {refreshTime?.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <QualityFilters 
            onFiltersChange={handleFiltersChange}
            stringers={stringers}
          />

          {/* Quality Metrics Strip */}
          <QualityMetricsStrip 
            qualityData={qualityData}
            timeRange={filters?.dateRange}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* NG String Distribution Chart - 8 columns */}
            <div className="lg:col-span-8">
              <NGStringDistributionChart 
                chartData={ngDistributionData}
                stringers={stringers}
              />
            </div>

            {/* Quality Ranking Table - 4 columns */}
            <div className="lg:col-span-4">
              <QualityRankingTable 
                rankingData={qualityRankingData}
              />
            </div>
          </div>

          {/* Quality Control Chart - Full Width */}
          <QualityControlChart 
            controlData={qualityControlData}
            controlLimits={controlLimits}
          />
        </div>
      </main>
    </div>
  );
};

export default QualityControlAnalyticsDashboard;