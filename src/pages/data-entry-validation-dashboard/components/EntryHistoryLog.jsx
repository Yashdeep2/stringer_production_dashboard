import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EntryHistoryLog = ({ historyData, onEdit, onDelete, onRestore, onExport }) => {
  const [expandedEntry, setExpandedEntry] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'text-success bg-success/10';
      case 'draft': return 'text-warning bg-warning/10';
      case 'error': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return 'CheckCircle';
      case 'draft': return 'Clock';
      case 'error': return 'AlertTriangle';
      default: return 'FileText';
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp)?.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const calculateTotalModules = (entry) => {
    if (!entry?.data) return 0;
    return Object.values(entry?.data)?.reduce((sum, stringer) => {
      return sum + Math.floor((stringer?.totalOkStrings || 0) / 12);
    }, 0);
  };

  const calculateTotalOkStrings = (entry) => {
    if (!entry?.data) return 0;
    return Object.values(entry?.data)?.reduce((sum, stringer) => {
      return sum + (stringer?.totalOkStrings || 0);
    }, 0);
  };

  const handleDeleteWithConfirmation = (id) => {
    if (window.confirm('Are you sure you want to delete this history entry? This action cannot be undone.')) {
      onDelete(id);
    }
  };

  const handleRestoreWithConfirmation = (id) => {
    if (window.confirm('Restore this entry data? Current unsaved data will be replaced.')) {
      onRestore(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Entry History & Audit Trail</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
            disabled={!historyData || historyData?.length === 0}
          >
            Export History
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            iconPosition="left"
            onClick={() => {
              // Implement filter functionality
              console.log('Filter history');
            }}
          >
            Filter
          </Button>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg">
        <div className="max-h-96 overflow-y-auto">
          {!historyData || historyData?.length === 0 ? (
            <div className="p-8 text-center">
              <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No entry history available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Submitted entries will appear here with full audit trail
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {historyData?.map((entry) => (
                <div key={entry?.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(entry?.status)}`}>
                        <Icon name={getStatusIcon(entry?.status)} size={16} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">
                            Hour {entry?.hour}:00 Entry
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(entry?.status)}`}>
                            {entry?.status}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTimestamp(entry?.timestamp)} • by {entry?.user || 'Unknown User'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <div className="font-medium text-foreground">
                          {calculateTotalModules(entry)} modules
                        </div>
                        <div className="text-muted-foreground">
                          {calculateTotalOkStrings(entry)} OK strings
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName={expandedEntry === entry?.id ? "ChevronUp" : "ChevronDown"}
                          onClick={() => setExpandedEntry(expandedEntry === entry?.id ? null : entry?.id)}
                          title="Toggle details"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Edit2"
                          onClick={() => onEdit(entry?.id)}
                          title="Edit entry"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="RotateCcw"
                          onClick={() => handleRestoreWithConfirmation(entry?.id)}
                          title="Restore entry data"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Trash2"
                          onClick={() => handleDeleteWithConfirmation(entry?.id)}
                          title="Delete entry"
                        />
                      </div>
                    </div>
                  </div>

                  {expandedEntry === entry?.id && entry?.data && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(entry?.data)?.map(([stringerId, stringer]) => (
                          <div key={stringerId} className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-foreground">Stringer {stringerId}</span>
                              <span className="text-sm text-muted-foreground">
                                {Math.floor((stringer?.totalOkStrings || 0) / 12)} modules
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">OK:</span>
                                <span className="font-medium text-success ml-1">
                                  {stringer?.totalOkStrings || 0}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">NG:</span>
                                <span className="font-medium text-error ml-1">
                                  {stringer?.totalNgStrings || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {entry?.notes && (
                        <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                          <span className="text-sm font-medium text-foreground">Notes: </span>
                          <span className="text-sm text-muted-foreground">{entry?.notes}</span>
                        </div>
                      )}

                      {entry?.validationErrors && entry?.validationErrors?.length > 0 && (
                        <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
                          <span className="text-sm font-medium text-error">Validation Issues:</span>
                          <ul className="mt-1 text-sm text-error">
                            {entry?.validationErrors?.map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryHistoryLog;