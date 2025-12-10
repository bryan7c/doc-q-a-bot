import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface RatingDistributionProps {
  positive: number;
  negative: number;
}

export const RatingDistribution = ({ positive, negative }: RatingDistributionProps) => {
  // Get CSS variables
  const successColor = getComputedStyle(document.documentElement).getPropertyValue('--color-success-default').trim() || '#22C55E';
  const destructiveColor = getComputedStyle(document.documentElement).getPropertyValue('--color-destructive-default').trim() || '#EF4444';
  const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-surface-outline').trim() || '#DDDCE2';
  const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--color-surface-default').trim() || '#FFFFFF';
  const foregroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-surface-on-default').trim() || '#141316';
  
  const total = positive + negative;
  const data = [
    { name: 'Positivas', value: positive, color: successColor },
    { name: 'Negativas', value: negative, color: destructiveColor },
  ];

  const positivePercent = total > 0 ? ((positive / total) * 100).toFixed(1) : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-fade-in">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Distribuição de Avaliações
        </h3>
        <p className="text-sm text-muted-foreground">
          Feedback dos usuários sobre as respostas
        </p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="h-[160px] w-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  color: foregroundColor,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                <ThumbsUp className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Positivas</p>
                <p className="text-lg font-semibold text-foreground">{positive}</p>
              </div>
            </div>
            <span className="text-success font-medium">{positivePercent}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                <ThumbsDown className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Negativas</p>
                <p className="text-lg font-semibold text-foreground">{negative}</p>
              </div>
            </div>
            <span className="text-destructive font-medium">
              {total > 0 ? (100 - Number(positivePercent)).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
