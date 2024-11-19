import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Status, Opinion, OpinionFormData, RemarkFormData } from '../types';
import { KanbanOpinion } from './KanbanOpinion';
import { TaskDialog } from './TaskDialog';
import { cn } from '../utils';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/components/custom/translation';

interface KanbanColumnProps {
  status: Status;
  statusDescription: string;
  items: Opinion[];
  onAdd: (status: Status, data: OpinionFormData) => void;
  onEdit: (opinionId: string, data: OpinionFormData) => void;
  onDelete: (opinionId: string) => void;
  onAddRemark: (opinionId: string, remark: RemarkFormData) => void;
}

export function KanbanColumn({
  status,
  statusDescription,
  items,
  onAdd,
  onEdit,
  onDelete,
  onAddRemark
}: KanbanColumnProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { setNodeRef } = useDroppable({ id: status });
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;

  const getStatusColor = (status: Status): string => {
    const colorMap: Record<Status, string> = {
      'unassigned': 'bg-gray-100 border-t-gray-300',
      'assigned_to_department': 'bg-blue-100 border-t-blue-300',
      'assigned_to_expert': 'bg-teal-100 border-t-teal-300',
      'expert_opinion_submitted': 'bg-purple-100 border-t-purple-300',
      'head_review_pending': 'bg-yellow-100 border-t-yellow-300',
      'head_approved': 'bg-green-100 border-t-green-300',
      'in_review': 'bg-indigo-100 border-t-indigo-300',
      'pending_other_department': 'bg-orange-100 border-t-orange-300',
      'additional_info_requested': 'bg-pink-100 border-t-pink-300',
      'completed': 'bg-emerald-100 border-t-emerald-300',
      'rejected': 'bg-red-100 border-t-red-300'
    };
    return colorMap[status] || 'bg-gray-100 border-t-gray-300';
  };

  const handleAddOpinion = (data: OpinionFormData) => {
    onAdd(status, data);
    setIsAddDialogOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        'border-t-[3px] transition-colors min-w-[320px]',
        getStatusColor(status)
      )}
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 tracking-wide">
              {statusDescription}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {items.length} {items.length === 1 ? text.opinion : text.opinions}
            </p>
          </div>
          {status === 'unassigned' && (
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title={text.addOpinion}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <div className="p-2 flex flex-col gap-2 min-h-[200px]">
          {items.map((opinion) => (
            <KanbanOpinion
              key={opinion.id}
              opinion={opinion}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddRemark={onAddRemark}
            />
          ))}
        </div>
      </SortableContext>

      <TaskDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddOpinion}
        title={`${text.addOpinionTo} ${statusDescription}`}
        mode="add"
      />
    </div>
  );
}