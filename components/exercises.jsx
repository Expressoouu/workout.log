'use client';
import { useRef, useState } from 'react';
import { CaretRightIcon, DownloadSimpleIcon, FlaskIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon, UploadSimpleIcon, XIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Confirm } from '@/components/confirm';
import { exGroups } from '@/components/exercise-picker';
import { LastLifts } from '@/components/last-lifts';
import * as db from '@/lib/db';
import { demoSessions } from '@/lib/demo';
import { addDays, today } from '@/lib/use-data';

export function Exercises({ data, save, remove, reload }) {
  const [name, setName] = useState('');
  const [q, setQ] = useState('');
  const [pendingImport, setPendingImport] = useState(null);
  const [openGroups, setOpenGroups] = useState(() => new Set());
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await save('exercises', { name: name.trim(), group: 'Custom' });
    setName('');
  };

  const exportData = async () => {
    const blob = new Blob([JSON.stringify(await db.exportAll(), null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `workouts-${today()}.json` });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importData = async () => {
    try {
      await db.importAll(JSON.parse(await pendingImport.text()));
      await reload();
      toast.success('Backup restored');
    } catch (err) {
      toast.error(`Import failed: ${err.message}`);
    }
    setPendingImport(null);
  };

  const demos = data.sessions.filter((x) => x.demo);

  const loadDemo = async () => {
    if (!data.templates.length) return toast.error('Create a schedule first; demo workouts follow your schedules.');
    setBusy(true);
    const list = demoSessions({
      templates: data.templates, exercises: data.exercises, endDate: today(),
      takenDates: new Set(data.sessions.map((x) => x.date)),
    });
    for (const x of list) await db.put('sessions', x);
    await reload();
    setBusy(false);
    toast.success(`Added ${list.length} demo workouts`);
  };

  const removeDemo = async () => {
    setBusy(true);
    for (const x of demos) await db.del('sessions', x.id);
    await reload();
    setBusy(false);
    toast.success('Demo workouts removed');
  };

  const toggleGroup = (g, open) => setOpenGroups((prev) => {
    const next = new Set(prev);
    if (open) next.add(g); else next.delete(g);
    return next;
  });

  const query = q.trim().toLowerCase();
  const tomorrow = addDays(today(), 1); // Exercises tab history includes today
  const groups = exGroups(data.exercises)
    .map(([g, list]) => [g, list.filter((e) => e.name.toLowerCase().includes(query))])
    .filter(([, list]) => list.length);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 md:grid-cols-2">
        <form onSubmit={add} className="flex gap-2">
          <Input placeholder="New exercise…" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" aria-label="Add exercise"><PlusIcon />Add</Button>
        </form>

        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" className="pl-8" placeholder={`Search ${data.exercises.length} exercises`} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map(([group, list]) => (
          // While searching, every group with matches is open.
          <Collapsible key={group} open={!!query || openGroups.has(group)} onOpenChange={(o) => toggleGroup(group, o)}>
            <CollapsibleTrigger className="group flex w-full items-center gap-2 border bg-card px-3 py-2.5 text-xs transition-colors hover:bg-muted/50">
              <CaretRightIcon className="size-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
              <span className="flex-1 text-left font-medium">{group}</span>
              <span className="text-muted-foreground tabular-nums">{list.length}</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="divide-y border border-t-0">
              {list.map((e) => (
                <div key={`${e.id}:${e.name}`} className="flex items-center gap-1 pr-1">
                  <Input
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
                    aria-label="Exercise name"
                    defaultValue={e.name}
                    onBlur={(ev) => { const v = ev.target.value.trim(); if (v && v !== e.name) save('exercises', { ...e, name: v }); }}
                  />
                  <LastLifts sessions={data.sessions} exerciseId={e.id} name={e.name} before={tomorrow} />
                  <Confirm title={`Delete ${e.name}?`} description="Logged sets stay in your history." onConfirm={() => remove('exercises', e.id)}>
                    <Button variant="ghost" size="icon-xs" aria-label={`Delete ${e.name}`}><XIcon /></Button>
                  </Confirm>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      {groups.length === 0 && <p className="text-xs text-muted-foreground">No matches.</p>}

      <div className="grid items-start gap-4 md:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Backup</CardTitle>
            <CardDescription>Data lives only on this device. Export regularly.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportData}><DownloadSimpleIcon />Export</Button>
            <Button variant="outline" onClick={() => fileRef.current.click()}><UploadSimpleIcon />Import</Button>
            <input ref={fileRef} type="file" accept="application/json" hidden
              onChange={(e) => { setPendingImport(e.target.files[0] ?? null); e.target.value = ''; }} />
            {pendingImport && (
              <Confirm title="Replace all data?" description={`Everything on this device will be replaced with ${pendingImport.name}.`} action="Replace" onConfirm={importData}>
                <Button variant="destructive">Restore {pendingImport.name}</Button>
              </Confirm>
            )}
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Demo data</CardTitle>
            <CardDescription>
              {demos.length
                ? `${demos.length} demo workouts loaded. Removing them leaves your real workouts untouched.`
                : '5 weeks of sample workouts from your schedules, to preview the charts.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {demos.length === 0
              ? <Button variant="outline" disabled={busy} onClick={loadDemo}><FlaskIcon />Load demo data</Button>
              : <Button variant="destructive" disabled={busy} onClick={removeDemo}><TrashIcon />Remove demo data</Button>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
