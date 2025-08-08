import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../../components/ui/Header';
import ModeSelector from './components/ModeSelector';
import StringerDiagram from './components/StringerDiagram';
import StringerWiseEntry from './components/StringerWiseEntry';
import EntrySummaryTable from './components/EntrySummaryTable';
import EntryHistoryLog from './components/EntryHistoryLog';
import ValidationPanel from './components/ValidationPanel';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const DataEntryValidationDashboard = () => {
  const [currentMode, setCurrentMode] = useState('track-wise');
  const [currentHour] = useState(new Date()?.getHours());
  const [stringerData, setStringerData] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [entryProgress, setEntryProgress] = useState({ completed: 0, total: 6 });
  const [historyData, setHistoryData] = useState([]);
  const [validationSummary, setValidationSummary] = useState({
    passed: 0,
    warnings: 0,
    errors: 0,
    pending: 6
  });
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const autoSaveTimeoutRef = useRef(null);

  // Initialize stringer data structure
  useEffect(() => {
    const initialData = {};
    for (let i = 1; i <= 6; i++) {
      initialData[i] = {
        totalOkStrings: 0,
        totalNgStrings: 0,
        tracks: {
          1: { okStrings: 0, ngStrings: 0 },
          2: { okStrings: 0, ngStrings: 0 }
        }
      };
    }
    setStringerData(initialData);

    // Load saved data from localStorage
    const savedData = localStorage.getItem(`data-entry-${currentHour}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setStringerData(parsed);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }

    // Mock history data
    const mockHistory = [
      {
        id: 1,
        hour: currentHour - 1,
        timestamp: new Date(Date.now() - 3600000),
        user: "John Smith",
        status: "submitted",
        data: {
          1: { totalOkStrings: 144, totalNgStrings: 12 },
          2: { totalOkStrings: 156, totalNgStrings: 8 },
          3: { totalOkStrings: 132, totalNgStrings: 16 },
          4: { totalOkStrings: 148, totalNgStrings: 10 },
          5: { totalOkStrings: 140, totalNgStrings: 14 },
          6: { totalOkStrings: 152, totalNgStrings: 6 }
        },
        notes: "Normal production hour with good quality rates"
      },
      {
        id: 2,
        hour: currentHour - 2,
        timestamp: new Date(Date.now() - 7200000),
        user: "Sarah Johnson",
        status: "submitted",
        data: {
          1: { totalOkStrings: 138, totalNgStrings: 18 },
          2: { totalOkStrings: 150, totalNgStrings: 12 },
          3: { totalOkStrings: 144, totalNgStrings: 10 },
          4: { totalOkStrings: 142, totalNgStrings: 14 },
          5: { totalOkStrings: 136, totalNgStrings: 20 },
          6: { totalOkStrings: 148, totalNgStrings: 8 }
        },
        validationErrors: ["Stringer 5 quality rate below 85%"],
        notes: "Minor quality issues on Stringer 5, maintenance scheduled"
      }
    ];
    
    // Load history from localStorage
    const savedHistory = localStorage.getItem('entry-history');
    if (savedHistory) {
      try {
        setHistoryData(JSON.parse(savedHistory));
      } catch (error) {
        setHistoryData(mockHistory);
      }
    } else {
      setHistoryData(mockHistory);
    }
  }, [currentHour]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave) {
      if (autoSaveTimeoutRef?.current) {
        clearTimeout(autoSaveTimeoutRef?.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem(`data-entry-${currentHour}`, JSON.stringify(stringerData));
        setLastSaved(new Date());
      }, 2000);
    }

    return () => {
      if (autoSaveTimeoutRef?.current) {
        clearTimeout(autoSaveTimeoutRef?.current);
      }
    };
  }, [stringerData, autoSave, currentHour]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event?.ctrlKey || event?.metaKey) {
        switch (event?.key) {
          case 's':
            event?.preventDefault();
            handleSave();
            break;
          case 'Enter':
            event?.preventDefault();
            handleSubmitEntry();
            break;
          case 'r':
            event?.preventDefault();
            validateData();
            break;
          default:
            break;
        }
      } else if (event?.key === 'Escape') {
        event?.preventDefault();
        if (showDeleteConfirm) {
          setShowDeleteConfirm(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDeleteConfirm]);

  // Handle track-wise data changes with validation
  const handleTrackChange = useCallback((stringerId, trackId, field, value) => {
    // Validate input
    const numValue = Math.max(0, Math.min(999, parseInt(value) || 0));
    
    setStringerData(prev => {
      const updated = { ...prev };
      updated[stringerId] = { ...updated?.[stringerId] };
      updated[stringerId].tracks = { ...updated?.[stringerId]?.tracks };
      updated[stringerId].tracks[trackId] = { 
        ...updated?.[stringerId]?.tracks?.[trackId],
        [field]: numValue 
      };

      // Recalculate totals
      const tracks = updated?.[stringerId]?.tracks;
      updated[stringerId].totalOkStrings = Object.values(tracks)?.reduce((sum, track) => sum + (track?.okStrings || 0), 0);
      updated[stringerId].totalNgStrings = Object.values(tracks)?.reduce((sum, track) => sum + (track?.ngStrings || 0), 0);

      return updated;
    });
  }, []);

  // Handle stringer-wise data changes with validation
  const handleStringerChange = useCallback((stringerId, field, value) => {
    // Validate input
    const numValue = Math.max(0, Math.min(9999, parseInt(value) || 0));
    
    setStringerData(prev => ({
      ...prev,
      [stringerId]: {
        ...prev?.[stringerId],
        [field]: numValue
      }
    }));
  }, []);

  // Auto-distribute stringer totals to tracks
  const handleDistributeToTracks = useCallback(() => {
    setStringerData(prev => {
      const updated = { ...prev };
      
      Object.keys(updated)?.forEach(stringerId => {
        const stringer = updated?.[stringerId];
        const okPerTrack = Math.floor((stringer?.totalOkStrings || 0) / 2);
        const ngPerTrack = Math.floor((stringer?.totalNgStrings || 0) / 2);
        const okRemainder = (stringer?.totalOkStrings || 0) % 2;
        const ngRemainder = (stringer?.totalNgStrings || 0) % 2;

        updated[stringerId].tracks = {
          1: { 
            okStrings: okPerTrack + okRemainder, 
            ngStrings: ngPerTrack + ngRemainder 
          },
          2: { 
            okStrings: okPerTrack, 
            ngStrings: ngPerTrack 
          }
        };
      });

      return updated;
    });
  }, []);

  // Enhanced validation logic
  const validateData = useCallback(() => {
    const errors = [];
    
    Object.entries(stringerData)?.forEach(([stringerId, stringer]) => {
      const totalOk = stringer?.totalOkStrings || 0;
      const totalNg = stringer?.totalNgStrings || 0;
      const total = totalOk + totalNg;

      // Check for required data
      if (total === 0) {
        errors?.push({
          stringerId,
          type: 'required',
          severity: 'medium',
          message: 'No production data entered for this stringer',
          suggestion: 'Enter OK and NG string counts'
        });
      }

      // Check quality rate
      if (total > 0) {
        const qualityRate = (totalOk / total) * 100;
        if (qualityRate < 80) {
          errors?.push({
            stringerId,
            type: 'range',
            severity: 'high',
            message: `Quality rate ${qualityRate?.toFixed(1)}% is below 80% threshold`,
            suggestion: 'Review production process or verify data accuracy'
          });
        }
      }

      // Check for excessive production
      if (total > 500) {
        errors?.push({
          stringerId,
          type: 'range',
          severity: 'medium',
          message: 'Production count seems unusually high',
          suggestion: 'Verify data entry accuracy'
        });
      }

      // Track-wise validation for track-wise mode
      if (currentMode === 'track-wise') {
        Object.entries(stringer?.tracks || {})?.forEach(([trackId, track]) => {
          if ((track?.okStrings || 0) > 999 || (track?.ngStrings || 0) > 999) {
            errors?.push({
              stringerId,
              trackId,
              type: 'range',
              severity: 'high',
              message: 'Track values exceed maximum limit of 999',
              suggestion: 'Enter values between 0-999'
            });
          }
        });
      }
    });

    setValidationErrors(errors);
    
    // Update validation summary
    const completed = Object.values(stringerData)?.filter(s => (s?.totalOkStrings || 0) > 0 || (s?.totalNgStrings || 0) > 0)?.length;
    const highErrors = errors?.filter(e => e?.severity === 'high')?.length;
    const mediumErrors = errors?.filter(e => e?.severity === 'medium')?.length;
    
    setValidationSummary({
      passed: 6 - errors?.length,
      warnings: mediumErrors,
      errors: highErrors,
      pending: 6 - completed
    });

    setEntryProgress({ completed, total: 6 });
    
    return errors;
  }, [stringerData, currentMode]);

  // Auto-validate on data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateData();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [validateData]);

  // Handle mode change with data synchronization
  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    if (mode === 'stringer-wise') {
      // Sync track totals to stringer totals
      setStringerData(prev => {
        const updated = { ...prev };
        Object.keys(updated)?.forEach(stringerId => {
          const tracks = updated?.[stringerId]?.tracks || {};
          updated[stringerId].totalOkStrings = Object.values(tracks)?.reduce((sum, track) => sum + (track?.okStrings || 0), 0);
          updated[stringerId].totalNgStrings = Object.values(tracks)?.reduce((sum, track) => sum + (track?.ngStrings || 0), 0);
        });
        return updated;
      });
    }
  };

  // Handle save
  const handleSave = useCallback(() => {
    localStorage.setItem(`data-entry-${currentHour}`, JSON.stringify(stringerData));
    setLastSaved(new Date());
    // Show toast notification (you can implement a toast component)
    console.log('Data saved successfully');
  }, [stringerData, currentHour]);

  // Handle submit entry with validation
  const handleSubmitEntry = useCallback(async () => {
    const errors = validateData();
    const highSeverityErrors = errors?.filter(e => e?.severity === 'high');
    
    if (highSeverityErrors?.length > 0) {
      alert(`Cannot submit entry: ${highSeverityErrors?.length} high severity error(s) found. Please fix them first.`);
      return;
    }

    if (!window.confirm('Are you sure you want to submit this entry? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to history
      const newEntry = {
        id: Date.now(),
        hour: currentHour,
        timestamp: new Date(),
        user: "Current User",
        status: "submitted",
        data: { ...stringerData },
        validationErrors: errors?.filter(e => e?.severity === 'medium')?.map(e => e?.message),
        notes: `Submitted at ${new Date()?.toLocaleString()}`
      };

      const updatedHistory = [newEntry, ...historyData];
      setHistoryData(updatedHistory);
      localStorage.setItem('entry-history', JSON.stringify(updatedHistory));
      
      // Clear current data
      handleClear();
      
      alert('Entry submitted successfully!');
    } catch (error) {
      alert('Failed to submit entry. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateData, stringerData, currentHour, historyData]);

  // Handle edit with proper restoration
  const handleEdit = useCallback((id) => {
    if (typeof id === 'string' && id?.length === 1) {
      // Editing a stringer - focus on the stringer input
      const element = document.querySelector(`input[data-stringer="${id}"]`);
      if (element) {
        element?.focus();
        element?.select();
      }
    } else {
      // Editing a history entry
      const entry = historyData?.find(h => h?.id === id);
      if (entry && window.confirm('Load this entry data for editing? Current data will be replaced.')) {
        setStringerData(entry?.data || {});
      }
    }
  }, [historyData]);

  // Enhanced clear functionality with confirmation
  const handleClear = useCallback((stringerId = null) => {
    if (stringerId) {
      if (!window.confirm(`Clear all data for Stringer ${stringerId}?`)) return;
      
      setStringerData(prev => ({
        ...prev,
        [stringerId]: {
          totalOkStrings: 0,
          totalNgStrings: 0,
          tracks: {
            1: { okStrings: 0, ngStrings: 0 },
            2: { okStrings: 0, ngStrings: 0 }
          }
        }
      }));
    } else {
      if (!window.confirm('Clear all data for all stringers? This action cannot be undone.')) return;
      
      // Clear all
      const clearedData = {};
      for (let i = 1; i <= 6; i++) {
        clearedData[i] = {
          totalOkStrings: 0,
          totalNgStrings: 0,
          tracks: {
            1: { okStrings: 0, ngStrings: 0 },
            2: { okStrings: 0, ngStrings: 0 }
          }
        };
      }
      setStringerData(clearedData);
      localStorage.removeItem(`data-entry-${currentHour}`);
    }
    setShowDeleteConfirm(null);
  }, [currentHour]);

  // Handle restore from history
  const handleRestore = useCallback((id) => {
    const entry = historyData?.find(h => h?.id === id);
    if (entry && window.confirm('Restore this entry data? Current data will be replaced.')) {
      setStringerData(entry?.data || {});
    }
  }, [historyData]);

  // Handle delete from history with confirmation
  const handleDelete = useCallback((id) => {
    if (window.confirm('Delete this entry from history? This action cannot be undone.')) {
      const updatedHistory = historyData?.filter(h => h?.id !== id);
      setHistoryData(updatedHistory);
      localStorage.setItem('entry-history', JSON.stringify(updatedHistory));
    }
  }, [historyData]);

  // Handle clear validation errors
  const handleClearErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  // Handle export history
  const handleExportHistory = useCallback(() => {
    try {
      const dataStr = JSON.stringify(historyData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `entry-history-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export history');
      console.error('Export error:', error);
    }
  }, [historyData]);

  // Handle voice input (mock implementation)
  const handleVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = event?.results?.[0]?.[0]?.transcript;
      console.log('Voice input:', transcript);
      // Process voice commands here
      alert(`Voice input received: ${transcript}`);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event?.error);
      alert('Speech recognition failed');
    };
    
    recognition?.start();
  }, []);

  // Handle barcode scanner (mock implementation)
  const handleBarcodeScanner = useCallback(() => {
    // This would integrate with a real barcode scanning library
    const mockBarcode = prompt('Enter barcode data:');
    if (mockBarcode) {
      console.log('Scanned barcode:', mockBarcode);
      // Process barcode data here
      alert(`Barcode scanned: ${mockBarcode}`);
    }
  }, []);

  // Toggle auto-save
  const toggleAutoSave = useCallback(() => {
    setAutoSave(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Mode Selector */}
          <ModeSelector
            currentMode={currentMode}
            onModeChange={handleModeChange}
            currentHour={currentHour}
            entryProgress={entryProgress}
            autoSave={autoSave}
            onToggleAutoSave={toggleAutoSave}
            lastSaved={lastSaved}
          />

          {/* Main Content Grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-16 gap-6">
            {/* Data Entry Panel */}
            <div className={`${currentMode === 'track-wise' ? 'lg:col-span-10' : 'lg:col-span-12'}`}>
              {currentMode === 'track-wise' ? (
                <StringerDiagram
                  stringerData={stringerData}
                  onTrackChange={handleTrackChange}
                  validationErrors={validationErrors}
                />
              ) : (
                <StringerWiseEntry
                  stringerData={stringerData}
                  onStringerChange={handleStringerChange}
                  validationErrors={validationErrors}
                  onDistribute={handleDistributeToTracks}
                />
              )}
            </div>

            {/* Validation Panel */}
            {currentMode === 'track-wise' && (
              <div className="lg:col-span-6">
                <ValidationPanel
                  validationErrors={validationErrors}
                  validationSummary={validationSummary}
                  onValidate={validateData}
                  onClearErrors={handleClearErrors}
                />
              </div>
            )}
          </div>

          {/* Entry Summary Table */}
          <div className="mt-8">
            <EntrySummaryTable
              stringerData={stringerData}
              validationErrors={validationErrors}
              onEdit={handleEdit}
              onClear={handleClear}
              onSubmit={handleSubmitEntry}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Entry History Log */}
          <div className="mt-8">
            <EntryHistoryLog
              historyData={historyData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestore={handleRestore}
              onExport={handleExportHistory}
            />
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex items-center justify-between bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <Icon name="Keyboard" size={20} className="text-muted-foreground" />
              <div className="text-sm">
                <span className="font-medium text-foreground">Keyboard Shortcuts:</span>
                <span className="text-muted-foreground ml-2">
                  Ctrl+S (Save) • Ctrl+Enter (Submit) • Ctrl+R (Validate) • Esc (Cancel)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Mic"
                iconPosition="left"
                onClick={handleVoiceInput}
              >
                Voice Input
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Scan"
                iconPosition="left"
                onClick={handleBarcodeScanner}
              >
                Barcode Scanner
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Send"
                iconPosition="left"
                disabled={validationErrors?.filter(e => e?.severity === 'high')?.length > 0 || isSubmitting}
                onClick={handleSubmitEntry}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Entry'}
              </Button>
            </div>
          </div>

          {/* Auto-save status */}
          {lastSaved && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Last saved: {lastSaved?.toLocaleTimeString()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DataEntryValidationDashboard;