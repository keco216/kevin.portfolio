export function SectionLabel({
  index,
  label,
  aside,
}: {
  index: string;
  label: string;
  aside?: string;
}) {
  return (
    <div className="mb-12 flex items-center justify-between gap-6 border-b border-card-border pb-4 font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted md:mb-16">
      <p className="flex items-center gap-4">
        <span className="text-accent">{index}</span>
        <span>{label}</span>
      </p>
      {aside ? <p className="text-right">{aside}</p> : null}
    </div>
  );
}
