import React, { useState } from 'react';
import { X, User, Calendar, Tag, Flag, Pencil, MessageSquare, FileText, Info, Brain, Send, Upload, Save } from 'lucide-react';
import { Opinion, RemarkFormData } from '../types';
import { DocumentAnalysis } from './DocumentAnalysis';
import { analyzeDocument, DocumentAnalysisResponse } from '../services/documentAnalysis';
import { cn } from '../utils';

interface KanbanDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opinion: Opinion;
  onEdit?: () => void;
  onAddRemark: (opinionId: string, remark: RemarkFormData) => void;
}

const DetailSection = ({ title, content, description }: { title: string; content?: string; description?: string }) => (
  <div className="mb-6">
    <div className="flex items-start justify-between mb-2">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      {description && (
        <div className="group relative">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute right-0 w-64 p-2 bg-white rounded-lg shadow-lg border border-gray-100 text-xs text-gray-600 hidden group-hover:block z-10">
            {description}
          </div>
        </div>
      )}
    </div>
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-gray-700 whitespace-pre-wrap">{content || 'No information provided'}</p>
    </div>
  </div>
);

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

  // Rest of your component implementation remains the same, just use 'details' instead of 'opinion.details'
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Rest of your JSX remains the same, just ensure you're using 'details' instead of 'opinion.details' */}
      <div className={cn(
        "bg-white rounded-xl max-h-[90vh] flex transition-all duration-300",
        showAiPanel ? "w-[90vw]" : "w-[800px]"
      )}>
        {/* Your existing JSX content */}
        <div className="flex-1 flex flex-col max-h-[90vh]">
          {/* Content sections */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'details' ? (
              <div className="p-6">
                {/* Basic Information section remains the same */}
                
                {/* Opinion Details section with the fix */}
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

                {/* Rest of your component remains the same */}
              </div>
            ) : (
              // Remarks tab content remains the same
              <div className="p-6">
                {/* Your existing remarks section */}
              </div>
            )}
          </div>
        </div>

        {/* AI Analysis Panel remains the same */}
      </div>
    </div>
  );
}