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
  'todo': { title: 'TO DO', color: 'bg-gray-100' },
  'in-progress': { title: 'IN PROGRESS', color: 'bg-blue-50' },
  'testing': { title: 'TESTING', color: 'bg-purple-50' },
  'review': { title: 'REVIEW', color: 'bg-yellow-50' },
  'done': { title: 'DONE', color: 'bg-green-50' }
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
        'rounded-lg p-4',
        statusConfig[status].color
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          {statusConfig[status].title}
          <span className="text-sm bg-white px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </h3>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="p-1 hover:bg-white rounded-lg transition-colors"
          title="Add task"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <SortableContext
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
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