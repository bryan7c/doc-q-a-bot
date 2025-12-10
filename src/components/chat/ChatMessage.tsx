import { ThumbsUp, ThumbsDown, FileText, Bot, User } from 'lucide-react';
import { Message } from '@/types/chat';
import { useChatStore } from '@/hooks/useChatStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { rateMessage } = useChatStore();
  const { recordRating } = useAnalytics();
  const isAssistant = message.role === 'assistant';

  const handleRate = (rating: 'positive' | 'negative') => {
    if (message.rating === rating) return;
    
    rateMessage(message.id, rating);
    
    // Record rating in analytics using the original user query
    if (message.role === 'assistant' && message.userQuery) {
      recordRating(message.userQuery, rating);
    }
  };

  return (
    <div
      className={cn(
        'animate-slide-up flex',
        isAssistant ? 'bg-card/50' : 'bg-transparent'
      )}
      style={{
        gap: 'var(--spacing-gap-s)',
        padding: 'var(--spacing-padding-m)',
        borderRadius: 'var(--radius-l)',
      }}
    >
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 flex items-center justify-center',
          isAssistant ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground'
        )}
        style={{ borderRadius: 'var(--radius-l)' }}
      >
        {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      <div 
        className="flex-1"
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-gap-xs)',
        }}
      >
        <div className="text-sm text-muted-foreground">
          {isAssistant ? 'Assistente RAG' : 'Você'}
        </div>
        
        <div className="text-foreground leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        {isAssistant && message.sources && message.sources.length > 0 && (
          <div 
            className="flex flex-wrap pt-2"
            style={{ gap: 'var(--spacing-gap-xs)' }}
          >
            {message.sources.map((source, index) => (
              <span
                key={index}
                className="inline-flex items-center text-xs bg-secondary text-muted-foreground"
                style={{
                  gap: 'var(--spacing-gap-4xs)',
                  padding: 'var(--spacing-padding-xs) var(--spacing-padding-xs)',
                  borderRadius: 'var(--radius-m)',
                }}
              >
                <FileText className="w-3 h-3" />
                {source}
              </span>
            ))}
          </div>
        )}

        {isAssistant && (
          <div 
            className="flex items-center pt-2"
            style={{ gap: 'var(--spacing-gap-s)' }}
          >
            <span className="text-xs text-muted-foreground">Esta resposta foi útil?</span>
            <div 
              className="flex"
              style={{ gap: 'var(--spacing-gap-4xs)' }}
            >
              <button
                onClick={() => handleRate('positive')}
                className={cn(
                  'p-1.5 transition-all duration-200',
                  message.rating === 'positive'
                    ? 'bg-success/20 text-success'
                    : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                )}
                style={{ borderRadius: 'var(--radius-m)' }}
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRate('negative')}
                className={cn(
                  'p-1.5 transition-all duration-200',
                  message.rating === 'negative'
                    ? 'bg-destructive/20 text-destructive'
                    : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                )}
                style={{ borderRadius: 'var(--radius-m)' }}
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
            {message.relevanceScore && (
              <span className="text-xs text-muted-foreground ml-auto">
                Relevância: {message.relevanceScore}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
