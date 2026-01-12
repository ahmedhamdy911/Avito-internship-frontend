import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from 'recharts';
import { StatsPeriod } from '../api/types';
import { useStats } from '../hooks/useStats';
import { LoadingOverlay } from '../components/LoadingOverlay';

const DECISION_COLORS: Record<string, string> = {
  approved: '#22c55e',
  rejected: '#ef4444',
  revision: '#eab308'
};

export const StatsPage: React.FC = () => {
  const [period, setPeriod] = useState<StatsPeriod>('7d');
  const { summary, activity, decisions, categories, loading, error } =
    useStats(period);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5">Статистика модератора</Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={period}
          onChange={(_, value) => value && setPeriod(value)}
        >
          <ToggleButton value="today">Сегодня</ToggleButton>
          <ToggleButton value="7d">7 дней</ToggleButton>
          <ToggleButton value="30d">30 дней</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {loading && <LoadingOverlay />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {summary && !loading && (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Проверено объявлений
                  </Typography>
                  <Typography variant="h5">{summary.checkedTotal}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Одобрено
                  </Typography>
                  <Typography variant="h5">
                    {summary.approvedPercent.toFixed(1)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Отклонено
                  </Typography>
                  <Typography variant="h5">
                    {summary.rejectedPercent.toFixed(1)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Среднее время проверки
                  </Typography>
                  <Typography variant="h5">
                    {Math.round(summary.avgCheckTimeSeconds)} сек
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Активность по дням
                  </Typography>
                  <BarChart width={400} height={250} data={activity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Проверено" />
                  </BarChart>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Решения модератора
                  </Typography>
                  <PieChart width={400} height={250}>
                    <Pie
                      data={decisions}
                      dataKey="count"
                      nameKey="decision"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {decisions.map(entry => (
                        <Cell
                          key={entry.decision}
                          fill={DECISION_COLORS[entry.decision]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Категории проверенных объявлений
                  </Typography>
                  <BarChart width={700} height={250} data={categories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Проверено" />
                  </BarChart>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};
