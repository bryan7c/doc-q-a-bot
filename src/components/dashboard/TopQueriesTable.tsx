import { Star } from 'lucide-react';
import { TopQuery } from '@/types/chat';

interface TopQueriesTableProps {
  queries: TopQuery[];
}

export const TopQueriesTable = ({ queries }: TopQueriesTableProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-fade-in">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Perguntas Mais Frequentes
        </h3>
        <p className="text-sm text-muted-foreground">
          Top 5 perguntas com maior volume
        </p>
      </div>
      <div className="space-y-3">
        {queries.map((query, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-sm text-foreground truncate max-w-[200px] lg:max-w-[300px]">
                {query.query}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {query.count}x
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                <span className="text-sm text-foreground font-medium">
                  {query.avgRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
