import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/hooks/useChatStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { MessageSquare, Trash2 } from 'lucide-react';

// Simulated RAG responses
const simulatedResponses = [
  {
    content: `Para configurar a autenticação na sua aplicação, siga estes passos:

1. **Instale as dependências necessárias:**
   \`\`\`bash
   npm install @auth/core @auth/providers
   \`\`\`

2. **Configure o provider de autenticação** no arquivo \`auth.config.ts\`

3. **Adicione as variáveis de ambiente** necessárias no seu \`.env\`

4. **Implemente o middleware** para proteger suas rotas

A documentação completa está disponível na seção "Autenticação" do guia.`,
    sources: ['auth-guide.md', 'getting-started.md'],
    relevanceScore: 92,
  },
  {
    content: `Os principais endpoints da API estão organizados da seguinte forma:

**Usuários:**
- \`GET /api/users\` - Lista todos os usuários
- \`POST /api/users\` - Cria um novo usuário
- \`PUT /api/users/:id\` - Atualiza um usuário

**Autenticação:**
- \`POST /api/auth/login\` - Realiza login
- \`POST /api/auth/logout\` - Realiza logout
- \`POST /api/auth/refresh\` - Atualiza o token

Todos os endpoints requerem autenticação, exceto \`/api/auth/login\`.`,
    sources: ['api-reference.md', 'endpoints.md'],
    relevanceScore: 88,
  },
  {
    content: `O processo de deploy pode ser realizado de várias formas:

**Deploy Automático (Recomendado):**
Configure CI/CD com GitHub Actions para deploy automático a cada push na branch main.

**Deploy Manual:**
1. Execute \`npm run build\` para gerar o build de produção
2. Configure as variáveis de ambiente no servidor
3. Execute \`npm start\` para iniciar a aplicação

**Plataformas suportadas:** Vercel, Railway, AWS, Google Cloud

Consulte o guia de deploy para configurações específicas de cada plataforma.`,
    sources: ['deploy-guide.md', 'production.md'],
    relevanceScore: 95,
  },
];

export const ChatContainer = () => {
  const { messages, addMessage, clearMessages } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    addMessage({ role: 'user', content });
    setIsLoading(true);

    // Simulate RAG processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const randomResponse =
      simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];

    addMessage({
      role: 'assistant',
      content: randomResponse.content,
      sources: randomResponse.sources,
      relevanceScore: randomResponse.relevanceScore,
    });

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Chat RAG</h2>
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
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse-slow">
              <MessageSquare className="w-8 h-8 text-primary" />
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
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-2">
                    Assistente RAG
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
