import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, FileText, AlertTriangle, Info } from 'lucide-react';
import { Opinion, Department, Priority } from '../types';
import { cn } from '../utils';

interface OpinionSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (opinion: Opinion) => void;
  initialData?: Opinion;
  isEditing?: boolean;
}

const DEPARTMENTS: Department[] = ['Engineering', 'Design', 'Marketing', 'Product', 'Sales'];
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
  lastModified: number;
}

export function OpinionSubmissionDialog({ isOpen, onClose, onSubmit, initialData, isEditing }: OpinionSubmissionDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [priority, setPriority] = useState<Priority>('medium');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData && isEditing) {
      setTitle(initialData.title);
      setDescription(initialData.submitter.description);
      setDepartment(initialData.department);
      setPriority(initialData.priority);
      setSubmitterName(initialData.submitter.name);
      setSubmitterEmail(initialData.submitter.email || '');
      // Convert existing documents to UploadedFile format
      setFiles(initialData.submitter.documents.map(doc => ({
        name: doc.name,
        size: 0, // Size not available from existing documents
        type: doc.name.split('.').pop() || '',
        lastModified: Date.now()
      })));
    }
  }, [initialData, isEditing, isOpen]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setDepartment('Engineering');
      setPriority('medium');
      setSubmitterName('');
      setSubmitterEmail('');
      setFiles([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
      type: file.type,
      lastModified: file.lastModified
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const opinionData: Opinion = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      opinionId: initialData?.opinionId || `GOV-${Math.floor(Math.random() * 1000)}`,
      title,
      status: initialData?.status || 'unassigned',
      department,
      priority,
      submitter: {
        name: submitterName,
        email: submitterEmail,
        description,
        documents: files.map(file => ({
          name: file.name,
          url: '#'
        }))
      },
      remarks: initialData?.remarks || []
    };

    onSubmit(opinionData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Opinion' : 'Submit New Opinion'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opinion Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a clear, descriptive title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                  Priority Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRIORITIES.map((p) => {
                    const PriorityIcon = priorityConfig[p].icon;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          'p-2 border rounded-lg flex items-center justify-center gap-1.5',
                          'transition-colors hover:bg-gray-50 text-sm',
                          priority === p ? priorityConfig[p].color : 'border-gray-200'
                        )}
                      >
                        <PriorityIcon className="w-3.5 h-3.5" />
                        <span className="font-medium capitalize">{p}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                placeholder="Provide a detailed description of your opinion..."
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
                  'border-2 border-dashed rounded-lg p-6 transition-colors',
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
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Drop files here or click to upload
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX, XLS, XLSX up to 10MB each
                  </span>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-3 space-y-2">
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

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Save Changes' : 'Submit Opinion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}