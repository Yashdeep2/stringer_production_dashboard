import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ValidationPanel = ({ validationErrors, validationSummary, onValidate, onClearErrors }) => {
  const getErrorTypeIcon = (type) => {
    switch (type) {
      case 'range': return 'AlertTriangle';
      case 'required': return 'AlertCircle';
      case 'format': return 'FileX';
      default: return 'Info';
    }
  };

  const getErrorTypeColor = (type) => {
    switch (type) {
      case 'range': return 'text-warning';
      case 'required': return 'text-error';
      case 'format': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-error bg-error/10';
      case 'medium': return 'border-warning bg-warning/10';
      case 'low': return 'border-muted bg-muted/10';
      default: return 'border-border bg-background';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Validation Status</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="CheckCircle"
            iconPosition="left"
            onClick={onValidate}
          >
            Validate All
          </Button>
          {validationErrors?.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={onClearErrors}
            >
              Clear Errors
            </Button>
          )}
        </div>
      </div>
      {/* Validation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <div>
              <div className="font-semibold text-success text-lg">{validationSummary?.passed}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <div>
              <div className="font-semibold text-warning text-lg">{validationSummary?.warnings}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={20} className="text-error" />
            <div>
              <div className="font-semibold text-error text-lg">{validationSummary?.errors}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={20} className="text-muted-foreground" />
            <div>
              <div className="font-semibold text-foreground text-lg">{validationSummary?.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>
      </div>
      {/* Validation Errors List */}
      {validationErrors?.length > 0 ? (
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h4 className="font-medium text-foreground">Validation Issues</h4>
            <p className="text-sm text-muted-foreground">
              {validationErrors?.length} issue{validationErrors?.length !== 1 ? 's' : ''} found that need attention
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            <div className="divide-y divide-border">
              {validationErrors?.map((error, index) => (
                <div key={index} className={`p-4 ${getSeverityColor(error?.severity)}`}>
                  <div className="flex items-start space-x-3">
                    <Icon 
                      name={getErrorTypeIcon(error?.type)} 
                      size={18} 
                      className={getErrorTypeColor(error?.type)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {error?.stringerId && `Stringer ${error?.stringerId}`}
                          {error?.trackId && ` - Track ${error?.trackId}`}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          error?.severity === 'high' ? 'bg-error text-error-foreground' :
                          error?.severity === 'medium' ? 'bg-warning text-warning-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {error?.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{error?.message}</p>
                      {error?.suggestion && (
                        <p className="text-sm text-primary mt-1">
                          <Icon name="Lightbulb" size={14} className="inline mr-1" />
                          {error?.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-success/10 border border-success/20 rounded-lg p-6 text-center">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
          <h4 className="font-medium text-success mb-2">All Validations Passed</h4>
          <p className="text-sm text-muted-foreground">
            Your data entry is valid and ready for submission
          </p>
        </div>
      )}
      {/* Validation Rules Info */}
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Validation Rules</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={14} className="text-success" />
            <span className="text-muted-foreground">OK strings: 0-999 per track</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={14} className="text-success" />
            <span className="text-muted-foreground">NG strings: 0-999 per track</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={14} className="text-success" />
            <span className="text-muted-foreground">Total strings: &lt; 10,000 per stringer</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={14} className="text-success" />
            <span className="text-muted-foreground">Quality rate: &gt; 80% recommended</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;