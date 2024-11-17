import React, { useState } from 'react';
import { X, User, Calendar, Tag, Flag, Pencil, MessageSquare, FileText, Info, Users, Brain, Send } from 'lucide-react';
import { Opinion, RemarkFormData } from '../types';
import { cn } from '../utils';

interface KanbanDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opinion: Opinion;
  onEdit?: () => void;
  onAddRemark: (opinionId: string, remark: RemarkFormData) => void;
}

type Tab = 'details' | 'remarks' | 'ai-analysis';

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
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [remarkContent, setRemarkContent] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);

  if (!isOpen) return null;

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
        showAiPanel ? "w-[90vw]" : "w-[600px]"
      )}>
        <div className="flex-1 flex flex-col max-h-[90vh]">
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
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-8">
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
                      Department
                    </div>
                    <div className="font-medium">{opinion.department}</div>
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

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {opinion.submitter.description}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Attached Documents</h3>
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
                </div>
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

        {showAiPanel && (
          <div className="w-[400px] border-l border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-500" />
                      Suggested Department
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">Engineering</div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[90%]"></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">90%</span>
                      </div>
                      <div className="mt-3 text-sm text-gray-600 bg-indigo-50 p-3 rounded-lg">
                        <p>
                          Based on the technical nature of the infrastructure development proposal, 
                          including detailed assessments of road conditions and bridge safety ratings. 
                          The project requires engineering expertise for structural analysis, 
                          material specifications, and technical implementation planning.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <h4 className="font-medium mb-3">Document Analysis</h4>
                    <div className="space-y-3">
                      {opinion.submitter.documents.map((doc, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="font-medium text-sm">{doc.name}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Technical document containing specifications and requirements.
                            Key topics: infrastructure, safety standards, implementation timeline.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <h4 className="font-medium mb-3">Content Analysis</h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Complexity Score:</span>
                        <span className="ml-2 text-blue-600">High</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Technical Level:</span>
                        <span className="ml-2 text-blue-600">Advanced</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Implementation Time:</span>
                        <span className="ml-2 text-blue-600">Long-term</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}