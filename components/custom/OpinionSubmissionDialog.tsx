import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, FileText, AlertTriangle, Info, Flag, Tag, User } from 'lucide-react';
import { Opinion, Department, Priority, Category, OpinionDetails, SubCategory } from '../types';
import { OpinionFormSection } from './OpinionFormSection';
import { OpinionReviewSection } from './OpinionReviewSection';
import { cn } from '../utils';
import { CATEGORY_SUBCATEGORIES } from '../utils';
import axios from 'axios';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/components/custom/translation';

type Step = 'basic' | 'details' | 'documents' | 'review';

interface OpinionSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (opinion: Opinion) => void;
  initialData?: Opinion | null;
  isEditing?: boolean;
}

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

interface OpinionRequestResponse {
	id: number;
	reference_number: string;
	title: string;
	description: string;
	department_id: number;
	category_id: number;
	sub_category_id: number;
	priority: string;
	requester_id: number;
	current_status_id: number;
	request_statement: string;
	challenges_opportunities: string;
	subject_content: string;
	alternative_options: string;
	expected_impact: string;
	potential_risks: string;
	studies_statistics: string;
	legal_financial_opinions: string;
	stakeholder_feedback: string;
	work_plan: string;
	decision_draft: string;
	due_date: string;
	version: number;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	deleted_at: string | null;
	deleted_by: number | null;
  }

  interface CategoryStructure {
	[key: string]: string[];
  }

const STEPS = [
  { id: 'basic', title: 'Basic Information' },
  { id: 'details', title: 'Opinion Details' },
  { id: 'documents', title: 'Supporting Documents' },
  { id: 'review', title: 'Review & Submit' }
] as const;

const PRIORITIES: Priority[] = ['urgent', 'high', 'medium', 'low'];

const initialDetails: OpinionDetails = {
  requestStatement: '',
  challengesOpportunities: '',
  subjectContent: '',
  alternativeOptions: '',
  expectedImpact: '',
  potentialRisks: '',
  studiesStatistics: '',
  legalFinancialOpinions: '',
  stakeholderFeedback: '',
  workPlan: '',
  decisionDraft: ''
};

const fetchCategories = async (): Promise<CategoryStructure> => {
	try {
	  const response = await axios.get(
		'http://localhost:8000/api/v1/opinions/categories/structured',
		{
		  headers: {
			'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you store the token in localStorage
			'accept': 'application/json'
		  }
		}
	  );
	  return response.data;
	} catch (error) {
	  console.error('Error fetching categories:', error);
	  return {};
	}
  };

export function OpinionSubmissionDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  isEditing = false 
}: OpinionSubmissionDialogProps) {
  const [step, setStep] = useState<Step>('basic');
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'Projects and Initiatives');
  const [subCategory, setSubCategory] = useState<SubCategory | undefined>(initialData?.subCategory);
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');
  const [submitterName, setSubmitterName] = useState(initialData?.submitter.name || '');
  const [submitterEmail, setSubmitterEmail] = useState(initialData?.submitter.email || '');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [details, setDetails] = useState<OpinionDetails>(initialData?.details || initialDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<CategoryStructure>({});
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;

  useEffect(() => {
    if (!isOpen) {
      setStep('basic');
      if (!initialData) {
        setTitle('');
        setCategory('Projects and Initiatives');
        setSubCategory(undefined);
        setPriority('medium');
        setSubmitterName('');
        setSubmitterEmail('');
        setFiles([]);
        setDetails(initialDetails);
      }
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories().then(setCategories);
    }
  }, [isOpen]);

  if (!isOpen) return null;



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step !== 'review') {
        nextStep();
        return;
    }

    try {
        const requestData = {
            title,
            description: details.requestStatement,
            priority: priority.toLowerCase(),
            department_id: 1,
            category_id: 1,
            sub_category_id: 1,
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            request_statement: details.requestStatement,
            challenges_opportunities: details.challengesOpportunities,
            subject_content: details.subjectContent,
            alternative_options: details.alternativeOptions,
            expected_impact: details.expectedImpact,
            potential_risks: details.potentialRisks,
            studies_statistics: details.studiesStatistics,
            legal_financial_opinions: details.legalFinancialOpinions,
            stakeholder_feedback: details.stakeholderFeedback,
            work_plan: details.workPlan,
            decision_draft: details.decisionDraft,
        };


		const formData = new FormData();
		formData.append('request_data', JSON.stringify(requestData));

		// Append files as file1, file2, file3
		files.slice(0, 3).forEach((uploadedFile, index) => {
			formData.append(`file${index + 1}`, uploadedFile.file);
		});
		

		const response = await axios.post(
			'http://localhost:8000/api/v1/opinions/requests/',
			formData,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		);
		

        if (response.data) {
            const documentUrls = files.map((file) => ({
                name: file.name,
                url: URL.createObjectURL(file.file),
            }));

            const opinionData: Opinion = {
                id: response.data.id.toString(),
                opinionId: response.data.reference_number,
                title: response.data.title,
                status: 'unassigned',
                department: 'Engineering',
                category,
                subCategory,
                priority,
                details,
                submitter: {
                    name: submitterName,
                    email: submitterEmail,
                    description: response.data.description,
                    documents: documentUrls,
                },
                remarks: [],
            };

            onSubmit(opinionData);
            onClose();
        }
    } catch (error) {
        console.error('Error submitting opinion request:', error);
        alert('Failed to submit opinion request. Please try again.');
    }
};


  const nextStep = () => {
    const currentIndex = STEPS.findIndex(s => s.id === step);
    if (currentIndex < STEPS.length - 1) {
      setStep(STEPS[currentIndex + 1].id as Step);
    }
  };

  const prevStep = () => {
    const currentIndex = STEPS.findIndex(s => s.id === step);
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1].id as Step);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const processedFiles = newFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setFiles(prev => [...prev, ...processedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isStepValid = (currentStep: Step): boolean => {
    switch (currentStep) {
      case 'basic':
        return !!(
          title &&
          category &&
		  (!categories[category]?.length || subCategory) &&	
          priority &&
          submitterName &&
          submitterEmail
        );
      case 'details':
        return Object.values(details).every(value => value.trim());
      case 'documents':
        return true;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'basic':
        return (
          <div className="p-6 space-y-6">
            <OpinionFormSection title={text.opinionTitle} required>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a clear, descriptive title"
                required
              />
            </OpinionFormSection>

            <OpinionFormSection title={text.category} required>
              <select
                value={category}
                onChange={(e) => {
                  const newCategory = e.target.value;
                  setCategory(newCategory);
                  setSubCategory(undefined);
                }}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Select category</option>
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </OpinionFormSection>

            {categories[category]?.length > 0 && (
              <OpinionFormSection title="Sub-category" required>
                <select
                  value={subCategory || ''}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">Select sub-category</option>
                  {categories[category].map((subCat) => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                  ))}
                </select>
              </OpinionFormSection>
            )}

            <OpinionFormSection title={text.priorityLevel} required>
              <div className="grid grid-cols-4 gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      'p-2 border rounded-lg flex items-center justify-center gap-1.5',
                      'transition-colors hover:bg-gray-50 text-sm',
                      priority === p ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200'
                    )}
                  >
                    <span className="font-medium capitalize">{p}</span>
                  </button>
                ))}
              </div>
            </OpinionFormSection>

            <div className="grid grid-cols-2 gap-6">
              <OpinionFormSection title={text.yourName} required>
                <input
                  type="text"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </OpinionFormSection>

              <OpinionFormSection title={text.emailAddress} required>
                <input
                  type="email"
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </OpinionFormSection>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="p-6 space-y-6">
            <OpinionFormSection 
              title={text.requestStatement} 
              description="Clearly mention what is required from the committee"
              required
            >
              <textarea
                value={details.requestStatement}
                onChange={(e) => setDetails({ ...details, requestStatement: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </OpinionFormSection>

            <OpinionFormSection 
              title={text.challengesOpportunities}
              description="Mention the reasons for submitting the request"
              required
            >
              <textarea
                value={details.challengesOpportunities}
                onChange={(e) => setDetails({ ...details, challengesOpportunities: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </OpinionFormSection>

            <OpinionFormSection 
              title={text.subjectContent}
              description="Provide details on the requested topic"
              required
            >
              <textarea
                value={details.subjectContent}
                onChange={(e) => setDetails({ ...details, subjectContent: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </OpinionFormSection>

            <OpinionFormSection 
              title={text.alternativeOptions}
              description="Mention other solutions and alternatives considered"
              required
            >
              <textarea
                value={details.alternativeOptions}
                onChange={(e) => setDetails({ ...details, alternativeOptions: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </OpinionFormSection>

            <OpinionFormSection 
              title={text.expectedImpact}
              description="Describe the feasibility of implementation"
              required
            >
              <textarea
                value={details.expectedImpact}
                onChange={(e) => setDetails({ ...details, expectedImpact: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </OpinionFormSection>

            <OpinionFormSection 
              title={text.potentialRisks}
              description="List the potential risks and possible consequences"
              required
            >
              <textarea
                value={details.potentialRisks}
                onChange={(e) => setDetails({ ...details, potentialRisks: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </OpinionFormSection>

            <OpinionFormSection 
              title={text.studiesStatistics}
              description="Incorporate insights from relevant studies"
              required
            >
              <textarea
                value={details.studiesStatistics}
                onChange={(e) => setDetails({ ...details, studiesStatistics: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </OpinionFormSection>

            <OpinionFormSection 
              title={text.legalFinancialOpinions}
              description="Include approved legal and financial opinions"
              required
            >
              <textarea
                value={details.legalFinancialOpinions}
                onChange={(e) => setDetails({ ...details, legalFinancialOpinions: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </OpinionFormSection>

            <OpinionFormSection 
              title={text.stakeholderFeedback}
              description="Insert feedback from stakeholders"
              required
            >
              <textarea
                value={details.stakeholderFeedback}
                onChange={(e) => setDetails({ ...details, stakeholderFeedback: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </OpinionFormSection>

            <OpinionFormSection 
              title={text.workPlan}
              description="Detail the required stages for implementation"
              required
            >
              <textarea
                value={details.workPlan}
                onChange={(e) => setDetails({ ...details, workPlan: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </OpinionFormSection>

            <OpinionFormSection 
              title={text.decisionDraft}
              description="Include the proposed draft text of the decision"
              required
            >
              <textarea
                value={details.decisionDraft}
                onChange={(e) => setDetails({ ...details, decisionDraft: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </OpinionFormSection>
          </div>
        );

      case 'documents':
        return (
          <div className="p-6">
            <OpinionFormSection title="Supporting Documents">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'border-2 border-dashed rounded-lg p-4 transition-colors',
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
                  'text-center'
                )}
              >
                <input
                  type="file"
                  onChange={handleFileInput}
                  multiple
                  className="hidden"
                  id="file-input"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
                <label
                  htmlFor="file-input"
                  className="cursor-pointer inline-flex flex-col items-center"
                >
                  <Upload className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-600">
                    {text.dropMessage}
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    {text.dropMessage2}  
                  </span>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white rounded-lg">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </OpinionFormSection>
          </div>
        );

      case 'review':
        return (
          <div className="p-6">
            <OpinionReviewSection
              title={title}
              category={category}
              subCategory={subCategory}
              priority={priority}
              submitterName={submitterName}
              submitterEmail={submitterEmail}
              details={details}
              files={files}
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">
              {isEditing ? text.editOpinion : text.submitNewOpinion}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-b border-gray-100">
          <div className="flex px-6">
            {STEPS.map((s, index) => (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => setStep(s.id as Step)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
                    step === s.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                    step === s.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  )}>
                    {index + 1}
                  </div>
                  {s.title}
                </button>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 border-b-2 border-gray-100 translate-y-[1.125rem]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          {renderStepContent()}

          <div className="flex items-center justify-between gap-2 p-6 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              className={cn(
                "px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors",
                step === 'basic' && "invisible"
              )}
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
			  <button
				type="submit"
				disabled={!isStepValid(step) || isSubmitting}
				className={cn(
					"px-4 py-2 text-white rounded-lg transition-colors",
					isStepValid(step) && !isSubmitting
					? "bg-blue-600 hover:bg-blue-700"
					: "bg-gray-300 cursor-not-allowed"
				)}
				>
				{isSubmitting 
					? 'Submitting...' 
					: (step === 'review' 
					? (isEditing ? 'Save Changes' : 'Submit Opinion') 
					: 'Next')}
				</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}