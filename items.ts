import { apiClient } from './axiosClient';
import {
  Item,
  ItemDetails,
  ItemsListParams,
  PaginatedResponse,
  ModerationRecord,
  ModerationRequest
} from './types';

export const getItems = async (
  params: ItemsListParams
): Promise<PaginatedResponse<Item>> => {
  const response = await apiClient.get('/items', { params });
  return response.data;
};

export const getItemById = async (id: number): Promise<ItemDetails> => {
  const response = await apiClient.get(`/items/${id}`);
  return response.data;
};

export const getItemModerationHistory = async (
  id: number
): Promise<ModerationRecord[]> => {
  const response = await apiClient.get(`/items/${id}/moderation`);
  return response.data;
};

export const sendModerationDecision = async (
  id: number,
  payload: ModerationRequest
): Promise<void> => {
  await apiClient.post(`/items/${id}/moderation`, payload);
};
