'use client'

import React, { useState, useEffect } from 'react';
import { DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors,} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Filter, Search } from 'lucide-react';
import { Opinion, Status, OpinionFormData, RemarkFormData } from '../types';
import { FilterDialog } from './FilterDialog';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/components/custom/translation';
import { KanbanBoardDnd } from './KanbanBoardDnd';
import { TaskFilters } from '../types';
import Chatbot from './chatbot';

const initialOpinions: Opinion[] = [
  {
    id: '1',
    title: 'Infrastructure Development Proposal',
    status: 'unassigned',
    opinionId: 'GOV-15',
    department: 'Engineering',
    priority: 'high',
    category: 'Infrastructure, Land and Assets',
    subCategory: 'Land and Assets',
    details: {
      requestStatement: 'Proposal for improving city roads and bridges',
      challengesOpportunities: 'Address aging infrastructure and increasing traffic',
      subjectContent: 'Comprehensive infrastructure upgrade plan',
      alternativeOptions: 'Phased implementation vs complete overhaul',
      expectedImpact: 'Improved traffic flow and safety',
      potentialRisks: 'Construction delays and budget overruns',
      studiesStatistics: 'Traffic analysis and structural assessments',
      legalFinancialOpinions: 'Budget allocation and contractor requirements',
      stakeholderFeedback: 'Community input and contractor proposals',
      workPlan: 'Three-phase implementation over 18 months',
      decisionDraft: 'Approve phase 1 of infrastructure upgrade'
    },
    submitter: {
      name: 'John Smith',
      email: 'john@example.com',
      description: 'Proposal for improving city roads and bridges.',
      documents: [
        { name: '42ArabicADEO.pdf', url: '#' },
        { name: '42CaseStudy.pdf', url: '#' }
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
    category: 'Policies and Strategies',
    subCategory: 'General Policy',
    details: {
      requestStatement: 'Updates to environmental protection policies',
      challengesOpportunities: 'Address climate change concerns and sustainability goals',
      subjectContent: 'New environmental protection guidelines',
      alternativeOptions: 'Gradual implementation vs immediate enforcement',
      expectedImpact: 'Reduced environmental impact and improved sustainability',
      potentialRisks: 'Business adaptation challenges and compliance costs',
      studiesStatistics: 'Environmental impact assessments',
      legalFinancialOpinions: 'Legal compliance requirements and cost analysis',
      stakeholderFeedback: 'Industry feedback and public consultation',
      workPlan: 'Six-month implementation timeline',
      decisionDraft: 'Approve new environmental protection measures'
    },
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
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;
  const [opinions, setOpinions] = useState<Opinion[]>(initialOpinions);
  const [activeOpinion, setActiveOpinion] = useState<Opinion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const opinion = opinions.find((t) => t.id === event.active.id);
    setActiveOpinion(opinion || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
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
      category: data.category,
      subCategory: data.subCategory,
      details: data.details,
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
            category: data.category,
            subCategory: data.subCategory,
            details: data.details,
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
      <div className="min-h-screen bg-[#f8f9fa]">
        <div className="px-20">
          <header className="flex justify-end"></header>
          <div className="container mx-auto px-4 py-2">
            <div className="mb-8">
              <div className="">
                <div>
                  <div className="text-sm text-gray-500 mb-1 tracking-wide">{text.opinionsGovernment}</div>
                  <h1 className="text-3xl font-bold tracking-tight mt-2">{text.opinionManagement}</h1>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-xl mt-2">
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

            <FilterDialog
              isOpen={isFilterDialogOpen}
              onClose={() => setIsFilterDialogOpen(false)}
              filters={filters}
              onApplyFilters={setFilters}
            />
            <FilterDialog
              isOpen={isFilterDialogOpen}
              onClose={() => setIsFilterDialogOpen(false)}
              filters={filters}
              onApplyFilters={setFilters}
            />
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
          </div>
          <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />  
        </div>
      </div>
    </>
  );
}
