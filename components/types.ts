export type Status = 'todo' | 'in-progress' | 'testing' | 'review' | 'done';
export type Department = 'Engineering' | 'Design' | 'Marketing' | 'Product' | 'Sales';

export interface Task {
  id: string;
  title: string;
  status: Status;
  assignee?: string;
  taskId: string;
  department: Department;
}

export interface TaskFormData {
  title: string;
  assignee: string;
  department: Department;
}

export interface TaskFilters {
  assignee?: string;
  department?: Department;
}