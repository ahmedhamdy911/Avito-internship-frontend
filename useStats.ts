import { useEffect, useState } from 'react';
import {
  ActivityPoint,
  CategoryStatsEntry,
  DecisionDistributionEntry,
  StatsPeriod,
  StatsSummary
} from '../api/types';
import {
  getActivityStats,
  getCategoriesStats,
  getDecisionsDistribution,
  getStatsSummary
} from '../api/stats';

export const useStats = (period: StatsPeriod) => {
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [activity, setActivity] = useState<ActivityPoint[]>([]);
  const [decisions, setDecisions] = useState<DecisionDistributionEntry[]>([]);
  const [categories, setCategories] = useState<CategoryStatsEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, a, d, c] = await Promise.all([
        getStatsSummary(period),
        getActivityStats(period),
        getDecisionsDistribution(period),
        getCategoriesStats(period)
      ]);
      setSummary(s);
      setActivity(a);
      setDecisions(d);
      setCategories(c);
    } catch (e) {
      console.error(e);
      setError('Не удалось загрузить статистику');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  return { summary, activity, decisions, categories, loading, error, reload: load };
};
