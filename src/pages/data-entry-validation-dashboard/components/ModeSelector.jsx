import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ModeSelector = ({ 
  currentMode, 
  onModeChange, 
  currentHour, 
  entryProgress, 
  autoSave, 
  onToggleAutoSave, 
  lastSaved 
}) => {
  const modes = [
    {
      id: 'track-wise',
      label: 'Track-wise Entry',
      icon: 'Grid3X3',
      description: 'Individual track data entry'
    },
    {
      id: 'stringer-wise',
      label: 'Stringer-wise Entry',
      icon: 'Layers',
      description: 'Bulk stringer data entry'
    }
  ];

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex bg-muted rounded-lg p-1">
            {modes?.map((mode) => (
              <Button
                key={mode?.id}
                variant={currentMode === mode?.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onModeChange(mode?.id)}
                iconName={mode?.icon}
                iconPosition="left"
                className="px-4"
              >
                {mode?.label}
              </Button>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {modes?.find(m => m?.id === currentMode)?.description}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Current Hour: {currentHour}:00
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm text-foreground">
              Progress: {entryProgress?.completed}/{entryProgress?.total}
            </span>
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-success transition-all duration-300"
                style={{ width: `${(entryProgress?.completed / entryProgress?.total) * 100}%` }}
              />
            </div>
          </div>

          <Button
            variant={autoSave ? "default" : "outline"}
            size="sm"
            iconName="Save"
            iconPosition="left"
            onClick={onToggleAutoSave}
            className={autoSave ? "bg-success hover:bg-success/90" : ""}
          >
            Auto-save: {autoSave ? 'ON' : 'OFF'}
          </Button>

          {lastSaved && autoSave && (
            <div className="text-xs text-muted-foreground">
              Saved: {lastSaved?.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;