import axios from 'axios';

export interface DocumentAnalysisResponse {
  document_id: string;
  status: string;
  analysis_result: {
    document_ids: string[];
    content_analysis: {
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

export async function analyzeDocument(file: File): Promise<DocumentAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<DocumentAnalysisResponse>(
    'http://localhost:8000/api/v1/documentprocessor/analyze-document',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}