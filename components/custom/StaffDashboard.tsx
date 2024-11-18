// components/custom/StaffDashboard.tsx
'use client'

import React, { useState } from 'react';
import { Search, Filter, Users, MessageSquare } from 'lucide-react';
import { Opinion, TaskFilters, Department } from '../types';
import { StaffOpinionCard } from './StaffOpinionCard';
import { StaffFilterDialog } from './StaffFilterDialog';
import { GlobalSearchButton } from './GlobalSearchButton';
import { GlobalSearchDialog } from './GlobalSearchDialog';

const initialOpinions: Opinion[] = [
  {
    id: '1',
    title: 'Infrastructure Development Proposal',
    status: 'in-progress',
    opinionId: 'GOV-15',
    assignee: 'YD',
    department: 'Engineering',
    priority: 'high',
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
  }
];

export function StaffDashboard() {
  const [opinions, setOpinions] = useState<Opinion[]>(initialOpinions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  const handleAssignDepartment = (opinionId: string, department: Department) => {
    setOpinions(opinions.map(opinion =>
      opinion.id === opinionId ? { ...opinion, department } : opinion
    ));
  };

  const handleAssignStaff = (opinionId: string, assignee: string) => {
    setOpinions(opinions.map(opinion =>
      opinion.id === opinionId ? { ...opinion, assignee } : opinion
    ));
  };

  const handleAddRemark = (opinionId: string, remark: { content: string; author: string }) => {
    setOpinions(opinions.map(opinion =>
      opinion.id === opinionId ? {
        ...opinion,
        remarks: [...opinion.remarks, {
          id: Math.random().toString(36).substr(2, 9),
          ...remark,
          timestamp: new Date().toLocaleString()
        }]
      } : opinion
    ));
  };

  const handleCloseOpinion = (opinionId: string) => {
    setOpinions(opinions.map(opinion =>
      opinion.id === opinionId ? { ...opinion, status: 'done' } : opinion
    ));
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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Assigned Opinions</h1>
            <p className="text-gray-500 mt-2">Manage and process assigned opinions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Users className="w-5 h-5" />
              <span className="font-medium">Staff Portal</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search opinions..."
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
            Filter
            {(filters.assignee || filters.department) && (
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOpinions.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opinions assigned</h3>
            <p className="text-gray-500">You currently have no opinions assigned to you</p>
          </div>
        ) : (
          filteredOpinions.map((opinion) => (
            <StaffOpinionCard
              key={opinion.id}
              opinion={opinion}
              onAssignDepartment={handleAssignDepartment}
              onAssignStaff={handleAssignStaff}
              onAddRemark={handleAddRemark}
              onCloseOpinion={handleCloseOpinion}
            />
          ))
        )}
      </div>

      <StaffFilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
      />

      <GlobalSearchButton onClick={() => setIsGlobalSearchOpen(true)} />
      <GlobalSearchDialog 
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
      />
    </>
  );
}