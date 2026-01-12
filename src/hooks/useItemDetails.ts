import { useCallback, useEffect, useState } from 'react';
import {
  getItemById,
  getItemModerationHistory,
  sendModerationDecision
} from '../api/items';
import {
  ItemDetails,
  ModerationDecision,
  ModerationRecord
} from '../api/types';

export const useItemDetails = (id: number | null) => {
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [history, setHistory] = useState<ModerationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [itemResp, historyResp] = await Promise.all([
        getItemById(id),
        getItemModerationHistory(id)
      ]);
      setItem(itemResp);
      setHistory(historyResp);
    } catch (e) {
      console.error(e);
      setError('Не удалось загрузить объявление');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const sendDecision = async (decision: ModerationDecision, reason?: string) => {
    if (!id) return;
    setDecisionLoading(true);
    try {
      await sendModerationDecision(id, { decision, reason });
      await load(); // обновляем данные после решения
    } catch (e) {
      console.error(e);
      setError('Не удалось отправить решение');
    } finally {
      setDecisionLoading(false);
    }
  };

  return {
    item,
    history,
    loading,
    decisionLoading,
    error,
    reload: load,
    sendDecision
  };
};
