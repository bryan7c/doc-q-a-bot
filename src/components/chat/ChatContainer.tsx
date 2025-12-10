import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/hooks/useChatStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { MessageSquare, Trash2 } from 'lucide-react';
import { fetchAnswer, APIError } from '@/services/api';

export const ChatContainer = () => {
  const { messages, addMessage, clearMessages } = useChatStore();
  const { recordQuery } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const startTime = performance.now();
    
    addMessage({ role: 'user', content });
    setIsLoading(true);

    try {
      const response = await fetchAnswer(content);
      const endTime = performance.now();
      const responseTime = (endTime - startTime) / 1000; // Convert to seconds

      // Calculate relevance score based on chunks_count (higher chunks = more relevant)
      const relevanceScore = Math.min(95, 70 + (response.chunks_count * 5));

      addMessage({
        role: 'assistant',
        content: response.generated_answer,
        sources: [`${response.chunks_count} chunks encontrados`],
        relevanceScore: relevanceScore,
        userQuery: content,
      });

      // Record analytics
      recordQuery(content, responseTime, relevanceScore);
    } catch (error) {
      const endTime = performance.now();
      const responseTime = (endTime - startTime) / 1000;

      let errorMessage = 'Desculpe, ocorreu um erro ao processar sua pergunta.';
      
      if (error instanceof APIError) {
        if (error.message.includes('Network error')) {
          errorMessage = `**Erro de Conexão**\n\nNão foi possível conectar ao servidor da API em \`localhost:8080\`.\n\nVerifique se:\n- O servidor da API está rodando\n- A porta 8080 está acessível\n\n\`${error.message}\``;
        } else {
          errorMessage = `**Erro ao buscar resposta**\n\n${error.message}`;
        }
      }

      addMessage({
        role: 'assistant',
        content: errorMessage,
        sources: ['error'],
        relevanceScore: 0,
        userQuery: content,
      });

      // Record failed query with 0 score
      recordQuery(content, responseTime, 0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">IA llow</h2>
            <p className="text-xs text-muted-foreground">
              Pergunte sobre a documentação
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center animate-pulse-slow">
              <MessageSquare className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                Como posso ajudar?
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Faça perguntas sobre a documentação e receba respostas baseadas
                no conteúdo disponível. Avalie as respostas para melhorar o sistema.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {['Como configurar autenticação?', 'Quais são os endpoints?', 'Como fazer deploy?'].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSendMessage(suggestion)}
                    className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-3 p-4 bg-card/50 rounded-lg animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-2">
                    IA llow
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-secondary rounded w-3/4" />
                    <div className="h-4 bg-secondary rounded w-1/2" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
