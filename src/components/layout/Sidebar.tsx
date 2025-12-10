import { MessageSquare, LayoutDashboard, FileText, Settings, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeView: 'chat' | 'dashboard';
  onViewChange: (view: 'chat' | 'dashboard') => void;
}

const navItems = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
] as const;

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  return (
    <aside className="w-64 h-full bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex flex-col items-center gap-1">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
          <div className="text-center">
            <h1 className="font-bold text-foreground">IAllow</h1>
            <p className="text-xs text-muted-foreground">Chat Inteligente</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
              activeView === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Documentação
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            156 documentos indexados
          </p>
          <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: '78%' }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
