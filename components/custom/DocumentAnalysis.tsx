import React, { useState, useEffect } from 'react';
import { Brain, FileText, Users, AlertCircle, Lightbulb } from 'lucide-react';
import { DocumentAnalysisResponse } from '../services/documentAnalysis';
import { cn } from '../utils';

interface DocumentAnalysisProps {
  analysis: DocumentAnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
}

const analysisTips = [
  {
    icon: Brain,
    title: "AI Processing",
    tip: "Our AI analyzes document structure, content, and context to provide comprehensive insights."
  },
  {
    icon: FileText,
    title: "Document Classification",
    tip: "Documents are automatically categorized based on content, format, and purpose."
  },
  {
    icon: Users,
    title: "Stakeholder Analysis",
    tip: "We identify key stakeholders and their roles mentioned in the document."
  },
  {
    icon: Lightbulb,
    title: "Smart Suggestions",
    tip: "Get department routing suggestions based on document content and previous patterns."
  }
];

export function DocumentAnalysis({ analysis, isLoading, error }: DocumentAnalysisProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % analysisTips.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    const CurrentTipIcon = analysisTips[currentTipIndex].icon;

    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 animate-pulse"></div>
          <div className="w-16 h-16 rounded-full border-t-4 border-blue-600 animate-spin absolute inset-0"></div>
        </div>
        
        <div className="text-center max-w-md mx-auto">
          <p className="text-gray-600 mb-6">Analyzing document...</p>
          
          <div className="bg-blue-50 rounded-xl p-4 transition-all duration-500 animate-fade-in">
            <div className="flex items-center justify-center mb-2">
              <CurrentTipIcon className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900">
                {analysisTips[currentTipIndex].title}
              </h4>
            </div>
            <p className="text-sm text-blue-700">
              {analysisTips[currentTipIndex].tip}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-xl">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertCircle className="w-5 h-5" />
          <h4 className="font-medium">Analysis Error</h4>
        </div>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center p-8 text-gray-500">
        <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Select a document to view its analysis</p>
      </div>
    );
  }

  const { content_analysis } = analysis.analysis_result;
  const processingTime = analysis.metadata?.processing_time;
  const chunksProcessed = analysis.metadata?.chunks_processed;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          Document Analysis
        </h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Document Type:</span>
              <span className="ml-2 text-gray-600">
                {content_analysis.document_metadata.document_type}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Classification:</span>
              <span className="ml-2 text-gray-600">
                {content_analysis.document_metadata.classification}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Language:</span>
              <span className="ml-2 text-gray-600">
                {content_analysis.document_metadata.language}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h5 className="font-medium mb-2">Main Purpose</h5>
            <p className="text-sm text-gray-600">
              {content_analysis.executive_summary.main_purpose}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h5 className="font-medium mb-2">Target Audience</h5>
            <div className="flex flex-wrap gap-2">
              {content_analysis.executive_summary.target_audience.map((audience, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                >
                  {audience}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h5 className="font-medium mb-2">Key Topics</h5>
            <div className="grid gap-2">
              {content_analysis.key_components.main_topics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                  {topic}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h5 className="font-medium mb-2">Critical Points</h5>
            <div className="space-y-2">
              {content_analysis.key_components.critical_points.map((point, index) => (
                <p key={index} className="text-sm text-gray-600">
                  • {point}
                </p>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h5 className="font-medium mb-2">Key Stakeholders</h5>
            <div className="flex flex-wrap gap-2">
              {content_analysis.key_components.key_stakeholders.map((stakeholder, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                    "bg-blue-50 text-blue-700"
                  )}
                >
                  <Users className="w-3 h-3" />
                  {stakeholder}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {processingTime && chunksProcessed && (
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>Processed: {new Date(processingTime).toLocaleString()}</span>
          <span>{chunksProcessed} chunks analyzed</span>
        </div>
      )}
    </div>
  );
}