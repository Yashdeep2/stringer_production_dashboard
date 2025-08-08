import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const StringerWiseEntry = ({ stringerData, onStringerChange, validationErrors, onDistribute }) => {
  const calculateModules = (okStrings) => {
    return Math.floor((okStrings || 0) / 12);
  };

  const getStringerStatus = (stringerId) => {
    const error = validationErrors?.find(e => e?.stringerId === stringerId);
    if (error) return 'error';
    
    const stringer = stringerData?.[stringerId];
    if (stringer && ((stringer?.totalOkStrings || 0) > 0 || (stringer?.totalNgStrings || 0) > 0)) return 'filled';
    
    return 'empty';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'error': return 'border-error bg-error/5';
      case 'filled': return 'border-success bg-success/5';
      default: return 'border-border bg-card';
    }
  };

  const handleInputChange = (stringerId, field, e) => {
    const value = e?.target?.value;
    let numValue = parseInt(value) || 0;
    
    // Clamp between 0 and 9999
    numValue = Math.max(0, Math.min(9999, numValue));
    
    // Update the input value to show clamped value
    if (e?.target) {
      e.target.value = numValue?.toString();
    }
    
    onStringerChange(stringerId, field, numValue);
  };

  const totalOkStrings = Object.values(stringerData || {})?.reduce((sum, s) => sum + (s?.totalOkStrings || 0), 0);
  const totalNgStrings = Object.values(stringerData || {})?.reduce((sum, s) => sum + (s?.totalNgStrings || 0), 0);
  const totalModules = Object.values(stringerData || {})?.reduce((sum, s) => sum + calculateModules(s?.totalOkStrings), 0);
  const overallQuality = totalOkStrings + totalNgStrings > 0 ? Math.round((totalOkStrings / (totalOkStrings + totalNgStrings)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Stringer-wise Bulk Entry</h3>
        <Button
          variant="outline"
          size="sm"
          iconName="Shuffle"
          iconPosition="left"
          onClick={onDistribute}
          disabled={totalOkStrings === 0 && totalNgStrings === 0}
        >
          Auto-distribute to Tracks
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(stringerData || {})?.map(([stringerId, stringer]) => {
          const status = getStringerStatus(stringerId);
          const error = validationErrors?.find(e => e?.stringerId === stringerId);
          const qualityRate = (stringer?.totalOkStrings || 0) + (stringer?.totalNgStrings || 0) > 0 
            ? Math.round(((stringer?.totalOkStrings || 0) / ((stringer?.totalOkStrings || 0) + (stringer?.totalNgStrings || 0))) * 100)
            : 0;

          return (
            <div key={stringerId} className={`border rounded-lg p-4 ${getStatusColor(status)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={18} className="text-primary" />
                  <h4 className="font-medium text-foreground">Stringer {stringerId}</h4>
                </div>
                {status === 'error' && (
                  <Icon name="AlertTriangle" size={16} className="text-error" />
                )}
              </div>
              <div className="space-y-3">
                <Input
                  label="OK Strings"
                  type="number"
                  placeholder="Enter OK strings"
                  value={(stringer?.totalOkStrings || 0)?.toString()}
                  onChange={(e) => handleInputChange(stringerId, 'totalOkStrings', e)}
                  min="0"
                  max="9999"
                  data-stringer={stringerId}
                  error={error?.field === 'totalOkStrings' ? error?.message : ''}
                />

                <Input
                  label="NG Strings"
                  type="number"
                  placeholder="Enter NG strings"
                  value={(stringer?.totalNgStrings || 0)?.toString()}
                  onChange={(e) => handleInputChange(stringerId, 'totalNgStrings', e)}
                  min="0"
                  max="9999"
                  data-stringer={stringerId}
                  error={error?.field === 'totalNgStrings' ? error?.message : ''}
                />
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Modules:</span>
                    <div className="font-semibold text-primary text-lg">
                      {calculateModules(stringer?.totalOkStrings)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quality Rate:</span>
                    <div className={`font-medium ${
                      qualityRate >= 95 ? 'text-success' :
                      qualityRate >= 85 ? 'text-warning' : 'text-error'
                    }`}>
                      {qualityRate}%
                    </div>
                  </div>
                </div>
              </div>
              {error && error?.field === 'general' && (
                <div className="mt-3 p-2 bg-error/10 border border-error/20 rounded text-xs text-error">
                  {error?.message}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Bulk Entry Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total OK Strings:</span>
            <div className="font-semibold text-success text-lg">
              {totalOkStrings}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Total NG Strings:</span>
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
  );
};

export default StringerWiseEntry;