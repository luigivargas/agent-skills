import React from 'react';
import { Accomplishment } from '../../shared/types';

interface TimelineViewProps {
  accomplishments: Accomplishment[];
  onEdit: (id: string) => void;
}

const impactDot: Record<string, string> = {
  low: 'bg-gray-400',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

function groupByMonth(items: Accomplishment[]): Map<string, Accomplishment[]> {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
  const groups = new Map<string, Accomplishment[]>();
  for (const item of sorted) {
    const key = item.date.substring(0, 7); // YYYY-MM
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }
  return groups;
}

function formatMonth(yyyyMm: string): string {
  const [year, month] = yyyyMm.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

function TimelineView({ accomplishments, onEdit }: TimelineViewProps) {
  if (accomplishments.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
        <p className="text-lg text-gray-500 dark:text-gray-400">No accomplishments to display</p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          Add accomplishments to see them on the timeline.
        </p>
      </div>
    );
  }

  const grouped = groupByMonth(accomplishments);

  return (
    <div className="space-y-8">
      {Array.from(grouped.entries()).map(([month, items]) => (
        <div key={month}>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {formatMonth(month)}
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({items.length} accomplishment{items.length !== 1 ? 's' : ''})
            </span>
          </h3>
          <div className="relative ml-4 border-l-2 border-gray-200 pl-6 dark:border-gray-700">
            {items.map((item) => (
              <div key={item.id} className="relative mb-6 last:mb-0">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-white dark:border-gray-900 ${impactDot[item.impactLevel]}`}
                />
                <button
                  onClick={() => onEdit(item.id)}
                  className="block w-full rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{item.date}</span>
                        <span>·</span>
                        <span className="capitalize">{item.category.replace(/-/g, ' ')}</span>
                        <span>·</span>
                        <span className="capitalize">{item.impactLevel} impact</span>
                      </div>
                    </div>
                  </div>
                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  )}
                  {item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TimelineView;
