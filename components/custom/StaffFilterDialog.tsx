import React from 'react';
import { X } from 'lucide-react';
import { Department, TaskFilters } from '../types';

interface StaffFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TaskFilters;
  onApplyFilters: (filters: TaskFilters) => void;
}

const DEPARTMENTS: Department[] = ['Engineering', 'Design', 'Marketing', 'Product', 'Sales'];
const ASSIGNEES = ['BS', 'YD', 'FK'];

export function StaffFilterDialog({ isOpen, onClose, filters, onApplyFilters }: StaffFilterDialogProps) {
  const [localFilters, setLocalFilters] = React.useState<TaskFilters>(filters);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onApplyFilters({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter Opinions</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <select
              value={localFilters.assignee || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, assignee: e.target.value || undefined })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All assignees</option>
              {ASSIGNEES.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={localFilters.department || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, department: (e.target.value || undefined) as Department })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}