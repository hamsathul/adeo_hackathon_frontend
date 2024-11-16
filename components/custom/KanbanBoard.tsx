'use client';

import React, { useState } from 'react';
import Header from '@/app/admin/_components/header';
import Sidebar from '@/app/admin/_components/sidebar';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Filter, Search, Settings, Share2, Zap } from 'lucide-react';
import { Department, Status, Task, TaskFilters, TaskFormData } from '../types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTask } from './KanbanTask';
import { FilterDialog } from './FilterDialog';
import { translations } from './translation';
import { useLanguageStore } from '@/store/useLanguageStore';
import { nanoid } from 'nanoid';

const initialTasks: Task[] = [
  { id: '1', title: 'Fix Login Bug', status: 'todo', taskId: 'CPG-15', assignee: 'BS', department: 'Engineering' },
  { id: '2', title: 'Update API Documentation', status: 'in-progress', taskId: 'CPG-16', assignee: 'YD', department: 'Engineering' },
  { id: '3', title: 'Implement Search Feature', status: 'testing', taskId: 'CPG-17', assignee: 'FK', department: 'Engineering' },
  { id: '4', title: 'Design Review', status: 'review', taskId: 'CPG-18', assignee: 'BS', department: 'Design' },
  { id: '5', title: 'Deploy v1.0.0', status: 'done', taskId: 'CPG-19', assignee: 'YD', department: 'Engineering' },
];

const columns: Status[] = ['todo', 'in-progress', 'testing', 'review', 'done', 'on-hold', 'rejected'];

export function KanbanBoard() {
  const { isArabic } = useLanguageStore(); // Access language state
  const text = isArabic ? translations.ar : translations.en;
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTaskId = active.id.toString();
    const overColumnId = over.id.toString();

    const activeTask = tasks.find((t) => t.id === activeTaskId);
    
    if (!activeTask) return;

    if (columns.includes(overColumnId as Status)) {
      setTasks(tasks.map((t) => {
        if (t.id === activeTaskId) {
          return { ...t, status: overColumnId as Status };
        }
        return t;
      }));
    } else {
      const overTask = tasks.find((t) => t.id === overColumnId);
      if (!overTask) return;

      const activeIndex = tasks.findIndex((t) => t.id === activeTaskId);
      const overIndex = tasks.findIndex((t) => t.id === overColumnId);

      if (activeTask.status === overTask.status) {
        setTasks(arrayMove(tasks, activeIndex, overIndex));
      } else {
        const newTasks = tasks.map((t) => {
          if (t.id === activeTaskId) {
            return { ...t, status: overTask.status };
          }
          return t;
        });
        setTasks(newTasks);
      }
    }
    
    setActiveTask(null);
  };

  const handleAddTask = (status: Status, data: TaskFormData) => {
    const newTask: Task = {
      id: nanoid(),
      taskId: `CPG-${tasks.length + 1}`,
      status,
      title: data.title,
      department: data.department,
      assignee: data.assignee,
    };
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (taskId: string, data: TaskFormData) => {
    setTasks(tasks.map(task => 
      task.id === taskId
        ? { ...task, title: data.title, department: data.department, assignee: data.assignee }
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.taskId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !filters.department || task.department === filters.department;
    const matchesAssignee = !filters.assignee || task.assignee === filters.assignee;
    
    return matchesSearch && matchesAssignee && matchesDepartment;
  });

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header />
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1 tracking-wide">{text.departments}</div>
                  <h1 className="text-3xl font-bold tracking-tight">{text.pageTitle}</h1>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Zap className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                  {/* <button className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 transition-colors font-medium">
                    {text.searchEngine}
                  </button> */}
                  <a
                    href="/search"
                    className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 transition-colors font-medium"
                  >
                    {text.search}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={text.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
                  />
                </div>
                <button
                  onClick={() => setIsFilterDialogOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-white transition-colors bg-transparent"
                >
                  <Filter className="w-5 h-5" />
                  {text.filter}
                  {(filters.assignee || filters.department) && (
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  )}
                </button>
              </div>
            </div>

            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="kanban-grid grid gap-4 overflow-x-auto pb-4">
                {columns.map((column) => (
                  <KanbanColumn
                    key={column}
                    status={column}
                    tasks={filteredTasks.filter((task) => task.status === column)}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    text={text}
                  />
                ))}
              </div>

              <DragOverlay>
                {activeTask && (
                  <KanbanTask
                    task={activeTask}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    text={text}
                  />
                )}
              </DragOverlay>
            </DndContext>

            <FilterDialog
              isOpen={isFilterDialogOpen}
              onClose={() => setIsFilterDialogOpen(false)}
              filters={filters}
              onApplyFilters={setFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}