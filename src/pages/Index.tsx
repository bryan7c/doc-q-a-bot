import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { Dashboard } from '@/components/dashboard/Dashboard';

const Index = () => {
  const [activeView, setActiveView] = useState<'chat' | 'dashboard'>('chat');

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-hidden">
        {activeView === 'chat' ? <ChatContainer /> : <Dashboard />}
      </main>
    </div>
  );
};

export default Index;
