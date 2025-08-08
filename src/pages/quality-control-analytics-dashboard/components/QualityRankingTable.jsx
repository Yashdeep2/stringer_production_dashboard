import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const QualityRankingTable = ({ rankingData }) => {
  const [sortBy, setSortBy] = useState('qualityRate');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedData = [...rankingData]?.sort((a, b) => {
    const aValue = a?.[sortBy];
    const bValue = b?.[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getQualityRateColor = (rate) => {
    if (rate >= 95) return 'text-success';
    if (rate >= 90) return 'text-warning';
    return 'text-error';
  };

  const getQualityRateBg = (rate) => {
    if (rate >= 95) return 'bg-success/10';
    if (rate >= 90) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const MiniTrendChart = ({ data }) => (
    <div className="flex items-end space-x-0.5 h-6">
      {data?.map((value, index) => (
        <div
          key={index}
          className="w-1 bg-primary/60 rounded-t"
          style={{ height: `${(value / Math.max(...data)) * 100}%` }}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 industrial-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Quality Performance Ranking</h3>
          <p className="text-sm text-muted-foreground">Stringer quality rates and trends</p>
        </div>
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg hover-feedback">
          <Icon name="MoreVertical" size={16} />
        </button>
      </div>
      <div className="space-y-3">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <div className="col-span-1">#</div>
          <div className="col-span-3">Stringer</div>
          <div 
            className="col-span-2 cursor-pointer hover:text-foreground flex items-center space-x-1"
            onClick={() => handleSort('qualityRate')}
          >
            <span>Quality Rate</span>
            {sortBy === 'qualityRate' && (
              <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
            )}
          </div>
          <div 
            className="col-span-2 cursor-pointer hover:text-foreground flex items-center space-x-1"
            onClick={() => handleSort('ngStrings')}
          >
            <span>NG Strings</span>
            {sortBy === 'ngStrings' && (
              <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
            )}
          </div>
          <div className="col-span-2">Trend</div>
          <div className="col-span-2">Actions</div>
        </div>

        {/* Table Rows */}
        {sortedData?.map((stringer, index) => (
          <div key={stringer?.id} className="grid grid-cols-12 gap-4 py-3 border-b border-border/50 hover:bg-muted/30 hover-feedback">
            <div className="col-span-1 flex items-center">
              <span className="text-sm font-medium text-foreground">{index + 1}</span>
            </div>
            
            <div className="col-span-3 flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${stringer?.status === 'active' ? 'bg-success' : 'bg-error'}`} />
              <div>
                <p className="text-sm font-medium text-foreground">{stringer?.name}</p>
                <p className="text-xs text-muted-foreground">Track {stringer?.trackCount}</p>
              </div>
            </div>
            
            <div className="col-span-2 flex items-center">
              <div className={`px-2 py-1 rounded-full ${getQualityRateBg(stringer?.qualityRate)}`}>
                <span className={`text-sm font-medium ${getQualityRateColor(stringer?.qualityRate)}`}>
                  {stringer?.qualityRate}%
                </span>
              </div>
            </div>
            
            <div className="col-span-2 flex items-center">
              <span className="text-sm font-medium text-foreground">{stringer?.ngStrings}</span>
            </div>
            
            <div className="col-span-2 flex items-center space-x-2">
              <Icon 
                name={getTrendIcon(stringer?.trend)} 
                size={16} 
                className={getTrendColor(stringer?.trend)}
              />
              <MiniTrendChart data={stringer?.trendData} />
            </div>
            
            <div className="col-span-2 flex items-center space-x-2">
              <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded hover-feedback">
                <Icon name="Eye" size={14} />
              </button>
              <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded hover-feedback">
                <Icon name="BarChart3" size={14} />
              </button>
              <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded hover-feedback">
                <Icon name="Settings" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-success">
              {sortedData?.filter(s => s?.qualityRate >= 95)?.length}
            </p>
            <p className="text-xs text-muted-foreground">Excellent (&gt;95%)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">
              {sortedData?.filter(s => s?.qualityRate >= 90 && s?.qualityRate < 95)?.length}
            </p>
            <p className="text-xs text-muted-foreground">Good (90-95%)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-error">
              {sortedData?.filter(s => s?.qualityRate < 90)?.length}
            </p>
            <p className="text-xs text-muted-foreground">Needs Attention (&lt;90%)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityRankingTable;