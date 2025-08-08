import React, { useState } from 'react';


const PerformanceHeatmap = ({ data }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 95) return 'bg-success text-white';
    if (efficiency >= 85) return 'bg-success/70 text-white';
    if (efficiency >= 75) return 'bg-warning text-white';
    if (efficiency >= 65) return 'bg-warning/70 text-black';
    return 'bg-error text-white';
  };

  const getEfficiencyLabel = (efficiency) => {
    if (efficiency >= 95) return 'Excellent';
    if (efficiency >= 85) return 'Good';
    if (efficiency >= 75) return 'Average';
    if (efficiency >= 65) return 'Below Average';
    return 'Poor';
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const stringers = ['Stringer 1', 'Stringer 2', 'Stringer 3', 'Stringer 4', 'Stringer 5', 'Stringer 6'];

  return (
    <div className="bg-card rounded-lg border border-border p-6 industrial-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Performance Efficiency Heatmap</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-error rounded"></div>
            <span className="text-muted-foreground">&lt;65%</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span className="text-muted-foreground">65-85%</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span className="text-muted-foreground">&gt;85%</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="grid grid-cols-25 gap-1 text-xs">
          {/* Header row with hours */}
          <div className="col-span-1"></div>
          {hours?.map(hour => (
            <div key={hour} className="text-center text-muted-foreground font-medium p-1">
              {hour?.toString()?.padStart(2, '0')}
            </div>
          ))}

          {/* Data rows */}
          {stringers?.map((stringer, stringerIndex) => (
            <React.Fragment key={stringer}>
              <div className="text-right text-muted-foreground font-medium p-2 flex items-center justify-end">
                {stringer}
              </div>
              {hours?.map(hour => {
                const cellData = data?.find(d => 
                  d?.stringer === stringer && d?.hour === hour
                );
                const efficiency = cellData ? cellData?.efficiency : 0;
                
                return (
                  <div
                    key={`${stringer}-${hour}`}
                    className={`
                      relative h-8 rounded cursor-pointer transition-all duration-200 
                      ${getEfficiencyColor(efficiency)} 
                      hover:scale-110 hover:z-10 hover:shadow-lg
                    `}
                    onMouseEnter={() => setHoveredCell({ stringer, hour, efficiency, data: cellData })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {efficiency > 0 ? `${efficiency}%` : '-'}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div className="absolute z-20 bg-popover border border-border rounded-lg p-3 industrial-shadow pointer-events-none"
               style={{ 
                 left: '50%', 
                 top: '50%', 
                 transform: 'translate(-50%, -100%)',
                 marginTop: '-10px'
               }}>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">{hoveredCell?.stringer}</p>
              <p className="text-sm text-muted-foreground">Hour: {hoveredCell?.hour}:00</p>
              <p className="text-sm text-foreground">
                Efficiency: <span className="font-medium">{hoveredCell?.efficiency}%</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {getEfficiencyLabel(hoveredCell?.efficiency)}
              </p>
              {hoveredCell?.data && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Modules: {hoveredCell?.data?.modules}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    OK Strings: {hoveredCell?.data?.okStrings}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    NG Strings: {hoveredCell?.data?.ngStrings}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceHeatmap;