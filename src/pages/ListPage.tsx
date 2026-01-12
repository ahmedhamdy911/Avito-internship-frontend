import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useItemsList } from '../hooks/useItemsList';
import { ItemStatus } from '../api/types';
import { StatusChip } from '../components/StatusChip';
import { PriorityChip } from '../components/PriorityChip';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { formatDate, formatPrice } from '../utils/format';

const STATUS_OPTIONS: { value: ItemStatus; label: string }[] = [
  { value: 'pending', label: 'На модерации' },
  { value: 'approved', label: 'Одобрено' },
  { value: 'rejected', label: 'Отклонено' },
  { value: 'revision', label: 'На доработке' }
];

export const ListPage: React.FC = () => {
  const {
    page,
    setPage,
    filters,
    setFilters,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    data,
    loading,
    error,
    resetFilters
  } = useItemsList();

  const navigate = useNavigate();

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  const handleStatusChange = (event: any) => {
    const value = event.target.value as ItemStatus[];
    setFilters(prev => ({ ...prev, statuses: value }));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Список объявлений
      </Typography>

      {/* Filters */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ mb: 2 }}
        alignItems={{ xs: 'stretch', md: 'flex-end' }}
      >
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Статус</InputLabel>
          <Select
            multiple
            value={filters.statuses}
            onChange={handleStatusChange}
            input={<OutlinedInput label="Статус" />}
            renderValue={selected =>
              (selected as ItemStatus[])
                .map(v => STATUS_OPTIONS.find(o => o.value === v)?.label ?? v)
                .join(', ')
            }
          >
            {STATUS_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                <Checkbox checked={filters.statuses.indexOf(opt.value) > -1} />
                <ListItemText primary={opt.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Категория"
          value={filters.category}
          onChange={e =>
            setFilters(prev => ({ ...prev, category: e.target.value }))
          }
        />
        <TextField
          size="small"
          label="Цена от"
          type="number"
          value={filters.minPrice ?? ''}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              minPrice: e.target.value ? Number(e.target.value) : undefined
            }))
          }
        />
        <TextField
          size="small"
          label="Цена до"
          type="number"
          value={filters.maxPrice ?? ''}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              maxPrice: e.target.value ? Number(e.target.value) : undefined
            }))
          }
        />
        <TextField
          size="small"
          label="Поиск по названию"
          value={filters.search}
          onChange={e =>
            setFilters(prev => ({ ...prev, search: e.target.value }))
          }
        />
        <Button variant="outlined" size="small" onClick={resetFilters}>
          Сбросить
        </Button>
      </Stack>

      {/* Sorting */}
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2 }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          <FormControl size="small">
            <InputLabel>Сортировка</InputLabel>
            <Select
              value={sortField}
              label="Сортировка"
              onChange={e =>
                setSortField(e.target.value as 'createdAt' | 'price' | 'priority')
              }
            >
              <MenuItem value="createdAt">По дате создания</MenuItem>
              <MenuItem value="price">По цене</MenuItem>
              <MenuItem value="priority">По приоритету</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Порядок</InputLabel>
            <Select
              value={sortOrder}
              label="Порядок"
              onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <MenuItem value="desc">Убывание</MenuItem>
              <MenuItem value="asc">Возрастание</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {data && (
          <Typography variant="body2" color="text.secondary">
            Всего объявлений: {data.total}
          </Typography>
        )}
      </Stack>

      {loading && <LoadingOverlay />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {data && !loading && (
        <>
          <Grid container spacing={2}>
            {data.items.map(item => (
              <Grid item xs={12} md={6} lg={4} key={item.id}>
                <Card>
                  <CardActionArea onClick={() => navigate(`/item/${item.id}`)}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={item.thumbnailUrl || '/images/placeholder-1.jpg'}
                      alt={item.title}
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" noWrap>
                          {item.title}
                        </Typography>
                        <Typography variant="subtitle2">
                          {formatPrice(item.price)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.category}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Создано: {formatDate(item.createdAt)}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <StatusChip status={item.status} />
                          <PriorityChip priority={item.priority} />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                page={page}
                count={totalPages}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
