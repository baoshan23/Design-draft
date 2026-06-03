// Re-mounts on every navigation, so the CSS entrance animation on
// `.page-transition` re-fires — giving a smooth page-to-page fade/glide
// instead of a hard cut. (layout.tsx persists; template.tsx does not.)
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
