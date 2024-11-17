import React from 'react';
import { X, Flag, Tag, User, FileText, AlertTriangle, Info, Upload, Trash2 } from 'lucide-react';
import { Department, OpinionFormData, Priority } from '../types';
import { cn } from '../utils';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OpinionFormData) => void;
  initialData?: OpinionFormData;
  title: string;
}

const DEPARTMENTS: Department[] = ['Engineering', 'Design', 'Marketing', 'Product', 'Sales'];
const ASSIGNEES = ['BS', 'YD', 'FK'];
const PRIORITIES: Priority[] = ['urgent', 'high', 'medium', 'low'];

const priorityConfig = {
  urgent: { icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-100' },
  high: { icon: AlertTriangle, color: 'text-orange-600 bg-orange-50 border-orange-100' },
  medium: { icon: Info, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
  low: { icon: Info, color: 'text-green-600 bg-green-50 border-green-100' },
};

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export function TaskDialog({ isOpen, onClose, onSubmit, initialData, title }: TaskDialogProps) {
  const [formData, setFormData] = React.useState<OpinionFormData>(
    initialData || {
      title: '',
      assignee: '',
      department: 'Engineering',
      priority: 'medium',
      submitter: {
        name: '',
        email: '',
        description: ''
      }
    }
  );
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    const processedFiles = newFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setFiles(prevFiles => [...prevFiles, ...processedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-[10vh]">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opinion Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a clear, descriptive title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Department
                  </div>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  required
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Assignee
                  </div>
                </label>
                <select
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  required
                >
                  <option value="">Select assignee</option>
                  {ASSIGNEES.map((assignee) => (
                    <option key={assignee} value={assignee}>
                      {assignee}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Priority Level
                </div>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRIORITIES.map((p) => {
                  const PriorityIcon = priorityConfig[p].icon;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={cn(
                        'p-2 border rounded-lg flex items-center justify-center gap-1.5',
                        'transition-colors hover:bg-gray-50 text-sm',
                        formData.priority === p ? priorityConfig[p].color : 'border-gray-200'
                      )}
                    >
                      <PriorityIcon className="w-3.5 h-3.5" />
                      <span className="font-medium capitalize">{p}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.submitter.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    submitter: { ...formData.submitter, name: e.target.value }
                  })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.submitter.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    submitter: { ...formData.submitter, email: e.target.value }
                  })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.submitter.description}
                onChange={(e) => setFormData({
                  ...formData,
                  submitter: { ...formData.submitter, description: e.target.value }
                })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide a detailed description..."
                rows={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supporting Documents
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'border-2 border-dashed rounded-lg p-4 transition-colors',
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
                  'text-center'
                )}
              >
                <input
                  type="file"
                  onChange={handleFileInput}
                  multiple
                  className="hidden"
                  id="file-input"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
                <label
                  htmlFor="file-input"
                  className="cursor-pointer inline-flex flex-col items-center"
                >
                  <Upload className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-600">
                    Drop files here or click to upload
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    PDF, DOC, DOCX, XLS, XLSX up to 10MB each
                  </span>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white rounded-lg">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}