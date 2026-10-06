import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ProjectionPoint, formatCompactINR } from '../config/financialData';

interface WealthTrajectoryChartProps {
  data: ProjectionPoint[];
  baselineLabel?: string;
}

export const WealthTrajectoryChart: React.FC<WealthTrajectoryChartProps> = ({
  data,
  baselineLabel = 'Compounding Wealth Path',
}) => {
  const { theme } = useTheme();

  if (!data || data.length === 0) return null;

  const width = 740;
  const height = 300;
  const padLeft = 82;
  const padRight = 28;
  const padTop = 26;
  const padBottom = 42;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxVal = Math.max(
    100000,
    ...data.map((d) => Math.max(d.baselineWealth, d.investedCapital))
  );

  const gridColor = theme === 'dark' ? 'rgba(148, 163, 184, 0.20)' : '#e2e8f0';
  const axisTextColor = theme === 'dark' ? '#cbd5e1' : '#475569';
  const baselineColor = theme === 'dark' ? '#10b981' : '#059669';
  const investedColor = theme === 'dark' ? '#64748b' : '#94a3b8';

  const getX = (idx: number) =>
    padLeft + (data.length <= 1 ? 0 : (idx / (data.length - 1)) * plotW);
  const getY = (val: number) => padTop + plotH - Math.min(1, Math.max(0, val / maxVal)) * plotH;

  const baselinePoints = data.map((d, i) => `${getX(i)},${getY(d.baselineWealth)}`).join(' ');
  const investedPoints = data.map((d, i) => `${getX(i)},${getY(d.investedCapital)}`).join(' ');

  const areaBaseline = `${getX(0)},${padTop + plotH} ${baselinePoints} ${getX(data.length - 1)},${padTop + plotH}`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxVal * t));

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: baselineColor }} />
            {baselineLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: investedColor }} />
            Total Principal Invested
          </span>
        </div>
        <span className="font-mono text-[var(--text-muted)]">
          Final Year: {formatCompactINR(data[data.length - 1].baselineWealth)}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
        role="img"
        aria-label="Wealth projection chart"
      >
        <defs>
          <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={baselineColor} stopOpacity={theme === 'dark' ? 0.32 : 0.22} />
            <stop offset="100%" stopColor={baselineColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines & Y-Axis Labels */}
        {yTicks.map((tickVal, idx) => {
          const y = getY(tickVal);
          return (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke={gridColor}
                strokeDasharray={idx === 0 ? undefined : '4 4'}
                strokeWidth="1"
              />
              <text
                x={padLeft - 10}
                y={y + 4}
                textAnchor="end"
                fill={axisTextColor}
                fontSize="13"
                fontFamily="JetBrains Mono, monospace"
              >
                {formatCompactINR(tickVal)}
              </text>
            </g>
          );
        })}

        {/* Area under baseline */}
        <polygon points={areaBaseline} fill="url(#baselineGrad)" />

        {/* Invested Principal Line */}
        <polyline
          fill="none"
          stroke={investedColor}
          strokeWidth="1.75"
          strokeDasharray="4 4"
          points={investedPoints}
        />

        {/* Baseline Wealth Line */}
        <polyline
          fill="none"
          stroke={baselineColor}
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={baselinePoints}
        />

        {/* Data nodes & X-axis labels */}
        {data.map((pt, i) => {
          const showLabel = data.length <= 12 || i % 2 === 0 || i === data.length - 1;
          const x = getX(i);
          const yBase = getY(pt.baselineWealth);
          return (
            <g key={pt.year}>
              <circle cx={x} cy={yBase} r="3.5" fill={baselineColor} />
              {showLabel && (
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fill={axisTextColor}
                  fontSize="13"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {pt.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

interface AllocationBreakdownProps {
  monthlyInHand: number;
  monthlyExpenses: number;
  monthlyInvestments: number;
}

export const AllocationBreakdownChart: React.FC<AllocationBreakdownProps> = ({
  monthlyInHand,
  monthlyExpenses,
  monthlyInvestments,
}) => {
  const { theme } = useTheme();
  const total = Math.max(1, monthlyInHand);
  const expPct = Math.min(100, Math.round((monthlyExpenses / total) * 100));
  const invPct = Math.min(100 - expPct, Math.round((monthlyInvestments / total) * 100));
  const bufferPct = Math.max(0, 100 - expPct - invPct);

  const items = [
    {
      label: 'Monthly Living Expenses',
      pct: expPct,
      amount: monthlyExpenses,
      color: theme === 'dark' ? '#f59e0b' : '#d97706',
    },
    {
      label: 'SIP & Wealth Investments',
      pct: invPct,
      amount: monthlyInvestments,
      color: theme === 'dark' ? '#10b981' : '#059669',
    },
    {
      label: 'Liquid Buffer / Emergency Savings',
      pct: bufferPct,
      amount: Math.max(0, monthlyInHand - monthlyExpenses - monthlyInvestments),
      color: theme === 'dark' ? '#38bdf8' : '#0284c7',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stacked Horizontal Bar */}
      <div className="w-full h-4 rounded-full overflow-hidden flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              width: `${Math.max(2, item.pct)}%`,
              backgroundColor: item.color,
            }}
            title={`${item.label}: ${item.pct}%`}
            className="h-full transition-all duration-300"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate">{item.label}</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <span className="font-mono font-semibold text-sm text-[var(--text-primary)]">
                {formatCompactINR(item.amount)}
              </span>
              <span className="font-mono text-xs text-[var(--text-muted)]">{item.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
