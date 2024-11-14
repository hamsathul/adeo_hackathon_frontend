import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Status, Task, TaskFormData } from '../types';
import { KanbanTask } from './KanbanTask';
import { TaskDialog } from './TaskDialog';
import { cn } from '../utils';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  onAddTask: (status: Status, data: TaskFormData) => void;
  onEditTask: (taskId: string, data: TaskFormData) => void;
  onDeleteTask: (taskId: string) => void;
}

const statusConfig = {
  'todo': { title: 'TO DO', color: 'bg-gray-50 border-t-gray-300' },
  'in-progress': { title: 'IN PROGRESS', color: 'bg-blue-50 border-t-blue-400' },
  'testing': { title: 'TESTING', color: 'bg-purple-50 border-t-purple-400' },
  'review': { title: 'REVIEW', color: 'bg-yellow-50 border-t-yellow-400' },
  'done': { title: 'DONE', color: 'bg-green-50 border-t-green-400' },
  'on-hold': { title: 'ON HOLD', color: 'bg-orange-50 border-t-orange-400' },
  'rejected': { title: 'REJECTED', color: 'bg-red-50 border-t-red-400' }
};

export function KanbanColumn({ status, tasks, onAddTask, onEditTask, onDeleteTask }: KanbanColumnProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { setNodeRef } = useDroppable({ id: status });

  const handleAddTask = (data: TaskFormData) => {
    onAddTask(status, data);
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        'border-t-2 transition-colors min-w-[280px]',
        statusConfig[status].color
      )}
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 tracking-wide">
            {statusConfig[status].title}
            <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-medium">
              {tasks.length}
            </span>
          </h3>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <SortableContext
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div className="p-2 flex flex-col gap-2 min-h-[200px]">
          {tasks.map((task) => (
            <KanbanTask
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      </SortableContext>

      <TaskDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddTask}
        title={`Add Task to ${statusConfig[status].title}`}
      />
    </div>
  );
}