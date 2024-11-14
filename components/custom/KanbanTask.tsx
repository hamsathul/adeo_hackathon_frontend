import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Task, TaskFormData } from '../types';
import { TaskDialog } from './TaskDialog';
import { cn } from '../utils';

interface KanbanTaskProps {
  task: Task;
  onEdit: (taskId: string, data: TaskFormData) => void;
  onDelete: (taskId: string) => void;
}

const assigneeColors: Record<string, string> = {
  'BS': 'bg-blue-500',
  'YD': 'bg-yellow-500',
  'FK': 'bg-green-500',
};

export function KanbanTask({ task, onEdit, onDelete }: KanbanTaskProps) {
  const [showActions, setShowActions] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = (data: TaskFormData) => {
    onEdit(task.id, data);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
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
          'bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move group',
          'hover:shadow-md transition-shadow duration-200',
          isDragging && 'opacity-50'
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600">
              {task.taskId}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {task.department}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {task.assignee && (
              <div
                className={cn(
                  'w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-medium',
                  assigneeColors[task.assignee]
                )}
              >
                {task.assignee}
              </div>
            )}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showActions && (
                <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-32 z-10">
                  <button
                    onClick={() => {
                      setIsEditDialogOpen(true);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-gray-700">{task.title}</p>
      </div>

      <TaskDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEdit}
        initialData={{ title: task.title, assignee: task.assignee || '', department: task.department }}
        title="Edit Task"
      />
    </>
  );
}