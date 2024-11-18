// components/custom/KanbanBoard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/admin/_components/header';
import Sidebar from '@/app/admin/_components/sidebar';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors,} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Sparkles, Filter, Search, Settings, Share2, Zap } from 'lucide-react';
import { Opinion, Status, OpinionFormData, RemarkFormData } from '../types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanOpinion } from './KanbanOpinion';
import { FilterDialog } from './FilterDialog';
import { useLanguageStore } from '@/store/useLanguageStore'
import { translations } from '@/components/custom/translation'
import Chatbot from '@/components/custom/chatbot'
import { TaskFilters } from '../types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlobalSearchDialog } from './GlobalSearchDialog';
import SearchEngine from '@/components/custom/SearchEngine';

const initialOpinions: Opinion[] = [
  { 
    id: '1',
    title: 'Infrastructure Development Proposal',
    status: 'unassigned',
    opinionId: 'GOV-15',
    department: 'Engineering',
    priority: 'high',
    submitter: {
      name: 'John Smith',
      email: 'john@example.com',
      description: 'Proposal for improving city roads and bridges.',
      documents: [
        { name: 'Proposal.pdf', url: '#' },
        { name: 'Budget.xlsx', url: '#' }
      ]
    },
    remarks: []
  },
  {
    id: '2',
    title: 'Environmental Policy Update',
    status: 'in-progress',
    opinionId: 'GOV-16',
    assignee: 'YD',
    department: 'Product',
    priority: 'urgent',
    submitter: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      description: 'Updates to environmental protection policies.',
      documents: [
        { name: 'PolicyDraft.pdf', url: '#' },
        { name: 'Research.pdf', url: '#' }
      ]
    },
    remarks: []
  },
];

const columns: Status[] = ['unassigned', 'todo', 'in-progress', 'testing', 'review', 'done', 'on-hold', 'rejected'];

export function KanbanBoard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  const [showChatbot, setShowChatbot] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  const [isClient, setIsClient] = useState(false);
  const [searchHovered, setSearchHovered] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [opinions, setOpinions] = useState<Opinion[]>(initialOpinions);
  const [activeOpinion, setActiveOpinion] = useState<Opinion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDragStart = (event: any) => {
    const opinion = opinions.find((t) => t.id === event.active.id);
    setActiveOpinion(opinion || null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeOpinionId = active.id.toString();
    const overColumnId = over.id.toString();

    const activeOpinion = opinions.find((t) => t.id === activeOpinionId);
    
    if (!activeOpinion) return;

    if (columns.includes(overColumnId as Status)) {
      setOpinions(opinions.map((t) => {
        if (t.id === activeOpinionId) {
          return { ...t, status: overColumnId as Status };
        }
        return t;
      }));
    } else {
      const overOpinion = opinions.find((t) => t.id === overColumnId);
      if (!overOpinion) return;

      const activeIndex = opinions.findIndex((t) => t.id === activeOpinionId);
      const overIndex = opinions.findIndex((t) => t.id === overColumnId);

      if (activeOpinion.status === overOpinion.status) {
        setOpinions(arrayMove(opinions, activeIndex, overIndex));
      } else {
        const newOpinions = opinions.map((t) => {
          if (t.id === activeOpinionId) {
            return { ...t, status: overOpinion.status };
          }
          return t;
        });
        setOpinions(newOpinions);
      }
    }
    
    setActiveOpinion(null);
  };

  const handleAddOpinion = (status: Status, data: OpinionFormData) => {
    const newOpinion: Opinion = {
      id: Math.random().toString(36).substr(2, 9),
      opinionId: `GOV-${opinions.length + 1}`,
      status,
      title: data.title,
      assignee: data.assignee,
      department: data.department,
      priority: data.priority,
      submitter: {
        name: data.submitter.name,
        email: data.submitter.email,
        description: data.submitter.description,
        documents: []
      },
      remarks: []
    };
    setOpinions([...opinions, newOpinion]);
  };

  const handleEditOpinion = (opinionId: string, data: OpinionFormData) => {
    setOpinions(opinions.map(opinion => 
      opinion.id === opinionId
        ? {
            ...opinion,
            title: data.title,
            assignee: data.assignee,
            department: data.department,
            priority: data.priority,
            submitter: {
              ...opinion.submitter,
              name: data.submitter.name,
              email: data.submitter.email,
              description: data.submitter.description
            }
          }
        : opinion
    ));
  };

  const handleDeleteOpinion = (opinionId: string) => {
    setOpinions(opinions.filter(opinion => opinion.id !== opinionId));
  };

  const handleAddRemark = (opinionId: string, remarkData: RemarkFormData) => {
    setOpinions(opinions.map(opinion => {
      if (opinion.id === opinionId) {
        return {
          ...opinion,
          remarks: [
            ...opinion.remarks,
            {
              id: Math.random().toString(36).substr(2, 9),
              content: remarkData.content,
              author: remarkData.author,
              timestamp: new Date().toLocaleString()
            }
          ]
        };
      }
      return opinion;
    }));
  };

  const filteredOpinions = opinions.filter(opinion => {
    const matchesSearch = opinion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opinion.opinionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = !filters.assignee || opinion.assignee === filters.assignee;
    const matchesDepartment = !filters.department || opinion.department === filters.department;
    
    return matchesSearch && matchesAssignee && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
  {/* <Header /> */}
  <div className="px-20">
    <header className="flex justify-end p-4"></header>
    <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
    <div className="container mx-auto px-6 py-2">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {/* Left Section: Opinions / Government and Opinion Management */}
          <div>
            <div className="text-sm text-gray-500 mb-1 tracking-wide">{text.opinionsGovernment}</div>
            <h1 className="text-3xl font-bold tracking-tight mt-2">{text.opinionManagement}</h1>
          </div>
          
          {/* Right Section: Icons */}
            <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={text.searchOpinion}
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
        </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="kanban-grid grid gap-4 overflow-x-auto pb-4">
            {columns.map((columnStatus) => (
              <KanbanColumn
                key={columnStatus}
                status={columnStatus}
                items={filteredOpinions.filter((opinion) => opinion.status === columnStatus)}
                onAdd={handleAddOpinion}
                onEdit={handleEditOpinion}
                onDelete={handleDeleteOpinion}
                onAddRemark={handleAddRemark}
              />
            ))}
          </div>

          <DragOverlay>
            {activeOpinion && (
              <KanbanOpinion
                opinion={activeOpinion}
                onEdit={handleEditOpinion}
                onDelete={handleDeleteOpinion}
                onAddRemark={handleAddRemark}
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
{/* AI Assistant Button */}
<div className="fixed bottom-4 right-4">
  <div
    className={`relative rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 cursor-pointer transition-all duration-500 ease-in-out ${
      isHovered ? "scale-125 shadow-2xl" : "scale-100 shadow-lg"
    }`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={() => setShowChatbot(true)}
  >
    {/* Animated Pulsating Circle */}
    <div
      className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-md opacity-70 ${
        isHovered ? "animate-pulse" : ""
      }`}
    ></div>
    {/* Sparkles Icon */}
    <Sparkles
      className="relative w-12 h-12 text-white z-10"
      strokeWidth={1.1}
    />

    {/* Hover Text */}
    {isHovered && (
      <span className="absolute left-14 top-1/2 transform -translate-y-1/2 text-white text-sm font-semibold whitespace-nowrap z-20">
        AI Assistant
      </span>
    )}
  </div>
</div>

{/* Search Panel */}
<div className="fixed bottom-24 right-4 mb-3">
  <div
    className={`absolute bottom-full right-0 mb-4 transition-all duration-300 ${
      showSearch ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    }`}
  >
    <Card className="w-80 p-4 shadow-xl">
      <div className="flex gap-2">
        <Input placeholder="Search..." className="flex-1" />
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  </div>

  {/* Search Button */}
  <div
    className={`relative rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-4 cursor-pointer transition-all duration-500 ease-in-out ${
      searchHovered ? "scale-125 shadow-2xl" : "scale-100 shadow-lg"
    }`}
    onMouseEnter={() => setSearchHovered(true)}
    onMouseLeave={() => setSearchHovered(false)}
    onClick={() => setShowSearch(!showSearch)}
  >
    {/* Animated Pulsating Circle */}
    <div
      className={`absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 blur-md opacity-70 ${
        searchHovered ? "animate-pulse" : ""
      }`}
    />

    {/* Search Icon with Sparkles */}
    <div className="relative w-12 h-12 text-white z-10">
      <Search className="w-full h-full" strokeWidth={1.1} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`transition-opacity duration-300 ${
            searchHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="absolute top-1 right-1 block w-1.5 h-1.5 bg-white rounded-full animate-twinkle" />
          <span className="absolute top-3 right-3 block w-1 h-1 bg-white rounded-full animate-twinkle delay-100" />
        </div>
      </div>
    </div>

    {/* Hover Text */}
    {searchHovered && (
      <span className="absolute left-14 top-1/2 transform -translate-y-1/2 text-white text-sm font-semibold whitespace-nowrap z-20">
      </span>
    )}
  </div>

  <style jsx global>{`
    @keyframes twinkle {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }
    .animate-twinkle {
      animation: twinkle 1.5s infinite ease-in-out;
    }
  `}</style>
</div>

{/* GlobalSearchDialog Slide-out */}
{showSearch && (
  <div
    className="fixed top-0 right-0 h-full w-90 bg-white shadow-xl transition-transform duration-500 ease-in-out"
    style={{ transform: showSearch ? "translateX(0)" : "translateX(100%)" }}
  >
    <SearchEngine isOpen={showSearch} onClose={() => setShowSearch(false)} />
  </div>
)}

{/* Chatbot */}
<Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
      </div>
  );
}