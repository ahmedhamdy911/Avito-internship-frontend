import React from 'react';
import { Chip } from '@mui/material';
import { ItemPriority } from '../api/types';

interface Props {
  priority: ItemPriority;
}

export const PriorityChip: React.FC<Props> = ({ priority }) => {
  if (priority === 'normal') return null;

  return <Chip size="small" color="secondary" label="Срочно" />;
};
