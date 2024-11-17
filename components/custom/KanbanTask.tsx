import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, MoreVertical, Pencil, Tag, Trash2 } from 'lucide-react';
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

const statusColors: Record<string, string> = {
  'todo': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'testing': 'bg-purple-100 text-purple-700',
  'review': 'bg-yellow-100 text-yellow-700',
  'done': 'bg-green-100 text-green-700',
  'on-hold': 'bg-orange-100 text-orange-700',
  'rejected': 'bg-red-100 text-red-700',
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
          'bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-move group',
          'hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5',
          isDragging && 'opacity-50 rotate-2'
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              statusColors[task.status]
            )}>
              {task.taskId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {task.assignee && (
              <div
                className={cn(
                  'w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-medium shadow-sm',
                  assigneeColors[task.assignee]
                )}
              >
                {task.assignee}
              </div>
            )}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showActions && (
                <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 w-36 z-10">
                  <button
                    onClick={() => {
                      setIsEditDialogOpen(true);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
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
        <h3 className="text-gray-900 font-medium mb-2">{task.title}</h3>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            {task.department}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            2d
          </div>
        </div>
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