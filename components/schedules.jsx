'use client';
import { useState } from 'react';
import { CaretDownIcon, PencilSimpleIcon, PlusIcon, TrashIcon, XIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Confirm } from '@/components/confirm';
import { ExercisePicker } from '@/components/exercise-picker';

const num = (v) => (v === '' ? '' : Number(v));

export function Schedules({ data, save, remove }) {
  const [editing, setEditing] = useState(null);
  const exName = (id) => data.exercises.find((e) => e.id === id)?.name ?? '(deleted exercise)';

  if (editing) {
    const set = (fn) => setEditing((t) => { const next = structuredClone(t); fn(next); return next; });
    const submit = async () => {
      await save('templates', { ...editing, name: editing.name.trim() || 'Untitled' });
      setEditing(null);
    };
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{editing.id ? 'Edit schedule' : 'New schedule'}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tpl-name">Name</Label>
            <Input id="tpl-name" placeholder="e.g. Push day" value={editing.name} onChange={(e) => set((t) => { t.name = e.target.value; })} />
          </div>
          <div className="grid grid-cols-[1fr_1fr_1fr_1.5rem] gap-2 text-[10px] tracking-widest text-muted-foreground uppercase sm:grid-cols-[1fr_3rem_3rem_3.5rem_1.5rem]">
            <span className="hidden sm:block">Exercise</span><span>Sets</span><span>Reps</span><span>Kg</span><span />
          </div>
          {editing.items.map((it, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1.5rem] items-center gap-2 border-b pb-3 sm:grid-cols-[1fr_3rem_3rem_3.5rem_1.5rem] sm:border-0 sm:pb-0">
              <ExercisePicker exercises={data.exercises} value={it.exerciseId} onSelect={(id) => set((t) => { t.items[i].exerciseId = id; })}>
                <Button variant="outline" className="col-span-3 min-w-0 justify-between sm:col-span-1">
                  <span className="truncate">{exName(it.exerciseId)}</span><CaretDownIcon className="opacity-50" />
                </Button>
              </ExercisePicker>
              {['sets', 'reps', 'weight'].map((f) => (
                <Input key={f} type="number" min="0" step={f === 'weight' ? '0.5' : '1'} aria-label={f} className="px-1 text-center tabular-nums"
                  value={it[f]} onChange={(e) => set((t) => { t.items[i][f] = num(e.target.value); })} />
              ))}
              <Button variant="ghost" size="icon-xs" className="col-start-4 row-start-1 sm:col-start-auto sm:row-start-auto" aria-label="Remove" onClick={() => set((t) => t.items.splice(i, 1))}><XIcon /></Button>
            </div>
          ))}
          <ExercisePicker exercises={data.exercises} onSelect={(id) => set((t) => t.items.push({ exerciseId: id, sets: 3, reps: 10, weight: 0 }))}>
            <Button variant="outline" className="border-dashed sm:self-start"><PlusIcon />Add exercise</Button>
          </ExercisePicker>
        </CardContent>
        <CardFooter className="gap-2 border-t py-3">
          <Button onClick={submit}>Save</Button>
          <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {data.templates.map((t) => (
        <Card key={t.id} size="sm" className="border-t-2 border-t-chart-1">
          <CardHeader>
            <CardTitle>{t.name}</CardTitle>
            <CardDescription>{t.items.length} exercises</CardDescription>
            <CardAction className="flex gap-1">
              <Button variant="ghost" size="icon-sm" className="text-chart-1" aria-label={`Edit ${t.name}`} onClick={() => setEditing(structuredClone(t))}><PencilSimpleIcon /></Button>
              <Confirm title={`Delete “${t.name}”?`} description="Past workouts are kept." onConfirm={() => remove('templates', t.id)}>
                <Button variant="ghost" size="icon-sm" aria-label={`Delete ${t.name}`}><TrashIcon /></Button>
              </Confirm>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1">
              {t.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-2 text-xs">
                  <span className="truncate">{exName(it.exerciseId)}</span>
                  <span className="shrink-0 text-chart-1 tabular-nums">{it.sets}×{it.reps}{it.weight ? ` @ ${it.weight}kg` : ''}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" size="lg" className="h-full min-h-12 border-dashed" onClick={() => setEditing({ name: '', items: [] })}><PlusIcon />New schedule</Button>
    </div>
  );
}
