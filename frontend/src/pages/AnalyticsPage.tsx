import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import axiosInstance from '../api/axiosInstance';
import { Loader2, TrendingUp, CheckCircle2, Clock, HelpCircle } from 'lucide-react';

interface JargonHit    { keyword: string; hitCount: number; }
interface RoleRatio    { role: string; hitCount: number; }
interface Productivity { totalTasks: number; completedTasks: number; completionRate: number; avgCompletionDays: number; }
interface AnalyticsData { topJargonHits: JargonHit[]; roleRatios: RoleRatio[]; productivity: Productivity; }

const CHART_COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];

export const AnalyticsPage: React.FC = () => {
  const [data, setData]       = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    axiosInstance.get<{ success: boolean; data: AnalyticsData }>('/insights/dashboard')
      .then((res) => setData(res.data.data))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 className="spinner" style={{ color: 'var(--primary)' }} size={44} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '60vh', flexDirection: 'column', gap: '12px',
      }}>
        <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>
          데이터를 불러오지 못했습니다.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  const totalJargonHits = data.topJargonHits.reduce((acc, cur) => acc + cur.hitCount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Header */}
      <header>
        <h1 style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Analytics &amp; Insights
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontWeight: 500, fontSize: 'var(--text-base)' }}>
          데이터로 확인하는 커뮤니케이션 가이드라인
        </p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}>
        <AnalyticsStatCard
          title="총 업무 요청"
          value={data.productivity.totalTasks}
          description="전체 접수된 업무"
          icon={<TrendingUp size={20} />}
          colorRgb="59,130,246"
        />
        <AnalyticsStatCard
          title="완료된 업무"
          value={data.productivity.completedTasks}
          description={`달성률 ${data.productivity.completionRate}%`}
          icon={<CheckCircle2 size={20} />}
          colorRgb="16,185,129"
        />
        <AnalyticsStatCard
          title="평균 처리 기간"
          value={`${data.productivity.avgCompletionDays}일`}
          description="요청부터 완료까지"
          icon={<Clock size={20} />}
          colorRgb="245,158,11"
        />
        <AnalyticsStatCard
          title="용어 도움 횟수"
          value={totalJargonHits}
          description="전체 용어 툴팁 조회 수"
          icon={<HelpCircle size={20} />}
          colorRgb="99,102,241"
        />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Bar Chart */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '24px', color: 'var(--text-main)' }}>
            가장 많이 조회된 IT 용어 TOP 5
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topJargonHits} layout="vertical" margin={{ left: 40, right: 24, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="keyword"
                  type="category"
                  tick={{ fill: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(18, 21, 30, 0.95)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="hitCount" radius={[0, 8, 8, 0]} maxBarSize={32}>
                  {data.topJargonHits.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '24px', color: 'var(--text-main)' }}>
            직무별 용어 도움 요청 비율
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.roleRatios}
                  cx="50%"
                  cy="45%"
                  innerRadius={56}
                  outerRadius={96}
                  paddingAngle={6}
                  dataKey="hitCount"
                  nameKey="role"
                >
                  {data.roleRatios.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      stroke="rgba(0,0,0,0.15)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(18, 21, 30, 0.95)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '12px' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Stat Card ── */
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  colorRgb: string; // e.g. "99,102,241"
}

const AnalyticsStatCard = React.memo<StatCardProps>(({ title, value, description, icon, colorRgb }) => (
  <div
    className="stat-card"
    style={{
      '--stat-accent':  `rgb(${colorRgb})`,
      '--stat-icon-bg': `rgba(${colorRgb}, 0.10)`,
    } as React.CSSProperties}
  >
    <div className="stat-card-icon">{icon}</div>
    <div>
      <div className="stat-card-label">{title}</div>
      <div className="stat-card-value">{value}</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '3px' }}>{description}</div>
    </div>
  </div>
));
