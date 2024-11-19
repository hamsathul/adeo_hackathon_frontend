import React from 'react';
import { OpinionDetails } from '../types';

interface OpinionReviewSectionProps {
  title: string;
  category: string;
  subCategory?: string;
  priority: string;
  submitterName: string;
  submitterEmail: string;
  details: OpinionDetails;
  files: Array<{ name: string }>;
}

export function OpinionReviewSection({
  title,
  category,
  subCategory,
  priority,
  submitterName,
  submitterEmail,
  details,
  files
}: OpinionReviewSectionProps) {
  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-700">
      Please review your opinion details before submitting. Make sure all information is accurate.
        </div>

      <div>
        <h3 className="font-medium mb-3 text-gray-900">Basic Information</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <p><span className="text-gray-500 font-medium">Title:</span> {title}</p>
          <p><span className="text-gray-500 font-medium">Category:</span> {category}</p>
          {subCategory && (
            <p><span className="text-gray-500 font-medium">Sub-category:</span> {subCategory}</p>
          )}
          <p><span className="text-gray-500 font-medium">Priority:</span> {priority}</p>
          <p><span className="text-gray-500 font-medium">Submitter Name:</span> {submitterName}</p>
          <p><span className="text-gray-500 font-medium">Email:</span> {submitterEmail}</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3 text-gray-900">Opinion Details</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-4 text-sm">
          <div>
            <p className="text-gray-500 font-medium mb-1">Request Statement</p>
            <p className="text-gray-900">{details.requestStatement}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Challenges / Opportunities</p>
            <p className="text-gray-900">{details.challengesOpportunities}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Subject Content</p>
            <p className="text-gray-900">{details.subjectContent}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Alternative Options</p>
            <p className="text-gray-900">{details.alternativeOptions}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Expected Impact</p>
            <p className="text-gray-900">{details.expectedImpact}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Potential Risks and Mitigation</p>
            <p className="text-gray-900">{details.potentialRisks}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Studies and Statistics</p>
            <p className="text-gray-900">{details.studiesStatistics}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Legal and Financial Opinions</p>
            <p className="text-gray-900">{details.legalFinancialOpinions}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Stakeholder Feedback</p>
            <p className="text-gray-900">{details.stakeholderFeedback}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Work Plan</p>
            <p className="text-gray-900">{details.workPlan}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Decision Draft</p>
            <p className="text-gray-900">{details.decisionDraft}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3 text-gray-900">Supporting Documents</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {files.length > 0 ? (
            <ul className="space-y-1">
              {files.map((file, index) => (
                <li key={index} className="text-sm text-gray-900">• {file.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No documents attached</p>
          )}
        </div>
      </div>
    </div>
  );
}