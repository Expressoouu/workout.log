'use client';
import { useState } from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ExercisePicker } from '@/components/exercise-picker';
import { doneCount, exerciseSeries, volume, weekStart, weeklyTotals } from '@/lib/stats';
import { today } from '@/lib/use-data';

const exConfig = {
  maxWeight: { label: 'Top set (kg)', color: 'var(--chart-1)' },
  volume: { label: 'Volume (kg)', color: 'var(--chart-2)' },
};
const weekConfig = { volume: { label: 'Volume (kg)', color: 'var(--chart-1)' } };
const shortDate = (d) => d.slice(5).replace('-', '/');
// Axis labels: 28500 -> 29k, 2700 -> 2.7k.
const compact = (v) => (v >= 10000 ? `${Math.round(v / 1000)}k` : v >= 1000 ? `${+(v / 1000).toFixed(1)}k` : v);

function Stat({ label, value }) {
  return (
    <Card size="sm">
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
        <div className="text-[10px] tracking-widest text-muted-foreground uppercase">{label}</div>
      </CardContent>
    </Card>
  );
}

export function Progress({ data }) {
  const { sessions, exercises } = data;
  const trained = exercises.filter((e) => exerciseSeries(sessions, e.id).length);
  const [picked, setPicked] = useState(null);
  const exId = trained.some((e) => e.id === picked) ? picked : trained[0]?.id;
  const series = exId != null ? exerciseSeries(sessions, exId) : [];
  const weeks = weeklyTotals(sessions);
  const week = weekStart(today());
  const workouts = sessions.filter((s) => doneCount(s));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Stat label="Workouts" value={workouts.length} />
        <Stat label="This week" value={workouts.filter((s) => weekStart(s.date) === week).length} />
        <Stat label="Sets done" value={sessions.reduce((n, s) => n + doneCount(s), 0)} />
        <Stat label="Kg lifted" value={Math.round(sessions.reduce((n, s) => n + volume(s), 0)).toLocaleString()} />
      </div>

      {trained.length === 0 ? (
        <p className="text-xs text-muted-foreground">Complete some sets to see your progress charts.</p>
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Exercise progress</CardTitle>
              <ExercisePicker exercises={trained} value={exId} onSelect={setPicked}>
                <Button variant="outline" size="sm" className="mt-1 justify-between">
                  <span className="truncate">{exercises.find((e) => e.id === exId)?.name}</span><CaretDownIcon className="opacity-50" />
                </Button>
              </ExercisePicker>
            </CardHeader>
            <CardContent>
              <ChartContainer config={exConfig} className="aspect-[4/3] w-full">
                <LineChart data={series} margin={{ left: -8, right: -8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickFormatter={shortDate} tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis yAxisId="w" tickLine={false} axisLine={false} width={36} />
                  <YAxis yAxisId="v" orientation="right" tickLine={false} axisLine={false} width={48} tickFormatter={compact} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line yAxisId="w" dataKey="maxWeight" stroke="var(--color-maxWeight)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="v" dataKey="volume" stroke="var(--color-volume)" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly volume</CardTitle>
              <CardDescription>Kg lifted per week (Mon–Sun)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={weekConfig} className="aspect-[4/3] w-full">
                <BarChart data={weeks} margin={{ left: -8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="week" tickFormatter={shortDate} tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={compact} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="volume" fill="var(--color-volume)" maxBarSize={40} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
