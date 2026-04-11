import { Accomplishment } from '../../shared/types';

export function exportToMarkdown(accomplishments: Accomplishment[], title: string): string {
  const lines: string[] = [`# ${title}`, '', `*Generated on ${new Date().toLocaleDateString()}*`, ''];

  const grouped = groupByCategory(accomplishments);
  for (const [category, items] of Object.entries(grouped)) {
    lines.push(`## ${formatCategory(category)}`, '');
    for (const item of items) {
      lines.push(`### ${item.title}`);
      lines.push(`- **Date:** ${item.date}`);
      lines.push(`- **Impact:** ${item.impactLevel}`);
      if (item.description) {
        lines.push(`- **Description:** ${item.description}`);
      }
      if (item.tags.length > 0) {
        lines.push(`- **Tags:** ${item.tags.join(', ')}`);
      }
      if (item.evidenceLinks.length > 0) {
        lines.push(`- **Evidence:**`);
        for (const link of item.evidenceLinks) {
          lines.push(`  - ${link}`);
        }
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

export function exportToCsv(accomplishments: Accomplishment[]): string {
  const headers = ['Title', 'Description', 'Date', 'Category', 'Impact Level', 'Tags', 'Evidence Links'];
  const rows = accomplishments.map((a) => [
    escapeCsv(a.title),
    escapeCsv(a.description),
    a.date,
    a.category,
    a.impactLevel,
    escapeCsv(a.tags.join('; ')),
    escapeCsv(a.evidenceLinks.join('; ')),
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function groupByCategory(accomplishments: Accomplishment[]): Record<string, Accomplishment[]> {
  const groups: Record<string, Accomplishment[]> = {};
  for (const a of accomplishments) {
    if (!groups[a.category]) {
      groups[a.category] = [];
    }
    groups[a.category].push(a);
  }
  return groups;
}

function formatCategory(category: string): string {
  return category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
