import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/types/chat';

interface ChatStore {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  rateMessage: (messageId: string, rating: 'positive' | 'negative') => void;
  clearMessages: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],

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
        })),

      rateMessage: (messageId, rating) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, rating } : msg
          ),
        })),

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
