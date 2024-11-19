import React, { useState } from 'react';
import { FileText, Plus, Search, Flag, ChevronRight } from 'lucide-react';
import { OpinionSubmissionDialog } from './OpinionSubmissionDialog';
import { OpinionDetailsDialog } from './OpinionDetailsDialog';
import { Opinion, Status, Priority } from '../types';
import { cn } from '../utils';

const priorityConfig: Record<Priority, { color: string; bgColor: string }> = {
  'urgent': { color: 'text-red-600', bgColor: 'bg-red-50' },
  'high': { color: 'text-orange-600', bgColor: 'bg-orange-50' },
  'medium': { color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  'low': { color: 'text-green-600', bgColor: 'bg-green-50' }
};

const statusColors: Record<Status, string> = {
  'unassigned': 'bg-gray-100 text-gray-700',
  'todo': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'testing': 'bg-purple-100 text-purple-700',
  'review': 'bg-yellow-100 text-yellow-700',
  'done': 'bg-green-100 text-green-700',
  'on-hold': 'bg-orange-100 text-orange-700',
  'rejected': 'bg-red-100 text-red-700'
};

const sampleOpinion: Opinion = {
  id: '1',
  title: 'Urban Development Initiative',
  status: 'in-progress',
  opinionId: 'GOV-42',
  department: 'Engineering',
  priority: 'high',
  category: 'Infrastructure, Land and Assets',
  subCategory: 'Land and Assets',
  details: {
    requestStatement: 'Proposal for comprehensive urban development project focusing on sustainable infrastructure and community spaces.',
    challengesOpportunities: 'Growing population needs, aging infrastructure, opportunity for sustainable development.',
    subjectContent: 'Development of mixed-use spaces, green infrastructure, and smart city integration.',
    alternativeOptions: 'Traditional development vs. smart city approach, phased implementation vs. complete overhaul.',
    expectedImpact: 'Improved quality of life, increased property values, reduced environmental impact.',
    potentialRisks: 'Budget overruns, construction delays, community displacement concerns.',
    studiesStatistics: 'Population growth projections, environmental impact assessments, traffic studies.',
    legalFinancialOpinions: 'Zoning compliance review, budget allocation analysis, ROI projections.',
    stakeholderFeedback: 'Community surveys, business owner consultations, environmental group inputs.',
    workPlan: 'Three-phase implementation over 36 months with quarterly milestones.',
    decisionDraft: 'Approve Phase 1 of urban development initiative with allocated budget of $50M.'
  },
  submitter: {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    description: 'Comprehensive urban development proposal for downtown district.',
    documents: [
      { name: 'UrbanPlanningProposal.pdf', url: '#' },
      { name: 'FinancialProjections.xlsx', url: '#' },
      { name: 'EnvironmentalImpact.pdf', url: '#' }
    ]
  },
  remarks: [
    {
      id: '1',
      content: 'Environmental impact assessment looks promising. Suggested minor adjustments to green space allocation.',
      author: 'Environmental Review Team',
      timestamp: '2024-03-15 14:30'
    },
    {
      id: '2',
      content: 'Financial projections have been validated. ROI timeline seems realistic.',
      author: 'Financial Department',
      timestamp: '2024-03-16 09:15'
    }
  ]
};

export function UserDashboard() {
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null);
  const [editingOpinion, setEditingOpinion] = useState<Opinion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [myOpinions, setMyOpinions] = useState<Opinion[]>([sampleOpinion]);

  const handleSubmitOpinion = (opinionData: Opinion) => {
    if (!priorityConfig[opinionData.priority]) {
      console.error('Invalid priority value:', opinionData.priority);
      return;
    }

    if (editingOpinion) {
      setMyOpinions(myOpinions.map(op => 
        op.id === editingOpinion.id ? {
          ...editingOpinion,
          title: opinionData.title,
          department: opinionData.department,
          category: opinionData.category,
          priority: opinionData.priority,
          details: opinionData.details,
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

  const filteredOpinions = myOpinions.filter(opinion =>
    opinion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opinion.opinionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Submit Opinion</h1>
          <p className="text-gray-500">Submit your opinions and track their status</p>
        </div>

        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your submissions..."
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
            New Opinion
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpinions.map((opinion) => (
            <div
              key={opinion.id}
              className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-200 hover:shadow-sm"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">
                    {opinion.opinionId}
                  </span>
                  {priorityConfig[opinion.priority] && (
                    <div className={cn(
                      'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
                      priorityConfig[opinion.priority].color,
                      priorityConfig[opinion.priority].bgColor
                    )}>
                      <Flag className="w-3 h-3" />
                      {opinion.priority.charAt(0).toUpperCase() + opinion.priority.slice(1)}
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{opinion.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {opinion.submitter.documents.length} files
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    statusColors[opinion.status]
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
          ))}
        </div>

        <OpinionSubmissionDialog
          isOpen={isSubmissionDialogOpen}
          onClose={() => {
            setIsSubmissionDialogOpen(false);
            setEditingOpinion(null);
          }}
          onSubmit={handleSubmitOpinion}
          initialData={editingOpinion}
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
      </div>
    </div>
  );
}