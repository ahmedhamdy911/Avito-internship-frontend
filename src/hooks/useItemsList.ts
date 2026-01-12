import { useEffect, useState } from 'react';
import { getItems } from '../api/items';
import { Item, ItemStatus, ItemsListParams, PaginatedResponse } from '../api/types';

export interface Filters {
  statuses: ItemStatus[];
  category: string;
  search: string;
  minPrice?: number;
  maxPrice?: number;
}

export type SortField = 'createdAt' | 'price' | 'priority';
export type SortOrder = 'asc' | 'desc';

export const useItemsList = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    statuses: [],
    category: '',
    search: ''
  });
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [data, setData] = useState<PaginatedResponse<Item> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ItemsListParams = {
        page,
        limit: 10,
        statuses: filters.statuses.length ? filters.statuses : undefined,
        category: filters.category || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        search: filters.search || undefined,
        sortField,
        sortOrder
      };
      const resp = await getItems(params);
      setData(resp);
    } catch (e) {
      console.error(e);
      setError('Не удалось загрузить объявления');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters, sortField, sortOrder]);

  const setPageSafe = (p: number) => {
    setPage(Math.max(1, p));
  };

  const resetFilters = () => {
    setFilters({ statuses: [], category: '', search: '' });
    setPage(1);
  };

  return {
    page,
    setPage: setPageSafe,
    filters,
    setFilters,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    data,
    loading,
    error,
    reload: load,
    resetFilters
  };
};
