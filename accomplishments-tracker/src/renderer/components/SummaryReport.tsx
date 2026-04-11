import React, { useState } from 'react';
import { Accomplishment, Category } from '../../shared/types';

type Period = 'week' | 'month' | 'quarter' | 'year' | 'all';

interface SummaryReportProps {
  accomplishments: Accomplishment[];
}

function getDateRange(period: Period): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString().split('T')[0];
  let start: Date;

  switch (period) {
    case 'week':
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start = new Date(now);
      start.setMonth(start.getMonth() - 1);
      break;
    case 'quarter':
      start = new Date(now);
      start.setMonth(start.getMonth() - 3);
      break;
    case 'year':
      start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      break;
    case 'all':
      return { start: '1970-01-01', end };
  }

  return { start: start.toISOString().split('T')[0], end };
}

function groupByCategory(items: Accomplishment[]): Record<string, Accomplishment[]> {
  const groups: Record<string, Accomplishment[]> = {};
  for (const a of items) {
    if (!groups[a.category]) {
      groups[a.category] = [];
    }
    groups[a.category].push(a);
  }
  return groups;
}

function formatCategory(cat: string): string {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const impactWeight: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const impactBadge: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

function SummaryReport({ accomplishments }: SummaryReportProps) {
  const [period, setPeriod] = useState<Period>('quarter');

  const { start, end } = getDateRange(period);
  const filtered = accomplishments.filter((a) => a.date >= start && a.date <= end);
  const byCategory = groupByCategory(filtered);

  const totalImpactScore = filtered.reduce((sum, a) => sum + impactWeight[a.impactLevel], 0);

  const impactCounts = filtered.reduce(
    (acc, a) => {
      acc[a.impactLevel] = (acc[a.impactLevel] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topTags = getTopTags(filtered, 5);

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period:</span>
        {(['week', 'month', 'quarter', 'year', 'all'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              period === p
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total" value={filtered.length} />
        <StatCard label="Impact Score" value={totalImpactScore} />
        <StatCard label="Categories" value={Object.keys(byCategory).length} />
        <StatCard
          label="Top Impact"
          value={
            filtered.length > 0
              ? filtered.reduce((top, a) =>
                  impactWeight[a.impactLevel] > impactWeight[top.impactLevel] ? a : top
                ).impactLevel
              : '—'
          }
        />
      </div>

      {/* Impact distribution */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Impact Distribution
        </h3>
        <div className="flex gap-3">
          {(['critical', 'high', 'medium', 'low'] as const).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${impactBadge[level]}`}>
                {level}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {impactCounts[level] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top tags */}
      {topTags.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Top Tags</h3>
          <div className="flex flex-wrap gap-2">
            {topTags.map(({ tag, count }) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {tag} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* By category */}
      {Object.entries(byCategory)
        .sort(([, a], [, b]) => b.length - a.length)
        .map(([category, items]) => (
          <div
            key={category}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCategory(category)}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {items.length} accomplishment{items.length !== 1 ? 's' : ''}
              </span>
            </div>
            <ul className="space-y-2">
              {items
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((item) => (
                  <li key={item.id} className="flex items-start gap-2 text-sm">
                    <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs font-medium ${impactBadge[item.impactLevel]}`}>
                      {item.impactLevel}
                    </span>
                    <div>
                      <span className="text-gray-900 dark:text-white">{item.title}</span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {item.date}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}

      {filtered.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No accomplishments in this period
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

function getTopTags(items: Accomplishment[], limit: number): { tag: string; count: number }[] {
  const tagCounts = new Map<string, number>();
  for (const item of items) {
    for (const tag of item.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export default SummaryReport;
