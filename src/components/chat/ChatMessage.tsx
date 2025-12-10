import { ThumbsUp, ThumbsDown, FileText, Bot, User } from 'lucide-react';
import { Message } from '@/types/chat';
import { useChatStore } from '@/hooks/useChatStore';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { rateMessage } = useChatStore();
  const isAssistant = message.role === 'assistant';

  const handleRate = (rating: 'positive' | 'negative') => {
    if (message.rating === rating) return;
    rateMessage(message.id, rating);
  };

  return (
    <div
      className={cn(
        'animate-slide-up flex gap-3 p-4 rounded-lg',
        isAssistant ? 'bg-card/50' : 'bg-transparent'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          isAssistant ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground'
        )}
      >
        {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      <div className="flex-1 space-y-2">
        <div className="text-sm text-muted-foreground">
          {isAssistant ? 'Assistente RAG' : 'Você'}
        </div>
        
        <div className="text-foreground leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        {isAssistant && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {message.sources.map((source, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary rounded-md text-muted-foreground"
              >
                <FileText className="w-3 h-3" />
                {source}
              </span>
            ))}
          </div>
        )}

        {isAssistant && (
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs text-muted-foreground">Esta resposta foi útil?</span>
            <div className="flex gap-1">
              <button
                onClick={() => handleRate('positive')}
                className={cn(
                  'p-1.5 rounded-md transition-all duration-200',
                  message.rating === 'positive'
                    ? 'bg-success/20 text-success'
                    : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                )}
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRate('negative')}
                className={cn(
                  'p-1.5 rounded-md transition-all duration-200',
                  message.rating === 'negative'
                    ? 'bg-destructive/20 text-destructive'
                    : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                )}
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
