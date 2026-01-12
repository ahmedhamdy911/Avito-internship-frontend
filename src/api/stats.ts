import { apiClient } from './axiosClient';
import {
  ActivityPoint,
  CategoryStatsEntry,
  DecisionDistributionEntry,
  StatsPeriod,
  StatsSummary
} from './types';

export const getStatsSummary = async (
  period: StatsPeriod
): Promise<StatsSummary> => {
  const response = await apiClient.get('/stats/summary', {
    params: { period }
  });
  return response.data;
};

export const getActivityStats = async (
  period: StatsPeriod
): Promise<ActivityPoint[]> => {
  const response = await apiClient.get('/stats/activity', {
    params: { period }
  });
  return response.data;
};

export const getDecisionsDistribution = async (
  period: StatsPeriod
): Promise<DecisionDistributionEntry[]> => {
  const response = await apiClient.get('/stats/decisions', {
    params: { period }
  });
  return response.data;
};

export const getCategoriesStats = async (
  period: StatsPeriod
): Promise<CategoryStatsEntry[]> => {
  const response = await apiClient.get('/stats/categories', {
    params: { period }
  });
  return response.data;
};
