import React, { useState } from 'react';
import { X, User, Calendar, Tag, Flag, Pencil, MessageSquare, FileText, Info, Brain, Send, Upload, Save, Loader2 } from 'lucide-react';
import { Opinion, RemarkFormData } from '../types';
import { DocumentAnalysis } from './DocumentAnalysis';
import { analyzeDocument, DocumentAnalysisResponse } from '../services/documentAnalysis';
import { DetailSection } from './DetailSection';
import { cn } from '../utils';
import { translations } from './translation';
import { useLanguageStore } from '@/store/useLanguageStore';

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
	'assigned_to_department': 'bg-gray-100 text-gray-700',
	'assigned_to_expert': 'bg-blue-100 text-blue-700',
	'expert_opinion_submitted': 'bg-purple-100 text-purple-700',
	'head_review_pending': 'bg-yellow-100 text-yellow-700',
	'head_approved': 'bg-green-100 text-green-700',
	'pending_other_department': 'bg-orange-100 text-orange-700',
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
  const isArabic = useLanguageStore((state) => state.isArabic);
  const text = isArabic ? translations.ar : translations.en;

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

  const handleAnalyzeDocument = async (doc: { id: number; file_name: string }) => {
	try {
	  setIsAnalyzing(true);
	  setAnalysisError(null);
	  setSelectedDocument(doc.file_name);
	  setShowAiPanel(true);
  
	  try {
		const result = await analyzeDocument(doc.id);
		setDocumentAnalysis(result);
	  } catch (error) {
		console.error('Analysis error:', error);
		setAnalysisError(error instanceof Error ? error.message : 'Failed to analyze document');
	  }
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
  <span className="text-sm font-medium text-blue-600">{opinion.reference_number}</span>
  <span className="text-sm text-gray-500">•</span>
  <span className="text-sm text-gray-500">{opinion.department?.name}</span>
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
    statusColors[opinion.current_status.name]
  )}>
    {opinion.current_status.description}
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
                {text.ai}
              </button>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  {text.edit}
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
                  {text.details}
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
                  {text.remarks}
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
  <h3 className="text-lg font-semibold mb-4">{text.basicInfo}</h3>
  <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-lg p-4">
    <div className="space-y-1">
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <User className="w-4 h-4" />
        {text.submittedby}
      </div>
      <div className="font-medium">{opinion.requester.username}</div>
      <div className="text-sm text-gray-500">{opinion.requester.email}</div>
    </div>
    <div className="space-y-1">
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        {text.submissionDate}
      </div>
      <div className="font-medium">
        {new Date(opinion.created_at).toLocaleDateString()}
      </div>
    </div>
    <div className="space-y-1">
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <Tag className="w-4 h-4" />
        {text.category}
      </div>
      <div className="font-medium">{opinion.category_rel.name}</div>
      {opinion.subcategory_rel && (
        <div className="text-sm text-gray-500">{opinion.subcategory_rel.name}</div>
      )}
    </div>
    <div className="space-y-1">
      <div className="text-sm text-gray-500">{text.assignmentStatus}</div>
      <div className="font-medium">
        {opinion.assignments && opinion.assignments.length > 0 ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
              {opinion.assignments[0].expert?.username?.charAt(0)}
            </div>
            <span>{text.assignedTo} {opinion.assignments[0].expert?.username}</span>
          </div>
        ) : (
          <span className="text-gray-500">{text.unassigned}</span>
        )}
      </div>
    </div>
  </div>
</div>


<div className="mb-8">
  <h3 className="text-lg font-semibold mb-4">{text.opinionDetails}</h3>
  <DetailSection
    title={text.requestStatement}
    content={opinion.request_statement || ''}
    description="Clearly mention what is required from the committee, stating the purpose and reasoning"
  />
  <DetailSection
    title={text.challengesOpportunities}
    content={opinion.challenges_opportunities || ''}
    description="Mention the reasons for submitting the request and provide supporting information"
  />
  <DetailSection
    title={text.subjectContent}
    content={opinion.subject_content || ''}
    description="Provide details on the requested topic with supporting documents"
  />
  <DetailSection
    title={text.alternativeOptions}
    content={opinion.alternative_options || ''}
    description="Compare alternatives with the proposed solution"
  />
  <DetailSection
    title={text.expectedImpact}
    content={opinion.expected_impact || ''}
    description="Describe implementation feasibility and impacts"
  />
  <DetailSection
    title={text.potentialRisks}
    content={opinion.potential_risks || ''}
    description="List risks and recommended solutions"
  />
  <DetailSection
    title={text.studiesStatistics}
    content={opinion.studies_statistics || ''}
    description="Include relevant studies and statistics"
  />
  <DetailSection
    title={text.legalFinancialOpinions}
    content={opinion.legal_financial_opinions || ''}
    description="Include approved legal and financial opinions"
  />
  <DetailSection
    title={text.stakeholderFeedback}
    content={opinion.stakeholder_feedback || ''}
    description="Include feedback from relevant stakeholders"
  />
  <DetailSection
    title={text.workPlan}
    content={opinion.work_plan || ''}
    description="Detail implementation stages and timeline"
  />
  <DetailSection
    title={text.decisionDraft}
    content={opinion.decision_draft || ''}
    description="Proposed draft text of the decision"
  />
</div>
                {/* Documents Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">{text.supportingDocuments}</h3>
                  
                  {/* Document Upload Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-4 mb-4 transition-colors",
                      isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {text.dropMessage}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {text.dropMessage2}
                      </span>
                    </label>
                  </div>

                  {/* Document List */}
<div className="grid gap-2">
  {/* Existing Documents */}
  {opinion.documents.map((doc) => (
  <div
    key={doc.id}
    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <FileText className="w-5 h-5" />
      </div>
      <div>
        <div className="font-medium text-gray-900 group-hover:text-blue-600">
          {doc.file_name}
        </div>
        <div className="text-sm text-gray-500">
          {formatFileSize(doc.file_size)}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAnalyzeDocument(doc);
        }}
        disabled={isAnalyzing}
        className={cn(
          "p-2 rounded-lg transition-colors",
          isAnalyzing 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "hover:bg-blue-100 text-blue-600"
        )}
      >
        {isAnalyzing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Brain className="w-4 h-4" />
        )}
      </button>
    </div>
  </div>
))}
                    
                    {/* Newly Uploaded Documents */}
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
                            onClick={() =>  handleAnalyzeDocument(doc)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Brain className="w-4 h-4 text-blue-600" />
                          </button>
                          {!doc.saved ? (
                            <>
                              <button
                                onClick={() => handleSaveFile(index)}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                              >
                                <Save className="w-4 h-4 text-green-600" />
                              </button>
                              <button
                                onClick={() => handleRemoveFile(index)}
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
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">{text.opinionRemarks}</h3>
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
                  {text.ai}
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

const formatFileSize = (bytes: number) => {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };