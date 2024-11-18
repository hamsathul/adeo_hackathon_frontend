import React from 'react';
import { Upload, Brain, Save, X, FileText } from 'lucide-react';
import { cn } from '../utils';

interface UploadedFile {
  file: File;
  url: string;
  name: string;
  saved?: boolean;
}

interface DocumentUploadProps {
  isDragging: boolean;
  uploadedFiles: UploadedFile[];
  existingDocuments: Array<{ name: string; url: string }>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyzeDocument: (url: string, name: string) => void;
  onSaveFile: (index: number) => void;
  onRemoveFile: (index: number) => void;
}

export function DocumentUpload({
  isDragging,
  uploadedFiles,
  existingDocuments,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInput,
  onAnalyzeDocument,
  onSaveFile,
  onRemoveFile
}: DocumentUploadProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Supporting Documents</h3>
      
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 mb-4 transition-colors",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        )}
      >
        <input
          type="file"
          onChange={onFileInput}
          multiple
          className="hidden"
          id="file-input"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">
            Drop files here or click to upload
          </span>
          <span className="text-xs text-gray-500 mt-1">
            PDF, DOC, DOCX, XLS, XLSX up to 10MB each
          </span>
        </label>
      </div>

      <div className="grid gap-2">
        {existingDocuments.map((doc, index) => (
          <div
            key={`existing-${index}`}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600">
                  {doc.name}
                </div>
                <div className="text-sm text-gray-500">
                  Existing document
                </div>
              </div>
            </div>
            <button
              onClick={() => onAnalyzeDocument('#', doc.name)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Brain className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        ))}
        
        {uploadedFiles.map((doc, index) => (
          <div
            key={`uploaded-${index}`}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600">
                  {doc.name}
                </div>
                <div className="text-sm text-gray-500">
                  {doc.saved ? 'Saved' : 'Pending save'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAnalyzeDocument(doc.url, doc.name)}
                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Brain className="w-4 h-4 text-blue-600" />
              </button>
              {!doc.saved ? (
                <>
                  <button
                    onClick={() => onSaveFile(index)}
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}