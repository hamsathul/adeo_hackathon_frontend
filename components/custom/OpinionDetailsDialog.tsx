import React, { useState } from 'react';
import { X, FileText, User, Calendar, Tag, Flag, Pencil, MessageSquare, Info } from 'lucide-react';
import { Opinion } from '../types';
import { cn } from '../utils';

interface OpinionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opinion: Opinion;
  isAdmin?: boolean;
  onEdit?: () => void;
}

type Tab = 'details' | 'remarks';

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

export function OpinionDetailsDialog({ isOpen, onClose, opinion, isAdmin = false, onEdit }: OpinionDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<Tab>('details');

  if (!isOpen) return null;

  const renderDetailSection = (title: string, content: string) => (
    <div>
      <p className="text-gray-500 font-medium mb-1">{title}</p>
      <p className="text-gray-900">{content}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
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
            {!isAdmin && onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit Opinion
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
        
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'details' ? (
            <div className="p-6 space-y-8">
              <div>
                <h3 className="font-medium mb-3 text-gray-900">Basic Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-6">
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
                  </div>
                  <p><span className="text-gray-500 font-medium">Category:</span> {opinion.category}</p>
                  {opinion.subCategory && (
                    <p><span className="text-gray-500 font-medium">Sub-category:</span> {opinion.subCategory}</p>
                  )}
                  <p><span className="text-gray-500 font-medium">Priority:</span> {opinion.priority}</p>
                </div>
              </div>

              {opinion.details && (
                <div>
                  <h3 className="font-medium mb-3 text-gray-900">Opinion Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4 text-sm">
                    {renderDetailSection('Request Statement', opinion.details.requestStatement)}
                    {renderDetailSection('Challenges / Opportunities', opinion.details.challengesOpportunities)}
                    {renderDetailSection('Subject Content', opinion.details.subjectContent)}
                    {renderDetailSection('Alternative Options', opinion.details.alternativeOptions)}
                    {renderDetailSection('Expected Impact', opinion.details.expectedImpact)}
                    {renderDetailSection('Potential Risks and Mitigation', opinion.details.potentialRisks)}
                    {renderDetailSection('Studies and Statistics', opinion.details.studiesStatistics)}
                    {renderDetailSection('Legal and Financial Opinions', opinion.details.legalFinancialOpinions)}
                    {renderDetailSection('Stakeholder Feedback', opinion.details.stakeholderFeedback)}
                    {renderDetailSection('Work Plan', opinion.details.workPlan)}
                    {renderDetailSection('Decision Draft', opinion.details.decisionDraft)}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-3 text-gray-900">Supporting Documents</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {opinion.submitter.documents.length > 0 ? (
                    <div className="grid gap-2">
                      {opinion.submitter.documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
                        >
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-blue-600">
                              {doc.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Added on March 15, 2024
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No documents attached</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Opinion Remarks</h3>
                {opinion.remarks?.length > 0 ? (
                  <div className="space-y-4">
                    {opinion.remarks.map((remark) => (
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
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-1">No remarks yet</h4>
                    <p className="text-gray-500">
                      There are no remarks or comments on this opinion yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}