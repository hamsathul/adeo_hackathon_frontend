import React, { useState } from 'react';
import { X, User, Calendar, Tag, Flag, Pencil, MessageSquare, FileText, Info, Brain, Send } from 'lucide-react';
import { Opinion, RemarkFormData } from '../types';
import { DocumentAnalysis } from './DocumentAnalysis';
import { analyzeDocument, DocumentAnalysisResponse } from '../services/documentAnalysis';
import { DetailSection } from './DetailSection';
import { DocumentUpload } from './DocumentUpload';
import { cn } from '../utils';

interface KanbanDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opinion: Opinion;
  onEdit?: () => void;
  onAddRemark: (opinionId: string, remark: RemarkFormData) => void;
}

const priorityConfig: Record<string, { color: string; icon: string }> = {
  'urgent': { color: 'text-red-600', icon: 'bg-red-100' },
  'high': { color: 'text-orange-600', icon: 'bg-orange-100' },
  'medium': { color: 'text-yellow-600', icon: 'bg-yellow-100' },
  'low': { color: 'text-green-600', icon: 'bg-green-100' },
};

const statusColors: Record<string, string> = {
  'unassigned': 'bg-gray-100 text-gray-700',
  'todo': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'testing': 'bg-purple-100 text-purple-700',
  'review': 'bg-yellow-100 text-yellow-700',
  'done': 'bg-green-100 text-green-700',
  'on-hold': 'bg-orange-100 text-orange-700',
  'rejected': 'bg-red-100 text-red-700',
};

export function KanbanDetailsDialog({ isOpen, onClose, opinion, onEdit, onAddRemark }: KanbanDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'remarks'>('details');
  const [remarkContent, setRemarkContent] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [documentAnalysis, setDocumentAnalysis] = useState<DocumentAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ file: File; url: string; name: string; saved?: boolean }>>([]);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const details = opinion.details || {
    requestStatement: '',
    challengesOpportunities: '',
    subjectContent: '',
    alternativeOptions: '',
    expectedImpact: '',
    potentialRisks: '',
    studiesStatistics: '',
    legalFinancialOpinions: '',
    stakeholderFeedback: '',
    workPlan: '',
    decisionDraft: ''
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
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newFiles = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      saved: false
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleAnalyzeDocument = async (documentUrl: string, fileName: string) => {
    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      setSelectedDocument(fileName);
      setShowAiPanel(true);

      let file: File;
      
      if (documentUrl === '#') {
        const response = await fetch(`/${fileName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.statusText}`);
        }
        const blob = await response.blob();
        const fileType = fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 
                        fileName.toLowerCase().endsWith('.xlsx') ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                        fileName.toLowerCase().endsWith('.xls') ? 'application/vnd.ms-excel' :
                        fileName.toLowerCase().endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                        fileName.toLowerCase().endsWith('.doc') ? 'application/msword' : 'application/octet-stream';
        
        file = new File([blob], fileName, { type: fileType });
      } else {
        const response = await fetch(documentUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }
        const blob = await response.blob();
        file = new File([blob], fileName, { type: blob.type });
      }

      const result = await analyzeDocument(file);
      setDocumentAnalysis(result);
    } catch (error) {
      console.error('Document analysis error:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Failed to analyze document');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSaveFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = { ...newFiles[index], saved: true };
      return newFiles;
    });
  };

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (remarkContent.trim()) {
      onAddRemark(opinion.id, {
        content: remarkContent,
        author: 'Current User'
      });
      setRemarkContent('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={cn(
        "bg-white rounded-xl max-h-[90vh] flex transition-all duration-300",
        showAiPanel ? "w-[90vw]" : "w-[800px]"
      )}>
        <div className="flex-1 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-blue-600">{opinion.opinionId}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{opinion.department}</span>
                <div className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
                  priorityConfig[opinion.priority].icon,
                  priorityConfig[opinion.priority].color
                )}>
                  <Flag className="w-3 h-3" />
                  {opinion.priority.charAt(0).toUpperCase() + opinion.priority.slice(1)}
                </div>
                <div className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  statusColors[opinion.status]
                )}>
                  {opinion.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{opinion.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAiPanel(!showAiPanel)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
                  showAiPanel 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Brain className="w-4 h-4" />
                AI Analysis
              </button>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100">
            <div className="flex gap-6 px-6">
              <button
                onClick={() => setActiveTab('details')}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                )}
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Details
                </div>
              </button>
              <button
                onClick={() => setActiveTab('remarks')}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'remarks'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Remarks
                </div>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'details' ? (
              <div className="p-6">
                {/* Basic Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-lg p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Submitted by
                      </div>
                      <div className="font-medium">{opinion.submitter.name}</div>
                      <div className="text-sm text-gray-500">{opinion.submitter.email}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Submission Date
                      </div>
                      <div className="font-medium">March 15, 2024</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Category
                      </div>
                      <div className="font-medium">{opinion.category}</div>
                      {opinion.subCategory && (
                        <div className="text-sm text-gray-500">{opinion.subCategory}</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Assignment Status</div>
                      <div className="font-medium">
                        {opinion.assignee ? (
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-medium',
                              opinion.assignee === 'BS' ? 'bg-blue-500' :
                              opinion.assignee === 'YD' ? 'bg-yellow-500' :
                              'bg-green-500'
                            )}>
                              {opinion.assignee}
                            </div>
                            <span>Assigned to {opinion.assignee}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Unassigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opinion Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Opinion Details</h3>
                  <DetailSection
                    title="Request Statement"
                    content={details.requestStatement}
                    description="Clearly mention what is required from the committee, stating the purpose and reasoning"
                  />
                  <DetailSection
                    title="Challenges / Opportunities"
                    content={details.challengesOpportunities}
                    description="Mention the reasons for submitting the request and provide supporting information"
                  />
                  <DetailSection
                    title="Subject Content"
                    content={details.subjectContent}
                    description="Provide details on the requested topic with supporting documents"
                  />
                  <DetailSection
                    title="Alternative Options"
                    content={details.alternativeOptions}
                    description="Compare alternatives with the proposed solution"
                  />
                  <DetailSection
                    title="Expected Impact"
                    content={details.expectedImpact}
                    description="Describe implementation feasibility and impacts"
                  />
                  <DetailSection
                    title="Potential Risks and Mitigation"
                    content={details.potentialRisks}
                    description="List risks and recommended solutions"
                  />
                  <DetailSection
                    title="Studies and Statistics"
                    content={details.studiesStatistics}
                    description="Include relevant studies and statistics"
                  />
                  <DetailSection
                    title="Legal and Financial Opinions"
                    content={details.legalFinancialOpinions}
                    description="Include approved legal and financial opinions"
                  />
                  <DetailSection
                    title="Stakeholder Feedback"
                    content={details.stakeholderFeedback}
                    description="Include feedback from relevant stakeholders"
                  />
                  <DetailSection
                    title="Work Plan"
                    content={details.workPlan}
                    description="Detail implementation stages and timeline"
                  />
                  <DetailSection
                    title="Decision Draft"
                    content={details.decisionDraft}
                    description="Proposed draft text of the decision"
                  />
                </div>

                {/* Documents Section */}
                <DocumentUpload
                  isDragging={isDragging}
                  uploadedFiles={uploadedFiles}
                  existingDocuments={opinion.submitter.documents}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onFileInput={handleFileInput}
                  onAnalyzeDocument={handleAnalyzeDocument}
                  onSaveFile={handleSaveFile}
                  onRemoveFile={handleRemoveFile}
                />
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Opinion Remarks</h3>
                  <div className="space-y-4 mb-4">
                    {opinion.remarks?.map((remark) => (
                      <div key={remark.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                              {remark.author.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{remark.author}</div>
                              <div className="text-sm text-gray-500">{remark.timestamp}</div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">{remark.content}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAddRemark} className="flex gap-2">
                    <input
                      type="text"
                      value={remarkContent}
                      onChange={(e) => setRemarkContent(e.target.value)}
                      placeholder="Add a remark..."
                      className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      disabled={!remarkContent.trim()}
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Analysis Panel */}
        {showAiPanel && (
          <div className="w-[500px] border-l border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  AI Analysis
                  {selectedDocument && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      for {selectedDocument}
                    </span>
                  )}
                </h3>
                <DocumentAnalysis
                  analysis={documentAnalysis}
                  isLoading={isAnalyzing}
                  error={analysisError}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}