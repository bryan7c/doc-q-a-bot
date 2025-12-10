export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  rating?: 'positive' | 'negative' | null;
  relevanceScore?: number;
  sources?: string[];
  userQuery?: string; // Track the original user question for analytics
}

export interface ChatMetrics {
  totalQuestions: number;
  positiveRatings: number;
  negativeRatings: number;
  averageRelevance: number;
  questionsToday: number;
  responseTime: number;
}

export interface DailyMetric {
  date: string;
  questions: number;
  positiveRate: number;
}

export interface TopQuery {
  query: string;
  count: number;
  avgRating: number;
}
