import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useItemDetails } from '../hooks/useItemDetails';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { StatusChip } from '../components/StatusChip';
import { PriorityChip } from '../components/PriorityChip';
import { formatDate, formatPrice } from '../utils/format';

const QUICK_REASONS = [
  'Запрещённый товар',
  'Неверная категория',
  'Некорректное описание',
  'Проблемы с фото',
  'Подозрение на мошенничество'
];

export const ItemPage: React.FC = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const navigate = useNavigate();
  const { item, history, loading, decisionLoading, error, sendDecision } =
    useItemDetails(Number.isNaN(numericId) ? null : numericId);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  // hotkeys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!item || decisionLoading) return;
      if (e.key === 'a' || e.key === 'A') {
        sendDecision('approve');
      }
      if (e.key === 'd' || e.key === 'D') {
        setRejectDialogOpen(true);
      }
      if (e.key === 'ArrowLeft') {
        // prev
        navigate('/list');
      }
      if (e.key === 'ArrowRight') {
        // next - упрощённо: тоже на /list, реальная логика может быть сложнее
        navigate('/list');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [item, decisionLoading, navigate, sendDecision]);

  const handleSubmitReject = () => {
    const reason = selectedReason || customReason.trim();
    if (!reason) return;
    sendDecision('reject', reason);
    setRejectDialogOpen(false);
    setSelectedReason('');
    setCustomReason('');
  };

  if (loading) return <LoadingOverlay />;

  if (!item) {
    return (
      <Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Button variant="outlined" onClick={() => navigate('/list')}>
          Назад к списку
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2 }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="outlined" onClick={() => navigate('/list')}>
            ← Назад к списку
          </Button>
          <Typography variant="h5">{item.title}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <StatusChip status={item.status} />
          <PriorityChip priority={item.priority} />
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {/* Gallery & main info */}
        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={1}>
                {item.images && item.images.length > 0
                  ? item.images.map((img, idx) => (
                      <Grid item xs={4} key={idx}>
                        <img
                          src={img}
                          alt={`${item.title}-${idx}`}
                          style={{
                            width: '100%',
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 4
                          }}
                        />
                      </Grid>
                    ))
                  : [1, 2, 3].map(i => (
                      <Grid item xs={4} key={i}>
                        <img
                          src={`/images/placeholder-${i}.jpg`}
                          alt="placeholder"
                          style={{
                            width: '100%',
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 4
                          }}
                        />
                      </Grid>
                    ))}
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Описание
              </Typography>
              <Typography variant="body1">{item.description}</Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Характеристики
              </Typography>
              {Object.entries(item.specs).map(([key, value]) => (
                <Stack
                  key={key}
                  direction="row"
                  justifyContent="space-between"
                  sx={{ py: 0.5 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {key}
                  </Typography>
                  <Typography variant="body2">{value}</Typography>
                </Stack>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Seller + moderation */}
        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Информация о товаре
              </Typography>
              <Typography variant="subtitle1">
                {formatPrice(item.price)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Категория: {item.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Дата создания: {formatDate(item.createdAt)}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Продавец
              </Typography>
              <Typography variant="subtitle1">{item.seller.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Рейтинг: {item.seller.rating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Объявлений: {item.seller.itemsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                На Авито с: {formatDate(item.seller.registeredAt)}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Действия модератора
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="success"
                  disabled={decisionLoading}
                  onClick={() => sendDecision('approve')}
                >
                  Одобрить (A)
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={decisionLoading}
                  onClick={() => setRejectDialogOpen(true)}
                >
                  Отклонить (D)
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  disabled={decisionLoading}
                  onClick={() => sendDecision('revision')}
                >
                  На доработку
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                История модерации
              </Typography>
              {history.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Пока нет действий модератора
                </Typography>
              )}
              <Stack spacing={1}>
                {history.map(record => (
                  <Box key={record.id}>
                    <Typography variant="body2">
                      {record.moderatorName}{' '}
                      <Chip
                        size="small"
                        label={record.decision}
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    {record.comment && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {record.comment}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block' }}
                    >
                      {formatDate(record.createdAt)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reject dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Причина отклонения</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {QUICK_REASONS.map(reason => (
              <Button
                key={reason}
                variant={selectedReason === reason ? 'contained' : 'outlined'}
                onClick={() => setSelectedReason(reason)}
              >
                {reason}
              </Button>
            ))}
            <TextField
              label="Другое"
              multiline
              minRows={3}
              value={customReason}
              onChange={e => setCustomReason(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={handleSubmitReject}
            variant="contained"
            color="error"
            disabled={decisionLoading}
          >
            Отклонить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
