import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DetailedDataGrid = ({ data, onExportSelection }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [filterConfig, setFilterConfig] = useState({
    stringer: 'all',
    status: 'all',
    efficiency: { min: 0, max: 100 }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mockData = [
    {
      id: 1,
      timestamp: '2025-01-08 05:00',
      stringer: 'STR-001',
      track1: 48,
      track2: 52,
      totalStrings: 100,
      modules: 8.33,
      efficiency: 94.2,
      utilization: 88.5,
      ngCount: 3,
      qualityRate: 97.0,
      status: 'optimal',
      operator: 'John Smith',
      shift: 'A'
    },
    {
      id: 2,
      timestamp: '2025-01-08 04:00',
      stringer: 'STR-002',
      track1: 45,
      track2: 49,
      totalStrings: 94,
      modules: 7.83,
      efficiency: 91.7,
      utilization: 85.2,
      ngCount: 6,
      qualityRate: 93.6,
      status: 'good',
      operator: 'Sarah Johnson',
      shift: 'A'
    },
    {
      id: 3,
      timestamp: '2025-01-08 03:00',
      stringer: 'STR-003',
      track1: 42,
      track2: 46,
      totalStrings: 88,
      modules: 7.33,
      efficiency: 89.3,
      utilization: 82.7,
      ngCount: 8,
      qualityRate: 90.9,
      status: 'good',
      operator: 'Mike Wilson',
      shift: 'A'
    },
    {
      id: 4,
      timestamp: '2025-01-08 02:00',
      stringer: 'STR-004',
      track1: 38,
      track2: 44,
      totalStrings: 82,
      modules: 6.83,
      efficiency: 86.8,
      utilization: 79.4,
      ngCount: 12,
      qualityRate: 85.4,
      status: 'attention',
      operator: 'Lisa Brown',
      shift: 'A'
    },
    {
      id: 5,
      timestamp: '2025-01-08 01:00',
      stringer: 'STR-005',
      track1: 35,
      track2: 41,
      totalStrings: 76,
      modules: 6.33,
      efficiency: 84.1,
      utilization: 76.8,
      ngCount: 15,
      qualityRate: 80.3,
      status: 'attention',
      operator: 'David Lee',
      shift: 'A'
    },
    {
      id: 6,
      timestamp: '2025-01-08 00:00',
      stringer: 'STR-006',
      track1: 32,
      track2: 38,
      totalStrings: 70,
      modules: 5.83,
      efficiency: 81.5,
      utilization: 74.2,
      ngCount: 18,
      qualityRate: 74.3,
      status: 'critical',
      operator: 'Emma Davis',
      shift: 'C'
    }
  ];

  const gridData = data || mockData;

  const columns = [
    { key: 'timestamp', label: 'Time', sortable: true, width: '120px' },
    { key: 'stringer', label: 'Stringer', sortable: true, width: '100px' },
    { key: 'totalStrings', label: 'Strings', sortable: true, width: '80px' },
    { key: 'modules', label: 'Modules', sortable: true, width: '80px' },
    { key: 'efficiency', label: 'Efficiency %', sortable: true, width: '100px' },
    { key: 'utilization', label: 'Utilization %', sortable: true, width: '110px' },
    { key: 'ngCount', label: 'NG Count', sortable: true, width: '80px' },
    { key: 'qualityRate', label: 'Quality %', sortable: true, width: '90px' },
    { key: 'status', label: 'Status', sortable: true, width: '100px' },
    { key: 'operator', label: 'Operator', sortable: true, width: '120px' },
    { key: 'shift', label: 'Shift', sortable: true, width: '60px' }
  ];

  const sortedData = useMemo(() => {
    let sortableData = [...gridData];
    if (sortConfig?.key) {
      sortableData?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [gridData, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData?.filter(item => {
      if (filterConfig?.stringer !== 'all' && item?.stringer !== filterConfig?.stringer) return false;
      if (filterConfig?.status !== 'all' && item?.status !== filterConfig?.status) return false;
      if (item?.efficiency < filterConfig?.efficiency?.min || item?.efficiency > filterConfig?.efficiency?.max) return false;
      return true;
    });
  }, [sortedData, filterConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleRowSelect = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected?.has(id)) {
      newSelected?.delete(id);
    } else {
      newSelected?.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows?.size === paginatedData?.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(item => item.id)));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'text-success bg-success/10';
      case 'good': return 'text-primary bg-primary/10';
      case 'attention': return 'text-warning bg-warning/10';
      case 'critical': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg industrial-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Detailed Performance Data</h3>
          <p className="text-sm text-muted-foreground">
            Showing {paginatedData?.length} of {filteredData?.length} records
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            onClick={() => console.log('Open filters')}
          >
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => onExportSelection && onExportSelection(Array.from(selectedRows))}
            disabled={selectedRows?.size === 0}
          >
            Export ({selectedRows?.size})
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="p-4 bg-muted/30 border-b border-border">
        <div className="flex flex-wrap items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Stringer:</label>
            <select
              value={filterConfig?.stringer}
              onChange={(e) => setFilterConfig(prev => ({ ...prev, stringer: e?.target?.value }))}
              className="px-3 py-1 bg-background border border-border rounded text-sm"
            >
              <option value="all">All</option>
              <option value="STR-001">STR-001</option>
              <option value="STR-002">STR-002</option>
              <option value="STR-003">STR-003</option>
              <option value="STR-004">STR-004</option>
              <option value="STR-005">STR-005</option>
              <option value="STR-006">STR-006</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Status:</label>
            <select
              value={filterConfig?.status}
              onChange={(e) => setFilterConfig(prev => ({ ...prev, status: e?.target?.value }))}
              className="px-3 py-1 bg-background border border-border rounded text-sm"
            >
              <option value="all">All</option>
              <option value="optimal">Optimal</option>
              <option value="good">Good</option>
              <option value="attention">Attention</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>
      {/* Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows?.size === paginatedData?.length && paginatedData?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              {columns?.map((column) => (
                <th
                  key={column?.key}
                  className="p-3 text-left text-sm font-medium text-foreground"
                  style={{ width: column?.width }}
                >
                  {column?.sortable ? (
                    <button
                      onClick={() => handleSort(column?.key)}
                      className="flex items-center space-x-1 hover:text-primary hover-feedback"
                    >
                      <span>{column?.label}</span>
                      <Icon name={getSortIcon(column?.key)} size={14} />
                    </button>
                  ) : (
                    column?.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((row) => (
              <tr key={row?.id} className="border-b border-border hover:bg-muted/30 hover-feedback">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedRows?.has(row?.id)}
                    onChange={() => handleRowSelect(row?.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-3 text-sm text-foreground">{row?.timestamp}</td>
                <td className="p-3 text-sm font-medium text-foreground">{row?.stringer}</td>
                <td className="p-3 text-sm text-foreground">{row?.totalStrings}</td>
                <td className="p-3 text-sm text-foreground">{row?.modules}</td>
                <td className="p-3 text-sm text-foreground">{row?.efficiency}%</td>
                <td className="p-3 text-sm text-foreground">{row?.utilization}%</td>
                <td className="p-3 text-sm text-foreground">{row?.ngCount}</td>
                <td className="p-3 text-sm text-foreground">{row?.qualityRate}%</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(row?.status)}`}>
                    {row?.status?.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-sm text-foreground">{row?.operator}</td>
                <td className="p-3 text-sm text-foreground">{row?.shift}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailedDataGrid;