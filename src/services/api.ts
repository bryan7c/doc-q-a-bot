export interface APIResponse {
  chunks_count: number;
  generated_answer: string;
  query: string;
}

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

const API_BASE_URL = 'http://localhost:8080';

export async function fetchAnswer(query: string): Promise<APIResponse> {
  if (!query.trim()) {
    throw new APIError('Query cannot be empty');
  }

  try {
    const url = new URL('/pergunta', API_BASE_URL);
    url.searchParams.set('query', query);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new APIError(
        `Failed to fetch answer: ${response.statusText}`,
        response.status
      );
    }

    const data: APIResponse = await response.json();

    if (!data.generated_answer || typeof data.generated_answer !== 'string') {
      throw new APIError('Invalid response format: missing generated_answer');
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new APIError(`Network error: ${error.message}`);
    }
    
    throw new APIError('An unexpected error occurred');
  }
}
