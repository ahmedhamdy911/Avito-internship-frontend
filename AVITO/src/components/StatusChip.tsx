import React from 'react';
import { Chip } from '@mui/material';
import { ItemStatus } from '../api/types';

interface Props {
  status: ItemStatus;
}

export const StatusChip: React.FC<Props> = ({ status }) => {
  const labelMap: Record<ItemStatus, string> = {
    pending: 'На модерации',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    revision: 'На доработке'
  };

  const colorMap: Record<ItemStatus, 'default' | 'success' | 'error' | 'warning'> =
    {
      pending: 'default',
      approved: 'success',
      rejected: 'error',
      revision: 'warning'
    };

  return (
    <Chip
      size="small"
      label={labelMap[status]}
      color={colorMap[status]}
      variant={status === 'pending' ? 'outlined' : 'filled'}
    />
  );
};
