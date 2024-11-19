import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, MoreVertical, Pencil, Tag, Trash2, ChevronRight, Flag, FileText } from 'lucide-react';
import { Opinion, OpinionFormData, RemarkFormData } from '../types';
import { TaskDialog } from './TaskDialog';
import { KanbanDetailsDialog } from './KanbanDetailsDialog';
import { cn } from '../utils';

interface KanbanOpinionProps {
  opinion: Opinion;
  onEdit: (opinionId: string, data: OpinionFormData) => void;
  onDelete: (opinionId: string) => void;
  onAddRemark: (opinionId: string, remark: RemarkFormData) => void;
}

const priorityConfig: Record<string, { color: string; bgColor: string }> = {
  'urgent': { color: 'text-red-700', bgColor: 'bg-red-50' },
  'high': { color: 'text-orange-700', bgColor: 'bg-orange-50' },
  'medium': { color: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  'low': { color: 'text-green-700', bgColor: 'bg-green-50' },
};

export function KanbanOpinion({ opinion, onEdit, onDelete, onAddRemark }: KanbanOpinionProps) {
  const [showActions, setShowActions] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: opinion.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = (data: OpinionFormData) => {
    onEdit(opinion.id.toString(), data);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this opinion?')) {
      onDelete(opinion.id.toString());
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          'bg-white rounded-lg shadow-sm border border-gray-100 cursor-move group',
          'hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5',
          isDragging && 'opacity-50 rotate-2'
        )}
        onClick={() => setIsDetailsDialogOpen(true)}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                {opinion.reference_number}
              </span>
              <div className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium',
                priorityConfig[opinion.priority].bgColor,
                priorityConfig[opinion.priority].color
              )}>
                <Flag className="w-3 h-3" />
                {opinion.priority.charAt(0).toUpperCase() + opinion.priority.slice(1)}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {opinion.documents.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FileText className="w-3 h-3" />
                  {opinion.documents.length}
                </div>
              )}
              {opinion.requester && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  {opinion.requester.username}
                </div>
              )}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showActions && (
                  <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 w-32 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditDialogOpen(true);
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
            {opinion.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {opinion.department?.name}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(opinion.created_at).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailsDialogOpen(true);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5"
            >
              View
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <TaskDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEdit}
        initialData={{
          title: opinion.title,
          description: opinion.description,
          department_id: opinion.department_id,
          priority: opinion.priority,
          category_id: opinion.category_id,
          sub_category_id: opinion.sub_category_id,
          request_statement: opinion.request_statement,
          challenges_opportunities: opinion.challenges_opportunities,
          subject_content: opinion.subject_content,
          alternative_options: opinion.alternative_options,
          expected_impact: opinion.expected_impact,
          potential_risks: opinion.potential_risks,
          studies_statistics: opinion.studies_statistics,
          legal_financial_opinions: opinion.legal_financial_opinions,
          stakeholder_feedback: opinion.stakeholder_feedback,
          work_plan: opinion.work_plan,
          decision_draft: opinion.decision_draft
        }}
        title="Edit Opinion"
      />

      <KanbanDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        opinion={opinion}
        onEdit={() => {
          setIsEditDialogOpen(true);
          setIsDetailsDialogOpen(false);
        }}
        onAddRemark={onAddRemark}
      />
    </>
  );
}