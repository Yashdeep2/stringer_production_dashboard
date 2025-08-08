import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EntrySummaryTable = ({ 
  stringerData, 
  validationErrors, 
  onEdit, 
  onClear, 
  onSubmit, 
  isSubmitting 
}) => {
  const calculateModules = (okStrings) => {
    return Math.floor((okStrings || 0) / 12);
  };

  const getRowStatus = (stringerId) => {
    const hasError = validationErrors?.some(e => e?.stringerId === stringerId);
    if (hasError) return 'error';
    
    const stringer = stringerData?.[stringerId];
    if (stringer && ((stringer?.totalOkStrings || 0) > 0 || (stringer?.totalNgStrings || 0) > 0)) return 'complete';
    
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete': return { name: 'CheckCircle', color: 'text-success' };
      case 'error': return { name: 'AlertTriangle', color: 'text-error' };
      default: return { name: 'Clock', color: 'text-muted-foreground' };
    }
  };

  const getRowClass = (status) => {
    switch (status) {
      case 'complete': return 'bg-success/5 border-success/20';
      case 'error': return 'bg-error/5 border-error/20';
      default: return 'bg-background border-border';
    }
  };

  const totalOkStrings = Object.values(stringerData || {})?.reduce((sum, s) => sum + (s?.totalOkStrings || 0), 0);
  const totalNgStrings = Object.values(stringerData || {})?.reduce((sum, s) => sum + (s?.totalNgStrings || 0), 0);
  const totalModules = Object.values(stringerData || {})?.reduce((sum, s) => sum + calculateModules(s?.totalOkStrings), 0);
  const completedCount = Object.values(stringerData || {})?.filter(s => (s?.totalOkStrings || 0) > 0 || (s?.totalNgStrings || 0) > 0)?.length;
  const overallQuality = totalOkStrings + totalNgStrings > 0 ? Math.round((totalOkStrings / (totalOkStrings + totalNgStrings)) * 100) : 0;
  const hasHighSeverityErrors = validationErrors?.some(e => e?.severity === 'high');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Entry Summary</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={() => onClear()}
            disabled={isSubmitting}
          >
            Clear All
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Send"
            iconPosition="left"
            onClick={onSubmit}
            disabled={hasHighSeverityErrors || isSubmitting || completedCount === 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Entry'}
          </Button>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-foreground">Status</th>
                <th className="text-left p-3 text-sm font-medium text-foreground">Stringer</th>
                <th className="text-left p-3 text-sm font-medium text-foreground">OK Strings</th>
                <th className="text-left p-3 text-sm font-medium text-foreground">NG Strings</th>
                <th className="text-left p-3 text-sm font-medium text-foreground">Modules</th>
                <th className="text-left p-3 text-sm font-medium text-foreground">Quality Rate</th>
                <th className="text-left p-3 text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stringerData || {})?.map(([stringerId, stringer]) => {
                const status = getRowStatus(stringerId);
                const statusIcon = getStatusIcon(status);
                const okStrings = stringer?.totalOkStrings || 0;
                const ngStrings = stringer?.totalNgStrings || 0;
                const qualityRate = okStrings + ngStrings > 0 
                  ? Math.round((okStrings / (okStrings + ngStrings)) * 100)
                  : 0;

                return (
                  <tr key={stringerId} className={`border-b border-border ${getRowClass(status)}`}>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Icon name={statusIcon?.name} size={16} className={statusIcon?.color} />
                        <span className="text-sm capitalize text-foreground">{status}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-foreground">Stringer {stringerId}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-success">{okStrings}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-error">{ngStrings}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-primary">{calculateModules(okStrings)}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${
                          qualityRate >= 95 ? 'text-success' :
                          qualityRate >= 85 ? 'text-warning' : 'text-error'
                        }`}>
                          {qualityRate}%
                        </span>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              qualityRate >= 95 ? 'bg-success' : 
                              qualityRate >= 85 ? 'bg-warning' : 'bg-error'
                            }`}
                            style={{ width: `${qualityRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Edit2"
                          onClick={() => onEdit(stringerId)}
                          disabled={isSubmitting}
                          title="Edit stringer data"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Trash2"
                          onClick={() => onClear(stringerId)}
                          disabled={isSubmitting}
                          title="Clear stringer data"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-muted/30 border-t border-border p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total OK:</span>
              <div className="font-semibold text-success text-lg">
                {totalOkStrings}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Total NG:</span>
              <div className="font-semibold text-error text-lg">
                {totalNgStrings}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Total Modules:</span>
              <div className="font-semibold text-primary text-lg">
                {totalModules}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Completed:</span>
              <div className="font-semibold text-foreground text-lg">
                {completedCount}/6
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Overall Quality:</span>
              <div className={`font-semibold text-lg ${
                overallQuality >= 95 ? 'text-success' :
                overallQuality >= 85 ? 'text-warning' : 'text-error'
              }`}>
                {overallQuality}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasHighSeverityErrors && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">
              Cannot submit: Please fix high severity errors first
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntrySummaryTable;