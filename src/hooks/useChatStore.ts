import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, ChatMetrics, DailyMetric, TopQuery } from '@/types/chat';

interface ChatStore {
  messages: Message[];
  metrics: ChatMetrics;
  dailyMetrics: DailyMetric[];
  topQueries: TopQuery[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  rateMessage: (messageId: string, rating: 'positive' | 'negative') => void;
  clearMessages: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialMetrics: ChatMetrics = {
  totalQuestions: 47,
  positiveRatings: 38,
  negativeRatings: 9,
  averageRelevance: 87.5,
  questionsToday: 12,
  responseTime: 1.2,
};

const initialDailyMetrics: DailyMetric[] = [
  { date: '05/12', questions: 8, positiveRate: 75 },
  { date: '06/12', questions: 12, positiveRate: 83 },
  { date: '07/12', questions: 15, positiveRate: 80 },
  { date: '08/12', questions: 10, positiveRate: 90 },
  { date: '09/12', questions: 14, positiveRate: 85 },
  { date: '10/12', questions: 12, positiveRate: 92 },
];

const initialTopQueries: TopQuery[] = [
  { query: 'Como configurar autenticação?', count: 12, avgRating: 4.5 },
  { query: 'Quais são os endpoints da API?', count: 8, avgRating: 4.2 },
  { query: 'Como fazer deploy?', count: 7, avgRating: 4.8 },
  { query: 'Configuração de banco de dados', count: 6, avgRating: 4.0 },
  { query: 'Tratamento de erros', count: 5, avgRating: 4.3 },
];

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      metrics: initialMetrics,
      dailyMetrics: initialDailyMetrics,
      topQueries: initialTopQueries,

      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: generateId(),
              timestamp: new Date(),
            },
          ],
          metrics: message.role === 'user'
            ? {
                ...state.metrics,
                totalQuestions: state.metrics.totalQuestions + 1,
                questionsToday: state.metrics.questionsToday + 1,
              }
            : state.metrics,
        })),

      rateMessage: (messageId, rating) =>
        set((state) => {
          const updatedMessages = state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, rating } : msg
          );
          
          const positiveCount = updatedMessages.filter(m => m.rating === 'positive').length;
          const negativeCount = updatedMessages.filter(m => m.rating === 'negative').length;
          
          return {
            messages: updatedMessages,
            metrics: {
              ...state.metrics,
              positiveRatings: state.metrics.positiveRatings + (rating === 'positive' ? 1 : 0),
              negativeRatings: state.metrics.negativeRatings + (rating === 'negative' ? 1 : 0),
            },
          };
        }),

      clearMessages: () =>
        set({
          messages: [],
        }),
    }),
    {
      name: 'rag-chat-storage',
    }
  )
);
