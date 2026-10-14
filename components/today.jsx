'use client';
import { useRef, useState } from 'react';
import { CaretLeftIcon, CaretRightIcon, CheckCircleIcon, LightningIcon, LockOpenIcon, PlusIcon, TrashIcon, XIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Confirm } from '@/components/confirm';
import { ExercisePicker } from '@/components/exercise-picker';
import { LastLifts } from '@/components/last-lifts';
import { doneCount, volume } from '@/lib/stats';
import { swipeStep } from '@/lib/swipe';
import { addDays, today } from '@/lib/use-data';
import { cn } from '@/lib/utils';

const num = (v) => (v === '' ? '' : Number(v));
const fmtDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
const fmtTime = (iso) => new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
// Finished workouts show values as plain text.
const lockedInput = 'pointer-events-none border-transparent bg-transparent dark:bg-transparent';

export function Today({ data, save, update, remove }) {
  const [date, setDate] = useState(today);
  const [dir, setDir] = useState(0); // last step direction, for the slide-in animation
  const touch = useRef(null);
  const ses = data.sessions.find((s) => s.date === date);
  const locked = !!ses?.finishedAt;

  const go = (n) => { setDir(n); setDate((d) => (n ? addDays(d, n) : today())); };
  const onTouchStart = (e) => {
    touch.current = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
  };
  const onTouchEnd = (e) => {
    const t0 = touch.current;
    touch.current = null;
    if (!t0) return;
    const step = swipeStep(e.changedTouches[0].clientX - t0.x, e.changedTouches[0].clientY - t0.y);
    if (step) go(step);
  };
  const exName = (id) => data.exercises.find((e) => e.id === id)?.name ?? '(deleted exercise)';

  const edit = (fn) => update('sessions', ses.id, fn);

  const start = (t) => save('sessions', {
    date,
    name: t?.name ?? 'Custom',
    items: (t?.items ?? []).map((it) => ({
      exerciseId: it.exerciseId,
      sets: Array.from({ length: it.sets }, () => ({ reps: it.reps, weight: it.weight, done: false })),
    })),
  });

  const total = ses ? ses.items.reduce((n, it) => n + it.sets.length, 0) : 0;
  const done = ses ? doneCount(ses) : 0;

  return (
    // flex-1 so the whole screen below the header is swipeable, not just the content.
    <div className="flex flex-1 touch-pan-y flex-col gap-4" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="mx-auto flex w-full max-w-sm items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Previous day" onClick={() => go(-1)}><CaretLeftIcon /></Button>
        <div className="flex-1 text-center">
          <div className="text-sm font-medium">{date === today() ? 'Today' : fmtDate(date)}</div>
          <div className="text-[10px] tracking-widest text-muted-foreground uppercase">{date}</div>
        </div>
        <Button variant="ghost" size="icon" aria-label="Next day" onClick={() => go(1)}><CaretRightIcon /></Button>
      </div>
      {date !== today() && <Button variant="link" size="sm" className="-mt-3" onClick={() => go(0)}>Back to today</Button>}

      <div
        key={date}
        className={cn(
          'flex flex-col gap-4 duration-200 animate-in fade-in',
          dir > 0 && 'slide-in-from-right-8',
          dir < 0 && 'slide-in-from-left-8',
        )}
      >
        {!ses && (
          <>
            <p className="text-xs tracking-widest text-muted-foreground uppercase">Pick a schedule</p>
            {data.templates.length === 0 && <p className="text-xs text-muted-foreground">No schedules yet. Create one in Schedules.</p>}
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.templates.map((t) => (
                <button key={t.id} onClick={() => start(t)} className="group text-left">
                  <Card size="sm" className="transition-colors group-hover:bg-muted/50">
                    <CardHeader>
                      <CardTitle>{t.name}</CardTitle>
                      <CardDescription className="line-clamp-1">{t.items.map((it) => exName(it.exerciseId)).join(' · ')}</CardDescription>
                      <CardAction><span className="text-[10px] text-muted-foreground">{t.items.length} ex</span></CardAction>
                    </CardHeader>
                  </Card>
                </button>
              ))}
            </div>
            <Button variant="outline" size="lg" className="sm:self-start sm:px-6" onClick={() => start(null)}><LightningIcon />Custom workout</Button>
          </>
        )}

        {ses && (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold">{ses.name}</h2>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {done}/{total} sets · {volume(ses).toLocaleString()} kg
                    {locked && <> · <span className="text-chart-1">finished {fmtTime(ses.finishedAt)}</span></>}
                  </p>
                </div>
                <div className="flex gap-1">
                  {locked && (
                    <Button variant="ghost" size="sm" onClick={() => edit((n) => { delete n.finishedAt; })}><LockOpenIcon />Reopen</Button>
                  )}
                    <Confirm title="Delete this workout?" description="All logged sets for this day will be removed." onConfirm={() => remove('sessions', ses.id)}>
                    <Button variant="ghost" size="icon-sm" aria-label="Delete workout"><TrashIcon /></Button>
                  </Confirm>
                </div>
              </div>
              <div className="h-1 w-full bg-muted">
                <div className="h-full bg-chart-1 transition-all" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="grid items-start gap-4 lg:grid-cols-2">
              {ses.items.map((it, i) => (
                <Card key={i} size="sm">
                  <CardHeader>
                    <CardTitle>{exName(it.exerciseId)}</CardTitle>
                    <CardDescription className="tabular-nums">{it.sets.filter((s) => s.done).length}/{it.sets.length} done</CardDescription>
                    <CardAction className="flex gap-1">
                      <LastLifts sessions={data.sessions} exerciseId={it.exerciseId} name={exName(it.exerciseId)} before={date} />
                      {!locked && (
                        <Confirm title={`Remove ${exName(it.exerciseId)}?`} action="Remove" onConfirm={() => edit((n) => n.items.splice(i, 1))}>
                          <Button variant="ghost" size="icon-xs" aria-label="Remove exercise"><XIcon /></Button>
                        </Confirm>
                      )}
                    </CardAction>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1.5">
                    <div className="grid grid-cols-[1.25rem_1fr_1fr_1.75rem_1.5rem] items-center gap-2 text-[10px] tracking-widest text-muted-foreground uppercase">
                      <span>#</span><span>Reps</span><span>Kg</span><span>✓</span><span />
                    </div>
                    {it.sets.map((s, j) => (
                      <div
                        key={j}
                        data-done={s.done}
                        className="grid grid-cols-[1.25rem_1fr_1fr_1.75rem_1.5rem] items-center gap-2 transition-opacity data-[done=true]:opacity-60"
                      >
                        <span className="text-xs text-muted-foreground tabular-nums">{j + 1}</span>
                        <Input type="number" inputMode="numeric" min="0" aria-label="Reps" className={cn('text-center tabular-nums', locked && lockedInput)}
                          readOnly={locked} value={s.reps} onChange={(e) => edit((n) => { n.items[i].sets[j].reps = num(e.target.value); })} />
                        <Input type="number" inputMode="decimal" min="0" step="0.5" aria-label="Weight in kg" className={cn('text-center tabular-nums', locked && lockedInput)}
                          readOnly={locked} value={s.weight} onChange={(e) => edit((n) => { n.items[i].sets[j].weight = num(e.target.value); })} />
                        <Checkbox className="size-6 justify-self-center disabled:cursor-default disabled:opacity-100" aria-label={`Set ${j + 1} done`}
                          disabled={locked} checked={s.done} onCheckedChange={(v) => edit((n) => { n.items[i].sets[j].done = v === true; })} />
                        {!locked && <Button variant="ghost" size="icon-xs" aria-label="Remove set" onClick={() => edit((n) => n.items[i].sets.splice(j, 1))}><XIcon /></Button>}
                      </div>
                    ))}
                    {!locked && (
                      <Button variant="ghost" size="sm" className="mt-1 self-start" onClick={() => edit((n) => {
                        const last = n.items[i].sets.at(-1) ?? { reps: 10, weight: 0 };
                        n.items[i].sets.push({ reps: last.reps, weight: last.weight, done: false });
                      })}><PlusIcon />Set</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {!locked && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <ExercisePicker exercises={data.exercises} onSelect={(id) => edit((n) => n.items.push({
                  exerciseId: id, sets: Array.from({ length: 3 }, () => ({ reps: 10, weight: 0, done: false })),
                }))}>
                  <Button variant="outline" size="lg" className="border-dashed sm:px-6"><PlusIcon />Add exercise</Button>
                </ExercisePicker>
                <Confirm
                  title="Finish workout?"
                  description={`${done}/${total} sets done. Values will be locked; you can reopen it later.`}
                  action="Finish"
                  variant="default"
                  onConfirm={() => edit((n) => { n.finishedAt = new Date().toISOString(); })}
                >
                  <Button size="lg" className="sm:ml-auto sm:px-6"><CheckCircleIcon />Finish workout</Button>
                </Confirm>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
