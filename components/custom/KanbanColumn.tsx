import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Task, TaskFormData } from './TaskDialog';
import { KanbanTask } from './KanbanTask';
import { TaskDialog } from './TaskDialog';
import { cn } from '../utils';
import { translations } from './translation';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  onAddTask: (status: Status, data: TaskFormData) => void;
  onEditTask: (taskId: string, data: TaskFormData) => void;
  onDeleteTask: (taskId: string) => void;
  text: typeof translations.en | typeof translations.ar;
}

const statusConfig = {
  'todo': { color: 'bg-gray-200 border-t-gray-300' },
  'in-progress': { color: 'bg-blue-50 border-t-blue-400' },
  'testing': { color: 'bg-purple-50 border-t-purple-400' },
  'review': { color: 'bg-yellow-50 border-t-yellow-400' },
  'done': { color: 'bg-green-50 border-t-green-400' },
  'on-hold': { color: 'bg-orange-50 border-t-orange-400' },
  'rejected': { color: 'bg-red-50 border-t-red-400' },
  'unassigned': { color: 'bg-gray-50 border-t-gray-300' },
};

export function KanbanColumn({ status, tasks, onAddTask, onEditTask, onDeleteTask, text }: KanbanColumnProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { setNodeRef } = useDroppable({ id: status });

  const handleAddTask = (data: TaskFormData) => {
    onAddTask(status, data);
  };

  const getColumnTitle = (status: Status) => {
    switch(status) {
      case 'todo': return text.todocard;
      case 'in-progress': return text.progressCard;
      case 'testing': return text.testingCard;
      case 'review': return text.reviewCard;
      case 'done': return text.completedCard;
      case 'on-hold': return text.onholdCard;
      case 'rejected': return text.rejectedCard;
      default: return status;
    }
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
            {getColumnTitle(status)}
            <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-medium">
              {tasks.length}
            </span>
          </h3>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title={text.addTask}
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
              text={text}
            />
          ))}
        </div>
      </SortableContext>

      <TaskDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddTask}
        title={`${text.addTask} ${getColumnTitle(status)}`}
      />
    </div>
  );
}