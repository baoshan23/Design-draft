import PageWipe from '@/components/effects/PageWipe';

// Re-mounts on every navigation, so the CSS entrance animation on
// `.page-transition` re-fires — giving a smooth page-to-page fade/glide
// instead of a hard cut. (layout.tsx persists; template.tsx does not.)
// <PageWipe/> lives here too so the Arcadia-style gold+cream wipe replays on
// every refresh AND every client-side route change.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-transition">
      <PageWipe />
      {children}
    </div>
  );
}
