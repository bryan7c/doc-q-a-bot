import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyMetric, TopQuery } from '@/types/chat';

interface QueryRecord {
  query: string;
  timestamp: Date;
  rating?: 'positive' | 'negative';
  responseTime: number;
  relevanceScore?: number;
}

interface AnalyticsStore {
  queries: QueryRecord[];
  dailyMetrics: DailyMetric[];
  topQueries: TopQuery[];
  
  // Actions
  recordQuery: (query: string, responseTime: number, relevanceScore?: number) => void;
  recordRating: (query: string, rating: 'positive' | 'negative') => void;
  getMetrics: () => {
    totalQuestions: number;
    positiveRatings: number;
    negativeRatings: number;
    averageRelevance: number;
    questionsToday: number;
    responseTime: number;
  };
  getDailyMetrics: () => DailyMetric[];
  getTopQueries: () => TopQuery[];
}

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const formatDate = (date: Date) => {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const getLast7Days = () => {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(formatDate(date));
  }
  return days;
};

export const useAnalytics = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      queries: [],
      dailyMetrics: [],
      topQueries: [],

      recordQuery: (query, responseTime, relevanceScore) => {
        set((state) => ({
          queries: [
            ...state.queries,
            {
              query,
              timestamp: new Date(),
              responseTime,
              relevanceScore,
            },
          ],
        }));
      },

      recordRating: (query, rating) => {
        set((state) => ({
          queries: state.queries.map((q) =>
            q.query === query && !q.rating
              ? { ...q, rating }
              : q
          ),
        }));
      },

      getMetrics: () => {
        const { queries } = get();
        
        const totalQuestions = queries.length;
        const positiveRatings = queries.filter(q => q.rating === 'positive').length;
        const negativeRatings = queries.filter(q => q.rating === 'negative').length;
        
        const queriesWithRelevance = queries.filter(q => q.relevanceScore);
        const averageRelevance = queriesWithRelevance.length > 0
          ? queriesWithRelevance.reduce((sum, q) => sum + (q.relevanceScore || 0), 0) / queriesWithRelevance.length
          : 0;
        
        const questionsToday = queries.filter(q => isToday(new Date(q.timestamp))).length;
        
        const responseTime = queries.length > 0
          ? queries.reduce((sum, q) => sum + q.responseTime, 0) / queries.length
          : 0;

        return {
          totalQuestions,
          positiveRatings,
          negativeRatings,
          averageRelevance: Number(averageRelevance.toFixed(1)),
          questionsToday,
          responseTime: Number(responseTime.toFixed(1)),
        };
      },

      getDailyMetrics: () => {
        const { queries } = get();
        const last7Days = getLast7Days();
        
        return last7Days.map(date => {
          const dayQueries = queries.filter(q => {
            const qDate = new Date(q.timestamp);
            return formatDate(qDate) === date;
          });
          
          const totalQuestions = dayQueries.length;
          const positiveCount = dayQueries.filter(q => q.rating === 'positive').length;
          const ratedCount = dayQueries.filter(q => q.rating).length;
          
          const positiveRate = ratedCount > 0
            ? Math.round((positiveCount / ratedCount) * 100)
            : 0;

          return {
            date,
            questions: totalQuestions,
            positiveRate,
          };
        });
      },

      getTopQueries: () => {
        const { queries } = get();
        
        // Group queries by text
        const queryMap = new Map<string, { count: number; ratings: number[]; }>();
        
        queries.forEach(q => {
          const existing = queryMap.get(q.query);
          const ratingValue = q.rating === 'positive' ? 5 : q.rating === 'negative' ? 1 : 0;
          
          if (existing) {
            existing.count++;
            if (ratingValue > 0) {
              existing.ratings.push(ratingValue);
            }
          } else {
            queryMap.set(q.query, {
              count: 1,
              ratings: ratingValue > 0 ? [ratingValue] : [],
            });
          }
        });
        
        // Convert to array and calculate average rating
        const topQueries: TopQuery[] = Array.from(queryMap.entries())
          .map(([query, data]) => ({
            query,
            count: data.count,
            avgRating: data.ratings.length > 0
              ? data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length
              : 0,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        return topQueries;
      },
    }),
    {
      name: 'rag-analytics-storage',
    }
  )
);
