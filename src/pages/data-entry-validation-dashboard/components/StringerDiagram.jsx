import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const StringerDiagram = ({ stringerData, onTrackChange, validationErrors }) => {
  const calculateModules = (okStrings) => {
    return Math.floor((okStrings || 0) / 12);
  };

  const getTrackStatus = (stringerId, trackId) => {
    const error = validationErrors?.find(e => 
      e?.stringerId === stringerId && e?.trackId === trackId
    );
    if (error) return 'error';
    
    const track = stringerData?.[stringerId]?.tracks?.[trackId];
    if (track && ((track?.okStrings || 0) > 0 || (track?.ngStrings || 0) > 0)) return 'filled';
    
    return 'empty';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'error': return 'border-error bg-error/10';
      case 'filled': return 'border-success bg-success/10';
      default: return 'border-border bg-background';
    }
  };

  const handleInputChange = (stringerId, trackId, field, e) => {
    const value = e?.target?.value;
    let numValue = parseInt(value) || 0;
    
    // Clamp between 0 and 999
    numValue = Math.max(0, Math.min(999, numValue));
    
    // Update the input value to show clamped value
    if (e?.target) {
      e.target.value = numValue?.toString();
    }
    
    onTrackChange(stringerId, trackId, field, numValue);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Track-wise Data Entry</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded border-success bg-success/10" />
            <span className="text-muted-foreground">Data Entered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded border-error bg-error/10" />
            <span className="text-muted-foreground">Validation Error</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(stringerData || {})?.map(([stringerId, stringer]) => (
          <div key={stringerId} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={20} className="text-primary" />
                <h4 className="font-medium text-foreground">Stringer {stringerId}</h4>
              </div>
              <div className="text-sm text-muted-foreground">
                Modules: {calculateModules(stringer?.totalOkStrings)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(stringer?.tracks || {})?.map(([trackId, track]) => {
                const status = getTrackStatus(stringerId, trackId);
                const error = validationErrors?.find(e => 
                  e?.stringerId === stringerId && e?.trackId === trackId
                );

                return (
                  <div key={trackId} className={`border rounded-lg p-3 ${getStatusColor(status)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Track {trackId}
                      </span>
                      {status === 'error' && (
                        <Icon name="AlertTriangle" size={14} className="text-error" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="OK Strings"
                        value={(track?.okStrings || 0)?.toString()}
                        onChange={(e) => handleInputChange(stringerId, trackId, 'okStrings', e)}
                        className="text-xs"
                        min="0"
                        max="999"
                        data-stringer={stringerId}
                        data-track={trackId}
                        data-field="okStrings"
                      />
                      <Input
                        type="number"
                        placeholder="NG Strings"
                        value={(track?.ngStrings || 0)?.toString()}
                        onChange={(e) => handleInputChange(stringerId, trackId, 'ngStrings', e)}
                        className="text-xs"
                        min="0"
                        max="999"
                        data-stringer={stringerId}
                        data-track={trackId}
                        data-field="ngStrings"
                      />
                    </div>
                    {error && (
                      <div className="mt-2 text-xs text-error">
                        {error?.message}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-border">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total OK:</span>
                  <div className="font-medium text-success">{stringer?.totalOkStrings || 0}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Total NG:</span>
                  <div className="font-medium text-error">{stringer?.totalNgStrings || 0}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Modules:</span>
                  <div className="font-medium text-primary">{calculateModules(stringer?.totalOkStrings)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StringerDiagram;