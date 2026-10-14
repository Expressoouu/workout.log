'use client';
import { useEffect, useState } from 'react';
import { DownloadSimpleIcon, XIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

const DISMISS_KEY = 'install-dismissed';

export function InstallBanner() {
  // A beforeinstallprompt event (Chrome/Android/desktop), 'ios' (Safari has no prompt API), or null.
  const [install, setInstall] = useState(null);

  useEffect(() => {
    const installed = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    let dismissed = false;
    try { dismissed = localStorage.getItem(DISMISS_KEY) === '1'; } catch {}
    if (installed || dismissed) return;

    const onPrompt = (e) => { e.preventDefault(); setInstall(e); };
    const onInstalled = () => setInstall(null);
    addEventListener('beforeinstallprompt', onPrompt);
    addEventListener('appinstalled', onInstalled);
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) setInstall('ios');
    return () => {
      removeEventListener('beforeinstallprompt', onPrompt);
      removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!install) return null;

  const dismiss = () => {
    setInstall(null);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch {}
  };
  const promptInstall = async () => {
    install.prompt();
    const { outcome } = await install.userChoice;
    if (outcome === 'accepted') setInstall(null);
  };

  return (
    <div role="region" aria-label="Install app" className="flex items-center gap-3 border border-dashed p-3 text-xs">
      <DownloadSimpleIcon className="size-4 shrink-0 text-muted-foreground" />
      <span className="flex-1">
        {install === 'ios'
          ? <>Install: tap <b>Share</b> → <b>Add to Home Screen</b></>
          : 'Install for offline, full-screen access.'}
      </span>
      {install !== 'ios' && <Button size="sm" onClick={promptInstall}>Install</Button>}
      <Button variant="ghost" size="icon-sm" onClick={dismiss} aria-label="Dismiss"><XIcon /></Button>
    </div>
  );
}
