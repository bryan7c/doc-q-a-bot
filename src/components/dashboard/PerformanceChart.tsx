import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { DailyMetric } from '@/types/chat';

interface PerformanceChartProps {
  data: DailyMetric[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  // Get CSS variables
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-default').trim() || '#14B8A6';
  const successColor = getComputedStyle(document.documentElement).getPropertyValue('--color-success-default').trim() || '#22C55E';
  const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-surface-outline').trim() || '#DDDCE2';
  const mutedForeground = getComputedStyle(document.documentElement).getPropertyValue('--color-surface-on-default-placeholder').trim() || '#66636B';
  const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--color-surface-default').trim() || '#FFFFFF';
  const foregroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-surface-on-default').trim() || '#141316';

  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-fade-in">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Performance ao longo do tempo
        </h3>
        <p className="text-sm text-muted-foreground">
          Perguntas e taxa de aprovação por dia
        </p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={successColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={successColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={borderColor}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke={mutedForeground}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke={mutedForeground}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={mutedForeground}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                color: foregroundColor,
              }}
              labelStyle={{ color: mutedForeground }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="questions"
              stroke={accentColor}
              strokeWidth={2}
              fill="url(#colorQuestions)"
              name="Perguntas"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="positiveRate"
              stroke={successColor}
              strokeWidth={2}
              fill="url(#colorRate)"
              name="Taxa de Aprovação (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
