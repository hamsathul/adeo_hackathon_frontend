'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Filter, Search } from 'lucide-react';
import { Opinion, Status, WorkflowStatus, OpinionResponse } from '../types';
import { FilterDialog } from './FilterDialog';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/components/custom/translation';
import { KanbanBoardDnd } from './KanbanBoardDnd';

const isValidOpinion = (opinion: any): opinion is Opinion => {
	return (
	  opinion &&
	  typeof opinion.id === 'number' &&
	  typeof opinion.title === 'string' &&
	  typeof opinion.reference_number === 'string' &&
	  opinion.current_status &&
	  typeof opinion.current_status.name === 'string' &&
	  typeof opinion.current_status.description === 'string'
	);
  };

export function KanbanBoard() {
	const [isClient, setIsClient] = useState(false);
	const { isArabic } = useLanguageStore();
	const text = isArabic ? translations.ar : translations.en;
	const [opinions, setOpinions] = useState<Opinion[]>([]);
	const [workflowStatuses, setWorkflowStatuses] = useState<WorkflowStatus[]>([]);
	const [activeOpinion, setActiveOpinion] = useState<Opinion | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [filters, setFilters] = useState({});
	const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);



	useEffect(() => {
		setIsClient(true);
		fetchData();
	  }, []);
	
	  const fetchData = async () => {
		try {
		  setLoading(true);
		  
		  // Fetch workflow statuses
		  const statusResponse = await axios.get<{ total: number; items: WorkflowStatus[] }>(
			'http://localhost:8000/api/v1/opinions/workflow_status/',
			{
			  headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			  }
			}
		  );
		  setWorkflowStatuses(statusResponse.data.items);
	  
		  // Fetch opinions
		  const opinionResponse = await axios.get<Opinion[]>(
			'http://localhost:8000/api/v1/opinions/requests/',
			{
			  headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			  }
			}
		  );
		  
		  if (opinionResponse.data && Array.isArray(opinionResponse.data)) {
			const validOpinions = opinionResponse.data.filter(isValidOpinion);
			if (validOpinions.length !== opinionResponse.data.length) {
			  console.warn('Some opinions were invalid and filtered out');
			}
			setOpinions(validOpinions);
		  } else {
			console.error('Invalid opinion response format:', opinionResponse.data);
			setError('Invalid data format received');
		  }
		} catch (err) {
		  console.error('Failed to fetch data:', err);
		  setError('Failed to fetch data');
		} finally {
		  setLoading(false);
		}
	  };
	
	  const filteredOpinions = opinions.filter(opinion => {
		const matchesSearch = 
		  opinion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		  opinion.reference_number.toLowerCase().includes(searchQuery.toLowerCase());
		
		const matchesAssignee = !filters.assignee || 
		  opinion.current_status.name === filters.assignee;
		
		const matchesDepartment = !filters.department || 
		  opinion.department.id === filters.department;
		
		return matchesSearch && matchesAssignee && matchesDepartment;
	  });
	
	  if (loading) return <div>Loading...</div>;
	  if (error) return <div>Error: {error}</div>;



  const handleDragStart = (event: DragStartEvent) => {
    const opinion = opinions.find((t) => t.id === event.active.id);
    setActiveOpinion(opinion || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
	const { active, over } = event;
	
	if (!over) return;
  
	const activeOpinionId = Number(active.id);
	const overColumnId = over.id.toString();
  
	const activeOpinion = opinions.find((t) => t.id === activeOpinionId);
	
	if (!activeOpinion) return;
  
	if (workflowStatuses.some(status => status.name === overColumnId)) {
	  try {
		// Update status in backend
		await axios.patch(
		  `http://localhost:8000/api/v1/opinions/requests/${activeOpinionId}/status`,
		  { status: overColumnId },
		  {
			headers: {
			  Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		  }
		);
  
		// Update local state
		setOpinions(opinions.map((t) => {
		  if (t.id === activeOpinionId) {
			return { 
			  ...t, 
			  current_status: {
				...t.current_status,
				name: overColumnId as Status
			  }
			};
		  }
		  return t;
		}));
	  } catch (error) {
		console.error('Failed to update opinion status:', error);
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



  return (
  <div className="min-h-screen bg-[#f8f9fa]">
    <div className="px-6 lg:px-8"> {/* Adjusted padding */}
      <div className="container mx-auto py-2">
        <div className="mb-6"> {/* Reduced margin */}
            <div>
              <div className="text-sm text-gray-500 mb-1 tracking-wide">
                {text.opinionsGovernment}
              </div>
              <h1 className="text-3xl font-bold tracking-tight mt-2">
                {text.opinionManagement}
              </h1>
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

          <FilterDialog
            isOpen={isFilterDialogOpen}
            onClose={() => setIsFilterDialogOpen(false)}
            filters={filters}
            onApplyFilters={setFilters}
          />

{isClient && workflowStatuses.length > 0 && (
            <KanbanBoardDnd 
              workflowStatuses={workflowStatuses}
              filteredOpinions={filteredOpinions}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleAddOpinion={handleAddOpinion}
              handleEditOpinion={handleEditOpinion}
              handleDeleteOpinion={handleDeleteOpinion}
              handleAddRemark={handleAddRemark}
              activeOpinion={activeOpinion}
            />
          )}
        </div>
      </div>
    </div>
  );
}