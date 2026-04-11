import { Accomplishment, ImpactLevel } from '../../shared/types';
import { FilterState } from '../components/FilterBar';

const IMPACT_ORDER: Record<ImpactLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

export function filterAccomplishments(
  accomplishments: Accomplishment[],
  filters: FilterState
): Accomplishment[] {
  let result = [...accomplishments];

  // Category filter
  if (filters.category !== 'all') {
    result = result.filter((a) => a.category === filters.category);
  }

  // Impact filter
  if (filters.impactLevel !== 'all') {
    result = result.filter((a) => a.impactLevel === filters.impactLevel);
  }

  // Date range filter
  if (filters.dateFrom) {
    result = result.filter((a) => a.date >= filters.dateFrom);
  }
  if (filters.dateTo) {
    result = result.filter((a) => a.date <= filters.dateTo);
  }

  // Full-text search
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  // Sort
  result.sort((a, b) => {
    let comparison = 0;
    switch (filters.sortBy) {
      case 'date':
        comparison = a.date.localeCompare(b.date);
        break;
      case 'impact':
        comparison = IMPACT_ORDER[a.impactLevel] - IMPACT_ORDER[b.impactLevel];
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }
    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  return result;
}
