'use client';
import { useEffect, useState } from 'react';
import { BarbellIcon, CalendarCheckIcon, ChartLineUpIcon, ListChecksIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useData } from '@/lib/use-data';
import { InstallBanner } from '@/components/install-banner';
import { ThemeToggle } from '@/components/theme-toggle';
import { Today } from '@/components/today';
import { Schedules } from '@/components/schedules';
import { Exercises } from '@/components/exercises';
import { Progress } from '@/components/progress';

const TABS = [
  { id: 'today', label: 'Today', icon: CalendarCheckIcon, View: Today },
  { id: 'schedules', label: 'Schedules', icon: ListChecksIcon, View: Schedules },
  { id: 'exercises', label: 'Exercises', icon: BarbellIcon, View: Exercises },
  { id: 'progress', label: 'Progress', icon: ChartLineUpIcon, View: Progress },
];

export default function Page() {
  const [tab, setTab] = useState('today');
  const store = useData();

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') navigator.serviceWorker.register('/sw.js');
  }, []);

  const current = TABS.find((t) => t.id === tab);

  return (
    <div className="flex min-h-dvh flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-8">
      <header className="sticky top-0 z-10 border-b bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 md:px-6">
          <h1 className="py-3 text-sm font-semibold tracking-tight">
            workout<span className="text-chart-1">.</span>log
            <span className="ml-2 text-muted-foreground md:hidden">/ {current.label.toLowerCase()}</span>
          </h1>
          {/* Desktop/tablet: tabs live in the header. */}
          <nav className="hidden flex-1 gap-1 md:flex">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-current={tab === id ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-2 px-3 py-3.5 text-xs text-muted-foreground transition-colors hover:text-foreground',
                  tab === id && 'text-foreground after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-chart-1',
                )}
              >
                <Icon className="size-4" weight={tab === id ? 'fill' : 'regular'} />
                {label}
              </button>
            ))}
          </nav>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 md:p-6">
        <InstallBanner />
        {store.data ? <current.View {...store} /> : <p className="text-xs text-muted-foreground">Loading…</p>}
      </main>

      {/* Phone: bottom tab bar. */}
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/80 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-4">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              aria-current={tab === id ? 'page' : undefined}
              className={cn(
                'relative flex flex-col items-center gap-1 py-2.5 text-[10px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground',
                tab === id && 'text-foreground before:absolute before:inset-x-6 before:top-0 before:h-0.5 before:bg-chart-1',
              )}
            >
              <Icon className="size-5" weight={tab === id ? 'fill' : 'regular'} />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
