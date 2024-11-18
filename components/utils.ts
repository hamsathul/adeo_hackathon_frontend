import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Category, SubCategory } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORY_SUBCATEGORIES: Record<Category, SubCategory[]> = {
  'Projects and Initiatives': [
    'Project or Initiative',
    'Hosting/Holding an Event',
    'Cancelling a Project'
  ],
  'Policies and Strategies': [
    'General Policy',
    'Strategy/Executive Plan for an Entity',
    'Change in the Approved Executive Plan',
    'Strategy for a Pillar/Sector'
  ],
  'Governance and Legislation': [
    'Local Legislation',
    'Federal Legislation',
    'Governance Mechanisms',
    'Committees/Councils and Powers',
    'Complex/Responsive Memoranda',
    'Legislative Permission',
    'Agreements',
    'Memoranda of Understanding'
  ],
  'Infrastructure, Land and Assets': [
    'Leasing a Headquarter',
    'Land and Assets'
  ],
  'Human Capital': [
    'Organizational Structures',
    'Talent Management and Manpower for the Administration',
    'Manpower Exceptions'
  ],
  'Financial Requests': [
    'Contracts',
    'Purchases',
    'Fees, Tariffs and Taxes',
    'Financial Transfers',
    'Additional Budget for Projects',
    'Additional Budget Or financial transfer on the first door',
    'Additional budget (jobs, employment contracts)',
    'Acceptance of a sponsorship request'
  ],
  'Reports and Studies': []
};