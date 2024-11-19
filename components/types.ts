
export type Department = 'Engineering' | 'Design' | 'Marketing' | 'Product' | 'Sales';
export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export interface TaskFilters {
  assignee?: string;
  department?: Department;
}

export interface WorkflowStatus {
	id: number;
	name: Status;
	description: string;
	created_at: string;
  }

export interface Remark {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

export type Status = 
  | 'unassigned'
  | 'assigned_to_department'
  | 'assigned_to_expert'
  | 'expert_opinion_submitted' 
  | 'head_review_pending'
  | 'head_approved'
  | 'in_review'
  | 'pending_other_department'
  | 'additional_info_requested'
  | 'completed'
  | 'todo'
  | 'in-progress'
  | 'rejected';

  export interface Opinion {
	id: number;
	title: string;
	reference_number: string;
	description: string;
	priority: 'low' | 'medium' | 'high' | 'urgent';
	due_date: string | null;
	department_id: number;
	category_id: number;
	sub_category_id: number | null;
	request_statement: string | null;
	challenges_opportunities: string | null;
	subject_content: string | null;
	alternative_options: string | null;
	expected_impact: string | null;
	potential_risks: string | null;
	studies_statistics: string | null;
	legal_financial_opinions: string | null;
	stakeholder_feedback: string | null;
	work_plan: string | null;
	decision_draft: string | null;
	created_at: string;
	updated_at: string;
	current_status: WorkflowStatus;
	documents: Document[];
	remarks: any[];
	opinions: any[];
	assignments: any[];
	category_rel: {
	  id: number;
	  name: string;
	  created_at: string;
	};
	subcategory_rel: {
	  id: number;
	  name: string;
	  category_id: number;
	  created_at: string;
	};
	department: {
	  id: number;
	  name: string;
	  code: string;
	  description: string;
	};
	requester: {
	  id: number;
	  username: string;
	  email: string;
	};
	workflow_history: WorkflowHistory[];
	communications: any[];
  }

  export interface Document {
	id: number;
	file_name: string;
	file_url: string;
	file_type: string;
	file_size: number;
	uploaded_by: number;
	created_at: string;
	uploader: {
	  id: number;
	  username: string;
	  email: string;
	  is_active: boolean;
	  is_superuser: boolean;
	};
  }
  
  export interface WorkflowHistory {
	id: number;
	action_type: string;
	action_details: {
	  message: string;
	  files_uploaded?: number;
	};
	created_at: string;
	actor: {
	  id: number;
	  username: string;
	  email: string;
	};
	from_status: WorkflowStatus | null;
	to_status: WorkflowStatus;
  }
  
  
  export interface OpinionResponse {
	total: number;
	items: Opinion[];
  }

export interface WorkflowStatusResponse {
  total: number;
  items: WorkflowStatus[];
}

export interface OpinionDetails {
  requestStatement: string;
  challengesOpportunities: string;
  subjectContent: string;
  alternativeOptions: string;
  expectedImpact: string;
  potentialRisks: string;
  studiesStatistics: string;
  legalFinancialOpinions: string;
  stakeholderFeedback: string;
  workPlan: string;
  decisionDraft: string;
}



  export interface OpinionFormData {
	title: string;
	assignee?: string;
	department: string;
	priority: string;
	category: string;
	subCategory: string;
	details: {
	  requestStatement: string;
	  challengesOpportunities: string;
	  subjectContent: string;
	  alternativeOptions: string;
	  expectedImpact: string;
	  potentialRisks: string;
	  studiesStatistics: string;
	  legalFinancialOpinions: string;
	  stakeholderFeedback: string;
	  workPlan: string;
	  decisionDraft: string;
	};
	submitter: {
	  name: string;
	  email: string;
	  description: string;
	};
  }

export interface RemarkFormData {
  content: string;
  author: string;
}

export type Category = 
  | 'Projects and Initiatives'
  | 'Policies and Strategies'
  | 'Governance and Legislation'
  | 'Infrastructure, Land and Assets'
  | 'Human Capital'
  | 'Financial Requests'
  | 'Reports and Studies';

export type SubCategory =
  // Projects and Initiatives
  | 'Project or Initiative'
  | 'Hosting/Holding an Event'
  | 'Cancelling a Project'
  // Policies and Strategies
  | 'General Policy'
  | 'Strategy/Executive Plan for an Entity'
  | 'Change in the Approved Executive Plan'
  | 'Strategy for a Pillar/Sector'
  // Governance and Legislation
  | 'Local Legislation'
  | 'Federal Legislation'
  | 'Governance Mechanisms'
  | 'Committees/Councils and Powers'
  | 'Complex/Responsive Memoranda'
  | 'Legislative Permission'
  | 'Agreements'
  | 'Memoranda of Understanding'
  // Infrastructure, Land and Assets
  | 'Leasing a Headquarter'
  | 'Land and Assets'
  // Human Capital
  | 'Organizational Structures'
  | 'Talent Management and Manpower for the Administration'
  | 'Manpower Exceptions'
  // Financial Requests
  | 'Contracts'
  | 'Purchases'
  | 'Fees, Tariffs and Taxes'
  | 'Financial Transfers'
  | 'Additional Budget for Projects'
  | 'Additional Budget Or financial transfer on the first door'
  | 'Additional budget (jobs, employment contracts)'
  | 'Acceptance of a sponsorship request';
