import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: MetricCardProps) => {
  const variantStyles = {
    default: 'bg-card border-border',
    primary: 'bg-primary/10 border-primary/20',
    success: 'bg-success/10 border-success/20',
    warning: 'bg-warning/10 border-warning/20',
  };

  const iconStyles = {
    default: 'bg-secondary text-muted-foreground',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
  };

  return (
    <div
      className={cn(
        'border transition-all duration-300 hover:scale-[1.02] animate-fade-in',
        variantStyles[variant]
      )}
      style={{
        borderRadius: 'var(--radius-card)',
        padding: 'var(--spacing-padding-l)',
      }}
    >
      <div 
        className="flex items-start justify-between"
        style={{ marginBottom: 'var(--spacing-gap-s)' }}
      >
        <div
          className={cn(
            'w-10 h-10 flex items-center justify-center',
            iconStyles[variant]
          )}
          style={{ borderRadius: 'var(--radius-l)' }}
        >
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-1',
              trend.isPositive
                ? 'bg-success/20 text-success'
                : 'bg-destructive/20 text-destructive'
            )}
            style={{ borderRadius: 'var(--radius-badge)' }}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/70">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
