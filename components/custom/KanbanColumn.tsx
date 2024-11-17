import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Status, Opinion, OpinionFormData, RemarkFormData } from '../types';
import { KanbanOpinion } from './KanbanOpinion';
import { TaskDialog } from './TaskDialog';
import { cn } from '../utils';

interface KanbanColumnProps {
  status: Status;
  items: Opinion[];
  onAdd: (status: Status, data: OpinionFormData) => void;
  onEdit: (opinionId: string, data: OpinionFormData) => void;
  onDelete: (opinionId: string) => void;
  onAddRemark: (opinionId: string, remark: RemarkFormData) => void;
}

const statusConfig: Record<Status, { title: string; color: string }> = {
  'unassigned': { title: 'UNASSIGNED', color: 'bg-gray-50 border-t-gray-300' },
  'todo': { title: 'TO DO', color: 'bg-gray-50 border-t-gray-300' },
  'in-progress': { title: 'IN PROGRESS', color: 'bg-blue-50 border-t-blue-400' },
  'testing': { title: 'TESTING', color: 'bg-purple-50 border-t-purple-400' },
  'review': { title: 'REVIEW', color: 'bg-yellow-50 border-t-yellow-400' },
  'done': { title: 'DONE', color: 'bg-green-50 border-t-green-400' },
  'on-hold': { title: 'ON HOLD', color: 'bg-orange-50 border-t-orange-400' },
  'rejected': { title: 'REJECTED', color: 'bg-red-50 border-t-red-400' }
};

export function KanbanColumn({ status, items, onAdd, onEdit, onDelete, onAddRemark }: KanbanColumnProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { setNodeRef } = useDroppable({ id: status });

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
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Add opinion"
          >
            <Plus className="w-4 h-4" />
          </button>
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