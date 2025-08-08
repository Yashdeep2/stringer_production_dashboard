import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import KPICard from './components/KPICard';
import ProductionChart from './components/ProductionChart';
import LiveStatusPanel from './components/LiveStatusPanel';
import PerformanceHeatmap from './components/PerformanceHeatmap';
import ControlPanel from './components/ControlPanel';

const ProductionOverviewDashboard = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [selectedShift, setSelectedShift] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock KPI data for 6 stringers
  const stringerKPIs = [
    { id: 1, name: 'Stringer 1', modulesProduced: 145, hourlyTarget: 150, efficiency: 97, status: 'on-target' },
    { id: 2, name: 'Stringer 2', modulesProduced: 132, hourlyTarget: 150, efficiency: 88, status: 'warning' },
    { id: 3, name: 'Stringer 3', modulesProduced: 158, hourlyTarget: 150, efficiency: 105, status: 'on-target' },
    { id: 4, name: 'Stringer 4', modulesProduced: 98, hourlyTarget: 150, efficiency: 65, status: 'critical' },
    { id: 5, name: 'Stringer 5', modulesProduced: 142, hourlyTarget: 150, efficiency: 95, status: 'on-target' },
    { id: 6, name: 'Stringer 6', modulesProduced: 136, hourlyTarget: 150, efficiency: 91, status: 'warning' }
  ];

  // Mock hourly production data
  const hourlyProductionData = [
    { hour: 6, okStrings: 1680, ngStrings: 45 },
    { hour: 7, okStrings: 1725, ngStrings: 38 },
    { hour: 8, okStrings: 1698, ngStrings: 52 },
    { hour: 9, okStrings: 1742, ngStrings: 41 },
    { hour: 10, okStrings: 1689, ngStrings: 67 },
    { hour: 11, okStrings: 1756, ngStrings: 29 },
    { hour: 12, okStrings: 1634, ngStrings: 78 },
    { hour: 13, okStrings: 1712, ngStrings: 44 },
    { hour: 14, okStrings: 1698, ngStrings: 56 },
    { hour: 15, okStrings: 1723, ngStrings: 33 },
    { hour: 16, okStrings: 1687, ngStrings: 61 },
    { hour: 17, okStrings: 1745, ngStrings: 42 }
  ];

  // Mock shift summary data
  const shiftSummary = {
    totalModules: 811,
    targetAchievement: 90,
    qualityRate: 96.2,
    activeStringers: 6
  };

  // Mock quality alerts
  const qualityAlerts = [
    {
      id: 1,
      title: 'High NG Rate - Stringer 4',
      message: 'NG string rate exceeded 5% threshold at 12:30',
      severity: 'high',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: 2,
      title: 'Production Below Target',
      message: 'Stringer 2 running 12% below hourly target',
      severity: 'medium',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      title: 'Maintenance Alert',
      message: 'Scheduled maintenance for Stringer 6 at 18:00',
      severity: 'low',
      timestamp: new Date(Date.now() - 7200000)
    }
  ];

  // Mock heatmap data
  const heatmapData = [];
  const stringers = ['Stringer 1', 'Stringer 2', 'Stringer 3', 'Stringer 4', 'Stringer 5', 'Stringer 6'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  stringers?.forEach(stringer => {
    hours?.forEach(hour => {
      const baseEfficiency = stringer === 'Stringer 4' ? 65 : 
                           stringer === 'Stringer 2' ? 88 : 
                           Math.floor(Math.random() * 20) + 85;
      const efficiency = Math.max(0, baseEfficiency + Math.floor(Math.random() * 10) - 5);
      
      heatmapData?.push({
        stringer,
        hour,
        efficiency,
        modules: Math.floor(efficiency * 1.5),
        okStrings: Math.floor(efficiency * 18),
        ngStrings: Math.floor((100 - efficiency) * 0.8)
      });
    });
  });

  // Auto-refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastUpdate(new Date());
        // Simulate occasional connection issues
        if (Math.random() < 0.05) {
          setConnectionStatus('warning');
          setTimeout(() => setConnectionStatus('connected'), 2000);
        }
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleDataPointClick = (data) => {
    console.log('Drill down to track level for:', data);
    // Navigate to detailed track view
  };

  const handleExportReport = () => {
    console.log('Exporting production report...');
    // Implement export functionality
  };

  const handleRefreshData = () => {
    setLastUpdate(new Date());
    console.log('Refreshing data...');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          {/* Control Panel */}
          <ControlPanel
            selectedDateRange={selectedDateRange}
            onDateRangeChange={setSelectedDateRange}
            selectedShift={selectedShift}
            onShiftChange={setSelectedShift}
            autoRefresh={autoRefresh}
            onAutoRefreshToggle={() => setAutoRefresh(!autoRefresh)}
            onExportReport={handleExportReport}
            onRefreshData={handleRefreshData}
          />

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {stringerKPIs?.map((stringer) => (
              <KPICard
                key={stringer?.id}
                stringer={stringer?.name}
                modulesProduced={stringer?.modulesProduced}
                hourlyTarget={stringer?.hourlyTarget}
                efficiency={stringer?.efficiency}
                status={stringer?.status}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Production Chart - Takes 2/3 width on xl screens */}
            <div className="xl:col-span-2">
              <ProductionChart
                data={hourlyProductionData}
                onDataPointClick={handleDataPointClick}
              />
            </div>

            {/* Live Status Panel - Takes 1/3 width on xl screens */}
            <div className="xl:col-span-1">
              <LiveStatusPanel
                connectionStatus={connectionStatus}
                lastUpdate={lastUpdate}
                shiftSummary={shiftSummary}
                qualityAlerts={qualityAlerts}
              />
            </div>
          </div>

          {/* Performance Heatmap */}
          <PerformanceHeatmap data={heatmapData} />
        </div>
      </main>
    </div>
  );
};

export default ProductionOverviewDashboard;