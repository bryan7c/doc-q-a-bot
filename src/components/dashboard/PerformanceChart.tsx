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
                <stop offset="5%" stopColor="hsl(175, 80%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(175, 80%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(222, 30%, 18%)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 8%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 98%)',
              }}
              labelStyle={{ color: 'hsl(215, 20%, 55%)' }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="questions"
              stroke="hsl(175, 80%, 45%)"
              strokeWidth={2}
              fill="url(#colorQuestions)"
              name="Perguntas"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="positiveRate"
              stroke="hsl(142, 76%, 36%)"
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
