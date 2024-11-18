// components/custom/UserDashboard.tsx
'use client'

import React, { useState } from 'react';
import { FileText, Plus, Search, Flag, ChevronRight } from 'lucide-react';
import { OpinionSubmissionDialog } from './OpinionSubmissionDialog';
import { OpinionDetailsDialog } from './OpinionDetailsDialog';
import { Opinion } from '../types';
import { cn } from '../utils';
import { translations } from './translation'
import { useLanguageStore } from '@/store/useLanguageStore';

const priorityConfig = {
  'urgent': { color: 'text-red-600 bg-red-50' },
  'high': { color: 'text-orange-600 bg-orange-50' },
  'medium': { color: 'text-yellow-600 bg-yellow-50' },
  'low': { color: 'text-green-600 bg-green-50' },
};

export function UserDashboard() {
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null);
  const [editingOpinion, setEditingOpinion] = useState<Opinion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [myOpinions, setMyOpinions] = useState<Opinion[]>([]);
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en

  const handleSubmitOpinion = (opinionData: Opinion) => {
    if (editingOpinion) {
      setMyOpinions(myOpinions.map(op => 
        op.id === editingOpinion.id ? {
          ...editingOpinion,
          title: opinionData.title,
          department: opinionData.department,
          priority: opinionData.priority,
          submitter: {
            ...editingOpinion.submitter,
            name: opinionData.submitter.name,
            email: opinionData.submitter.email,
            description: opinionData.submitter.description,
            documents: [
              ...editingOpinion.submitter.documents,
              ...opinionData.submitter.documents.filter(newDoc => 
                !editingOpinion.submitter.documents.some(existingDoc => 
                  existingDoc.name === newDoc.name
                )
              )
            ]
          }
        } : op
      ));
      setEditingOpinion(null);
    } else {
      setMyOpinions([...myOpinions, opinionData]);
    }
    setIsSubmissionDialogOpen(false);
  };

  const handleEditClick = (opinion: Opinion) => {
    setEditingOpinion(opinion);
    setSelectedOpinion(null);
    setIsSubmissionDialogOpen(true);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{text.submitOpinion}</h1>
        <p className="text-gray-500">{text.submitMessage}</p>
      </div>

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={text.searchSubmission}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
          />
        </div>
        <button
          onClick={() => {
            setEditingOpinion(null);
            setIsSubmissionDialogOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {text.newOpinion}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {myOpinions.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{text.noOpinion}</h3>
            <p className="text-gray-500 mb-4">{text.noOpinion2}</p>
            <button
              onClick={() => setIsSubmissionDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {text.submitOpinion}
            </button>
          </div>
        ) : (
          myOpinions.map((opinion) => (
            <div
              key={opinion.id}
              className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-200 hover:shadow-sm"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">
                    {opinion.opinionId}
                  </span>
                  <div className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
                    priorityConfig[opinion.priority].color
                  )}>
                    <Flag className="w-3 h-3" />
                    {opinion.priority.charAt(0).toUpperCase() + opinion.priority.slice(1)}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{opinion.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {opinion.submitter.documents.length} files
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    opinion.status === 'unassigned' ? 'bg-gray-100 text-gray-700' :
                    opinion.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    opinion.status === 'done' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  )}>
                    {opinion.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOpinion(opinion)}
                  className="w-full flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <OpinionSubmissionDialog
        isOpen={isSubmissionDialogOpen}
        onClose={() => {
          setIsSubmissionDialogOpen(false);
          setEditingOpinion(null);
        }}
        onSubmit={handleSubmitOpinion}
        initialData={editingOpinion ?? undefined}
        isEditing={!!editingOpinion}
      />

      {selectedOpinion && (
        <OpinionDetailsDialog
          isOpen={!!selectedOpinion}
          onClose={() => setSelectedOpinion(null)}
          opinion={selectedOpinion}
          onEdit={() => handleEditClick(selectedOpinion)}
        />
      )}
    </>
  );
}