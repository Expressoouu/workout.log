'use client';
import { useState } from 'react';
import { LIBRARY } from '@/lib/exercise-library';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

// Exercises bucketed by muscle group in library order; user-added ones go under Custom.
export function exGroups(exercises) {
  const groups = new Map([...Object.keys(LIBRARY), 'Custom'].map((g) => [g, []]));
  for (const e of exercises) (groups.get(e.group) ?? groups.get('Custom')).push(e);
  return [...groups].filter(([, list]) => list.length);
}

// Searchable exercise dropdown. `children` is the trigger element.
export function ExercisePicker({ exercises, value, onSelect, children, align = 'start' }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[min(20rem,calc(100vw-2rem))] p-0" align={align}>
        <Command>
          <CommandInput placeholder="Search exercises…" />
          <CommandList>
            <CommandEmpty>No exercise found.</CommandEmpty>
            {exGroups(exercises).map(([group, list]) => (
              <CommandGroup key={group} heading={group}>
                {list.map((e) => (
                  <CommandItem
                    key={e.id}
                    value={String(e.id)}
                    keywords={[e.name, group]}
                    data-checked={e.id === value}
                    onSelect={() => { onSelect(e.id); setOpen(false); }}
                  >
                    {e.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
