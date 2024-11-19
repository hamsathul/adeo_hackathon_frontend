import React, { useState } from 'react';
import { Flag, ChevronRight, FileText } from 'lucide-react';
import { Opinion, Department, Priority } from '../types';
import { StaffOpinionDialog } from './StaffOpinionDialog';
import { cn } from '../utils';

interface StaffOpinionCardProps {
  opinion: Opinion;
  onAssignDepartment: (opinionId: string, department: Department) => void;
  onAssignStaff: (opinionId: string, assignee: string) => void;
  onAddRemark: (opinionId: string, remark: { content: string; author: string }) => void;
  onCloseOpinion: (opinionId: string) => void;
}

const priorityConfig = {
  urgent: { color: 'text-red-600', bgColor: 'bg-red-50' },
  high: { color: 'text-orange-600', bgColor: 'bg-orange-50' },
  medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  low: { color: 'text-green-600', bgColor: 'bg-green-50' }
} as const;

const statusColors: Record<string, string> = {
  'unassigned': 'bg-gray-100 text-gray-600',
  'todo': 'bg-gray-100 text-gray-600',
  'assigned_to_department': 'bg-blue-100 text-blue-700',
  'assigned_to_expert': 'bg-indigo-100 text-indigo-700',
  'in-progress': 'bg-sky-100 text-sky-700',
  'expert_opinion_submitted': 'bg-emerald-100 text-emerald-700',
  'head_review_pending': 'bg-amber-100 text-amber-700',
  'head_approved': 'bg-green-100 text-green-700',
  'in_review': 'bg-yellow-100 text-yellow-700',
  'pending_other_department': 'bg-purple-100 text-purple-700',
  'additional_info_requested': 'bg-orange-100 text-orange-700',
  'completed': 'bg-teal-100 text-teal-700',
  'rejected': 'bg-red-100 text-red-700'
};

// Type guard to check if a string is a valid Priority
const isPriority = (value: string): value is Priority => {
  return ['urgent', 'high', 'medium', 'low'].includes(value);
};

// Get priority styles with type safety
const getPriorityStyles = (priority: string) => {
  if (isPriority(priority)) {
    return {
      color: priorityConfig[priority].color,
      bgColor: priorityConfig[priority].bgColor
    };
  }
  // Fallback to medium priority if invalid
  return {
    color: priorityConfig.medium.color,
    bgColor: priorityConfig.medium.bgColor
  };
};

export function StaffOpinionCard({
  opinion,
  onAssignDepartment,
  onAssignStaff,
  onAddRemark,
  onCloseOpinion
}: StaffOpinionCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const priorityStyles = getPriorityStyles(opinion.priority);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-200 hover:shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">
              {opinion.opinionId}
            </span>
            <div className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
              priorityStyles.color,
              priorityStyles.bgColor
            )}>
              <Flag className="w-3 h-3" />
              {opinion.priority.charAt(0).toUpperCase() + opinion.priority.slice(1)}
            </div>
          </div>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{opinion.title}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {opinion.submitter.documents.length} files
            </div>
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              statusColors[opinion.status]
            )}>
              {opinion.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => setIsDetailsOpen(true)}
            className="w-full flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Process Opinion
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <StaffOpinionDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        opinion={opinion}
        onAssignDepartment={onAssignDepartment}
        onAssignStaff={onAssignStaff}
        onAddRemark={onAddRemark}
        onCloseOpinion={onCloseOpinion}
      />
    </>
  );
}