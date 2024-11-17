export type Status = 'unassigned' | 'todo' | 'in-progress' | 'testing' | 'review' | 'done' | 'on-hold' | 'rejected';
export type Department = 'Engineering' | 'Design' | 'Marketing' | 'Product' | 'Sales';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Remark {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

export interface Opinion {
  id: string;
  title: string;
  status: Status;
  assignee?: string;
  opinionId: string;
  department: Department;
  priority: Priority;
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
  submitter: {
    name: string;
    email: string;
    description: string;
  };
}

export interface OpinionFilters {
  assignee?: string;
  department?: Department;
}

export interface RemarkFormData {
  content: string;
  author: string;
}