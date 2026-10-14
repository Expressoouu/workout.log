'use client';
import { ClockCounterClockwiseIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { lastLifts } from '@/lib/stats';

const fmtDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

// History button: the last few sessions of one exercise, to help pick today's weight.
export function LastLifts({ sessions, exerciseId, name, before }) {
  const history = lastLifts(sessions, exerciseId, before);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-xs" aria-label={`Last lifts: ${name}`}><ClockCounterClockwiseIcon /></Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <div className="text-[10px] tracking-widest text-muted-foreground uppercase">Last lifted · {name}</div>
        {history.length === 0 && <p className="text-xs text-muted-foreground">No completed sets yet.</p>}
        {history.map((h) => {
          const top = Math.max(...h.sets.map((s) => Number(s.weight) || 0));
          return (
            <div key={h.date} className="flex flex-col gap-1 border-t pt-2 first-of-type:border-t-0">
              <div className="flex justify-between text-xs">
                <span className="font-medium">{fmtDate(h.date)}</span>
                <span className="text-chart-1 tabular-nums">top {top} kg</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {h.sets.map((s, i) => (
                  <span key={i} className="bg-muted px-1.5 py-0.5 text-[11px] tabular-nums">{s.reps}×{s.weight}</span>
                ))}
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
