import axios from 'axios';
// services/documentAnalysis.ts

export interface DocumentAnalysisResponse {
	document_id: string;
	status: string;
	analysis_result?: {
	  document_type?: string;
	  main_purpose?: string;
	  key_points?: string[];
	  requirements?: string[];
	  important_dates_deadlines?: string[];
	  sections_analysis?: Array<{
		section_name: string;
		key_content: string;
	  }>;
	  summary?: string;
	  audience?: string;
	  action_items?: string[];
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
		{},
		{
		  headers: {
			'Authorization': `Bearer ${token}`,
		  },
		}
	  );
	  return response.data;
	} catch (error) {
	  if (axios.isAxiosError(error)) {
		const errorMessage = error.response?.data?.detail || 'Failed to analyze document';
		console.error('Document analysis error:', error.response?.data);
		throw new Error(errorMessage);
	  }
	  throw error;
	}
  }