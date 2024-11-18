export type Status = 'unassigned' | 'todo' | 'in-progress' | 'testing' | 'review' | 'done' | 'on-hold' | 'rejected';
export type Department = 'Engineering' | 'Design' | 'Marketing' | 'Product' | 'Sales';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskFilters {
  assignee?: string;
  department?: Department;
}

export interface Remark {
  id: string;
  content: string;
  author: string;
  timestamp: string;
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

export interface Opinion {
  id: string;
  title: string;
  status: Status;
  assignee?: string;
  opinionId: string;
  department: Department;
  priority: Priority;
  category: Category;
  subCategory?: SubCategory;
  details: OpinionDetails;
  submitter: {
    name: string;
    email: string;
    description: string;
    documents: Array<{
      name: string;
      url: string;
    }>;
  };
  remarks: Remark[];
}


export interface OpinionFormData {
  title: string;
  assignee: string;
  department: Department;
  priority: Priority;
  category: Category;
  subCategory?: SubCategory;
  details: OpinionDetails;
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