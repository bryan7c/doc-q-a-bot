import {
  MessageSquare,
  ThumbsUp,
  Clock,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MetricCard } from './MetricCard';
import { PerformanceChart } from './PerformanceChart';
import { TopQueriesTable } from './TopQueriesTable';
import { RatingDistribution } from './RatingDistribution';

export const Dashboard = () => {
  const { getMetrics, getDailyMetrics, getTopQueries } = useAnalytics();
  
  const metrics = getMetrics();
  const dailyMetrics = getDailyMetrics();
  const topQueries = getTopQueries();

  const satisfactionRate =
    metrics.positiveRatings + metrics.negativeRatings > 0
      ? (
          (metrics.positiveRatings /
            (metrics.positiveRatings + metrics.negativeRatings)) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard de Performance
        </h1>
        <p className="text-muted-foreground">
          Métricas e análises do sistema RAG
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Perguntas"
          value={metrics.totalQuestions}
          subtitle="Desde o início"
          icon={MessageSquare}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Taxa de Satisfação"
          value={`${satisfactionRate}%`}
          subtitle="Baseado nas avaliações"
          icon={ThumbsUp}
          variant="success"
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Relevância Média"
          value={`${metrics.averageRelevance}%`}
          subtitle="Score de relevância"
          icon={TrendingUp}
          variant="default"
        />
        <MetricCard
          title="Tempo de Resposta"
          value={`${metrics.responseTime}s`}
          subtitle="Média por pergunta"
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart data={dailyMetrics} />
        <RatingDistribution
          positive={metrics.positiveRatings}
          negative={metrics.negativeRatings}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopQueriesTable queries={topQueries} />
        
        {/* Activity Summary */}
        <div className="bg-card border border-border rounded-xl p-5 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Resumo de Hoje
              </h3>
              <p className="text-sm text-muted-foreground">
                Atividades das últimas 24 horas
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Perguntas hoje</span>
              <span className="text-lg font-semibold text-foreground">
                {metrics.questionsToday}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Avaliações recebidas</span>
              <span className="text-lg font-semibold text-foreground">
                {metrics.positiveRatings + metrics.negativeRatings}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Fontes consultadas</span>
              <span className="text-lg font-semibold text-foreground">24</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Documentos indexados</span>
              <span className="text-lg font-semibold text-foreground">156</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
