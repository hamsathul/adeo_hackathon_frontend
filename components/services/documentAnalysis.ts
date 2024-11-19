import axios from 'axios';

export interface DocumentAnalysisResponse {
  document_id: string;
  status: string;
  analysis_result: {
    document_metadata: {
      document_type: string;
      classification: string;
      language: string;
      formality_level: string;
    };
    executive_summary: {
      main_purpose: string;
      target_audience: string[];
      brief_overview: string;
    };
    key_components: {
      main_topics: string[];
      critical_points: string[];
      key_stakeholders: string[];
    };
    processing_metadata: {
      total_chunks: number;
      timestamp: string;
      analysis_version: string;
    };
  };
  metadata: {
    filename: string;
    content_type: string;
    text_length: number;
    processing_time: string;
    chunks_processed: number;
    similar_docs_found: number;
  };
}

export async function analyzeDocument(documentId: number): Promise<DocumentAnalysisResponse> {
	const API_BASE_URL = 'http://localhost:8000';
	const token = localStorage.getItem('token');
  
	try {
	  const response = await axios.post<DocumentAnalysisResponse>(
		`${API_BASE_URL}/api/v1/documentprocessor/analyze-document/existing/${documentId}`,
		null,
		{
		  headers: {
			'Authorization': `Bearer ${token}`,
		  },
		}
	  );
	  return response.data;
	} catch (error) {
	  if (axios.isAxiosError(error)) {
		console.error('Document analysis error:', error.response?.data);
		throw new Error(error.response?.data?.detail || 'Failed to analyze document');
	  }
	  throw error;
	}
  }