// components/custom/KanbanBoard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { Filter, Search, Bot } from 'lucide-react';
import { Opinion, Status, OpinionFormData, TaskFilters, RemarkFormData } from '../types';
import { FilterDialog } from './FilterDialog';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/components/custom/translation';
import Chatbot from '@/components/custom/chatbot';
import { KanbanBoardDnd } from './KanbanBoardDnd';

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
  const [isClient, setIsClient] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
    <>
      {isClient ? (
        <KanbanBoardDnd 
          columns={columns}
          filteredOpinions={filteredOpinions}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          handleAddOpinion={handleAddOpinion}
          handleEditOpinion={handleEditOpinion}
          handleDeleteOpinion={handleDeleteOpinion}
          handleAddRemark={handleAddRemark}
          activeOpinion={activeOpinion}
        />
      ) : (
        <div>Loading...</div>
      )}

      <FilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
      />
      
      {/* AI Assistant Button */}
      <div className="fixed bottom-4 right-4">
        <div
          className={`relative rounded-full bg-primary text-primary-foreground p-3 cursor-pointer transition-all duration-300 ease-in-out ${isHovered ? 'w-36' : 'w-12'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setShowChatbot(true)}
        >
          <Bot className="w-6 h-6" />
          {isHovered && (
            <span className="absolute left-12 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
              {text.ai}
            </span>
          )}
        </div>
      </div>
      
      {/* Chatbot component */}
      <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)}  />
    </>
  );
}