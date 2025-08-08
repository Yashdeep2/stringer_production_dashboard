import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import QualityControlAnalyticsDashboard from './pages/quality-control-analytics-dashboard';
import PerformanceAnalyticsDashboard from './pages/performance-analytics-dashboard';
import DataEntryValidationDashboard from './pages/data-entry-validation-dashboard';
import ProductionOverviewDashboard from './pages/production-overview-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<DataEntryValidationDashboard />} />
        <Route path="/quality-control-analytics-dashboard" element={<QualityControlAnalyticsDashboard />} />
        <Route path="/performance-analytics-dashboard" element={<PerformanceAnalyticsDashboard />} />
        <Route path="/data-entry-validation-dashboard" element={<DataEntryValidationDashboard />} />
        <Route path="/production-overview-dashboard" element={<ProductionOverviewDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
