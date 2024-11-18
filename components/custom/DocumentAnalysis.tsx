import React from 'react';
import { FileText, Brain } from 'lucide-react';
import { DocumentAnalysisResponse } from '../../services/documentAnalysis';

interface DocumentAnalysisProps {
  analysis: DocumentAnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function DocumentAnalysis({ analysis, isLoading, error }: DocumentAnalysisProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p>{error}</p>
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

  const contentAnalysis = analysis.analysis_result?.content_analysis || {};
  const documentMetadata = contentAnalysis.document_metadata || {};
  const executiveSummary = contentAnalysis.executive_summary || {};
  const keyComponents = contentAnalysis.key_components || {};
  const metadata = analysis.analysis_result?.processing_metadata || {};
  const analysisMetadata = analysis.metadata || {};

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          Document Analysis
        </h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Document Type:</span>
              <span className="ml-2 text-gray-600">
                {documentMetadata.document_type || 'Unknown'}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Classification:</span>
              <span className="ml-2 text-gray-600">
                {documentMetadata.classification || 'Unknown'}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Language:</span>
              <span className="ml-2 text-gray-600">
                {documentMetadata.language || 'Unknown'}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h5 className="font-medium mb-2">Main Topics</h5>
            <ul className="space-y-1">
              {(keyComponents.main_topics || []).map((topic, index) => (
                <li key={index} className="text-sm text-gray-600">
                  • {topic}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h5 className="font-medium mb-2">Executive Summary</h5>
            <p className="text-sm text-gray-600">
              {executiveSummary.brief_overview || 'No summary available'}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h5 className="font-medium mb-2">Critical Points</h5>
            <ul className="space-y-1">
              {(keyComponents.critical_points || []).map((point, index) => (
                <li key={index} className="text-sm text-gray-600">
                  • {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 flex items-center justify-between">
        <span>
          Processed: {metadata.processing_time ? new Date(metadata.processing_time).toLocaleString() : 'N/A'}
        </span>
        <span>{analysisMetadata.chunks_processed ?? 0} chunks analyzed</span>
      </div>
    </div>
  );
}
