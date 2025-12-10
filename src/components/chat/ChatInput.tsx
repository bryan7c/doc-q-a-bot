import { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-panel rounded-xl p-2">
      <div
        className="flex items-center"
        style={{
          borderRadius: 'var(--radius-input)',
          background: 'var(--color-surface-default)',
          height: '45px',
          padding: '0 var(--spacing-padding-m)',
          gap: 'var(--spacing-gap-xs)',
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Faça uma pergunta sobre a documentação..."
          aria-label="Mensagem de chat"
          className="flex-1 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground h-full py-0 px-0"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={cn(
            'flex-shrink-0 p-3 rounded-lg transition-all duration-200',
            input.trim() && !isLoading
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow-primary'
              : 'bg-secondary text-muted-foreground cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
