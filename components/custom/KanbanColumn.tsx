import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Status, Opinion, OpinionFormData, RemarkFormData } from '../types';
import { KanbanOpinion } from './KanbanOpinion';
import { TaskDialog } from './TaskDialog';
import { cn } from '../utils';
import { translations } from './translation';
import { useLanguageStore } from '../../store/useLanguageStore';

interface KanbanColumnProps {
  status: Status;
  items: Opinion[];
  onAdd: (status: Status, data: OpinionFormData) => void;
  onEdit: (opinionId: string, data: OpinionFormData) => void;
  onDelete: (opinionId: string) => void;
  onAddRemark: (opinionId: string, remark: RemarkFormData) => void;
}


export function KanbanColumn({ status, items, onAdd, onEdit, onDelete, onAddRemark }: KanbanColumnProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { setNodeRef } = useDroppable({ id: status });
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;

  const statusConfig: Record<Status, { title: string; color: string }> = {
    'unassigned': { title: text.unassignedCard, color: 'bg-gray-100 border-t-gray-300' },
    'todo': { title: text.todocard, color: 'bg-blue-100 border-t-blue-300' },
    'in-progress': { title: text.progressCard, color: 'bg-teal-100 border-t-teal-300' },
    'testing': { title: text.testingCard, color: 'bg-purple-100 border-t-purple-300' },
    'review': { title: text.reviewCard, color: 'bg-yellow-100 border-t-yellow-300' },
    'done': { title: text.completedCard, color: 'bg-green-100 border-t-green-300' },
    'on-hold': { title: text.onholdCard, color: 'bg-orange-100 border-t-orange-300' },
    'rejected': { title: text.rejectedCard, color: 'bg-red-100 border-t-red-300' }
  };
  
  const handleAddOpinion = (data: OpinionFormData) => {
    onAdd(status, data);
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        'border-t-[3px] transition-colors',
        statusConfig[status].color
      )}
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 tracking-wide">
              {statusConfig[status].title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {items.length} {items.length === 1 ? 'opinion' : 'opinions'}
            </p>
          </div>
          {/* <button
            onClick={() => setIsAddDialogOpen(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Add opinion"
          >
            <Plus className="w-4 h-4" />
          </button> */}
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
        title={`Add Opinion to ${statusConfig[status].title}`}
      />
    </div>
  );
}